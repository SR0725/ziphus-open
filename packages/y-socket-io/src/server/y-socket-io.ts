import * as Y from "yjs";
import { Namespace, Server, Socket } from "socket.io";
import * as AwarenessProtocol from "y-protocols/awareness";
import { Document } from "./document";
import { Observable } from "lib0/observable";
import { MongodbPersistence } from "y-mongodb-provider";

export interface Persistence {
  bindState: (docName: string, ydoc: Document) => void;
  writeState: (docName: string, ydoc: Document) => Promise<any>;
  provider: any;
}

export interface YSocketIOConfiguration {
  gcEnabled?: boolean;
}

export class YSocketIO extends Observable<string> {
  private readonly _documents: Map<string, Document> = new Map<
    string,
    Document
  >();

  private readonly roomSocketListMap: Map<string, string[]> = new Map();

  private readonly io: Server;

  private readonly configuration?: YSocketIOConfiguration;

  private persistence: Persistence | null = null;

  public nsp: Namespace | null = null;

  constructor(io: Server, configuration?: YSocketIOConfiguration) {
    super();

    this.io = io;

    this.initMongoDB();

    this.configuration = configuration;
  }

  public initialize(): void {
    this.io.on("connection", async (socket) => {
      socket.on("yjs-connect", async (roomName: string) => {
        // 將 socket.id 加入 roomSocketListMap
        if (this.roomSocketListMap.has(roomName)) {
          const socketList = this.roomSocketListMap.get(roomName);
          if (socketList?.includes(socket.id)) {
            socket.emit(`yjs-${roomName}-connected`);
            return;
          }
          socketList?.push(socket.id);
        } else {
          this.roomSocketListMap.set(roomName, [socket.id]);
        }

        const doc = await this.initDocument(
          roomName,
          socket.nsp,
          this.configuration?.gcEnabled
        );
        this.initSyncListeners(socket, doc, roomName);
        this.initAwarenessListeners(socket, doc, roomName);
        this.initSocketListeners(socket, doc);
        this.startSynchronization(socket, doc, roomName);
        socket.emit(`yjs-${roomName}-connected`);
      });
    });
  }

  public get documents(): Map<string, Document> {
    return this._documents;
  }

  private async initDocument(
    name: string,
    namespace: Namespace,
    gc: boolean = true
  ): Promise<Document> {
    const doc =
      this._documents.get(name) ??
      new Document(name, namespace, {
        onUpdate: (doc, update) => this.emit("document-update", [doc, update]),
        onChangeAwareness: (doc, update) =>
          this.emit("awareness-update", [doc, update]),
        onDestroy: async (doc) => {
          this._documents.delete(doc.name);
          this.emit("document-destroy", [doc]);
        },
      });
    doc.gc = gc;
    if (!this._documents.has(name)) {
      if (this.persistence != null) await this.persistence.bindState(name, doc);
      this._documents.set(name, doc);
      this.emit("document-loaded", [doc]);
    }
    return doc;
  }

  private async initMongoDB() {
    const connectionString = `${process.env.MONGODB_CONNECTION_STRING ?? ""}/${process.env.YJS_DB_NAME ?? ""}`;

    if (!connectionString) {
      throw new Error("MONGODB_CONNECTION_STRING is not set");
    }

    const mdb = new MongodbPersistence(connectionString, {
      flushSize: 400,
      multipleCollections: true,
    });

    this.persistence = {
      provider: mdb,
      bindState: async (docName: string, yDoc: Document) => {
        const persistedYDoc = await mdb.getYDoc(docName);

        const persistedStateVector = Y.encodeStateVector(persistedYDoc);
        const diff = Y.encodeStateAsUpdate(persistedYDoc, persistedStateVector);
        if (
          diff.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0
          ) > 0
        )
          mdb.storeUpdate(docName, diff);

        Y.applyUpdate(yDoc, Y.encodeStateAsUpdate(persistedYDoc));

        yDoc.on("update", async (update) => {
          mdb.storeUpdate(docName, update);
        });

        persistedYDoc.destroy();
      },
      writeState: async (_docName: string, _yDoc: Document) => {
        await this.persistence?.provider.flushDocument(_docName);
      },
    };
  }

  private readonly initSyncListeners = (
    socket: Socket,
    doc: Document,
    roomName: string
  ): void => {
    socket.on(
      `${roomName}-sync-step-1`,
      (stateVector: Uint8Array, syncStep2: (update: Uint8Array) => void) => {
        syncStep2(Y.encodeStateAsUpdate(doc, new Uint8Array(stateVector)));
      }
    );

    socket.on(`${roomName}-sync-update`, (update: Uint8Array) => {
      Y.applyUpdate(doc, update, null);
      this.roomSocketListMap.get(roomName)?.forEach((socketId) => {
        if (socketId !== socket.id) {
          socket.to(socketId).emit(`${roomName}-sync-update`, update);
        }
      });
    });
  };

  private readonly initAwarenessListeners = (
    socket: Socket,
    doc: Document,
    roomName: string
  ): void => {
    socket.on(`${roomName}-awareness-update`, (update: ArrayBuffer) => {
      AwarenessProtocol.applyAwarenessUpdate(
        doc.awareness,
        new Uint8Array(update),
        socket
      );
    });
  };

  private readonly initSocketListeners = (
    socket: Socket,
    doc: Document
  ): void => {
    socket.on("disconnect", async () => {
      const roomSocketList = this.roomSocketListMap.get(doc.name);
      if (roomSocketList) {
        const index = roomSocketList.indexOf(socket.id);
        if (index > -1) {
          roomSocketList.splice(index, 1);
        }
      }
      if (roomSocketList?.length === 0) {
        this.roomSocketListMap.delete(doc.name);
      }

      if ((await socket.nsp.allSockets()).size === 0) {
        this.emit("all-document-connections-closed", [doc]);
        if (this.persistence != null) {
          await this.persistence.writeState(doc.name, doc);
          await doc.destroy();
        }
      }
    });
  };

  private readonly startSynchronization = (
    socket: Socket,
    doc: Document,
    roomName: string
  ): void => {
    socket.emit(
      `${roomName}-sync-step-1`,
      Y.encodeStateVector(doc),
      (update: Uint8Array) => {
        Y.applyUpdate(doc, new Uint8Array(update), this);
      }
    );
    socket.emit(
      `${roomName}-awareness-update`,
      AwarenessProtocol.encodeAwarenessUpdate(
        doc.awareness,
        Array.from(doc.awareness.getStates().keys())
      )
    );
  };
}

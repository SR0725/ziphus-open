import * as Y from "yjs";
import * as bc from "lib0/broadcastchannel";
import * as AwarenessProtocol from "y-protocols/awareness";
import { Observable } from "lib0/observable";
import { io, ManagerOptions, Socket, SocketOptions } from "socket.io-client";
import { AwarenessChange } from "../types";

export interface ProviderConfiguration {
  awareness?: AwarenessProtocol.Awareness;
  disableBc?: boolean;
  auth?: { [key: string]: any };
}
export class SocketIOProvider extends Observable<string> {
  private readonly roomName: string;
  private readonly _broadcastChannel: string;
  public socket: Socket;
  public doc: Y.Doc;
  public awareness: AwarenessProtocol.Awareness;
  public disableBc: boolean;
  public bcConnected: boolean = false;
  public socketConnected: boolean = false;

  constructor(
    socket: Socket,
    roomName: string,
    doc: Y.Doc = new Y.Doc(),
    {
      awareness = new AwarenessProtocol.Awareness(doc),
      disableBc = false,
    }: ProviderConfiguration
  ) {
    super();

    // 綁定 doc 和 awareness
    this.doc = doc;
    this.awareness = awareness;
    this.roomName = roomName;

    this._broadcastChannel = `yjs-${roomName}`;

    this.disableBc = disableBc;

    this.socket = socket;

    this.onSocketConnection();

    this.initSyncListeners();

    this.initAwarenessListeners();

    this.initSystemListeners();

    awareness.on("update", this.awarenessUpdate);

    this.socket.on("disconnect", (event) => this.onSocketDisconnection(event));

    this.socket.on("connect_error", (error) =>
      this.onSocketConnectionError(error)
    );
  }

  public get broadcastChannel(): string {
    return this._broadcastChannel;
  }

  private readonly initSyncListeners = (): void => {
    this.socket.on(
      `${this.roomName}-sync-step-1`,
      (stateVector: ArrayBuffer, syncStep2: (update: Uint8Array) => void) => {
        syncStep2(Y.encodeStateAsUpdate(this.doc, new Uint8Array(stateVector)));
      }
    );

    this.socket.on(`${this.roomName}-sync-update`, this.onSocketSyncUpdate);
  };

  private readonly initAwarenessListeners = (): void => {
    this.socket.on(
      `${this.roomName}-awareness-update`,
      (update: ArrayBuffer) => {
        AwarenessProtocol.applyAwarenessUpdate(
          this.awareness,
          new Uint8Array(update),
          this
        );
      }
    );
  };

  private readonly initSystemListeners = (): void => {
    if (typeof window !== "undefined")
      window.addEventListener("beforeunload", this.beforeUnloadHandler);
    else if (typeof process !== "undefined")
      process.on("exit", this.beforeUnloadHandler);
  };

  public connect(): void {
    if (!this.socket.connected) {
      this.emit("status", [{ status: "connecting" }]);
      this.socket.connect();
      if (!this.disableBc) this.connectBc();
    }
  }

  private readonly onSocketConnection = (): void => {
    this.socket.emit("yjs-connect", this.roomName);

    this.socket.on(`yjs-${this.roomName}-connected`, () => {
      this.emit("status", [{ status: "connected" }]);
      // 將本地的 doc 狀態同步到 server
      this.socket.emit(
        `${this.roomName}-sync-step-1`,
        Y.encodeStateVector(this.doc),
        (update: Uint8Array) => {
          Y.applyUpdate(this.doc, new Uint8Array(update), this);
        }
      );

      this.doc.on("update", this.onUpdateDoc);

      if (this.awareness.getLocalState() !== null)
        this.socket.emit(
          `${this.roomName}-awareness-update`,
          AwarenessProtocol.encodeAwarenessUpdate(this.awareness, [
            this.doc.clientID,
          ])
        );

      this.socket.off(`yjs-${this.roomName}-connected`);
      this.socketConnected = true;
    });
  };

  public disconnect(): void {
    if (this.socket.connected) {
      this.disconnectBc();
    }
  }

  private readonly onSocketDisconnection = (
    event: Socket.DisconnectReason
  ): void => {
    this.emit("connection-close", [event, this]);
    this.socketConnected = false;
    AwarenessProtocol.removeAwarenessStates(
      this.awareness,
      Array.from(this.awareness.getStates().keys()).filter(
        (client) => client !== this.doc.clientID
      ),
      this
    );
    this.emit("status", [{ status: "disconnected" }]);
  };

  private readonly onSocketConnectionError = (error: Error): void => {
    this.emit("connection-error", [error, this]);
  };

  public destroy(): void {
    this.disconnect();
    if (typeof window !== "undefined")
      window.removeEventListener("beforeunload", this.beforeUnloadHandler);
    else if (typeof process !== "undefined")
      process.off("exit", this.beforeUnloadHandler);
    this.awareness.off("update", this.awarenessUpdate);
    this.awareness.destroy();
    this.doc.off("update", this.onUpdateDoc);
    super.destroy();
  }

  private readonly onUpdateDoc = (
    update: Uint8Array,
    origin: SocketIOProvider
  ): void => {
    if (origin !== this) {
      this.socket.emit(`${this.roomName}-sync-update`, update);
      if (this.bcConnected) {
        bc.publish(
          this._broadcastChannel,
          {
            type: "sync-update",
            data: update,
          },
          this
        );
      }
    }
  };

  private readonly onSocketSyncUpdate = (update: ArrayBuffer): void => {
    Y.applyUpdate(this.doc, new Uint8Array(update), this);
  };

  private readonly awarenessUpdate = (
    { added, updated, removed }: AwarenessChange,
    origin: SocketIOProvider | null
  ): void => {
    const changedClients = added.concat(updated).concat(removed);
    this.socket.emit(
      `${this.roomName}-awareness-update`,
      AwarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients)
    );
    if (this.bcConnected) {
      bc.publish(
        this._broadcastChannel,
        {
          type: "awareness-update",
          data: AwarenessProtocol.encodeAwarenessUpdate(
            this.awareness,
            changedClients
          ),
        },
        this
      );
    }
  };

  private readonly beforeUnloadHandler = (): void => {
    AwarenessProtocol.removeAwarenessStates(
      this.awareness,
      [this.doc.clientID],
      "window unload"
    );
  };

  private readonly connectBc = (): void => {
    if (!this.bcConnected) {
      bc.subscribe(this._broadcastChannel, this.onBroadcastChannelMessage);
      this.bcConnected = true;
    }
    bc.publish(
      this._broadcastChannel,
      { type: "sync-step-1", data: Y.encodeStateVector(this.doc) },
      this
    );
    bc.publish(
      this._broadcastChannel,
      { type: "sync-step-2", data: Y.encodeStateAsUpdate(this.doc) },
      this
    );
    bc.publish(
      this._broadcastChannel,
      { type: "query-awareness", data: null },
      this
    );
    bc.publish(
      this._broadcastChannel,
      {
        type: "awareness-update",
        data: AwarenessProtocol.encodeAwarenessUpdate(this.awareness, [
          this.doc.clientID,
        ]),
      },
      this
    );
  };

  private readonly disconnectBc = (): void => {
    bc.publish(
      this._broadcastChannel,
      {
        type: "awareness-update",
        data: AwarenessProtocol.encodeAwarenessUpdate(
          this.awareness,
          [this.doc.clientID],
          new Map()
        ),
      },
      this
    );
    if (this.bcConnected) {
      bc.unsubscribe(this._broadcastChannel, this.onBroadcastChannelMessage);
      this.bcConnected = false;
    }
  };

  private readonly onBroadcastChannelMessage = (
    message: { type: string; data: any },
    origin: SocketIOProvider
  ): void => {
    if (origin !== this && message.type.length > 0) {
      switch (message.type) {
        case "sync-step-1":
          bc.publish(
            this._broadcastChannel,
            {
              type: "sync-step-2",
              data: Y.encodeStateAsUpdate(this.doc, message.data),
            },
            this
          );
          break;

        case "sync-step-2":
          Y.applyUpdate(this.doc, new Uint8Array(message.data), this);
          break;

        case "sync-update":
          Y.applyUpdate(this.doc, new Uint8Array(message.data), this);
          break;

        case "query-awareness":
          bc.publish(
            this._broadcastChannel,
            {
              type: "awareness-update",
              data: AwarenessProtocol.encodeAwarenessUpdate(
                this.awareness,
                Array.from(this.awareness.getStates().keys())
              ),
            },
            this
          );
          break;

        case "awareness-update":
          AwarenessProtocol.applyAwarenessUpdate(
            this.awareness,
            new Uint8Array(message.data),
            this
          );
          break;

        default:
          break;
      }
    }
  };
}

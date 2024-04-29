import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import * as Y from "yjs";
import { SocketIOProvider } from "@repo/y-socket-io";
import useSocket from "@/hooks/useSocket";

function useYJSProvide(roomName: string) {
  const { socket } = useSocket();

  const [status, setStatus] = useState<string>("disconnected");
  const [doc] = useState(new Y.Doc());
  const [provider, setProvider] = useState<SocketIOProvider | null>(null);

  useEffect(() => {
    if (!socket) return;
    const newProvider = new SocketIOProvider(socket, roomName, doc, {
      auth: {
        authorization: getCookie("authorization"),
      },
    });
    setProvider(newProvider);
    newProvider.on("sync", (isSync: boolean) =>
      console.log("websocket sync", isSync)
    );
    newProvider.on("status", ({ status: _status }: { status: string }) => {
      if (_status) setStatus(_status);
    });

    return () => {
      newProvider.disconnect();
      newProvider.destroy();
    };
  }, []);

  return {
    doc,
    provider,
    status,
  };
}

export default useYJSProvide;

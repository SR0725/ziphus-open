"use client";

import { getCookie } from "cookies-next";
import { io, Socket } from "socket.io-client";

// eslint-disable-next-line turbo/no-undeclared-env-vars
const baseURL = process.env.NEXT_PUBLIC_API_ENDPOINT;

const socketMap = new Map<string, Socket>();

interface UseSocket {
  socketEmitWithAuth: (event: string, data: any) => void;
  socket: Socket | null;
}
function useSocket(room?: string): UseSocket {
  // 伺服器端不需要建立 socket
  if (typeof window === "undefined") {
    return { socketEmitWithAuth: () => {}, socket: null };
  }
  const roomKey = room || "";

  if (!socketMap.get(roomKey)) {
    if (!baseURL) {
      throw new Error("NEXT_PUBLIC_API_ENDPOINT is not defined");
    }

    const socket = io(baseURL, {
      transports: ["websocket", "polling", "webtransport"],
      forceNew: true,
      auth: {
        authorization: getCookie("authorization"),
      },
    });

    socket.on("connect", () => {
      if (room) {
        socket?.emit("join-space", room);
      }
    });

    socketMap.set(roomKey, socket);
  }

  const socketEmitWithAuth = (event: string, data: any) => {
    const socket = socketMap.get(roomKey);
    socket?.emit(event, {
      ...data,
      authorization: getCookie("authorization"),
    });
  };

  return { socketEmitWithAuth, socket: socketMap.get(roomKey)! };
}

export default useSocket;

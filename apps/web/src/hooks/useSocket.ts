"use client";

import { getCookie } from "cookies-next";
import { io, Socket } from "socket.io-client";

// eslint-disable-next-line turbo/no-undeclared-env-vars
const baseURL = process.env.NEXT_PUBLIC_API_ENDPOINT;

let socket: Socket | null = null;

interface UseSocket {
  socketEmitWithAuth: (event: string, data: any) => void;
  socket: Socket | null;
}
function useSocket(room?: string): UseSocket {
  // 伺服器端不需要建立 socket
  if (typeof window === "undefined") {
    return { socketEmitWithAuth: () => {}, socket: null };
  }

  if (!socket) {
    if (!baseURL) {
      throw new Error("NEXT_PUBLIC_API_ENDPOINT is not defined");
    }

    socket = io(baseURL, {
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
  }

  const socketEmitWithAuth = (event: string, data: any) => {
    socket?.emit(event, {
      ...data,
      authorization: getCookie("authorization"),
    });
  };

  return { socketEmitWithAuth, socket };
}

export default useSocket;

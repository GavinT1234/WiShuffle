import { io } from "socket.io-client";

let socket = null;

export function getSocket(token) {
  if (!socket) {
    socket = io(import.meta.env.VITE_SERVER_URL, {
      auth: { token },
      autoConnect: false,
      reconnection: true,
    });
  } else if (token && socket.auth.token !== token) {
    socket.auth = { token };
  }
  return socket;
}
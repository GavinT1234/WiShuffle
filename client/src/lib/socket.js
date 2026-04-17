import { io } from "socket.io-client";

let socket = null;

const SOCKET_URL =
  import.meta.env.PROD
    ? window.location.origin
    : "http://localhost:4000";

export function getSocket(token) {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: false,
      reconnection: true,
    });
  } else if (token && socket.auth.token !== token) {
    socket.auth = { token };
  }
  return socket;
}
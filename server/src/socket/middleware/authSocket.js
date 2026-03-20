import { verifyJWT } from "../../services/authService.js";

export async function socketAuthMiddleware(socket, next) {
  try {
    const token = socket.handshake.headers.authentication;
    if (!token) throw new Error("No token provided");

    socket.user = await verifyJWT(token);
    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
}
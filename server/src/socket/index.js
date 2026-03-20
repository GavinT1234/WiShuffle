import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { socketAuthMiddleware } from "./middleware/authSocket.js";
import { registerRoomHandlers } from "./handlers/roomHandler.js";
//import { registerChatHandlers } from "./handlers/chat.handler.js";
//import { registerQueueHandlers } from "./handlers/queue.handler.js";
//import { registerVoteHandlers } from "./handlers/vote.handler.js";

export async function initSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: { origin: process.env.CLIENT_URL }
    });

    // Redis adapter for multi-server scaling
    const pubClient = createClient({ url: process.env.REDIS_URL });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));

    // Auth middleware runs before every connection
    io.use(socketAuthMiddleware);

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.user.id}`);

        registerRoomHandlers(io, socket);
        //registerChatHandlers(io, socket);
        //registerQueueHandlers(io, socket);
        //registerVoteHandlers(io, socket);

        socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.user.id}`);
        });
    });

    return io;
}
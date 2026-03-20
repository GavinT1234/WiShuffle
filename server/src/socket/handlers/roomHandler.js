import { getRoomState, addUserToRoom, removeUserFromRoom } from "../../services/roomService.js";

export function registerRoomHandlers(io, socket) {

    socket.on("room:join", async ({ roomId }) => {
        socket.join(`room:${roomId}`);
        socket.currentRoom = roomId;

        await addUserToRoom(roomId, socket.user.id);
        const state = await getRoomState(roomId);

        socket.emit("room:state", state);
        socket.to(`room:${roomId}`).emit("room:user_joined", {
            userId: socket.user.id,
            username: socket.user.name,
        });
    });

    socket.on("room:leave", async ({ roomId }) => {
        await handleLeave(roomId);
    });

    socket.on("disconnect", async () => {
        if (socket.currentRoom) await handleLeave(socket.currentRoom);
    });

    async function handleLeave(roomId) {
        await removeUserFromRoom(roomId, socket.user.id);
        socket.leave(`room:${roomId}`);
        socket.to(`room:${roomId}`).emit("room:user_left", {
            userId: socket.user.id,
        });
        socket.currentRoom = null;
    }
}
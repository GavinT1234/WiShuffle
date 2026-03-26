import { getRoomState, addUserToRoom, removeUserFromRoom } from '../../services/roomService.js';
import { getDJQueue, getFullPlaybackState, leaveDJQueue, getCurrentDJ, isCurrentDJ } from '../../services/djService.js';

export function registerRoomHandlers(io, socket) {

    socket.on('room:join', async ({ roomId }) => {
        socket.join(`room:${roomId}`);
        socket.currentRoom = roomId;

        await addUserToRoom(roomId, socket.user.id);

        // Fetch room presence + DJ queue + playback state in parallel
        const [state, djQueue, playback] = await Promise.all([
            getRoomState(roomId),
            getDJQueue(roomId),
            getFullPlaybackState(roomId),
        ]);

        // Send full state to joining user
        socket.emit('room:state', {
            ...state,
            djQueue,
            playback, // { song, elapsedSeconds, playState } or null
        });

        // Notify others
        socket.to(`room:${roomId}`).emit('room:user_joined', {
            userId: socket.user.id,
            username: socket.user.username,
        });
    });

    socket.on('room:leave', async ({ roomId }) => {
        await handleLeave(roomId);
    });

    socket.on('disconnect', async () => {
        if (socket.currentRoom) await handleLeave(socket.currentRoom);
    });

    async function handleLeave(roomId) {
        await removeUserFromRoom(roomId, socket.user.id);
        socket.leave(`room:${roomId}`);
        socket.to(`room:${roomId}`).emit('room:user_left', {
            userId: socket.user.id,
        });
        socket.currentRoom = null;
    }
}
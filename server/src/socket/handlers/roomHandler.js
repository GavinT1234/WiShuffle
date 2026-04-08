import {
  getRoomState,
  addUserToRoom,
  removeUserFromRoom, getRoomsState,
} from '../../services/roomService.js';

export function registerRoomHandlers(io, socket) {
  // Join a room
  socket.on('room:join', async ({ roomId }, ack) => {
    if (!roomId) return;
    console.log(`[Socket] User ${socket.user.id} joining room ${roomId}`);

    // If user was already in a room, leave first
    if (socket.currentRoom && socket.currentRoom !== roomId) {
      await leaveRoom(socket.currentRoom);
    }

    socket.join(`room:${roomId}`);
    socket.currentRoom = roomId;

    await addUserToRoom(roomId, socket.user.id);
    const state = await getRoomState(roomId);

    // Broadcast updated state to all users in the room (including joiner)
    io.to(`room:${roomId}`).emit('room:state', state);

    // Ack the joiner with current state
    if (ack) ack({ ok: true, state });
  });

  // Leave a room manually
  socket.on('room:leave', async ({ roomId }) => {
    if (!roomId) return;
    console.log(`[Socket] User ${socket.user.id} leaving room ${roomId}`);
    await leaveRoom(roomId);
  });

  // Handle disconnect
  socket.on('disconnect', async () => {
    if (socket.currentRoom) {
      console.log(`[Socket] User ${socket.user.id} disconnected from room ${socket.currentRoom}`);
      await leaveRoom(socket.currentRoom);
    }
  });

  // Helper function
  async function leaveRoom(roomId) {
    if (!roomId) return;
    try {
      await removeUserFromRoom(roomId, socket.user.id);
      socket.leave(`room:${roomId}`);

      const state = await getRoomState(roomId);

      // Broadcast updated state to remaining users
      io.to(`room:${roomId}`).emit('room:state', state);

      if (socket.currentRoom === roomId) socket.currentRoom = null;
    } catch (err) {
      console.error(`[Socket] Error leaving room ${roomId}:`, err);
    }
  }
}

export function getRoomsHandler(io, socket) {
  socket.on('rooms:state', async (ack) => {
    const rooms = await getRoomsState();
    ack({ ok: true, state: rooms });
  });
}
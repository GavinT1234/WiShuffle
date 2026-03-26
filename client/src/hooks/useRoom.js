import { useEffect, useState, useCallback } from 'react';

export function useRoom(socket, roomId, onRoomState) {
    const [users, setUsers] = useState([]);
    const [joined, setJoined] = useState(false);

    useEffect(() => {
        if (!socket || !roomId) return;

        socket.emit('room:join', { roomId: Number(roomId) });

        socket.on('room:state', (state) => {
            setUsers(state.users || []);
            setJoined(true);
            // Forward full state to sync hook (playback, djQueue, etc.)
            onRoomState?.(state);
        });

        socket.on('room:user_joined', ({ userId }) => {
            setUsers((prev) =>
                prev.includes(String(userId)) ? prev : [...prev, String(userId)]
            );
        });

        socket.on('room:user_left', ({ userId }) => {
            setUsers((prev) => prev.filter((id) => id !== String(userId)));
        });

        return () => {
            socket.emit('room:leave', { roomId: Number(roomId) });
            socket.off('room:state');
            socket.off('room:user_joined');
            socket.off('room:user_left');
            setJoined(false);
            setUsers([]);
        };
    }, [socket, roomId]); // intentionally exclude onRoomState — stable ref not needed

    const leave = useCallback(() => {
        if (socket) socket.emit('room:leave', { roomId: Number(roomId) });
    }, [socket, roomId]);

    return { users, joined, leave };
}
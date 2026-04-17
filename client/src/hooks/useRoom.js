import { useQuery }  from "@tanstack/react-query";
import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import api from '../api/index'

export const useRoom = (roomId) => {
    const { socket } = useSocket();

    const query = useQuery({
        queryKey: ["room", roomId],
        queryFn:  () => api.get(`/rooms/${roomId}`),
        enabled:  !!roomId,
    });

    useEffect(() => {
        if (!socket || !roomId) return;

        socket.emit("room:join", roomId);      // tell server we're here
        return () => socket.emit("room:leave", roomId); // cleanup
    }, [socket, roomId]);

    return { room: query.data, isLoading: query.isLoading };
};
import { useEffect, useRef, useState, useCallback } from "react";
import { useSocket } from "../context/SocketContext";

export function useRoom(roomId) {
  const { socket } = useSocket();
  const [roomState, setRoomState] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasJoinedRef = useRef(false);

  const applyState = useCallback((state) => {
    setRoomState(state);
    setUsers(
        (state?.users ?? []).map((u) =>
            typeof u === "object" ? u : { userId: u, username: undefined }
        )
    );
  }, []);

  useEffect(() => {
    if (!socket || !roomId) return;

    // Register listener FIRST, before joining, so we never miss a broadcast
    socket.on("room:state", applyState);

    const join = () => {
      if (hasJoinedRef.current) return;
      hasJoinedRef.current = true;
      setIsLoading(true);

      console.log('📤 Emitting room:join for roomId:', roomId, 'socket.id:', socket.id);
      socket.emit("room:join", { roomId }, (resp) => {
        console.log('✅ room:join response:', resp);
        console.log('   After join, socket.rooms:', socket.rooms);
        if (resp?.ok && resp.state) {
          applyState(resp.state);
        } else {
          console.error("[useRoom] join failed:", resp?.error);
        }
        setIsLoading(false);
      });
    };

    // Use socket.connected directly — NOT isConnected state in deps
    if (socket.connected) {
      join();
    } else {
      socket.once("connect", join);
    }

    return () => {
      socket.off("room:state", applyState);
      socket.off("connect", join); // clean up in case we never connected

      if (hasJoinedRef.current) {
        if (socket.connected) socket.emit("room:leave", { roomId });
        hasJoinedRef.current = false;
      }
    };
  }, [socket, roomId, applyState]); // ← isConnected intentionally removed

  return { roomState, users, isLoading };
}
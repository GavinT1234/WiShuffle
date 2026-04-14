import { useState, useEffect, useCallback } from "react";
import { getAllRooms } from "../api/room.js";
import { useSocket } from "../context/SocketContext";

export const useGetRooms = () => {
  // const {socket} = useSocket();
  const [roomsState, setRoomsState] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const applyState = useCallback((state) => {
    console.log("state:", state);
    setRoomsState(state);
    setRooms(state?.rooms ?? [])
  }, []);

  const fetchRooms = async () => {
    setError(null);
    try {
      const rooms = await getAllRooms();
      console.log(rooms);
      setRooms(rooms);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // if (!socket) return;
    //
    // socket.on("rooms:state", applyState);
    //
    // socket.emit("rooms:state", (resp) => {
    // if (resp?.ok && resp.state) {
    //   applyState(resp.state);
    // } else {
    //   console.error("[useGetRooms] state fetch failed:", resp?.error);
    // }
    // })
    //
    // return () => {socket.off("rooms:state", applyState)}
    fetchRooms();
  }, []);

  return { rooms, roomsState, loading, error, fetchRooms };
};

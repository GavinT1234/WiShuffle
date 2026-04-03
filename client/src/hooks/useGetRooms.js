import { useState, useEffect } from "react";
import { getAllRooms } from "../api/room.js";

export const useGetRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    fetchRooms();
  }, []);

  return { rooms, loading, error, fetchRooms };
};

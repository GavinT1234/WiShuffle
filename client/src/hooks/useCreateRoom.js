import { useState, useEffect } from "react";
import { createRoom } from "../api/room";

export const useCreateRoom = () => {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = async ({ name, tags = [] }) => {
    setLoading(true);
    setError(null);
    try {
      console.log("name and tags:", name, tags);
      const room = await createRoom({ name, tags });
      setRoom(room);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { room, loading, error, create };
};

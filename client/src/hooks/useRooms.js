import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllRooms } from "../api/room";

export const useRooms = () => {
    const qc = useQueryClient();

    const query = useQuery({
        queryKey: ["rooms"],
        queryFn: getAllRooms,
    });

    const createRoom = useMutation({
        mutationFn: (data) => api.post("/rooms", data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["rooms"] }),
    });

    return {
        rooms:      query.data,
        isLoading:  query.isLoading,
        error:      query.error?.message,
        createRoom: createRoom.mutate,
  };

};
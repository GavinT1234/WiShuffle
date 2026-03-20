import { getAllRooms, getRoomById, createRoom, deleteRoom } from "../services/roomService.js";

export async function getAllRoomsHandler(req, res) {
    let rooms = await getAllRooms();
    res.status(200).json(rooms);
}

export async function getRoomByIdHandler(req, res) {
  const id = parseInt(req.params.id);
  const room = await getRoomById(id);
  res.status(200).json(room);
}

export async function createRoomHandler(req, res) {
  const { name } = req.body;
  const newRoom = await createRoom({ name, ownerId: req.user.id });
  res.status(201).json(newRoom);
}

export async function deleteRoomHandler(req, res) {
  const id = parseInt(req.params.id);
  await deleteRoom(id);
  res.status(204).send();
}
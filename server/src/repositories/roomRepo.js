import prisma from '../config/db.js';
import { Genre } from '../generated/prisma/index.js';
export async function getAll() {
  const rooms = await prisma.room.findMany({
    include: { owner: { select: { username: true } } },
  });
  return rooms;
}

export async function getById(id) {
  const room = await prisma.room.findUnique({ where: { id } });
  console.log(room);
  return room;
}

export async function create(data) {
  const { name, tags, ownerId } = data;

  const newRoom = await prisma.room.create({
    data: {
      name,
      tags: {
        set: tags.map((t) => Genre[t]),
      },
      ownerId,
    },
    include: {
      owner: {
        select: {
          username: true,
        },
      },
    },
  });

  return newRoom;
}

export async function remove(id) {
  try {
    const deletedRoom = await prisma.room.delete({ where: { id } });
    return deletedRoom;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}

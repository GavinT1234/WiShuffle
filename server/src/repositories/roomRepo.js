import prisma from '../config/db.js';

export async function getAll() {
    const rooms = await prisma.room.findMany();
    return rooms;
}

export async function getById(id) {
    const room = await prisma.room.findUnique({ where: { id } });
    return room;
}

export async function create(data) {
    const newRoom = await prisma.room.create({ data });
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
import prisma from '../config/db.js';

export async function playlists(ownerId) {
    const playlists = await prisma.room.findMany({where: {ownerId}});
    return playlists;
}
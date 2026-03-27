import prisma from '../config/db.js';

export async function playlists(ownerId) {
    const playlists = await prisma.playlist.findMany({where: {ownerId}});
    return playlists;
}
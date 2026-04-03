import prisma from '../config/db.js';

export async function getUser(ownerId) {
    const playlists = await prisma.playlist.findMany({where: {ownerId}});
    return playlists;
}

export async function getSingle(ownerId) {
    const playlist = await prisma.playlist.findUnique({where: {id}});
    return playlist;
}

export async function create({playlistData}) {
    const playlist = await prisma.playlist.create({data: {playlistData}});
    return playlist;
}

export async function update({playlistData}) {
    try {
        const playlist = await prisma.playlist.update({
        where: { id },
        data: playlistData,
        });
        return playlist;
    } catch (error) {
        if (error.code === 'P2025') return null;
        throw error;
  }
}

export async function remove(id) {
    try {
        const playlist = await prisma.playlist.delete({
        where: { id },
        });
        return playlist;
    } catch (error) {
        if (error.code === 'P2025') return null;
        throw error;
    }
}
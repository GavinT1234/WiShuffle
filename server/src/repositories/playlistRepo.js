import prisma from '../config/db.js';

export async function userPlaylists(ownerId) {
    const playlists = await prisma.playlist.findMany({where: {ownerId, isSong: false, parentId: null}, include: {ownerId: false}});
    return playlists;
}

export async function userPlaylistsAll(ownerId) {
    const playlists = await prisma.playlist.findMany({where: {ownerId, isSong: false}, include: {ownerId: false}});
    return playlists;
}

export async function singlePlaylist(id) {
    const playlist = await prisma.playlist.findUnique({where: {id, isSong: false}, include: {isSong: false}});
    return playlist;
}

export async function playlistSongs(parentId) {
    const songs = await prisma.playlist.findMany({
        where: {parentId, isSong: true},
        orderBy: {position: 'asc'},
        include: {name: true, author: true, url: true, position: true}
    });
    return songs;
}

export async function playlistContent(parentId) {
    const content = await prisma.playlist.findMany({
        where: { parentId },
        orderBy: { position: 'asc' }
    });
    return content;
}

export async function create(playlistData) {
    const playlist = await prisma.playlist.create({
        data: playlistData,
        include: {author: false, url: false, isSong: false}
    });
    return playlist;
}

export async function add(songData) {
    const song = await prisma.playlist.create({
        data: songData,
        include: {shuffle: false, isSong: false}
    });
    return song;
}

export async function update(id, playlistData) {
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

export async function next(parentId) {
    const next = await prisma.playlist.aggregate({
        where: {parentId},
        _max: {position: true}
    });
    if (next) return next._max.position + 1;
    return 0;
};

export async function pos(id) {
    const pos = await prisma.playlist.findUnique({
        select: {position: true},
        where: {id}
    });
    if (pos) return pos.position;
    return null;
}

export async function parent(id) {
    const parent = await prisma.playlist.findUnique({
        where: {id}
    });
    if (id) return parent.parentId;
    return null;
}

export async function playlistOrdering(parentId) {
    const ordering = await prisma.playlist.findMany({
        select: {id: true, position: true},
        where: {parentId},
        orderBy: {position: 'asc'},
    });
    return ordering;
}

export async function idAt(parentId, position) {
    const playlist = await prisma.playlist.findFirst({
        select: {id: true, position: true},
        where: {parentId, position}
    });
    return playlist;
}

export async function removeSong(id) {
    try {
        const song = await prisma.playlist.delete({
        where: { id },
        });
        return song;
    } catch (error) {
        if (error.code === 'P2025') return null;
        throw error;
    }
}

export async function ownership(id) {
    const item = await prisma.playlist.findUnique({where: {id}});
    return item;
}
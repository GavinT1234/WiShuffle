import prisma from '../config/db.js';

export async function getUser(ownerId) {
    const playlists = await prisma.playlist.findMany({where: {ownerId}});
    return playlists;
}

export async function getSingle(id) {
    const playlist = await prisma.playlist.findUnique({where: {id}});
    return playlist;
}

export async function getPositions(id) {
    const songs = await prisma.song.findMany({
        where: {playlistId: id},
        include: {
            position: true
        }
    });
    prisma.song
    const playlists = await prisma.playlist.findMany({
        where: {parentId: id},
        include: {
            position: true
        }
    });
    
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

// export async function allSongs(playlistId) {
//     try {
//         const songs = await prisma.song.findMany({
//             where: { playlistId }
//         });
//         return songs;
//     } catch (error) {
//         if (error.code === 'P2025') return null;
//         throw error;
//     }
// }

export async function getAllSongsFromPlaylist(playlistId) {
  // Step 1: fetch playlist with children + songs
  const playlist = await prisma.playlist.findUnique({
    where: { 
        id: { playlistId }
    },
    include: {
      songs: true,
      subPlaylist: true
    }
  });

  if (!playlist) return [];

  // Step 2: collect songs from this playlist
  let allSongs = [...playlist.songs];

  // Step 3: recursively collect songs from children
  for (const child of playlist.subPlaylist) {
    const childSongs = await getAllSongsFromPlaylist(child.id);
    allSongs = [...allSongs, ...childSongs];
  }

  return allSongs;
}

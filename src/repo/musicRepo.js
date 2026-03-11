import prisma from '../config/db.js';

// ============ PLAYLIST OPERATIONS ============

export async function createPlaylist(data) {
  return prisma.playlist.create({
    data,
    include: {
      folders: true,
      songs: true,
    },
  });
}

export async function getPlaylistById(id) {
  return prisma.playlist.findUnique({
    where: { id },
    include: {
      folders: {
        include: {
          songs: {
            include: {
              song: true,
            },
          },
        },
      },
      songs: {
        include: {
          song: true,
        },
      },
      user: true,
    },
  });
}

export async function getPlaylistsByUserId(userId) {
  return prisma.playlist.findMany({
    where: { userId },
    include: {
      folders: true,
      songs: true,
    },
  });
}

export async function getAllPlaylists() {
  return prisma.playlist.findMany({
    include: {
      folders: true,
      songs: true,
      user: true,
    },
  });
}

export async function updatePlaylist(id, data) {
  return prisma.playlist.update({
    where: { id },
    data,
    include: {
      folders: true,
      songs: true,
    },
  });
}

export async function deletePlaylist(id) {
  return prisma.playlist.delete({
    where: { id },
  });
}

// ============ FOLDER OPERATIONS ============

export async function createFolder(data) {
  return prisma.folder.create({
    data,
    include: {
      songs: {
        include: {
          song: true,
        },
      },
    },
  });
}

export async function getFolderById(id) {
  return prisma.folder.findUnique({
    where: { id },
    include: {
      songs: {
        include: {
          song: true,
        },
      },
      playlist: true,
    },
  });
}

export async function getFoldersByPlaylistId(playlistId) {
  return prisma.folder.findMany({
    where: { playlistId },
    include: {
      songs: {
        include: {
          song: true,
        },
      },
    },
  });
}

export async function updateFolder(id, data) {
  return prisma.folder.update({
    where: { id },
    data,
    include: {
      songs: {
        include: {
          song: true,
        },
      },
    },
  });
}

export async function deleteFolder(id) {
  return prisma.folder.delete({
    where: { id },
  });
}

// ============ SONG OPERATIONS ============

export async function createSong(data) {
  return prisma.song.create({
    data,
  });
}

export async function getSongById(id) {
  return prisma.song.findUnique({
    where: { id },
    include: {
      playlistSongs: true,
      folderSongs: true,
    },
  });
}

export async function getAllSongs() {
  return prisma.song.findMany();
}

export async function updateSong(id, data) {
  return prisma.song.update({
    where: { id },
    data,
  });
}

export async function deleteSong(id) {
  return prisma.song.delete({
    where: { id },
  });
}

// ============ PLAYLIST SONG OPERATIONS ============

export async function addSongToPlaylist(data) {
  return prisma.playlistSong.create({
    data,
    include: {
      song: true,
    },
  });
}

export async function getPlaylistSongs(playlistId) {
  return prisma.playlistSong.findMany({
    where: { playlistId },
    include: {
      song: true,
    },
  });
}

export async function removeSongFromPlaylist(playlistId, songId) {
  return prisma.playlistSong.deleteMany({
    where: {
      playlistId,
      songId,
    },
  });
}

// ============ FOLDER SONG OPERATIONS ============

export async function addSongToFolder(data) {
  return prisma.folderSong.create({
    data,
    include: {
      song: true,
    },
  });
}

export async function getFolderSongs(folderId) {
  return prisma.folderSong.findMany({
    where: { folderId },
    include: {
      song: true,
    },
  });
}

export async function removeSongFromFolder(folderId, songId) {
  return prisma.folderSong.deleteMany({
    where: {
      folderId,
      songId,
    },
  });
}

// ============ SEARCH OPERATIONS ============

export async function searchSongs(query) {
  return prisma.song.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { artist: { contains: query, mode: 'insensitive' } },
      ],
    },
  });
}

export async function searchPlaylists(query, userId) {
  return prisma.playlist.findMany({
    where: {
      AND: [
        {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        { userId },
      ],
    },
    include: {
      folders: true,
      songs: true,
    },
  });
}

import * as musicService from '../services/musicService.js';

// ============ FOLDER CONTROLLERS ============

export async function createFolder(req, res, next) {
  try {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    const folder = await musicService.createFolder(parseInt(playlistId), name, description);
    res.status(201).json(folder);
  } catch (error) {
    next(error);
  }
}

export async function getFolderById(req, res, next) {
  try {
    const { folderId } = req.params;
    const folder = await musicService.getFolderById(parseInt(folderId));
    res.json(folder);
  } catch (error) {
    next(error);
  }
}

export async function getFoldersByPlaylistId(req, res, next) {
  try {
    const { playlistId } = req.params;
    const folders = await musicService.getFoldersByPlaylistId(parseInt(playlistId));
    res.json(folders);
  } catch (error) {
    next(error);
  }
}

export async function updateFolder(req, res, next) {
  try {
    const { folderId } = req.params;
    const { name, description, isShuffle, orderIndex } = req.body;

    const folder = await musicService.updateFolder(parseInt(folderId), {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(isShuffle !== undefined && { isShuffle }),
      ...(orderIndex !== undefined && { orderIndex }),
    });

    res.json(folder);
  } catch (error) {
    next(error);
  }
}

export async function deleteFolder(req, res, next) {
  try {
    const { folderId } = req.params;
    await musicService.deleteFolder(parseInt(folderId));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function toggleFolderShuffle(req, res, next) {
  try {
    const { folderId } = req.params;
    const folder = await musicService.toggleFolderShuffle(parseInt(folderId));
    res.json(folder);
  } catch (error) {
    next(error);
  }
}

// ============ PLAYLIST CONTROLLERS ============

export async function createPlaylist(req, res, next) {
  try {
    const userId = req.user?.id; // Assumes auth middleware sets req.user
    const { name, description, isPublic } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const playlist = await musicService.createPlaylist(
      userId,
      name,
      description,
      isPublic
    );

    res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
}

export async function getPlaylistById(req, res, next) {
  try {
    const { playlistId } = req.params;
    const playlist = await musicService.getPlaylistById(parseInt(playlistId));
    res.json(playlist);
  } catch (error) {
    next(error);
  }
}

export async function getPlaylistsByUserId(req, res, next) {
  try {
    const { userId } = req.params;
    const playlists = await musicService.getPlaylistsByUserId(parseInt(userId));
    res.json(playlists);
  } catch (error) {
    next(error);
  }
}

export async function updatePlaylist(req, res, next) {
  try {
    const { playlistId } = req.params;
    const { name, description, isPublic } = req.body;

    const playlist = await musicService.updatePlaylist(parseInt(playlistId), {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(isPublic !== undefined && { isPublic }),
    });

    res.json(playlist);
  } catch (error) {
    next(error);
  }
}

export async function deletePlaylist(req, res, next) {
  try {
    const { playlistId } = req.params;
    await musicService.deletePlaylist(parseInt(playlistId));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

// ============ SONG CONTROLLERS ============

export async function createSong(req, res, next) {
  try {
    const { title, artist, youtubeUrl, duration, thumbnail, addedBy } = req.body;

    const song = await musicService.createSong(
      title,
      artist,
      youtubeUrl,
      duration,
      thumbnail,
      addedBy
    );

    res.status(201).json(song);
  } catch (error) {
    next(error);
  }
}

export async function getSongById(req, res, next) {
  try {
    const { songId } = req.params;
    const song = await musicService.getSongById(parseInt(songId));
    res.json(song);
  } catch (error) {
    next(error);
  }
}

export async function getAllSongs(req, res, next) {
  try {
    const songs = await musicService.getAllSongs();
    res.json(songs);
  } catch (error) {
    next(error);
  }
}

export async function updateSong(req, res, next) {
  try {
    const { songId } = req.params;
    const { title, artist, youtubeUrl, duration, thumbnail } = req.body;

    const song = await musicService.updateSong(parseInt(songId), {
      ...(title && { title }),
      ...(artist && { artist }),
      ...(youtubeUrl && { youtubeUrl }),
      ...(duration && { duration }),
      ...(thumbnail !== undefined && { thumbnail }),
    });

    res.json(song);
  } catch (error) {
    next(error);
  }
}

export async function deleteSong(req, res, next) {
  try {
    const { songId } = req.params;
    await musicService.deleteSong(parseInt(songId));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

// ============ FOLDER SONG MANAGEMENT ============

export async function addSongToFolder(req, res, next) {
  try {
    const { folderId } = req.params;
    const { songId, orderIndex } = req.body;

    const folderSong = await musicService.addSongToFolder(
      parseInt(folderId),
      parseInt(songId),
      orderIndex
    );

    res.status(201).json(folderSong);
  } catch (error) {
    next(error);
  }
}

export async function removeSongFromFolder(req, res, next) {
  try {
    const { folderId, songId } = req.params;
    await musicService.removeSongFromFolder(parseInt(folderId), parseInt(songId));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function reorderFolderSongs(req, res, next) {
  try {
    const { folderId } = req.params;
    const { songOrders } = req.body; // [{ songId, orderIndex }, ...]

    const result = await musicService.reorderSongsInFolder(
      parseInt(folderId),
      songOrders.map(so => ({
        songId: parseInt(so.songId),
        orderIndex: parseInt(so.orderIndex),
      }))
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
}

// ============ PLAYLIST SONG MANAGEMENT ============

export async function addSongToPlaylist(req, res, next) {
  try {
    const { playlistId } = req.params;
    const { songId, orderIndex } = req.body;

    const playlistSong = await musicService.addSongToPlaylist(
      parseInt(playlistId),
      parseInt(songId),
      orderIndex
    );

    res.status(201).json(playlistSong);
  } catch (error) {
    next(error);
  }
}

export async function removeSongFromPlaylist(req, res, next) {
  try {
    const { playlistId, songId } = req.params;
    await musicService.removeSongFromPlaylist(parseInt(playlistId), parseInt(songId));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function reorderPlaylistSongs(req, res, next) {
  try {
    const { playlistId } = req.params;
    const { songOrders } = req.body;

    const result = await musicService.reorderSongsInPlaylist(
      parseInt(playlistId),
      songOrders.map(so => ({
        songId: parseInt(so.songId),
        orderIndex: parseInt(so.orderIndex),
      }))
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
}

// ============ ROOM CONTROLLERS ============

export async function createRoom(req, res, next) {
  try {
    const userId = req.user?.id;
    const { name, description } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const room = await musicService.createRoom(userId, name, description);
    res.status(201).json(room);
  } catch (error) {
    next(error);
  }
}

export async function getRoomById(req, res, next) {
  try {
    const { roomId } = req.params;
    const room = await musicService.getRoomById(parseInt(roomId));
    res.json(room);
  } catch (error) {
    next(error);
  }
}

export async function getAllRooms(req, res, next) {
  try {
    const rooms = await musicService.getAllRooms();
    res.json(rooms);
  } catch (error) {
    next(error);
  }
}

export async function updateRoom(req, res, next) {
  try {
    const { roomId } = req.params;
    const { name, description, skipVoteThreshold, isActive, currentSongId } = req.body;

    const room = await musicService.updateRoom(parseInt(roomId), {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(skipVoteThreshold && { skipVoteThreshold }),
      ...(isActive !== undefined && { isActive }),
      ...(currentSongId && { currentSongId: parseInt(currentSongId) }),
    });

    res.json(room);
  } catch (error) {
    next(error);
  }
}

export async function deleteRoom(req, res, next) {
  try {
    const { roomId } = req.params;
    await musicService.deleteRoom(parseInt(roomId));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

// ============ VOTE CONTROLLERS ============

export async function addVote(req, res, next) {
  try {
    const userId = req.user?.id;
    const { roomId, songId, voteType } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const vote = await musicService.addVote(
      userId,
      parseInt(roomId),
      parseInt(songId),
      voteType
    );

    res.status(201).json(vote);
  } catch (error) {
    next(error);
  }
}

export async function removeVote(req, res, next) {
  try {
    const userId = req.user?.id;
    const { roomId, songId, voteType } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await musicService.removeVote(userId, parseInt(roomId), parseInt(songId), voteType);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getSkipPercentage(req, res, next) {
  try {
    const { roomId, songId } = req.params;
    const room = await musicService.getRoomById(parseInt(roomId));
    
    const skipPercentage = await musicService.calculateSkipPercentage(
      parseInt(roomId),
      parseInt(songId),
      10 // TODO: Get actual user count in room
    );

    res.json({ skipPercentage, skipThreshold: room.skipVoteThreshold });
  } catch (error) {
    next(error);
  }
}

// ============ DJ QUEUE CONTROLLERS ============

export async function addUserToDJQueue(req, res, next) {
  try {
    const userId = req.user?.id;
    const { roomId, playlistId } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const queueEntry = await musicService.addUserToDJQueue(
      userId,
      parseInt(roomId),
      playlistId ? parseInt(playlistId) : null
    );

    res.status(201).json(queueEntry);
  } catch (error) {
    next(error);
  }
}

export async function removeUserFromDJQueue(req, res, next) {
  try {
    const userId = req.user?.id;
    const { roomId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await musicService.removeUserFromDJQueue(userId, parseInt(roomId));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getDJQueue(req, res, next) {
  try {
    const { roomId } = req.params;
    const queue = await musicService.getDJQueueForRoom(parseInt(roomId));
    res.json(queue);
  } catch (error) {
    next(error);
  }
}

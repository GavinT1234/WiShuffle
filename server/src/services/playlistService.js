import { create, singlePlaylist, userPlaylists, update, playlistSongs, add, removeSong, playlistOrdering, next, parent, pos, ownership, remove, playlistContent } from '../repositories/playlistRepo.js'

export async function getPlaylists(ownerId) {
    const playlists = await userPlaylists(ownerId);
    return playlists;
}

export async function getPlaylist(id) {
    const playlist = await singlePlaylist(id);
    if (playlist) return playlist;
    else {
        const error = new Error(`Playlist not found`);
        error.status = 404;
        throw error;
    }
}

export async function getPlaylistSongs(id) {
    const songs = await playlistSongs(id);
    if (songs) return songs;
    else {
        const error = new Error(`Playlist not found`);
        error.status = 404;
        throw error;
    }
}

export async function getPlaylistContent(id) {
    const items = await playlistContent(id);
    if (items) return items;
    else {
        const error = new Error(`Playlist not found`);
        error.status = 404;
        throw error;
    }
}

export async function getNext(id) {
    const nextPos = await next(id);
    if (nextPos) return nextPos;
    else {
        const error = new Error(`Playlist not found`);
        error.status = 404;
        throw error;
    }
}

export async function createPlaylist(playlistData) {
    
    const playlist = await create(playlistData);
    return playlist;
}

export async function addSong(songData) {
    const song = await add(songData);
    if (song) return song;
    else {
        const error = new Error(`Playlist not found`);
        error.status(400);
        throw error;
    }
}

export async function updatePlaylist(id, playlistData, direction) {
    await positionHelper(id, playlistData, direction)
    const playlist = await update(id, playlistData);
    if (playlist) return playlist;
    else {
        const error = new Error(`Playlist not found`);
        error.status = 404;
        throw error;
    }
}

export async function getPlaylistOrdering(id) {
    const ordering = await playlistOrdering(id);
    if (ordering) return ordering;
    else {
        const error = new Error(`Playlist not found`);
        error.status = 404;
        throw error;
    }
}

export async function deletePlaylist(id) {
    const parentId = await parent(id);
    console.log(parentId);
    const order = await getPlaylistOrdering(parentId);
    console.log(order.length);
    const playlist = await updatePlaylist(id, { position: order.length});
    console.log(playlist);
    if (playlist) {
        await remove(id);
        return playlist;
    }
    else {
        const error = new Error(`Playlist not found`);
        error.status = 404;
        throw error;
    }
}

export async function deleteSong(id) {
    const song = await removeSong(id);
    if (song) return;
    else {
        const error = new Error(`Song not found`);
        error.status = 404;
        throw error;
    }
}

export async function getSongs(playlistId) {
    const songs = await playlistSongs(playlistId);
    if (songs) return;
    else {
        const error = new Error(`Playlist not found`);
        error.status = 404;
        throw error;
    }
}

export async function ownershipCheck(id) {
    const item = await ownership(id);
    if (item) return item;
    else {
        const error = new Error(`Item not found`);
        error.status = 404;
        throw error;
    }
}

async function positionHelper(id, playlistData, direction) {
    console.log(direction);
    let { position } = playlistData;
    if (position) {
        const parentId = await parent(id);
        const currentPos = await pos(id);
        const currentState = await playlistOrdering(parentId);
        const lastPos = currentState.length;
        // if (position > lastPos) {console.log('bigger!'); position = lastPos};
        if (direction === -1 || ((position < currentPos) && (direction === undefined))) {
            const node = currentState[position - 1];
            if (position === node.position) {
                console.log(position);
                await updatePlaylist(node.id, {position: position + 1}, -1);
                return;
            }
            // for (let i = position; i < lastPos - 1; i++) {
            //     const node = currentState[i];
            //     if (position === node.position) {
            //         await updatePlaylist(node.id, {position: position + 1}, -1);
            //         break;
            //     }
            // }
        }
        else if (direction === 1 || ((position > currentPos) && (direction === undefined))) {
            const node = currentState[position - 1];
            if (position === node.position) {
                await updatePlaylist(node.id, {position: position - 1}, 1);
                return;
            }
            // for (let i = lastPos - 1; i >= 0; i--) {
            //     const node = currentState[i];
            //     if (position === node.position) {
            //         await updatePlaylist(node.id, {position: position - 1}, 1);
            //         break;
            //     }
            // }
        }
    }
}
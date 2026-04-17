import { create, singlePlaylist, userPlaylists, update, playlistSongs, add, removeSong, playlistOrdering, next, parent, pos, idAt, ownership, remove, playlistContent, userPlaylistsAll } from '../repositories/playlistRepo.js'

export async function getPlaylists(ownerId) {
    const playlists = await userPlaylists(ownerId);
    return playlists;
}

export async function getPlaylistsAll(ownerId) {
    const playlists = await userPlaylistsAll(ownerId);
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

export async function updatePlaylist(id, playlistData, orderPayload) {
    await positionHelper(id, playlistData, orderPayload)
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
    const order = await getPlaylistOrdering(parentId);
    const playlist = await updatePlaylist(id, { position: order.length});
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

export async function seedPlaylist(id, ownerId) {
    const seeds = [
        {name: 'Icelandic Arpeggios', author: 'Div Kid', url: 'https://www.youtube.com/watch?v=pxoq8jEGbBo'},
        {name: 'You WON!', author: 'You WON!', url: 'https://www.youtube.com/watch?v=iJJKKLy6ezQ'},
        {name: 'Young And Beautiful (DH Orchestral Version)', author: 'Lana Del Rey', url: 'https://www.youtube.com/watch?v=nyBxaEsjaSg'},
        {name: 'Bagger 288!', author: 'Rathergood', url: 'https://www.youtube.com/watch?v=azEvfD4C6ow'},
        [
            {name: 'Faded (Interlude)', author: 'Alan Walker', url: 'https://www.youtube.com/watch?v=nIPgx1b02gM'},
            {name: 'Faded', author: 'Alan Walker', url: 'https://www.youtube.com/watch?v=zbxl4aiJo3M'}
        ],
        {name: 'Stuck In The Air ', author: 'The Tower', url: 'https://www.youtube.com/watch?v=Fpe3YOTlXac'},
        {name: 'D-E-C-A-D-E', author: 'Sheet Music Boss', url: 'https://www.youtube.com/watch?v=tD4_iPsWD7k'},
        {name: 'Never Gonna Give You Up', author: 'Rick Astley', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'},
        // {name: '', author: '', url: ''},
        // {name: '', author: '', url: ''},
        // {name: '', author: '', url: ''},
        // {name: '', author: '', url: ''},
        // {name: '', author: '', url: ''},
        // {name: '', author: '', url: ''},
        // {name: '', author: '', url: ''},
        // {name: '', author: '', url: ''},
        // {name: '', author: '', url: ''},
    ];
    const seedlist = [];
    for (const seed of seeds) {
        if (Array.isArray(seed)) {
            const position = await next(id);
            console.log(position);
            const subplaylist = await create({name:`Subplaylist ${Math.floor(8999 * Math.random()) + 1000}`, shuffle: false, parentId: id, position, ownerId});
            for (const sed of seed) {
                const position = await next(subplaylist.id);
            console.log(position);
                const song = await add({parentId: subplaylist.id, isSong: true, position, ownerId, ...sed});
            }
            seedlist.push(subplaylist);
        }
        else {
            const position = await next(id);
            console.log(position);
            const song = await add({parentId: id, isSong: true, position: await next(id), ownerId, ...seed});
            seedlist.push(song);
        }
    }
    console.log(seedlist);
    return seedlist;
}

async function positionHelper(id, playlistData, order) {
    let { position } = playlistData;
    const {direction, origin} = order ? order : {direction: null, origin: null};
    // console.log(136, 'payload:', order);
    if (position) {
        const parentId = await parent(id);
        const currentPos = await pos(id);
        // console.log(140, 'direction:', direction, 'new position', position, 'current position', currentPos);
        if (direction === -1 || ((position < currentPos) && (direction === null))) {
            const boot = await idAt(parentId, position);
            // console.log(143, 'bool pos:', boot ? boot.position : null, 'origin:', origin);
            if (boot && boot.position !== origin) {
                await updatePlaylist(boot.id, {position: position + 1}, order || {direction: -1, origin: currentPos});
            }
            return;
        }
        else if (direction === 1 || ((position > currentPos) && (direction === null))) {
            const boot = await idAt(parentId, position);
            // console.log(151, 'bool pos:', boot ? boot.position : null, 'origin:', origin);
            if (boot && boot.position !== origin) {
                await updatePlaylist(boot.id, {position: position - 1}, order || {direction: 1, origin: currentPos});
            }
            return;
        }
    }
}
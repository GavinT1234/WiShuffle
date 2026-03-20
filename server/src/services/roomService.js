import { getAll, getById, create, remove } from '../repositories/roomRepo.js'
import { redis } from '../config/redis.js';

// CRUD

export async function getAllRooms() {
    const rooms = await getAll();
    const counts = await Promise.all(
        rooms.map((r) => redis.sCard(`room:${r.id}:users`))
    );
    return rooms.map((r, i) => ({ ...r, listenerCount: counts[i] }));
}

export async function getRoomById(id) {
    const room = await getById(id);
    if (room) return room;
    else {
        const error = new Error(`Room ${id} not found`);
        error.status = 404;
        throw error;
    }
}

export async function createRoom(roomData) {
    return create(roomData);
}

export async function deleteRoom(id) {
    const result = await remove(id);
    if (result) return;
    else {
        const error = new Error(`Room ${id} not found`);
        error.status = 404;
        throw error;
    }
}

// Live State (Redis)

export async function getRoomState(id) {
    const [room, users, queue, currentSong, startedAt] = await Promise.all([
        getById(id),
        redis.sMembers(`room:${id}:users`),
        redis.lRange(`room:${id}:djQueue`, 0, -1),
        redis.get(`room:${id}:currentSong`),
        redis.get(`room:${id}:startedAt`),
    ]);

    if (!room) throw new Error("Room not found");

    const elapsedSeconds = startedAt ? (Date.now() - Number(startedAt)) / 1000 : 0;

    return {
        room,
        users,                                        // array of userIds currently online
        djQueue: queue,                               // ordered array of userIds waiting to DJ
        currentSong: currentSong ? JSON.parse(currentSong) : null,
        elapsedSeconds,                               // so joining clients can seek to right position
    };
}

// Presence (redis)

export async function addUserToRoom(roomId, userId) {
    await redis.sAdd(`room:${roomId}:users`, String(userId));
}

export async function removeUserFromRoom(roomId, userId) {
    await redis.sRem(`room:${roomId}:users`, String(userId));
}

export async function getUsersInRoom(id) {
    const userIds = await redis.sMembers(`room:${id}:users`);
    if (!userIds.length) return [];
    // return UserRepository.findManyByIds(userIds);
}

export async function getListenerCountInRoom(id) {
    return redis.sCard(`room:${id}:users`);
}

// Playback (redis)

export async function setCurrentSongInRoom(id, song) {
    const startedAt = Date.now();

    await Promise.all([
      redis.set(`room:${id}:currentSong`, JSON.stringify(song)),
      redis.set(`room:${id}:startedAt`, String(startedAt)),
      redis.del(`room:${id}:votes`),             // reset votes for new song
    ]);

    // Persist to play history in Postgres
    // await RoomRepository.addToHistory(roomId, song);

    return { song, startedAt };
}

export async function getCurrentSongInRoom(id) {
    const [song, startedAt] = await Promise.all([
        redis.get(`room:${id}:currentSong`),
        redis.get(`room:${id}:startedAt`),
    ]);

    if (!song) return null;

    return {
        ...JSON.parse(song),
        elapsedSeconds: startedAt ? (Date.now() - Number(startedAt)) / 1000 : 0,
    };
}

// Clean Up (redis)

export async function clearRoomState(id) {
    // Called when a room is deleted or the server restarts
    const keys = [
        `room:${id}:users`,
        `room:${id}:djQueue`,
        `room:${id}:currentSong`,
        `room:${id}:startedAt`,
        `room:${id}:votes`,
    ];

    await Promise.all(keys.map((k) => redis.del(k)));
}
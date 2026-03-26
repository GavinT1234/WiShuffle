import { redis } from '../config/redis.js';

// ─── DJ Queue ────────────────────────────────────────────────────────────────

export async function joinDJQueue(roomId, userId) {
    const key = `room:${roomId}:djQueue`;
    const queue = await redis.lRange(key, 0, -1);
    const id = String(userId);
    if (queue.includes(id)) return queue; // already in queue
    await redis.rPush(key, id);
    return redis.lRange(key, 0, -1);
}

export async function leaveDJQueue(roomId, userId) {
    const key = `room:${roomId}:djQueue`;
    await redis.lRem(key, 0, String(userId));
    return redis.lRange(key, 0, -1);
}

export async function getDJQueue(roomId) {
    return redis.lRange(`room:${roomId}:djQueue`, 0, -1);
}

export async function getCurrentDJ(roomId) {
    const queue = await getDJQueue(roomId);
    return queue[0] ?? null;
}

// Rotate: remove current DJ from front, they go to back if they want
// Returns the new queue
export async function rotateDJ(roomId) {
    const key = `room:${roomId}:djQueue`;
    const current = await redis.lPop(key);
    // current DJ is removed — next in line becomes DJ automatically
    return redis.lRange(key, 0, -1);
}

export async function isCurrentDJ(roomId, userId) {
    const current = await getCurrentDJ(roomId);
    return current === String(userId);
}

// ─── Video / Playback ─────────────────────────────────────────────────────────

export function parseVideoId(input) {
    if (!input) return null;
    // Already a bare video ID (11 chars, no slashes)
    if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim();

    try {
        const url = new URL(input.trim());
        // youtube.com/watch?v=ID
        if (url.searchParams.get('v')) return url.searchParams.get('v');
        // youtu.be/ID
        if (url.hostname === 'youtu.be') return url.pathname.slice(1);
        // youtube.com/embed/ID
        if (url.pathname.startsWith('/embed/')) return url.pathname.split('/')[2];
    } catch {
        // not a URL
    }
    return null;
}

export async function setVideo(roomId, videoId, title, userId) {
    const startedAt = Date.now();
    const song = { videoId, title: title || videoId, addedBy: String(userId) };

    await Promise.all([
        redis.set(`room:${roomId}:currentSong`, JSON.stringify(song)),
        redis.set(`room:${roomId}:startedAt`, String(startedAt)),
        redis.set(`room:${roomId}:playState`, 'playing'),
        redis.del(`room:${roomId}:votes`),
    ]);

    return { song, startedAt };
}

export async function setPlayState(roomId, state) {
    // state: 'playing' | 'paused'
    await redis.set(`room:${roomId}:playState`, state);
    if (state === 'playing') {
        // Record when play resumed so elapsed calc stays accurate
        await redis.set(`room:${roomId}:startedAt`, String(Date.now()));
    }
}

export async function getPlayState(roomId) {
    return redis.get(`room:${roomId}:playState`);
}

export async function seekVideo(roomId, positionSeconds) {
    // Reset startedAt so elapsed = now - startedAt aligns with seeked position
    const newStartedAt = Date.now() - positionSeconds * 1000;
    await redis.set(`room:${roomId}:startedAt`, String(newStartedAt));
    return newStartedAt;
}

export async function getFullPlaybackState(roomId) {
    const [songRaw, startedAtRaw, playState] = await Promise.all([
        redis.get(`room:${roomId}:currentSong`),
        redis.get(`room:${roomId}:startedAt`),
        redis.get(`room:${roomId}:playState`),
    ]);

    if (!songRaw) return null;

    const song = JSON.parse(songRaw);
    const startedAt = startedAtRaw ? Number(startedAtRaw) : null;
    const elapsedSeconds = startedAt ? (Date.now() - startedAt) / 1000 : 0;

    return {
        song,
        elapsedSeconds: Math.max(0, elapsedSeconds),
        playState: playState || 'paused',
    };
}
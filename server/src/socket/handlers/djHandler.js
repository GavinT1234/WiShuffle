import {
    joinDJQueue,
    leaveDJQueue,
    getDJQueue,
    getCurrentDJ,
    rotateDJ,
    isCurrentDJ,
    parseVideoId,
    setVideo,
    setPlayState,
    seekVideo,
    getFullPlaybackState,
} from '../../services/djService.js';

export function registerDJHandlers(io, socket) {
    const userId = socket.user.id;

    // ─── Helper: emit updated queue to whole room ───────────────────────────
    async function broadcastQueue(roomId) {
        const queue = await getDJQueue(roomId);
        io.to(`room:${roomId}`).emit('dj:queue_updated', { queue });
    }

    // ─── Guard: only current DJ can do playback actions ────────────────────
    async function assertIsDJ(roomId) {
        const ok = await isCurrentDJ(roomId, userId);
        if (!ok) {
            socket.emit('dj:error', { message: 'You are not the current DJ' });
            return false;
        }
        return true;
    }

    // ─── Join DJ queue ──────────────────────────────────────────────────────
    socket.on('dj:join_queue', async ({ roomId }) => {
        try {
            const queue = await joinDJQueue(roomId, userId);
            await broadcastQueue(roomId);

            // Tell the joining user whether they're up now
            const isDJ = queue[0] === String(userId);
            socket.emit('dj:status', { isDJ, position: queue.indexOf(String(userId)) });
        } catch (err) {
            console.error('dj:join_queue error', err);
        }
    });

    // ─── Leave DJ queue ─────────────────────────────────────────────────────
    socket.on('dj:leave_queue', async ({ roomId }) => {
        try {
            const wasDJ = await isCurrentDJ(roomId, userId);
            await leaveDJQueue(roomId, userId);
            await broadcastQueue(roomId);

            if (wasDJ) {
                // DJ stepped down — broadcast new DJ
                const newDJ = await getCurrentDJ(roomId);
                io.to(`room:${roomId}`).emit('dj:changed', { djId: newDJ });
            }
        } catch (err) {
            console.error('dj:leave_queue error', err);
        }
    });

    // ─── Queue a video (sets it as current, starts playing) ────────────────
    socket.on('dj:queue_video', async ({ roomId, input, title }) => {
        try {
            if (!(await assertIsDJ(roomId))) return;

            const videoId = parseVideoId(input);
            if (!videoId) {
                socket.emit('dj:error', { message: 'Invalid YouTube URL or video ID' });
                return;
            }

            const { song, startedAt } = await setVideo(roomId, videoId, title, userId);

            io.to(`room:${roomId}`).emit('room:video_load', {
                song,
                startedAt,
                elapsedSeconds: 0,
                playState: 'playing',
            });
        } catch (err) {
            console.error('dj:queue_video error', err);
        }
    });

    // ─── Play ───────────────────────────────────────────────────────────────
    socket.on('dj:play', async ({ roomId }) => {
        try {
            if (!(await assertIsDJ(roomId))) return;
            await setPlayState(roomId, 'playing');
            io.to(`room:${roomId}`).emit('room:video_play');
        } catch (err) {
            console.error('dj:play error', err);
        }
    });

    // ─── Pause ──────────────────────────────────────────────────────────────
    socket.on('dj:pause', async ({ roomId }) => {
        try {
            if (!(await assertIsDJ(roomId))) return;
            await setPlayState(roomId, 'paused');
            io.to(`room:${roomId}`).emit('room:video_pause');
        } catch (err) {
            console.error('dj:pause error', err);
        }
    });

    // ─── Seek ───────────────────────────────────────────────────────────────
    socket.on('dj:seek', async ({ roomId, positionSeconds }) => {
        try {
            if (!(await assertIsDJ(roomId))) return;
            await seekVideo(roomId, positionSeconds);
            io.to(`room:${roomId}`).emit('room:video_seek', { positionSeconds });
        } catch (err) {
            console.error('dj:seek error', err);
        }
    });

    // ─── Pass / next DJ ─────────────────────────────────────────────────────
    socket.on('dj:next', async ({ roomId }) => {
        try {
            if (!(await assertIsDJ(roomId))) return;
            const queue = await rotateDJ(roomId);
            await broadcastQueue(roomId);

            const newDJ = queue[0] ?? null;
            io.to(`room:${roomId}`).emit('dj:changed', { djId: newDJ });
        } catch (err) {
            console.error('dj:next error', err);
        }
    });

    // ─── Clean up on disconnect ─────────────────────────────────────────────
    socket.on('disconnect', async () => {
        // socket.currentRoom is set by roomHandler on join
        if (!socket.currentRoom) return;
        const roomId = socket.currentRoom;

        try {
            const wasDJ = await isCurrentDJ(roomId, userId);
            await leaveDJQueue(roomId, userId);
            await broadcastQueue(roomId);

            if (wasDJ) {
                const newDJ = await getCurrentDJ(roomId);
                io.to(`room:${roomId}`).emit('dj:changed', { djId: newDJ });
            }
        } catch (err) {
            console.error('dj disconnect cleanup error', err);
        }
    });
}
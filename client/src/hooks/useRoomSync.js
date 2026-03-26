import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Bridges socket events → YouTube player commands.
 * Also manages local DJ queue state and DJ controls.
 */
export function useRoomSync({ socket, roomId, userId, playerControls }) {
    const { loadVideo, play, pause, seekTo, ready: playerReady } = playerControls;

    const [playback, setPlayback] = useState(null);   // { song, elapsedSeconds, playState }
    const [djQueue, setDJQueue] = useState([]);
    const [isDJ, setIsDJ] = useState(false);

    const roomIdRef = useRef(roomId);
    roomIdRef.current = roomId;

    // ── On room:state (initial join) ─────────────────────────────────────────
    // Called by useRoom hook; we need to hook into it here too.
    // We expose a handleRoomState function the parent can call.
    const handleRoomState = useCallback((state) => {
        if (state.djQueue) setDJQueue(state.djQueue);

        if (state.playback && playerReady) {
            const { song, elapsedSeconds, playState } = state.playback;
            setPlayback(state.playback);
            loadVideo(song.videoId, Math.max(0, elapsedSeconds));
            if (playState === 'paused') pause();
        }
    }, [playerReady, loadVideo, pause]);

    // ── Socket event listeners ───────────────────────────────────────────────
    useEffect(() => {
        if (!socket) return;

        const onVideoLoad = ({ song, elapsedSeconds, playState }) => {
            setPlayback({ song, elapsedSeconds, playState });
            loadVideo(song.videoId, Math.max(0, elapsedSeconds ?? 0));
        };

        const onVideoPlay = () => {
            setPlayback((prev) => prev ? { ...prev, playState: 'playing' } : prev);
            play();
        };

        const onVideoPause = () => {
            setPlayback((prev) => prev ? { ...prev, playState: 'paused' } : prev);
            pause();
        };

        const onVideoSeek = ({ positionSeconds }) => {
            seekTo(positionSeconds);
        };

        const onQueueUpdated = ({ queue }) => {
            setDJQueue(queue);
            setIsDJ(queue[0] === String(userId));
        };

        const onDJChanged = ({ djId }) => {
            setIsDJ(String(djId) === String(userId));
        };

        const onError = ({ message }) => {
            console.warn('[dj error]', message);
        };

        socket.on('room:video_load', onVideoLoad);
        socket.on('room:video_play', onVideoPlay);
        socket.on('room:video_pause', onVideoPause);
        socket.on('room:video_seek', onVideoSeek);
        socket.on('dj:queue_updated', onQueueUpdated);
        socket.on('dj:changed', onDJChanged);
        socket.on('dj:status', ({ isDJ: amDJ }) => setIsDJ(amDJ));
        socket.on('dj:error', onError);

        return () => {
            socket.off('room:video_load', onVideoLoad);
            socket.off('room:video_play', onVideoPlay);
            socket.off('room:video_pause', onVideoPause);
            socket.off('room:video_seek', onVideoSeek);
            socket.off('dj:queue_updated', onQueueUpdated);
            socket.off('dj:changed', onDJChanged);
            socket.off('dj:status');
            socket.off('dj:error', onError);
        };
    }, [socket, userId, loadVideo, play, pause, seekTo]);

    // ── DJ actions (emit to server) ──────────────────────────────────────────

    const joinQueue = useCallback(() => {
        socket?.emit('dj:join_queue', { roomId });
    }, [socket, roomId]);

    const leaveQueue = useCallback(() => {
        socket?.emit('dj:leave_queue', { roomId });
    }, [socket, roomId]);

    const queueVideo = useCallback((input, title) => {
        socket?.emit('dj:queue_video', { roomId, input, title });
    }, [socket, roomId]);

    const emitPlay = useCallback(() => {
        socket?.emit('dj:play', { roomId });
    }, [socket, roomId]);

    const emitPause = useCallback(() => {
        socket?.emit('dj:pause', { roomId });
    }, [socket, roomId]);

    const emitSeek = useCallback((positionSeconds) => {
        socket?.emit('dj:seek', { roomId, positionSeconds });
    }, [socket, roomId]);

    const passDJ = useCallback(() => {
        socket?.emit('dj:next', { roomId });
    }, [socket, roomId]);

    return {
        playback,
        djQueue,
        isDJ,
        handleRoomState,
        // actions
        joinQueue,
        leaveQueue,
        queueVideo,
        emitPlay,
        emitPause,
        emitSeek,
        passDJ,
    };
}
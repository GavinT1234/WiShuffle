import { useEffect, useRef, useState, useCallback } from 'react';

export function useRoomSync({ socket, roomId, userId, playerControls }) {
    const [playback, setPlayback] = useState(null);
    const [djQueue, setDJQueue] = useState([]);
    const [isDJ, setIsDJ] = useState(false);

    useEffect(() => {
        if (!socket) {
            console.log('⚠️ useRoomSync: socket not yet connected');
            return;
        }

        console.log('🔌 Setting up socket listeners for room', roomId);

        const onVideoLoad = ({ song, elapsedSeconds, playState, roomId: eventRoomId }) => {
            // Filter by roomId since we broadcast to all clients
            if (eventRoomId !== roomId) {
                return;
            }
            console.log('🎬 room:video_load received:', song, 'controls ready:', !!playerControls.current);
            if (!song?.videoId) {
                console.warn('room:video_load received invalid payload', { song, elapsedSeconds, playState });
                return;
            }
            setPlayback({ song, elapsedSeconds, playState });

            // If player controls aren't ready yet, retry after a brief delay
            if (!playerControls.current) {
                console.warn('⏳ Player controls not ready, retrying in 500ms...');
                setTimeout(() => {
                    if (playerControls.current) {
                        console.log('✅ Retrying loadVideo now that player is ready');
                        playerControls.current.loadVideo(song.videoId, Math.max(0, elapsedSeconds ?? 0));
                    } else {
                        console.error('❌ Player still not ready after retry');
                    }
                }, 500);
                return;
            }

            playerControls.current.loadVideo(song.videoId, Math.max(0, elapsedSeconds ?? 0));
        };

        const onVideoPlay = ({ roomId: eventRoomId }) => {
            if (eventRoomId !== roomId) return;
            setPlayback(prev => prev ? { ...prev, playState: 'playing' } : prev);
            playerControls.current?.play();
        };

        const onVideoPause = ({ roomId: eventRoomId }) => {
            if (eventRoomId !== roomId) return;
            setPlayback(prev => prev ? { ...prev, playState: 'paused' } : prev);
            playerControls.current?.pause();
        };

        const onVideoSeek = ({ positionSeconds, roomId: eventRoomId }) => {
            if (eventRoomId !== roomId) return;
            playerControls.current?.seekTo(positionSeconds);
        };

        const onQueueUpdated = ({ queue, roomId: eventRoomId }) => {
            if (eventRoomId !== roomId) return;
            setDJQueue(queue);
            setIsDJ(queue[0] === String(userId));
        };

        const onDJChanged = ({ djId, roomId: eventRoomId }) => {
            if (eventRoomId !== roomId) return;
            setIsDJ(String(djId) === String(userId));
        };

        const onError = ({ message }) => {
            console.warn('[dj error]', message);
        };

        // ✅ Each event registered exactly once
        socket.on('room:video_load', onVideoLoad);
        socket.on('room:video_play', onVideoPlay);
        socket.on('room:video_pause', onVideoPause);
        socket.on('room:video_seek', onVideoSeek);
        socket.on('dj:queue_updated', onQueueUpdated);
        socket.on('dj:changed', onDJChanged);
        socket.on('dj:status', ({ isDJ: amDJ }) => setIsDJ(amDJ));
        socket.on('dj:error', onError);

        console.log('✅ All socket listeners registered');

        return () => {
            console.log('🧹 Cleaning up socket listeners for room', roomId);
            socket.off('room:video_load', onVideoLoad);
            socket.off('room:video_play', onVideoPlay);
            socket.off('room:video_pause', onVideoPause);
            socket.off('room:video_seek', onVideoSeek);
            socket.off('dj:queue_updated', onQueueUpdated);
            socket.off('dj:changed', onDJChanged);
            socket.off('dj:status');
            socket.off('dj:error', onError);
        };
    }, [socket, userId]);

    const joinQueue = useCallback(() => socket?.emit('dj:join_queue', { roomId }), [socket, roomId]);
    const leaveQueue = useCallback(() => socket?.emit('dj:leave_queue', { roomId }), [socket, roomId]);
    const queueVideo = useCallback((input, title) => {
        console.log('📤 Emitting dj:queue_video:', { roomId, input, title });
        socket?.emit('dj:queue_video', { roomId, input, title }, (response) => {
            console.log('📥 dj:queue_video response:', response);
        });
    }, [socket, roomId]);
    const emitPlay = useCallback(() => socket?.emit('dj:play', { roomId }), [socket, roomId]);
    const emitPause = useCallback(() => socket?.emit('dj:pause', { roomId }), [socket, roomId]);
    const emitSeek = useCallback((positionSeconds) => socket?.emit('dj:seek', { roomId, positionSeconds }), [socket, roomId]);
    const passDJ = useCallback(() => socket?.emit('dj:next', { roomId }), [socket, roomId]);

    return { playback, djQueue, isDJ, joinQueue, leaveQueue, queueVideo, emitPlay, emitPause, emitSeek, passDJ };
}
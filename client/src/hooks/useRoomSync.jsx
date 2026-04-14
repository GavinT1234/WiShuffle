import { useEffect, useRef, useState, useCallback } from 'react';

export function useRoomSync({ socket, roomId, userId, playerControls }) {
    const [playback, setPlayback] = useState(null);
    const [playlist, setPlaylist] = useState([]);
    const playerStateRef = useRef(null);

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
            setPlaylist(queue);
            console.log('📋 Playlist updated:', queue);
        };

        const onQueueEmpty = ({ roomId: eventRoomId }) => {
            if (eventRoomId !== roomId) return;
            console.log('📭 Queue empty');
            setPlaylist([]);
            setPlayback(null);
            playerControls.current?.stop?.();
        };

        const onError = ({ message }) => {
            console.warn('[room error]', message);
        };

        // ✅ Each event registered exactly once
        socket.on('room:video_load', onVideoLoad);
        socket.on('room:video_play', onVideoPlay);
        socket.on('room:video_pause', onVideoPause);
        socket.on('room:video_seek', onVideoSeek);
        socket.on('room:queue_updated', onQueueUpdated);
        socket.on('room:queue_empty', onQueueEmpty);
        socket.on('room:error', onError);

        console.log('✅ All socket listeners registered');

        return () => {
            console.log('🧹 Cleaning up socket listeners for room', roomId);
            socket.off('room:video_load', onVideoLoad);
            socket.off('room:video_play', onVideoPlay);
            socket.off('room:video_pause', onVideoPause);
            socket.off('room:video_seek', onVideoSeek);
            socket.off('room:queue_updated', onQueueUpdated);
            socket.off('room:queue_empty', onQueueEmpty);
            socket.off('room:error', onError);
        };
    }, [socket, roomId]);

    const queueVideo = useCallback((input, title) => {
        console.log('📤 Emitting room:queue_video:', { roomId, input, title });
        socket?.emit('room:queue_video', { roomId, input, title }, (response) => {
            console.log('📥 room:queue_video response:', response);
        });
    }, [socket, roomId]);

    const emitPlay = useCallback(() => {
        console.log('▶️ Emitting room:video_play');
        socket?.emit('room:video_play', { roomId });
    }, [socket, roomId]);

    const emitPause = useCallback(() => {
        console.log('⏸️ Emitting room:video_pause');
        socket?.emit('room:video_pause', { roomId });
    }, [socket, roomId]);

    const emitSeek = useCallback((positionSeconds) => {
        console.log('⏩ Emitting room:video_seek:', positionSeconds);
        socket?.emit('room:video_seek', { roomId, positionSeconds });
    }, [socket, roomId]);

    const emitNextVideo = useCallback(() => {
        console.log('⏭️ Emitting room:next_video - advancing queue');
        socket?.emit('room:next_video', { roomId });
    }, [socket, roomId]);

    return {
        playback,
        playlist,
        queueVideo,
        emitPlay,
        emitPause,
        emitSeek,
        emitNextVideo
    };
}

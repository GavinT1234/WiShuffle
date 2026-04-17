import { useEffect, useRef, useState, useCallback } from 'react';

export function useRoomSync({ socket, roomId, userId, playerControls }) {
    const [playback, setPlayback] = useState(null);
    const [playlist, setPlaylist] = useState([]);
    const listenerRegisteredRef = useRef(false);

    // Register listeners ONCE per socket instance
    useEffect(() => {
        if (!socket || listenerRegisteredRef.current) {
            console.log('⚠️ useRoomSync: socket not connected or listeners already registered');
            return;
        }

        console.log('🔌 Setting up socket listeners (ONCE per socket instance)');
        listenerRegisteredRef.current = true;

        const attemptLoadVideo = (videoId, startSeconds) => {
            let retries = 0;
            const maxRetries = 20;

            const tryLoad = () => {
                if (playerControls.current) {
                    console.log('✅ Loading video:', videoId, 'at', startSeconds, 'seconds');
                    playerControls.current.loadVideo(videoId, Math.max(0, startSeconds ?? 0));
                } else if (retries < maxRetries) {
                    retries++;
                    console.warn(`⏳ Attempt ${retries}/${maxRetries}: Player not ready`);
                    setTimeout(tryLoad, 100);
                } else {
                    console.error('❌ Player never became ready');
                }
            };
            tryLoad();
        };

        const onVideoLoad = ({ song, elapsedSeconds, playState, roomId: eventRoomId }) => {
            if (eventRoomId !== roomId) return;
            console.log('🎬 room:video_load received:', song);
            if (!song?.videoId) {
                console.warn('⚠️ No videoId in room:video_load');
                return;
            }
            setPlayback({ song, elapsedSeconds, playState });
            attemptLoadVideo(song.videoId, elapsedSeconds);

            if (playState === 'playing') {
                console.log('▶️ Video should auto-play (playState: playing)');
                setTimeout(() => {
                    console.log('▶️ Calling play() now');
                    playerControls.current?.play();
                }, 1500);  // Wait for loadVideo to finish
            }
        };

        const onVideoPlay = ({ roomId: eventRoomId }) => {
            if (eventRoomId !== roomId) return;
            console.log('▶️ room:video_play received');
            setPlayback(prev => prev ? { ...prev, playState: 'playing' } : prev);
            playerControls.current?.play();
        };

        const onVideoPause = ({ roomId: eventRoomId }) => {
            if (eventRoomId !== roomId) return;
            console.log('⏸️ room:video_pause received');
            setPlayback(prev => prev ? { ...prev, playState: 'paused' } : prev);
            playerControls.current?.pause();
        };

        const onVideoSeek = ({ positionSeconds, roomId: eventRoomId }) => {
            if (eventRoomId !== roomId) return;
            console.log('⏩ room:video_seek received:', positionSeconds);
            setPlayback(prev => prev ? { ...prev, elapsedSeconds: positionSeconds } : prev);
            playerControls.current?.seekTo(positionSeconds);
        };

        const onTimeUpdate = ({ videoId, elapsedSeconds, playState, roomId: eventRoomId }) => {
            if (eventRoomId !== roomId) return;
            if (!window.updateCounter) window.updateCounter = 0;
            window.updateCounter++;
            if (window.updateCounter % 50 === 0) {
                console.log('🔄 Time sync active:', {
                    elapsedSeconds,
                    playState,
                    updates: window.updateCounter
                });
            }
            setPlayback(prev =>
                prev ? {
                    ...prev,
                    elapsedSeconds,
                    playState
                } : prev
            );

            // Sync player to server's time if drift > 1.5 seconds
            const playerTime = playerControls.current?.getCurrentTime?.() ?? 0;
            const drift = Math.abs(playerTime - elapsedSeconds);
            if (drift > 1.5) {
                console.log(`🔄 Correcting drift: ${playerTime.toFixed(1)}s → ${elapsedSeconds}s`);
                playerControls.current?.seekTo(elapsedSeconds);
            }

            if (playState === 'playing') {
                playerControls.current?.play();
            } else if (playState === 'paused') {
                playerControls.current?.pause();
            }
        };

        const onQueueUpdated = ({ queue, roomId: eventRoomId }) => {
            if (eventRoomId !== roomId) return;
            console.log('📋 Playlist updated:', queue);
            setPlaylist(queue);
        };

        const onQueueEmpty = ({ roomId: eventRoomId }) => {
            if (eventRoomId !== roomId) return;
            console.log('📭 Queue empty');
            setPlaylist([]);
            setPlayback(null);
        };

        const onError = ({ message }) => {
            console.warn('[room error]', message);
        };

        // ✅ Register all listeners
        socket.on('room:video_load', onVideoLoad);
        socket.on('room:video_play', onVideoPlay);
        socket.on('room:video_pause', onVideoPause);
        socket.on('room:video_seek', onVideoSeek);
        socket.on('room:time_update', onTimeUpdate);
        socket.on('room:queue_updated', onQueueUpdated);
        socket.on('room:queue_empty', onQueueEmpty);
        socket.on('room:error', onError);

        console.log('✅ All socket listeners registered (persistent)');

        // Cleanup function
        return () => {
            console.log('🧹 Cleaning up socket listeners');
            socket.off('room:video_load', onVideoLoad);
            socket.off('room:video_play', onVideoPlay);
            socket.off('room:video_pause', onVideoPause);
            socket.off('room:video_seek', onVideoSeek);
            socket.off('room:time_update', onTimeUpdate);
            socket.off('room:queue_updated', onQueueUpdated);
            socket.off('room:queue_empty', onQueueEmpty);
            socket.off('room:error', onError);
            listenerRegisteredRef.current = false;
        };
    }, [socket]);


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
        console.log('⏸️ ========== EMIT PAUSE ==========');
        console.log('   Stack trace:');
        console.trace();
        console.log('==================================');
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

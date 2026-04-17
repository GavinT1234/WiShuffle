import { useEffect, useRef, useState, useCallback } from 'react';

// Loads the YouTube IFrame API script once globally
function loadYTScript() {
    if (window.YT?.Player) return Promise.resolve();
    if (window._ytScriptLoading) return window._ytScriptLoading;

    window._ytScriptLoading = new Promise((resolve) => {
        window.onYouTubeIframeAPIReady = () => {
            resolve();
            delete window._ytScriptLoading;
        };
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
    });

    return window._ytScriptLoading;
}

export function useYoutubePlayer({ containerId, onStateChange }) {

    const playerRef = useRef(null);
    const [ready, setReady] = useState(false);
    // Suppress echoing back events triggered by our own programmatic calls
    const isSyncing = useRef(false);
    const isLoadingRef = useRef(false);

    useEffect(() => {
        let destroyed = false;

        loadYTScript().then(() => {
            if (destroyed) return;
            console.log('✅ YouTube script loaded, creating player in container:', containerId);

            try {
                playerRef.current = new window.YT.Player(containerId, {
                    height: '100%',
                    width: '100%',
                    playerVars: {
                        autoplay: 1,       // auto-play when video is loaded
                        controls: 0,       // hide native controls — we draw our own
                        modestbranding: 1,
                        rel: 0,
                        enablejsapi: 1,
                    },
                    events: {
                        onReady: () => {
                            console.log('🎬 YouTube player is ready');
                            if (!destroyed) setReady(true);
                        },
                        onStateChange: (event) => {
                            const state = event.data;
                            console.log('📊 Player state changed:', state);

                            // ✅ Add this check
                            if (state === 2) {  // 2 = paused
                                console.warn('⚠️ Player paused - checking if this was intentional');
                                console.trace();  // Shows what caused the pause
                            }
                            if (isSyncing.current) return; // ignore our own commands
                            onStateChange?.(event.data);
                        },
                    },
                });
            } catch (err) {
                console.error('❌ Error creating YouTube player:', err);
            }
        }).catch(err => {
            console.error('❌ Failed to load YouTube script:', err);
        });

        return () => {
            destroyed = true;
            playerRef.current?.destroy?.();
            playerRef.current = null;
            setReady(false);
        };
        // containerId should never change — it's a static div id
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [containerId]);

    // ── Programmatic controls (all wrapped in isSyncing guard) ──────────────

    const loadVideo = useCallback((videoId, startSeconds = 0) => {
        if (!playerRef.current) {
            console.error('❌ loadVideo: Player not initialized yet');
            return;
        }
        console.log('📺 loadVideo called:', videoId, 'startSeconds:', startSeconds);
        isLoadingRef.current = true;
        isSyncing.current = true;
        playerRef.current.loadVideoById({ videoId, startSeconds });
        // YT fires onStateChange during load; clear flag after brief delay
        console.log('📺 Video loaded, will auto-play in 800ms');
        setTimeout(() => {
            console.log('▶️ Calling playVideo()');
            playerRef.current?.playVideo();

            // Clear loading flag after play
            setTimeout(() => {
                isLoadingRef.current = false;  // Clear after video starts
            }, 500);
        }, 800);
    }, []);


    const play = useCallback(() => {
        if (!playerRef.current) return;
        isSyncing.current = true;
        playerRef.current.playVideo();
        setTimeout(() => { isSyncing.current = false; }, 300);
    }, []);

    const pause = useCallback(() => {
        if (!playerRef.current) return;
        isSyncing.current = true;
        playerRef.current.pauseVideo();
        setTimeout(() => { isSyncing.current = false; }, 300);
    }, []);

    const seekTo = useCallback((seconds) => {
        if (!playerRef.current) return;
        isSyncing.current = true;
        playerRef.current.seekTo(seconds, true);
        setTimeout(() => { isSyncing.current = false; }, 500);
    }, []);

    const getCurrentTime = useCallback(() => {
        return playerRef.current?.getCurrentTime?.() ?? 0;
    }, []);

    const getDuration = useCallback(() => {
        return playerRef.current?.getDuration?.() ?? 0;
    }, []);

    return { ready, loadVideo, play, pause, seekTo, getCurrentTime, getDuration };
}


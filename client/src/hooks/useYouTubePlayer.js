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

export function useYouTubePlayer({ containerId, onStateChange }) {
    const playerRef = useRef(null);
    const [ready, setReady] = useState(false);
    // Suppress echoing back events triggered by our own programmatic calls
    const isSyncing = useRef(false);

    useEffect(() => {
        let destroyed = false;

        loadYTScript().then(() => {
            if (destroyed) return;

            playerRef.current = new window.YT.Player(containerId, {
                height: '100%',
                width: '100%',
                playerVars: {
                    autoplay: 0,
                    controls: 0,       // hide native controls — we draw our own
                    modestbranding: 1,
                    rel: 0,
                    enablejsapi: 1,
                },
                events: {
                    onReady: () => {
                        if (!destroyed) setReady(true);
                    },
                    onStateChange: (event) => {
                        if (isSyncing.current) return; // ignore our own commands
                        onStateChange?.(event.data);
                    },
                },
            });
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
        if (!playerRef.current) return;
        isSyncing.current = true;
        playerRef.current.loadVideoById({ videoId, startSeconds });
        // YT fires onStateChange during load; clear flag after brief delay
        setTimeout(() => { isSyncing.current = false; }, 1000);
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
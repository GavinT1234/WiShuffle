
import { useState, useEffect, useRef } from 'react';
import { useYoutubePlayer } from '../hooks/useYoutubePlayer';
import { YoutubeSearch } from './YoutubeSearch';

const PLAYER_DIV_ID = 'yt-player-container';

export function VideoPlayer({
                                playback,
                                playlist,
                                userId,
                                onQueueVideo,
                                onPlay,
                                onPause,
                                onSeek,
                                onNextVideo,
                                onPlayerReady,
                            }) {
    const [urlInput, setUrlInput] = useState('');
    const [titleInput, setTitleInput] = useState('');
    //const [localPlaying, setLocalPlaying] = useState(false);
    const videoEndedRef = useRef(false);

    const { ready, loadVideo, play, pause, seekTo, getCurrentTime, getDuration } =
        useYoutubePlayer({
            containerId: PLAYER_DIV_ID,
            onStateChange: (state) => {
                console.log('YouTube player state:', state);
                // 0 = ENDED, 1 = PLAYING, 2 = PAUSED
                //if (state === 1) setLocalPlaying(true);
                //if (state === 2) setLocalPlaying(false);
                // On video end, advance to next
                if (state === 0) {
                    console.log('🎬 Video ended, advancing to next');
                    if (!videoEndedRef.current) {
                        videoEndedRef.current = true;
                        onNextVideo?.();
                        // Reset flag after a short delay to prevent multiple fires
                        setTimeout(() => { videoEndedRef.current = false; }, 1000);
                    }
                }
            },
        });

    useEffect(() => {
        if (ready) onPlayerReady?.({ loadVideo, play, pause, seekTo, getCurrentTime, getDuration });
    }, [ready]);

    const handleQueueVideo = (e) => {
        e.preventDefault();
        if (!urlInput.trim()) return;
        onQueueVideo(urlInput.trim(), titleInput.trim() || undefined);
        setUrlInput('');
        setTitleInput('');
    };

    const handleSeekClick = (e) => {
        const duration = getDuration?.();
        if (!duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        const pos = ratio * duration;
        onSeek(pos);
    };

    const isPlaying = playback?.playState === 'playing';

    // Use actual player time if available, otherwise fallback to playback state
    const playerCurrentTime = ready ? (getCurrentTime?.() ?? 0) : 0;
    const currentTime = ready && playerCurrentTime >= 0 ? playerCurrentTime : (playback?.elapsedSeconds ?? 0);
    const duration = getDuration?.() ?? 0;
    const progressPct = duration ? (currentTime / duration) * 100 : 0;

    const handleSearchSelect = (videoId, title) => {
        console.log('Selected from search:', videoId, title);
        onQueueVideo(videoId, title);
    };

    return (
        <div style={styles.wrapper}>
            {/* ── Video frame ── */}
            <div style={styles.playerOuter}>
                <div id={PLAYER_DIV_ID} style={styles.playerInner} />
                {!playback && (
                    <div style={styles.emptyOverlay}>
                        <p style={styles.emptyText}>
                            {playlist.length === 0
                                ? 'Queue is empty — add a video below to start playing'
                                : 'Loading next video...'}
                        </p>
                    </div>
                )}
            </div>

            {/* ── Now playing info ── */}
            {playback?.song && (
                <div style={styles.nowPlaying}>
                    <span style={styles.songTitle}>{playback.song.title}</span>
                    <span style={styles.songMeta}>
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                </div>
            )}

            {/* ── Playback Controls (available to all) ── */}
            <div style={styles.controlsPanel}>
                <div style={styles.controls}>
                    <button
                        style={styles.btn}
                        onClick={playback ? (isPlaying ? onPause : onPlay) : undefined}
                        disabled={!playback}
                    >
                        {playback ? (isPlaying ? '⏸ Pause' : '▶ Play') : '▶ Play'}
                    </button>
                    {playlist.length > 0 && (
                        <button style={{ ...styles.btn, ...styles.btnSecondary }} onClick={onNextVideo}>
                            ⏭ Skip
                        </button>
                    )}
                </div>

                {/* Youtube Search */}
                <YoutubeSearch onSelectVideo={handleSearchSelect} />

                {/* Video input */}
                <form onSubmit={handleQueueVideo} style={styles.inputRow}>
                    <input
                        style={styles.input}
                        placeholder="YouTube URL or video ID"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                    />
                    <input
                        style={{ ...styles.input, maxWidth: 160 }}
                        placeholder="Title (optional)"
                        value={titleInput}
                        onChange={(e) => setTitleInput(e.target.value)}
                    />
                    <button style={styles.btn} type="submit">+ Add to Queue</button>
                </form>
            </div>

            {/* ── Playlist panel ── */}
            <div style={styles.playlistPanel}>
                <div style={styles.playlistHeader}>
                    <span style={styles.playlistTitle}>
                        Upcoming ({playlist.length})
                    </span>
                </div>
                {playlist.length === 0 ? (
                    <p style={styles.muted}>Queue is empty</p>
                ) : (
                    <ol style={styles.playlistList}>
                        {playlist.map((videoId, i) => (
                            <li key={`${videoId}-${i}`} style={styles.playlistItem}>
                                <span style={styles.playlistPos}>{i + 1}.</span>
                                <span style={styles.playlistName}>
                                    {videoId}
                                </span>
                            </li>
                        ))}
                    </ol>
                )}
            </div>
        </div>
    );
}

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

const styles = {
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
    },
    playerOuter: {
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%', // 16:9
        background: '#000',
        borderRadius: '8px 8px 0 0',
        overflow: 'hidden',
    },
    playerInner: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
    },
    emptyOverlay: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#111',
    },
    emptyText: {
        color: '#555',
        fontSize: '14px',
        textAlign: 'center',
        padding: '0 24px',
        margin: 0,
    },
    progressTrack: {
        height: '4px',
        background: '#2e2e2e',
        position: 'relative',
    },
    progressFill: {
        height: '100%',
        background: '#aa3bff',
        transition: 'width 0.5s linear',
    },
    nowPlaying: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 14px',
        background: '#141414',
        borderBottom: '1px solid #2e2e2e',
    },
    songTitle: {
        fontSize: '13px',
        color: '#ddd',
        fontWeight: '500',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    songMeta: {
        fontSize: '12px',
        color: '#555',
        flexShrink: 0,
        marginLeft: '12px',
    },
    controlsPanel: {
        background: '#1a1a1a',
        border: '1px solid #2e2e2e',
        borderTop: 'none',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    controls: {
        display: 'flex',
        gap: '8px',
    },
    inputRow: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
    },
    input: {
        flex: 1,
        minWidth: 0,
        padding: '8px 12px',
        background: '#111',
        border: '1px solid #2e2e2e',
        borderRadius: '6px',
        color: '#fff',
        fontSize: '13px',
        outline: 'none',
    },
    btn: {
        padding: '7px 14px',
        background: '#aa3bff',
        border: 'none',
        borderRadius: '6px',
        color: '#fff',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
    },
    btnSecondary: {
        background: 'transparent',
        border: '1px solid #2e2e2e',
        color: '#888',
    },
    playlistPanel: {
        background: '#1a1a1a',
        border: '1px solid #2e2e2e',
        borderTop: 'none',
        borderRadius: '0 0 8px 8px',
        padding: '16px',
    },
    playlistHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
    },
    playlistTitle: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
    },
    playlistList: {
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    playlistItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '13px',
    },
    playlistPos: {
        color: '#555',
        width: '20px',
        textAlign: 'center',
    },
    playlistName: {
        color: '#ccc',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    muted: {
        color: '#555',
        fontSize: '13px',
        margin: 0,
    },
    divider: {
        textAlign: 'center',
        fontSize: '11px',
        color: '#555',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        margin: '4px 0',
    },
};
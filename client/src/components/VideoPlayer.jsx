import { useState, useEffect, useRef } from 'react';
import { useYouTubePlayer } from '../hooks/useYouTubePlayer';

const PLAYER_DIV_ID = 'yt-player-container';

export function VideoPlayer({
    isDJ,
    playback,
    djQueue,
    userId,
    onReady,
    // DJ actions
    onQueueVideo,
    onPlay,
    onPause,
    onSeek,
    onPassDJ,
    onJoinQueue,
    onLeaveQueue,
}) {
    const [urlInput, setUrlInput] = useState('');
    const [titleInput, setTitleInput] = useState('');
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [localPlaying, setLocalPlaying] = useState(false);
    const progressInterval = useRef(null);

    const { ready, loadVideo, play, pause, seekTo, getCurrentTime, getDuration } =
        useYouTubePlayer({
            containerId: PLAYER_DIV_ID,
            onStateChange: (state) => {
                // YT.PlayerState: PLAYING=1, PAUSED=2, ENDED=0
                if (state === 1) setLocalPlaying(true);
                if (state === 2 || state === 0) setLocalPlaying(false);
                if (state === 1) {
                    setDuration(getDuration());
                }
            },
        });

    // Expose player controls upward via onReady callback
    useEffect(() => {
        if (ready) onReady?.({ loadVideo, play, pause, seekTo, getCurrentTime, getDuration });
    }, [ready]);

    // Progress bar ticker
    useEffect(() => {
        if (localPlaying) {
            progressInterval.current = setInterval(() => {
                setCurrentTime(getCurrentTime());
                setDuration(getDuration());
            }, 500);
        } else {
            clearInterval(progressInterval.current);
        }
        return () => clearInterval(progressInterval.current);
    }, [localPlaying, getCurrentTime, getDuration]);

    const handleQueueVideo = (e) => {
        e.preventDefault();
        if (!urlInput.trim()) return;
        onQueueVideo(urlInput.trim(), titleInput.trim() || undefined);
        setUrlInput('');
        setTitleInput('');
    };

    const handleSeekClick = (e) => {
        if (!duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        const pos = ratio * duration;
        onSeek(pos);
    };

    const inQueue = djQueue.includes(String(userId));
    const currentDJ = djQueue[0];
    const progressPct = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div style={styles.wrapper}>
            {/* ── Video frame ── */}
            <div style={styles.playerOuter}>
                <div id={PLAYER_DIV_ID} style={styles.playerInner} />
                {!playback && (
                    <div style={styles.emptyOverlay}>
                        <p style={styles.emptyText}>
                            {djQueue.length === 0
                                ? 'No DJ yet — join the queue to play!'
                                : isDJ
                                ? 'You\'re the DJ — queue a video below'
                                : `Waiting for DJ ${currentDJ ? `(User ${currentDJ})` : ''}...`}
                        </p>
                    </div>
                )}
            </div>

            {/* ── Progress bar (DJ can scrub, others can't) ── */}
            {playback && (
                <div
                    style={{ ...styles.progressTrack, cursor: isDJ ? 'pointer' : 'default' }}
                    onClick={isDJ ? handleSeekClick : undefined}
                >
                    <div style={{ ...styles.progressFill, width: `${progressPct}%` }} />
                </div>
            )}

            {/* ── Now playing info ── */}
            {playback?.song && (
                <div style={styles.nowPlaying}>
                    <span style={styles.songTitle}>{playback.song.title}</span>
                    <span style={styles.songMeta}>
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                </div>
            )}

            {/* ── DJ Controls ── */}
            {isDJ && (
                <div style={styles.djPanel}>
                    <p style={styles.djBadge}>🎧 You are the DJ</p>

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
                        <button style={styles.btn} type="submit">Load</button>
                    </form>

                    {/* Playback controls */}
                    <div style={styles.controls}>
                        <button
                            style={styles.btn}
                            onClick={localPlaying ? onPause : onPlay}
                        >
                            {localPlaying ? '⏸ Pause' : '▶ Play'}
                        </button>
                        <button style={{ ...styles.btn, ...styles.btnSecondary }} onClick={onPassDJ}>
                            Pass DJ →
                        </button>
                    </div>
                </div>
            )}

            {/* ── Queue panel ── */}
            <div style={styles.queuePanel}>
                <div style={styles.queueHeader}>
                    <span style={styles.queueTitle}>DJ Queue</span>
                    {inQueue ? (
                        <button style={{ ...styles.btn, ...styles.btnSecondary }} onClick={onLeaveQueue}>
                            Leave Queue
                        </button>
                    ) : (
                        <button style={styles.btn} onClick={onJoinQueue}>
                            + Join Queue
                        </button>
                    )}
                </div>
                {djQueue.length === 0 ? (
                    <p style={styles.muted}>No one in queue</p>
                ) : (
                    <ol style={styles.queueList}>
                        {djQueue.map((uid, i) => (
                            <li key={uid} style={styles.queueItem}>
                                <span style={i === 0 ? styles.currentDJLabel : styles.queuePos}>
                                    {i === 0 ? '🎧' : `${i + 1}.`}
                                </span>
                                <span style={styles.queueName}>
                                    {uid === String(userId) ? 'You' : `User ${uid}`}
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
    djPanel: {
        background: '#1a1a1a',
        border: '1px solid #2e2e2e',
        borderTop: 'none',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    djBadge: {
        margin: 0,
        fontSize: '13px',
        color: '#aa3bff',
        fontWeight: '600',
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
    controls: {
        display: 'flex',
        gap: '8px',
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
    queuePanel: {
        background: '#1a1a1a',
        border: '1px solid #2e2e2e',
        borderTop: 'none',
        borderRadius: '0 0 8px 8px',
        padding: '16px',
    },
    queueHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
    },
    queueTitle: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
    },
    queueList: {
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    queueItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '13px',
    },
    currentDJLabel: {
        fontSize: '16px',
    },
    queuePos: {
        color: '#555',
        width: '20px',
        textAlign: 'center',
    },
    queueName: {
        color: '#ccc',
    },
    muted: {
        color: '#555',
        fontSize: '13px',
        margin: 0,
    },
};
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom';
import { useRoomSync } from '../hooks/useRoomSync';
import { VideoPlayer } from '../components/VideoPlayer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export function RoomPage({ socket, connected, user, token }) {
    const { id: roomId } = useParams();
    const navigate = useNavigate();
    const [roomInfo, setRoomInfo] = useState(null);

    // Player controls ref — populated once the YT player is ready
    const playerControlsRef = useRef(null);

    // Stable player controls proxy: useRoomSync needs these but the player
    // isn't ready until after first render, so we proxy through a ref.
    const playerControls = {
        ready: !!playerControlsRef.current,
        loadVideo: (...args) => playerControlsRef.current?.loadVideo(...args),
        play: (...args) => playerControlsRef.current?.play(...args),
        pause: (...args) => playerControlsRef.current?.pause(...args),
        seekTo: (...args) => playerControlsRef.current?.seekTo(...args),
        getCurrentTime: () => playerControlsRef.current?.getCurrentTime() ?? 0,
        getDuration: () => playerControlsRef.current?.getDuration() ?? 0,
    };

    const {
        playback,
        djQueue,
        isDJ,
        handleRoomState,
        joinQueue,
        leaveQueue,
        queueVideo,
        emitPlay,
        emitPause,
        emitSeek,
        passDJ,
    } = useRoomSync({
        socket,
        roomId: Number(roomId),
        userId: user?.id,
        playerControls,
    });

    // useRoom handles join/leave + user presence
    const { users, joined, leave } = useRoom(socket, roomId, handleRoomState);

    useEffect(() => {
        fetch(`${API_URL}/api/rooms/${roomId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then(setRoomInfo)
            .catch(console.error);
    }, [roomId, token]);

    const handleLeave = () => {
        leave();
        navigate('/rooms');
    };

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <button style={styles.backBtn} onClick={handleLeave}>← Back</button>
                <span style={styles.roomTitle}>{roomInfo?.name ?? `Room #${roomId}`}</span>
                <span style={styles.connStatus}>
                    <span style={{ ...styles.dot, background: connected ? '#4ade80' : '#f87171' }} />
                    {connected ? 'Connected' : 'Disconnected'}
                </span>
            </header>

            <main style={styles.main}>
                <div style={styles.left}>
                    <VideoPlayer
                        isDJ={isDJ}
                        playback={playback}
                        djQueue={djQueue}
                        userId={user?.id}
                        onReady={(controls) => { playerControlsRef.current = controls; }}
                        onQueueVideo={queueVideo}
                        onPlay={emitPlay}
                        onPause={emitPause}
                        onSeek={emitSeek}
                        onPassDJ={passDJ}
                        onJoinQueue={joinQueue}
                        onLeaveQueue={leaveQueue}
                    />
                </div>

                <aside style={styles.right}>
                    <h3 style={styles.sectionTitle}>
                        Listeners <span style={styles.badge}>{users.length}</span>
                    </h3>
                    {!joined ? (
                        <p style={styles.muted}>Joining...</p>
                    ) : users.length === 0 ? (
                        <p style={styles.muted}>Just you</p>
                    ) : (
                        <div style={styles.userList}>
                            {users.map((uid) => (
                                <div key={uid} style={styles.userChip}>
                                    <span style={styles.avatar}>{String(uid).slice(0, 2)}</span>
                                    <span style={styles.uid}>
                                        {String(uid) === String(user?.id) ? 'You' : `User ${uid}`}
                                    </span>
                                    {djQueue[0] === String(uid) && (
                                        <span style={styles.djTag}>DJ</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </aside>
            </main>
        </div>
    );
}

const styles = {
    page: { minHeight: '100vh', background: '#0f0f0f', color: '#fff' },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '14px 24px',
        borderBottom: '1px solid #1e1e1e',
    },
    backBtn: {
        background: 'transparent',
        border: '1px solid #2e2e2e',
        borderRadius: '6px',
        color: '#888',
        padding: '6px 12px',
        fontSize: '13px',
        cursor: 'pointer',
    },
    roomTitle: { flex: 1, fontSize: '16px', fontWeight: '600' },
    connStatus: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#888' },
    dot: { width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block' },
    main: {
        display: 'grid',
        gridTemplateColumns: '1fr 240px',
        gap: '24px',
        padding: '24px',
        maxWidth: '1100px',
        margin: '0 auto',
        alignItems: 'start',
    },
    left: {},
    right: {
        background: '#1a1a1a',
        border: '1px solid #2e2e2e',
        borderRadius: '8px',
        padding: '16px',
    },
    sectionTitle: {
        margin: '0 0 12px',
        fontSize: '13px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: '#666',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    badge: {
        background: '#2e2e2e',
        borderRadius: '10px',
        padding: '1px 8px',
        fontSize: '12px',
        color: '#aaa',
        fontWeight: '500',
        textTransform: 'none',
        letterSpacing: 0,
    },
    userList: { display: 'flex', flexDirection: 'column', gap: '8px' },
    userChip: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 8px',
        background: '#111',
        borderRadius: '6px',
    },
    avatar: {
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: '#aa3bff44',
        color: '#aa3bff',
        fontSize: '10px',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textTransform: 'uppercase',
        flexShrink: 0,
    },
    uid: { fontSize: '13px', color: '#ccc', flex: 1 },
    djTag: {
        fontSize: '10px',
        fontWeight: '700',
        color: '#aa3bff',
        background: '#aa3bff22',
        padding: '2px 6px',
        borderRadius: '4px',
    },
    muted: { color: '#555', fontSize: '14px', margin: 0 },
};
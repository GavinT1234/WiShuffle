import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export function RoomsPage({ token, user, onLogout }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRoomName, setNewRoomName] = useState('');
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/api/rooms`);
      const data = await res.json();
      setRooms(data);
    } catch (err) {
      console.error('Failed to fetch rooms', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const createRoom = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(`${API_URL}/api/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newRoomName.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewRoomName('');
        setShowCreate(false);
        fetchRooms();
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <span style={styles.logo}>WiShuffle</span>
        <div style={styles.headerRight}>
          <span style={styles.username}>{user?.username}</span>
          <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.titleRow}>
          <h2 style={styles.heading}>Rooms</h2>
          <button style={styles.createBtn} onClick={() => setShowCreate(!showCreate)}>
            + New Room
          </button>
        </div>

        {showCreate && (
          <form onSubmit={createRoom} style={styles.createForm}>
            <input
              style={styles.input}
              placeholder="Room name"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              autoFocus
            />
            <button style={styles.createBtn} type="submit" disabled={creating}>
              {creating ? 'Creating...' : 'Create'}
            </button>
            <button
              style={styles.cancelBtn}
              type="button"
              onClick={() => setShowCreate(false)}
            >
              Cancel
            </button>
          </form>
        )}

        {loading ? (
          <p style={styles.muted}>Loading rooms...</p>
        ) : rooms.length === 0 ? (
          <p style={styles.muted}>No rooms yet. Create one!</p>
        ) : (
          <div style={styles.list}>
            {rooms.map((room) => (
              <button
                key={room.id}
                style={styles.roomCard}
                onClick={() => navigate(`/room/${room.id}`)}
              >
                <span style={styles.roomName}>{room.name}</span>
                <span style={styles.roomMeta}>
                  {room.listenerCount ?? 0} listening
                </span>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0f0f0f',
    color: '#fff',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid #1e1e1e',
  },
  logo: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#aa3bff',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  username: {
    fontSize: '14px',
    color: '#888',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #2e2e2e',
    borderRadius: '6px',
    color: '#888',
    padding: '6px 12px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  main: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  heading: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
  },
  createBtn: {
    background: '#aa3bff',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    padding: '8px 14px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  cancelBtn: {
    background: 'transparent',
    border: '1px solid #2e2e2e',
    borderRadius: '6px',
    color: '#888',
    padding: '8px 14px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  createForm: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
  },
  input: {
    flex: 1,
    padding: '8px 12px',
    background: '#1a1a1a',
    border: '1px solid #2e2e2e',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  roomCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    background: '#1a1a1a',
    border: '1px solid #2e2e2e',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    transition: 'border-color 0.15s',
  },
  roomName: {
    fontSize: '15px',
    fontWeight: '500',
  },
  roomMeta: {
    fontSize: '13px',
    color: '#666',
  },
  muted: {
    color: '#555',
    fontSize: '14px',
  },
};
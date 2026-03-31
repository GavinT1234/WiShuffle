import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export function ProfilePage({ token, user, onLogout }) {
  const [username, setUsername] = useState(user?.username || '');
  const [description, setDescription] = useState(user?.description || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [previewSrc, setPreviewSrc] = useState(user?.avatarUrl || '');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setDescription(user.description || '');
      setAvatarUrl(user.avatarUrl || '');
      setPreviewSrc(user.avatarUrl || '');
    }
  }, [user]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewSrc(reader.result);
      setAvatarUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setSaving(true);
    setStatus('');

    try {
      const res = await fetch(`${API_URL}/api/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: username.trim(),
          description,
          avatarUrl: avatarUrl.trim(),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setStatus(errorData.message || 'Failed to save profile');
      } else {
        setStatus('Profile updated successfully');
      }
    } catch (err) {
      setStatus('Unable to save profile');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <span style={styles.logo} onClick={() => navigate('/rooms')} role="button">WiShuffle</span>
        <div style={styles.headerRight}>
          <span style={styles.username} onClick={() => navigate('/profile')} role="button">{user?.username}</span>
          <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.titleRow}>
          <h2 style={styles.heading}>Profile</h2>
          <p style={styles.subtext}>Customize your username, avatar, and bio.</p>
        </div>

        <form onSubmit={saveProfile} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Profile picture</label>
            <div style={styles.avatarRow}>
              <div style={styles.avatarPreview}>
                {previewSrc ? (
                  <img src={previewSrc} alt="Avatar preview" style={styles.avatarImage} />
                ) : (
                  <span style={styles.avatarPlaceholder}>No image</span>
                )}
              </div>
              <div style={styles.avatarControls}>
                <input
                  style={styles.fileInput}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <input
                  style={styles.input}
                  value={avatarUrl}
                  onChange={(e) => {
                    setAvatarUrl(e.target.value);
                    setPreviewSrc(e.target.value);
                  }}
                  placeholder="Image URL"
                />
              </div>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              style={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell people a little about yourself"
              rows="4"
            />
          </div>

          <div style={styles.actions}>
            <button style={styles.createBtn} type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>

          {status && <p style={styles.status}>{status}</p>}
        </form>
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
    maxWidth: '650px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px',
  },
  heading: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
  },
  subtext: {
    margin: 0,
    color: '#777',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  label: {
    fontSize: '13px',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    background: '#1a1a1a',
    border: '1px solid #2e2e2e',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '12px 14px',
    background: '#1a1a1a',
    border: '1px solid #2e2e2e',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
  },
  avatarRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  avatarPreview: {
    minWidth: '120px',
    minHeight: '120px',
    borderRadius: '16px',
    background: '#121212',
    border: '1px solid #2e2e2e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    color: '#555',
    fontSize: '13px',
  },
  avatarControls: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  fileInput: {
    color: '#fff',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  createBtn: {
    background: '#aa3bff',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    padding: '12px 18px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  status: {
    color: '#aaa',
    fontSize: '14px',
  },
};
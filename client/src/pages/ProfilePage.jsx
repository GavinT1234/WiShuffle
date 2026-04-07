import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUser } from '../hooks/useGetUser';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export function ProfilePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { user, loading, fetchUser } = useGetUser();
  
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [previewSrc, setPreviewSrc] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

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
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 500;
        const ctx = canvas.getContext('2d');
        const size = Math.min(img.width, img.height);
        const x = (img.width - size) / 2;
        const y = (img.height - size) / 2;
        ctx.drawImage(img, x, y, size, size, 0, 0, 500, 500);
        const resizedData = canvas.toDataURL('image/jpeg', 0.8);
        setPreviewSrc(resizedData);
        setAvatarUrl(resizedData);
      };
      img.src = reader.result;
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
        const errorMessage = errorData.message || errorData.error || 'Failed to save profile';
        setStatus(errorMessage);
        console.error('Profile update error:', errorMessage);
      } else {
        setStatus('Profile updated successfully');
        // Refresh user data
        fetchUser();
      }
    } catch (err) {
      setStatus('Unable to save profile');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="flex justify-center items-center min-h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-300">
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">Profile</h2>
          <p className="text-base-content/70">Customize your username, avatar, and bio.</p>
        </div>

        <form onSubmit={saveProfile} className="space-y-6">
          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold">Username</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
            />
          </div>

          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold">Profile picture</span>
            </label>
            <div className="flex gap-6 flex-wrap">
              <div className="avatar placeholder">
                <div className="bg-base-200 rounded-xl w-24 h-24 flex items-center justify-center border border-base-300">
                  {previewSrc ? (
                    <img src={previewSrc} alt="Avatar preview" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <span className="text-base-content/50">No image</span>
                  )}
                </div>
              </div>
              <div className="flex-1 space-y-2 flex flex-col justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered w-full"
                />
                <input
                  type="text"
                  className="input input-bordered w-full"
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

          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell people a little about yourself"
              rows="4"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>

          {status && (
            <div className={`alert ${status.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
              <p>{status}</p>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}

export default ProfilePage;

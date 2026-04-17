import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export function FriendProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setError('User not found');
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const messageUser = () => {
    navigate(`/messages/${userId}`);
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

  if (error || !user) {
    return (
      <div className="min-h-screen bg-base-300">
        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="card bg-base-200 p-8 text-center">
            <p className="text-error mb-4">{error}</p>
            <button onClick={() => navigate('/friends')} className="btn bg-[#aa3bff] text-white border-[#aa3bff] hover:bg-[#8b28cc] hover:border-[#8b28cc]">
              Back to Friends
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-300">
      <main className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-sm btn-ghost mb-4"
        >
          ← Back
        </button>

        <div className="card bg-base-200 p-8">
          {/* Header with avatar */}
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="avatar">
              <div className="w-32 h-32 rounded-full bg-base-300 flex items-center justify-center border-4 border-base-300">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-5xl">{user.username[0]?.toUpperCase()}</span>
                )}
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-4xl font-bold mb-2">{user.username}</h2>
              {user.description && (
                <p className="text-base-content/70 mb-6 max-w-lg">{user.description}</p>
              )}
            </div>

            <button
              onClick={messageUser}
              className="btn bg-[#aa3bff] text-white border-[#aa3bff] hover:bg-[#8b28cc] hover:border-[#8b28cc]"
            >
              Send Message
            </button>
          </div>

          {/* Top Songs Section */}
          {user.topSongs && user.topSongs.length > 0 && (
            <div className="mt-8 pt-8 border-t border-base-300">
              <h3 className="text-2xl font-bold mb-6">Top Songs</h3>
              <div className="space-y-4">
                {user.topSongs.map((song, index) => (
                  <div key={index} className="card bg-base-100 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded bg-success flex items-center justify-center text-success-content font-bold">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{song.title}</p>
                          <p className="text-base-content/70">{song.artist}</p>
                        </div>
                      </div>
                      <a
                        href={song.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline"
                      >
                        Listen
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!user.topSongs || user.topSongs.length === 0) && (
            <div className="mt-8 pt-8 border-t border-base-300 text-center">
              <p className="text-base-content/70">{user.username} hasn't shared their top songs yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default FriendProfilePage;

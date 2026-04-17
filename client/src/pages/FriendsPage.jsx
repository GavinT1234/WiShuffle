import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFriends } from '../hooks/useFriends';

export function FriendsPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { searchUsers: searchUsersAPI, sendFriendRequest, loading: friendsLoading, error: friendsError } = useFriends();
  
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [status, setStatus] = useState('');
  const [activeTab, setActiveTab] = useState('friends');
  const [sentRequestIds, setSentRequestIds] = useState(new Set());

  useEffect(() => {
    fetchFriends();
    fetchPendingRequests();
    fetchSentRequests();
  }, []);

  useEffect(() => {
    if (friendsError) {
      setStatus(friendsError);
    }
  }, [friendsError]);

  const fetchFriends = async () => {
    try {
      const res = await fetch(`/api/friends`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFriends(data);
      }
    } catch (error) {
      console.error('Failed to fetch friends:', error);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const res = await fetch(`/api/friends/requests/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPendingRequests(data);
      }
    } catch (error) {
      console.error('Failed to fetch pending requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSentRequests = async () => {
    try {
      const res = await fetch(`/api/friends/requests/sent`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSentRequests(data);
        const ids = new Set(data.map(req => req.receiverId));
        setSentRequestIds(ids);
      }
    } catch (error) {
      console.error('Failed to fetch sent requests:', error);
    }
  };

  const searchUsers = async () => {
    if (!searchUsername.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await searchUsersAPI(searchUsername);
      if (results && results.length > 0) {
        setSearchResults(results);
        setStatus('');
      } else {
        setSearchResults([]);
        setStatus('No users found');
      }
    } catch (error) {
      console.error('Search failed:', error);
      setStatus('Search failed');
    } finally {
      setSearching(false);
    }
  };

  const handleAddFriend = async (userId) => {
    const result = await sendFriendRequest(userId);
    if (result.success) {
      setSentRequestIds(prev => new Set([...prev, userId]));
      setStatus('Friend request sent!');
      fetchSentRequests();
      setTimeout(() => setStatus(''), 3000);
    } else {
      setStatus(friendsError || 'Failed to send friend request');
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      const res = await fetch(`/api/friends/request/${requestId}/accept`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchFriends();
        fetchPendingRequests();
        setStatus('Friend request accepted');
      }
    } catch (error) {
      console.error('Failed to accept request:', error);
      setStatus('Failed to accept friend request');
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      const res = await fetch(`/api/friends/request/${requestId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchPendingRequests();
        setStatus('Friend request rejected');
      }
    } catch (error) {
      console.error('Failed to reject request:', error);
      setStatus('Failed to reject friend request');
    }
  };

  const removeFriend = async (friendId) => {
    try {
      const res = await fetch(`/api/friends/${friendId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchFriends();
        setStatus('Friend removed');
      }
    } catch (error) {
      console.error('Failed to remove friend:', error);
      setStatus('Failed to remove friend');
    }
  };

  const messageUser = (userId) => {
    navigate(`/messages/${userId}`);
  };

  const viewProfile = (userId) => {
    navigate(`/profile/${userId}`);
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
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">Friends</h2>
          <p className="text-base-content/70">Connect with your friends and see their profiles.</p>
        </div>

        {status && (
          <div className="alert alert-info mb-4">
            <p>{status}</p>
          </div>
        )}

        <div className="tabs tabs-bordered mb-8">
          <button
            className={`tab ${activeTab === 'friends' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('friends')}
          >
            Friends ({friends.length})
          </button>
          <button
            className={`tab ${activeTab === 'pending' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending ({pendingRequests.length})
          </button>
          <button
            className={`tab ${activeTab === 'sent' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('sent')}
          >
            Sent ({sentRequests.length})
          </button>
          <button
            className={`tab ${activeTab === 'search' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Add Friend
          </button>
        </div>

        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <div className="space-y-4">
            {friends.length === 0 ? (
              <div className="card bg-base-200 p-8 text-center">
                <p className="text-base-content/70">You don't have any friends yet.</p>
                <button
                  onClick={() => setActiveTab('search')}
                  className="btn bg-[#aa3bff] text-white border-[#aa3bff] hover:bg-[#8b28cc] hover:border-[#8b28cc] mt-4"
                >
                  Add a friend
                </button>
              </div>
            ) : (
              friends.map((friendship) => (
                <div key={friendship.id} className="card bg-base-200 p-4">
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full bg-base-300 flex items-center justify-center">
                        {friendship.friend.avatarUrl ? (
                          <img
                            src={friendship.friend.avatarUrl}
                            alt={friendship.friend.username}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-2xl">{friendship.friend.username[0]?.toUpperCase()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{friendship.friend.username}</h3>
                      {friendship.friend.description && (
                        <p className="text-sm text-base-content/70 line-clamp-2">
                          {friendship.friend.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => viewProfile(friendship.friend.id)}
                        className="btn btn-sm btn-outline"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => messageUser(friendship.friend.id)}
                        className="btn btn-sm bg-[#aa3bff] text-white border-[#aa3bff] hover:bg-[#8b28cc] hover:border-[#8b28cc]"
                      >
                        Message
                      </button>
                      <button
                        onClick={() => removeFriend(friendship.friend.id)}
                        className="btn btn-sm btn-ghost text-error"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pending Tab */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pendingRequests.length === 0 ? (
              <div className="card bg-base-200 p-8 text-center">
                <p className="text-base-content/70">You don't have any pending requests.</p>
              </div>
            ) : (
              pendingRequests.map((request) => (
                <div key={request.id} className="card bg-base-200 p-4">
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full bg-base-300 flex items-center justify-center">
                        {request.initiator.avatarUrl ? (
                          <img
                            src={request.initiator.avatarUrl}
                            alt={request.initiator.username}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-2xl">{request.initiator.username[0]?.toUpperCase()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{request.initiator.username}</h3>
                      {request.initiator.description && (
                        <p className="text-sm text-base-content/70 line-clamp-2">
                          {request.initiator.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => acceptRequest(request.id)}
                        className="btn btn-sm bg-[#aa3bff] text-white border-[#aa3bff] hover:bg-[#8b28cc] hover:border-[#8b28cc]"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => rejectRequest(request.id)}
                        className="btn btn-sm btn-ghost text-error"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Sent Tab */}
        {activeTab === 'sent' && (
          <div className="space-y-4">
            {sentRequests.length === 0 ? (
              <div className="card bg-base-200 p-8 text-center">
                <p className="text-base-content/70">You haven't sent any friend requests.</p>
              </div>
            ) : (
              sentRequests.map((request) => (
                <div key={request.id} className="card bg-base-200 p-4">
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full bg-base-300 flex items-center justify-center">
                        {request.receiver.avatarUrl ? (
                          <img
                            src={request.receiver.avatarUrl}
                            alt={request.receiver.username}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-2xl">{request.receiver.username[0]?.toUpperCase()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{request.receiver.username}</h3>
                    </div>
                    <div className="badge badge-outline">Pending</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="card bg-base-200 p-6">
            <h3 className="font-semibold text-lg mb-4">Add a Friend</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter username"
                className="input input-bordered flex-1"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
              />
              <button
                onClick={searchUsers}
                disabled={searching || friendsLoading}
                className="btn bg-[#aa3bff] text-white border-[#aa3bff] hover:bg-[#8b28cc] hover:border-[#8b28cc]"
              >
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
            {searchResults.length > 0 && (
              <div className="mt-6 space-y-4">
                {searchResults.map((user) => {
                  const isAlreadyFriend = friends.some(f => f.friend.id === user.id);
                  const hasRequestSent = sentRequestIds.has(user.id);
                  
                  return (
                    <div key={user.id} className="card bg-base-100 p-4 flex flex-row items-center gap-4">
                      <div className="avatar">
                        <div className="w-12 h-12 rounded-full bg-base-300 flex items-center justify-center">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.username}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <span>{user.username[0]?.toUpperCase()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{user.username}</p>
                        {user.description && (
                          <p className="text-sm text-base-content/70 line-clamp-1">{user.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddFriend(user.id)}
                        disabled={friendsLoading || isAlreadyFriend || hasRequestSent}
                        className={`btn btn-sm ${
                          isAlreadyFriend ? 'btn-disabled' : hasRequestSent ? 'btn-outline' : 'bg-[#aa3bff] text-white border-[#aa3bff] hover:bg-[#8b28cc] hover:border-[#8b28cc]'
                        }`}
                      >
                        {isAlreadyFriend ? 'Already Friends' : hasRequestSent ? 'Request Sent' : 'Add Friend'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default FriendsPage;

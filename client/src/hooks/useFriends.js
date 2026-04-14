import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const useFriends = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const searchUsers = async (username) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/users/search?username=${encodeURIComponent(username)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      } else {
        setError('Failed to search users');
        return [];
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (receiverId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/friends/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiverId }),
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, data };
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to send friend request');
        return { success: false };
      }
    } catch (err) {
      console.error('Failed to send friend request:', err);
      setError(err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const acceptFriendRequest = async (requestId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/friends/request/${requestId}/accept`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        return { success: true };
      } else {
        setError('Failed to accept friend request');
        return { success: false };
      }
    } catch (err) {
      console.error('Failed:', err);
      setError(err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const rejectFriendRequest = async (requestId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/friends/request/${requestId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        return { success: true };
      } else {
        setError('Failed to reject friend request');
        return { success: false };
      }
    } catch (err) {
      console.error('Failed:', err);
      setError(err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const removeFriend = async (friendId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/friends/${friendId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        return { success: true };
      } else {
        setError('Failed to remove friend');
        return { success: false };
      }
    } catch (err) {
      console.error('Failed:', err);
      setError(err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    searchUsers,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    loading,
    error,
  };
};

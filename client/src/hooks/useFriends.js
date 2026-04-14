import { useState } from 'react';
import { request } from '../api/index.js';

export const useFriends = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchUsers = async (username) => {
    setLoading(true);
    setError(null);
    try {
      const data = await request(`/users/search?username=${encodeURIComponent(username)}`);
      return data;
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
      const data = await request(`/friends/request`, {
        method: 'POST',
        body: JSON.stringify({ receiverId }),
      });
      return { success: true, data };
    } catch (err) {
      const errorMessage = err.message || 'Failed to send friend request';
      setError(errorMessage);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const acceptFriendRequest = async (requestId) => {
    setLoading(true);
    setError(null);
    try {
      await request(`/friends/request/${requestId}/accept`, {
        method: 'PATCH',
      });
      return { success: true };
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
      await request(`/friends/request/${requestId}`, {
        method: 'DELETE',
      });
      return { success: true };
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
      await request(`/friends/${friendId}`, {
        method: 'DELETE',
      });
      return { success: true };
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

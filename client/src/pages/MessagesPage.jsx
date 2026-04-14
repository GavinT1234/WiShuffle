import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetUser } from '../hooks/useGetUser';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export function MessagesPage() {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { user: currentUser, loading: userLoading } = useGetUser();
  
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentPartner, setCurrentPartner] = useState(partnerId ? parseInt(partnerId) : null);
  const [partnerInfo, setPartnerInfo] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchConversations();
  }, [token]);

  useEffect(() => {
    if (currentPartner) {
      fetchMessages();
      fetchPartnerInfo();
    }
  }, [currentPartner]);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_URL}/api/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/messages/${currentPartner}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        // Mark as read
        await fetch(`${API_URL}/api/messages/${currentPartner}/read`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const fetchPartnerInfo = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/${currentPartner}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPartnerInfo(data);
      }
    } catch (error) {
      console.error('Failed to fetch partner info:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: currentPartner,
          content: newMessage.trim(),
        }),
      });

      if (res.ok) {
        const sent = await res.json();
        setMessages([...messages, sent]);
        setNewMessage('');
        // Refresh conversations list
        fetchConversations();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const selectConversation = (partnerId) => {
    setCurrentPartner(partnerId);
  };

  if (loading || userLoading) {
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
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">Messages</h2>
          <p className="text-base-content/70">Direct message your friends.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
          {/* Conversations List */}
          <div className="card bg-base-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-base-300">
              <h3 className="font-semibold">Conversations</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-base-content/70">
                  No conversations yet
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.partnerId}
                    onClick={() => selectConversation(conv.partnerId)}
                    className={`w-full p-4 border-b border-base-300 text-left hover:bg-base-300 transition ${
                      currentPartner === conv.partnerId ? 'bg-base-300' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-10 h-10 rounded-full bg-base-100">
                          {conv.partnerInfo.avatarUrl ? (
                            <img
                              src={conv.partnerInfo.avatarUrl}
                              alt={conv.partnerInfo.username}
                            />
                          ) : (
                            <div className="flex items-center justify-center">
                              {conv.partnerInfo.username[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{conv.partnerInfo.username}</p>
                        <p className="text-sm text-base-content/70 truncate">{conv.lastMessage}</p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <div className="badge badge-primary">{conv.unreadCount}</div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="card bg-base-200 col-span-1 md:col-span-2 overflow-hidden flex flex-col">
            {currentPartner && partnerInfo ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-base-300 flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full bg-base-100">
                      {partnerInfo.avatarUrl ? (
                        <img src={partnerInfo.avatarUrl} alt={partnerInfo.username} />
                      ) : (
                        <div className="flex items-center justify-center">
                          {partnerInfo.username[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold cursor-pointer hover:text-primary"
                       onClick={() => navigate(`/profile/${currentPartner}`)}>
                      {partnerInfo.username}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/profile/${currentPartner}`)}
                    className="btn btn-sm btn-ghost"
                  >
                    View Profile
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-base-content/70">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`chat ${
                          msg.senderId === currentUser?.id
                            ? 'chat-end'
                            : 'chat-start'
                        }`}
                      >
                        <div className="chat-image avatar">
                          <div className="w-8 h-8 rounded-full bg-base-100">
                            {msg.sender.avatarUrl ? (
                              <img src={msg.sender.avatarUrl} alt={msg.sender.username} />
                            ) : (
                              <div className="flex items-center justify-center text-sm">
                                {msg.sender.username[0].toUpperCase()}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className={`chat-bubble ${
                          msg.senderId === currentUser?.id
                            ? 'chat-bubble-primary'
                            : 'chat-bubble-secondary'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={sendMessage} className="p-4 border-t border-base-300">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="input input-bordered flex-1"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      disabled={sending || !newMessage.trim()}
                      className="btn btn-primary"
                    >
                      {sending ? '...' : 'Send'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-base-content/70">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default MessagesPage;

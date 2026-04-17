import { useEffect, useRef, useState } from 'react';

export function RoomMessages({ socket, roomId, userId }) {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for incoming room messages
  useEffect(() => {
    if (!socket) return;

    const handleRoomMessage = (data) => {
      console.log('[RoomMessages] Received message:', data);
      setMessages((prev) => [...prev, data]);
    };

    socket.on('room:message', handleRoomMessage);

    return () => {
      socket.off('room:message', handleRoomMessage);
    };
  }, [socket, roomId]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !socket || isSending) return;

    setIsSending(true);
    const messageText = messageInput.trim();
    setMessageInput('');

    try {
      socket.emit('room:send_message', {
        roomId,
        content: messageText,
      }, (ack) => {
        if (!ack?.ok) {
          console.error('Failed to send message:', ack?.error);
          setMessageInput(messageText); // Restore input on error
        }
      });
    } catch (error) {
      console.error('[RoomMessages] Error sending message:', error);
      setMessageInput(messageText); // Restore input on error
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-4 flex flex-col gap-3 h-full">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto min-h-[200px] max-h-[400px] flex flex-col gap-2">
        {messages.length === 0 ? (
          <p className="text-[#444] text-xs text-center py-8">No messages yet</p>
        ) : (
          <>
            {messages.map((msg, idx) => {
              const isCurrentUser = msg.userId === userId;
              return (
                <div
                  key={idx}
                  className={`text-xs p-2 rounded-md ${
                    isCurrentUser
                      ? 'bg-[#aa3bff22] text-[#ccc] ml-8'
                      : 'bg-[#111] text-[#aaa] mr-8'
                  }`}
                  title={new Date(msg.timestamp).toLocaleTimeString()}
                >
                  {!isCurrentUser && (
                    <span className="font-semibold text-[#aa3bff] block text-[10px] mb-1">
                      {msg.username || `User ${msg.userId}`}
                    </span>
                  )}
                  <span className="break-words block">{msg.content}</span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Say something..."
          disabled={isSending}
          className="flex-1 bg-[#111] text-xs text-white border border-[#2e2e2e] rounded-md px-2.5 py-1.5 placeholder-[#666] focus:outline-none focus:border-[#aa3bff] transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!messageInput.trim() || isSending}
          className="bg-[#aa3bff] text-white text-xs font-medium px-3 py-1.5 rounded-md hover:bg-[#8b28cc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {isSending ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

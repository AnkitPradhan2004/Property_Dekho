import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { chatAPI } from '../services/api';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { Send } from 'lucide-react';

const ChatInbox = () => {
  const { user } = useAuth();
  const [activeRoom, setActiveRoom] = useState(null);
  const [text, setText] = useState('');
  const [liveMessages, setLiveMessages] = useState({}); // roomId -> []
  const socketRef = useRef(null);

  const { data: rooms = [] } = useQuery({
    queryKey: ['chat-rooms'],
    queryFn: () => chatAPI.getChatRooms().then(r => r.data || r),
    enabled: !!user,
    retry: 0
  });

  const { data: paged = { messages: [] } } = useQuery({
    queryKey: ['chat-messages', activeRoom?.lastMessage?.roomId || activeRoom?._id],
    queryFn: () => chatAPI.getMessages(activeRoom?.lastMessage?.roomId || activeRoom?._id).then(r => r.data || r),
    enabled: !!user && !!activeRoom,
    retry: 0
  });

  useEffect(() => {
    if (!user) return;
    const s = io('http://localhost:5000', { auth: { token: localStorage.getItem('token') } });
    socketRef.current = s;
    s.on('receiveMessage', (m) => {
      setLiveMessages(prev => {
        const arr = prev[m.roomId] ? [...prev[m.roomId], m] : [m];
        return { ...prev, [m.roomId]: arr };
      });
    });
    return () => { s.disconnect(); };
  }, [user]);

  const messages = useMemo(() => {
    const base = paged?.messages || [];
    const roomId = activeRoom?.lastMessage?.roomId || activeRoom?._id;
    return [...base, ...(liveMessages[roomId] || [])];
  }, [paged, liveMessages, activeRoom]);

  const send = () => {
    if (!text.trim() || !socketRef.current || !activeRoom) return;
    const toUserId = activeRoom?.lastMessage?.from === user?._id ? activeRoom?.lastMessage?.to : activeRoom?.lastMessage?.from;
    socketRef.current.emit('sendMessage', { toUserId, text: text.trim() });
    setText('');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-600">Please login to use chat.</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="px-3 py-2 border-b font-semibold">Chats</div>
        <div className="max-h-[70vh] overflow-y-auto">
          {rooms.length === 0 ? (
            <div className="p-4 text-gray-600">No conversations yet</div>
          ) : rooms.map((r) => (
            <button key={r._id || r.lastMessage?.roomId} onClick={() => setActiveRoom(r)} className={`w-full text-left px-3 py-3 border-b hover:bg-gray-50 ${ (activeRoom?._id === r._id || activeRoom?.lastMessage?.roomId === r.lastMessage?.roomId) ? 'bg-gray-50' : '' }`}>
              <div className="font-medium text-gray-900 truncate">{r.lastMessage?.from?.name || 'Conversation'}</div>
              <div className="text-sm text-gray-600 truncate">{r.lastMessage?.text}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="md:col-span-2 bg-white rounded-lg border shadow-sm flex flex-col overflow-hidden min-h-[70vh]">
        <div className="px-3 py-2 border-b font-semibold">{activeRoom ? 'Conversation' : 'Select a conversation'}</div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[75%] px-3 py-2 rounded-lg ${m.from === user?._id ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-100 text-gray-800'}`}>{m.text}</div>
          ))}
        </div>
        {activeRoom && (
          <div className="flex items-center gap-2 p-2 border-t">
            <input value={text} onChange={(e) => setText(e.target.value)} className="form-input flex-1" placeholder="Type a message" />
            <button onClick={send} className="btn-primary"><Send className="w-4 h-4" /></button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInbox;



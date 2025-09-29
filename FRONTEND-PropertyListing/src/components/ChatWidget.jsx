import { useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { Send } from 'lucide-react';

const ChatWidget = ({ peerUserId }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    const s = io('http://localhost:5000', {
      auth: { token: localStorage.getItem('token') },
    });
    socketRef.current = s;
    s.on('connect', () => {});
    s.on('receiveMessage', (msg) => setMessages((prev) => [...prev, msg]));
    return () => { s.disconnect(); };
  }, [user]);

  const send = () => {
    if (!text.trim() || !socketRef.current) return;
    socketRef.current.emit('sendMessage', { toUserId: peerUserId, text: text.trim() });
    setMessages((prev) => [...prev, { from: user?._id, to: peerUserId, text: text.trim(), createdAt: new Date() }]);
    setText('');
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="w-80 bg-white rounded-lg shadow-large border mb-2 flex flex-col overflow-hidden">
          <div className="px-3 py-2 border-b font-semibold">Chat</div>
          <div className="h-64 overflow-y-auto p-3 space-y-2">
            {messages.map((m, idx) => (
              <div key={idx} className={`max-w-[75%] px-3 py-2 rounded-lg ${m.from === user?._id ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-100 text-gray-800'}`}>{m.text}</div>
            ))}
          </div>
          <div className="flex items-center gap-2 p-2 border-t">
            <input value={text} onChange={(e) => setText(e.target.value)} className="form-input flex-1" placeholder="Type a message" />
            <button onClick={send} className="btn-primary"><Send className="w-4 h-4" /></button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="btn-primary">{open ? 'Close' : 'Chat'}</button>
    </div>
  );
};

export default ChatWidget;



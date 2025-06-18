import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatMessage {
  username: string;
  message: string;
}

function parseUsername(token: string | null): string | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.username || payload.sub || null;
  } catch {
    return null;
  }
}

const Chat = () => {
  const { accessToken } = useContext(AuthContext);
  const username = parseUsername(accessToken) ?? 'guest';
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const base = import.meta.env.VITE_WS_URL ?? `${scheme}://${window.location.host}/api/v1/ws`;
    const ws = new WebSocket(`${base}/chat/general?username=${encodeURIComponent(username)}`);
    wsRef.current = ws;
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (typeof data.username === 'string' && typeof data.message === 'string') {
          setMessages((prev) => [...prev, data]);
          return;
        }
      } catch {
        // ignore JSON parse errors
      }
      setMessages((prev) => [...prev, { username: 'server', message: event.data }]);
    };
    return () => {
      ws.close();
    };
  }, [username]);

  const sendMessage = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    if (!input.trim()) return;
    wsRef.current.send(input);
    setMessages((prev) => [...prev, { username, message: input }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-2">
          {messages.map((msg, idx) => (
            <div key={idx} className="text-sm">
              <span className="text-blue-400 mr-2">{msg.username}:</span>
              <span>{msg.message}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="메시지를 입력하세요..."
        />
        <Button onClick={sendMessage}>전송</Button>
      </div>
    </div>
  );
};

export default Chat;

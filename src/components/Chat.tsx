import { useContext, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '@/context/AuthContext';
import { fetchBoards } from '@/lib/api';
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
  const { data: boards } = useQuery({ queryKey: ['boards'], queryFn: fetchBoards });
  const [selectedBoard, setSelectedBoard] = useState<number | null>(null);
  const [activeBoard, setActiveBoard] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (activeBoard === null) return;
    const board = boards?.find((b) => b.id === activeBoard);
    if (!board) return;
    const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const base =
      import.meta.env.VITE_WS_URL ?? `${scheme}://${window.location.host}/api/v1/ws`;
    const room = `board_id_${board.id}`;
    const ws = new WebSocket(
      `${base}/chat/${encodeURIComponent(room)}?username=${encodeURIComponent(
        username,
      )}`,
    );
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
      if (event.data.startsWith('server:')) {
        setMessages((prev) => [...prev, { username: 'server', message: event.data.slice(7) }]);
        return;
      }
      const idx = event.data.indexOf(':');
      if (idx !== -1) {
        const from = event.data.slice(0, idx).trim();
        const msg = event.data.slice(idx + 1).trim();
        setMessages((prev) => [...prev, { username: from, message: msg }]);
      } else {
        setMessages((prev) => [...prev, { username: 'server', message: event.data }]);
      }
    };
    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [username, activeBoard, boards]);

  const sendMessage = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    if (!input.trim()) return;
    wsRef.current.send(input);
    setInput('');
  };

  const joinRoom = () => {
    if (selectedBoard !== null) {
      setMessages([]);
      setActiveBoard(selectedBoard);
    }
  };

  const leaveRoom = () => {
    setActiveBoard(null);
    setMessages([]);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <select
          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
          value={selectedBoard ?? ''}
          onChange={(e) => setSelectedBoard(Number(e.target.value))}
        >
          <option value="" disabled>
            채팅방 선택
          </option>
          {boards?.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        {activeBoard === null ? (
          <Button onClick={joinRoom} disabled={selectedBoard === null}>
            입장
          </Button>
        ) : (
          <Button onClick={leaveRoom} variant="destructive">
            나가기
          </Button>
        )}
      </div>
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
          disabled={activeBoard === null}
        />
        <Button onClick={sendMessage} disabled={activeBoard === null}>
          전송
        </Button>
      </div>
    </div>
  );
};

export default Chat;

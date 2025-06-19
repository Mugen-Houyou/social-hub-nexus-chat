import { useContext, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '@/context/AuthContext';
import { fetchBoards } from '@/lib/api';
import { Button } from '@/components/ui/button';

function parseUsername(token: string | null): string | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.username || payload.sub || null;
  } catch {
    return null;
  }
}

interface Signal {
  type: 'offer' | 'answer' | 'candidate' | 'leave';
  sdp?: string;
  candidate?: RTCIceCandidateInit;
}

const VoiceCall = () => {
  const { accessToken } = useContext(AuthContext);
  const username = parseUsername(accessToken) ?? 'guest';
  const { data: boards } = useQuery({ queryKey: ['boards'], queryFn: fetchBoards });

  const [selectedBoard, setSelectedBoard] = useState<number | null>(null);
  const [activeBoard, setActiveBoard] = useState<number | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (activeBoard === null) return;
    const boardId = activeBoard;
    let ws: WebSocket;
    let pc: RTCPeerConnection;

    const start = async () => {
      const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const base =
        import.meta.env.VITE_WS_URL ?? `${scheme}://${window.location.host}/api/v1/ws`;
      ws = new WebSocket(
        `${base}/webrtc/board_id_${boardId}?username=${encodeURIComponent(username)}`,
      );
      wsRef.current = ws;

      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      localStreamRef.current = localStream;
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream;

      pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });
      pcRef.current = pc;

      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

      pc.ontrack = (e) => {
        const [stream] = e.streams;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream;
      };

      pc.onicecandidate = (e) => {
        if (e.candidate && ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({ type: 'candidate', candidate: e.candidate } as Signal),
          );
        }
      };

      ws.onmessage = async (event) => {
        let msg: Signal;
        try {
          msg = JSON.parse(event.data);
        } catch {
          return;
        }
        if (!pc) return;
        switch (msg.type) {
          case 'offer': {
            await pc.setRemoteDescription(
              new RTCSessionDescription({ type: 'offer', sdp: msg.sdp }),
            );
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            ws.send(
              JSON.stringify({ type: 'answer', sdp: answer.sdp } as Signal),
            );
            break;
          }
          case 'answer':
            await pc.setRemoteDescription(
              new RTCSessionDescription({ type: 'answer', sdp: msg.sdp }),
            );
            break;
          case 'candidate':
            if (msg.candidate) await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
            break;
          case 'leave':
            leaveCall();
            break;
        }
      };

      ws.onopen = async () => {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        ws.send(JSON.stringify({ type: 'offer', sdp: offer.sdp } as Signal));
      };

      ws.onclose = () => {
        leaveCall();
      };
    };

    start();

    return () => {
      wsRef.current?.close();
      pcRef.current?.close();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      wsRef.current = null;
      pcRef.current = null;
      localStreamRef.current = null;
    };
  }, [activeBoard, username]);

  const joinCall = () => {
    if (selectedBoard !== null) {
      setActiveBoard(selectedBoard);
    }
  };

  const leaveCall = () => {
    wsRef.current?.send(JSON.stringify({ type: 'leave' } as Signal));
    wsRef.current?.close();
    pcRef.current?.close();
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    setActiveBoard(null);
  };

  return (
    <div className="p-4 space-y-4">
      {activeBoard === null ? (
        <div className="flex items-center space-x-2">
          <select
            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
            value={selectedBoard ?? ''}
            onChange={(e) => setSelectedBoard(Number(e.target.value))}
          >
            <option value="" disabled>
              보이스 채널 선택
            </option>
            {boards?.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <Button onClick={joinCall} disabled={selectedBoard === null}>
            참여
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <video ref={localVideoRef} autoPlay muted className="w-full rounded bg-black" />
            <video ref={remoteVideoRef} autoPlay className="w-full rounded bg-black" />
          </div>
          <Button onClick={leaveCall} variant="destructive">
            나가기
          </Button>
        </div>
      )}
    </div>
  );
};

export default VoiceCall;


import { useState } from 'react';
import { Phone, Users, Bell } from 'lucide-react';

const VoiceCall = () => {
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  const activeRooms = [
    { id: 1, name: '개발팀 회의', participants: 5, type: 'voice' },
    { id: 2, name: '프로젝트 논의', participants: 3, type: 'video' },
    { id: 3, name: '일반 채팅', participants: 8, type: 'voice' },
  ];

  const onlineUsers = [
    { id: 1, name: '김개발', avatar: '👨‍💻', status: 'available' },
    { id: 2, name: '이디자인', avatar: '🎨', status: 'in-call' },
    { id: 3, name: '박매니저', avatar: '📋', status: 'available' },
    { id: 4, name: '최기획', avatar: '💡', status: 'busy' },
  ];

  const joinRoom = (roomId: number) => {
    console.log('방 참여:', roomId);
    setIsInCall(true);
  };

  const leaveCall = () => {
    setIsInCall(false);
    setIsMuted(false);
    setIsVideoOn(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const startDirectCall = (userId: number) => {
    console.log('직접 통화 시작:', userId);
  };

  if (isInCall) {
    return (
      <div className="p-6 h-full flex flex-col">
        <div className="flex-1 bg-gray-800 rounded-lg p-6 mb-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">개발팀 회의</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {[1, 2, 3, 4, 5].map((participant) => (
                <div key={participant} className="bg-gray-700 rounded-lg p-4 aspect-square flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">👤</div>
                    <p className="text-sm">참여자 {participant}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full transition-colors ${
              isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            🎤
          </button>
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-colors ${
              isVideoOn ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            📹
          </button>
          <button
            onClick={leaveCall}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
          >
            📞
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold mb-2">음성/영상 통화</h1>
          <p className="text-gray-400 mb-6">멤버들과 실시간으로 소통하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 활성 방 목록 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">활성 음성방</h2>
            <div className="space-y-3">
              {activeRooms.map((room) => (
                <div key={room.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{room.name}</h3>
                    <span className="text-sm text-gray-400">
                      {room.type === 'video' ? '📹' : '🎤'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">
                      참여자 {room.participants}명
                    </span>
                    <button
                      onClick={() => joinRoom(room.id)}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm transition-colors"
                    >
                      참여
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition-colors">
              새 음성방 만들기
            </button>
          </div>

          {/* 온라인 사용자 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">온라인 멤버</h2>
            <div className="space-y-3">
              {onlineUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="text-2xl">{user.avatar}</div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${
                        user.status === 'available' ? 'bg-green-500' :
                        user.status === 'in-call' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-400">
                        {user.status === 'available' ? '사용 가능' :
                         user.status === 'in-call' ? '통화 중' : '다른 용무 중'}
                      </p>
                    </div>
                  </div>
                  
                  {user.status === 'available' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startDirectCall(user.id)}
                        className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                        title="음성 통화"
                      >
                        🎤
                      </button>
                      <button
                        onClick={() => startDirectCall(user.id)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        title="영상 통화"
                      >
                        📹
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 통화 기능 안내 */}
        <div className="mt-6 bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">통화 기능</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">🎤</div>
              <h4 className="font-medium mb-1">음성 채팅</h4>
              <p className="text-sm text-gray-400">고품질 음성으로 실시간 대화</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📹</div>
              <h4 className="font-medium mb-1">영상 통화</h4>
              <p className="text-sm text-gray-400">화면 공유와 영상 회의</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">👥</div>
              <h4 className="font-medium mb-1">그룹 통화</h4>
              <p className="text-sm text-gray-400">최대 20명까지 동시 참여</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceCall;

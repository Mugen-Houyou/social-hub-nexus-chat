
import { useState } from 'react';
import { MessageSquare, Users } from 'lucide-react';

const DirectMessages = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    { id: 1, name: '김개발', avatar: '👨‍💻', lastMessage: '네, 확인했습니다!', time: '방금', unread: 2, online: true },
    { id: 2, name: '이디자인', avatar: '🎨', lastMessage: '디자인 시안 어떠세요?', time: '5분 전', unread: 0, online: true },
    { id: 3, name: '박매니저', avatar: '📋', lastMessage: '회의 일정을 확인해주세요', time: '1시간 전', unread: 1, online: false },
    { id: 4, name: '최기획', avatar: '💡', lastMessage: '새로운 아이디어가 있어요', time: '3시간 전', unread: 0, online: false },
  ];

  const messages = [
    { id: 1, sender: '김개발', content: '안녕하세요! 프로젝트 진행상황은 어떠신가요?', time: '오후 2:30', isMe: false },
    { id: 2, sender: 'me', content: '네, 순조롭게 진행되고 있습니다. 내일까지 완료 예정이에요.', time: '오후 2:32', isMe: true },
    { id: 3, sender: '김개발', content: '좋네요! 테스트 환경도 준비해주시면 감사하겠습니다.', time: '오후 2:35', isMe: false },
    { id: 4, sender: 'me', content: '네, 확인했습니다!', time: '오후 2:36', isMe: true },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // 메시지 전송 로직
      console.log('메시지 전송:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-screen">
      {/* 채팅 목록 */}
      <div className="w-80 bg-gray-800 border-r border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">다이렉트 메시지</h2>
          <p className="text-sm text-gray-400 mt-1">개인 대화</p>
        </div>
        
        <div className="overflow-y-auto">
          {conversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`p-4 cursor-pointer hover:bg-gray-700 transition-colors ${
                selectedChat === chat.id ? 'bg-gray-700' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="text-2xl">{chat.avatar}</div>
                  {chat.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-400">{chat.time}</span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <div className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {chat.unread}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 채팅 내용 */}
      <div className="flex-1 flex flex-col">
        {/* 채팅 헤더 */}
        <div className="p-4 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">👨‍💻</div>
            <div>
              <h3 className="font-semibold">김개발</h3>
              <p className="text-sm text-green-400">온라인</p>
            </div>
          </div>
        </div>

        {/* 메시지 목록 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isMe
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                <p>{message.content}</p>
                <p className={`text-xs mt-1 ${message.isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 메시지 입력 */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="메시지를 입력하세요..."
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectMessages;

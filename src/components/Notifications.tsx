
import { Bell, Users, MessageSquare } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: 'follow',
      icon: Users,
      title: '김개발님이 팔로우했습니다',
      description: '프로필을 확인해보세요',
      time: '방금',
      read: false,
      color: 'text-blue-400'
    },
    {
      id: 2,
      type: 'comment',
      icon: MessageSquare,
      title: '새로운 댓글',
      description: '"React 18의 새로운 기능들 정리" 게시글에 댓글이 달렸습니다',
      time: '5분 전',
      read: false,
      color: 'text-green-400'
    },
    {
      id: 3,
      type: 'mention',
      icon: Bell,
      title: '멘션 알림',
      description: '이디자인님이 회원님을 멘션했습니다',
      time: '1시간 전',
      read: true,
      color: 'text-yellow-400'
    },
    {
      id: 4,
      type: 'follow',
      icon: Users,
      title: '박매니저님이 팔로우했습니다',
      description: '프로필을 확인해보세요',
      time: '3시간 전',
      read: true,
      color: 'text-blue-400'
    },
    {
      id: 5,
      type: 'comment',
      icon: MessageSquare,
      title: '새로운 댓글',
      description: '"프로젝트 협업 도구 추천" 게시글에 댓글이 달렸습니다',
      time: '1일 전',
      read: true,
      color: 'text-green-400'
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    console.log('알림 읽음 처리:', id);
  };

  const markAllAsRead = () => {
    console.log('모든 알림 읽음 처리');
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">알림</h1>
            <p className="text-gray-400 mt-1">
              {unreadCount > 0 ? `${unreadCount}개의 읽지 않은 알림` : '모든 알림을 확인했습니다'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-sm"
            >
              모두 읽음 처리
            </button>
          )}
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-gray-800 rounded-lg p-4 transition-colors cursor-pointer hover:bg-gray-750 ${
                !notification.read ? 'border-l-4 border-blue-500' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg bg-gray-700`}>
                  <notification.icon className={`w-5 h-5 ${notification.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-sm text-gray-400">{notification.time}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{notification.description}</p>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">알림이 없습니다</h3>
            <p className="text-gray-500">새로운 활동이 있으면 여기에 표시됩니다</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

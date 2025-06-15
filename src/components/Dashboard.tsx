
import { Users, MessageSquare, Bell } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { icon: Users, label: '팔로워', value: '1,234', color: 'text-blue-400' },
    { icon: MessageSquare, label: '게시글', value: '89', color: 'text-green-400' },
    { icon: Bell, label: '알림', value: '12', color: 'text-yellow-400' },
  ];

  const recentPosts = [
    { id: 1, title: '커뮤니티 가이드라인', author: '관리자', time: '2시간 전', comments: 15 },
    { id: 2, title: '새로운 기능 업데이트', author: '개발팀', time: '5시간 전', comments: 32 },
    { id: 3, title: '이번 주 인기 게시글 모음', author: 'community_bot', time: '1일 전', comments: 78 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">대시보드</h1>
        <p className="text-gray-400">커뮤니티 활동 현황을 확인하세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">최근 게시글</h2>
        <div className="space-y-3">
          {recentPosts.map((post) => (
            <div key={post.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
              <div>
                <h3 className="font-medium">{post.title}</h3>
                <p className="text-sm text-gray-400">{post.author} • {post.time}</p>
              </div>
              <div className="text-sm text-gray-400">
                댓글 {post.comments}개
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


import { useState } from 'react';
import { Users, MessageSquare, Bell } from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('followers');

  const followers = [
    { id: 1, name: '김개발', avatar: '👨‍💻', bio: '풀스택 개발자', following: true },
    { id: 2, name: '이디자인', avatar: '🎨', bio: 'UX/UI 디자이너', following: false },
    { id: 3, name: '박매니저', avatar: '📋', bio: '프로젝트 매니저', following: true },
    { id: 4, name: '최기획', avatar: '💡', bio: '기획자', following: false },
  ];

  const following = [
    { id: 5, name: '정개발', avatar: '🚀', bio: '백엔드 개발자', following: true },
    { id: 6, name: '한디자인', avatar: '✨', bio: '그래픽 디자이너', following: true },
  ];

  const handleFollow = (userId: number) => {
    console.log('팔로우/언팔로우:', userId);
  };

  const currentData = activeTab === 'followers' ? followers : following;

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* 프로필 헤더 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="text-6xl">👤</div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold">사용자</h1>
              <p className="text-gray-400 mt-1">커뮤니티 멤버</p>
              <p className="text-gray-300 mt-2">안녕하세요! 커뮤니티에서 활동하고 있는 사용자입니다.</p>
              
              <div className="flex justify-center md:justify-start space-x-6 mt-4">
                <div className="text-center">
                  <div className="text-xl font-bold">156</div>
                  <div className="text-sm text-gray-400">팔로워</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">89</div>
                  <div className="text-sm text-gray-400">팔로잉</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">24</div>
                  <div className="text-sm text-gray-400">게시글</div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                프로필 편집
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors">
                <MessageSquare size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('followers')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'followers'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            팔로워 ({followers.length})
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'following'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            팔로잉 ({following.length})
          </button>
        </div>

        {/* 사용자 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentData.map((user) => (
            <div key={user.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="text-2xl">{user.avatar}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{user.name}</h3>
                  <p className="text-sm text-gray-400 truncate">{user.bio}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleFollow(user.id)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                    user.following
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {user.following ? '언팔로우' : '팔로우'}
                </button>
                <button className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                  <MessageSquare size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;


import { useState } from 'react';
import { MessageSquare, Users, Bell } from 'lucide-react';

const Posts = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'all', label: '전체', count: 156 },
    { id: 'general', label: '일반', count: 89 },
    { id: 'tech', label: '기술', count: 34 },
    { id: 'qa', label: 'Q&A', count: 33 },
  ];

  const posts = [
    {
      id: 1,
      title: '새로운 커뮤니티 기능에 대한 의견을 들려주세요!',
      content: '안녕하세요! 커뮤니티 운영진입니다. 새로운 기능들을 계획하고 있는데 여러분의 의견이 필요합니다...',
      author: '운영진',
      avatar: '🛡️',
      time: '2시간 전',
      likes: 24,
      comments: 15,
      category: 'general'
    },
    {
      id: 2,
      title: 'React 18의 새로운 기능들 정리',
      content: 'React 18에서 추가된 Concurrent Features들에 대해 정리해보았습니다. Suspense, useTransition...',
      author: '개발자김씨',
      avatar: '👨‍💻',
      time: '4시간 전',
      likes: 45,
      comments: 28,
      category: 'tech'
    },
    {
      id: 3,
      title: '프로젝트 협업 도구 추천 부탁드립니다',
      content: '팀 프로젝트를 진행하는데 좋은 협업 도구가 있을까요? 현재 Discord와 GitHub을 사용하고 있는데...',
      author: '신입개발자',
      avatar: '🌱',
      time: '6시간 전',
      likes: 12,
      comments: 9,
      category: 'qa'
    },
  ];

  const filteredPosts = activeCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">게시판</h1>
          <p className="text-gray-400 mt-1">커뮤니티 멤버들과 소통하세요</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
          새 글 작성
        </button>
      </div>

      <div className="flex space-x-4 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors cursor-pointer">
            <div className="flex items-start space-x-4">
              <div className="text-2xl">{post.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold">{post.author}</h3>
                  <span className="text-gray-400 text-sm">•</span>
                  <span className="text-gray-400 text-sm">{post.time}</span>
                </div>
                <h2 className="text-lg font-medium mb-2">{post.title}</h2>
                <p className="text-gray-300 mb-4">{post.content}</p>
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Bell size={16} />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare size={16} />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;

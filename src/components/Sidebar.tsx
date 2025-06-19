
import { Home, MessageSquare, Users, Bell, Phone, User, LogOut, LogIn, MessageCircle } from 'lucide-react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const { logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', icon: Home, label: '대시보드' },
    { id: 'posts', icon: MessageSquare, label: '게시판' },
    { id: 'chat', icon: MessageCircle, label: '채팅' },
    { id: 'messages', icon: MessageSquare, label: 'DM' },
    { id: 'profile', icon: User, label: '프로필' },
    { id: 'notifications', icon: Bell, label: '알림' },
    { id: 'voice', icon: Phone, label: '보이스 채널' },
  ];

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">Community</h1>
        <p className="text-sm text-gray-400 mt-1">온라인 커뮤니티</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        {isAuthenticated ? (
          <>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User size={16} />
              </div>
              <div>
                <p className="text-sm font-medium">사용자</p>
                <p className="text-xs text-gray-400">온라인</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex items-center space-x-2 text-red-400 hover:text-red-300 text-sm"
            >
              <LogOut size={16} />
              <span>로그아웃</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm"
          >
            <LogIn size={16} />
            <span>로그인</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

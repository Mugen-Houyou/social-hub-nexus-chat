
import { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import Posts from '@/components/Posts';
import DirectMessages from '@/components/DirectMessages';
import Profile from '@/components/Profile';
import Notifications from '@/components/Notifications';
import VoiceCall from '@/components/VoiceCall';

const Index = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'posts':
        return <Posts />;
      case 'messages':
        return <DirectMessages />;
      case 'profile':
        return <Profile />;
      case 'notifications':
        return <Notifications />;
      case 'voice':
        return <VoiceCall />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 flex flex-col">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;

import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, Building2, FileText, User, Menu, X, LogOut, Settings } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import MobileLayout from '../components/MobileLayout';
import BottomNav from '../components/BottomNav';

// Client Pages
import ClientHome from '../components/client/ClientHome';
import ClientSchedule from '../components/client/ClientSchedule';
import ClientProperties from '../components/client/ClientProperties';
import ClientNotes from '../components/client/ClientNotes';
import ClientAgent from '../components/client/ClientAgent';
import ClientProfile from '../components/client/ClientProfile';
import ClientHistory from '../components/client/ClientHistory';
import ClientSavedHomes from '../components/client/ClientSavedHomes';

const ClientPortal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentPath = location.pathname.split('/').pop() || 'home';

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'properties', label: 'Homes', icon: Building2 },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'agent', label: 'Agent', icon: User }
  ];

  const sidebarItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'agent', label: 'Real Estate Agent Bio', icon: User },
    { id: 'schedule', label: 'Current Showing Schedule', icon: Calendar },
    { id: 'history', label: 'History', icon: FileText },
    { id: 'saved', label: 'Saved Homes', icon: Building2 },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'profile', label: 'Profile Settings', icon: Settings }
  ];

  const handleNavigate = (section) => {
    navigate(`/client/${section}`);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const header = (
    <div className="flex items-center justify-between p-4">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 rounded-lg bg-brand-gray border border-brand-border touch-feedback"
      >
        <Menu className="w-5 h-5 text-brand-gold" />
      </button>
      <h1 className="font-display text-xl font-semibold text-white">
        {navItems.find(item => item.id === currentPath)?.label || 'Portal'}
      </h1>
      <div className="w-9" /> {/* Spacer for centering */}
    </div>
  );

  const bottomNav = (
    <BottomNav
      items={navItems}
      activeItem={currentPath}
      onNavigate={handleNavigate}
    />
  );

  return (
    <>
      <MobileLayout header={header} bottomNav={bottomNav}>
        <Routes>
          <Route index element={<ClientHome />} />
          <Route path="home" element={<ClientHome />} />
          <Route path="schedule" element={<ClientSchedule />} />
          <Route path="properties" element={<ClientProperties />} />
          <Route path="notes" element={<ClientNotes />} />
          <Route path="agent" element={<ClientAgent />} />
          <Route path="profile" element={<ClientProfile />} />
          <Route path="history" element={<ClientHistory />} />
          <Route path="saved" element={<ClientSavedHomes />} />
        </Routes>
      </MobileLayout>

      {/* Collapsible Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="w-64 h-full bg-brand-gray border-r border-brand-border p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-lg font-semibold text-white">{user?.name}</h2>
                <p className="text-xs text-brand-text">Client Portal</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg bg-brand-dark border border-brand-border touch-feedback"
              >
                <X className="w-4 h-4 text-brand-gold" />
              </button>
            </div>

            {/* Sidebar Menu */}
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all touch-feedback ${
                      isActive
                        ? 'bg-brand-gold/20 border border-brand-gold'
                        : 'bg-brand-dark border border-brand-border hover:border-brand-gold/50'
                    }`}
                  >
                    <Icon
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: isActive ? '#c9a96e' : '#888888' }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: isActive ? '#c9a96e' : '#ffffff' }}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 mt-6 touch-feedback"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientPortal;

import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, Building2, User, LogOut, Plus } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import MobileLayout from '../components/MobileLayout';
import BottomNav from '../components/BottomNav';

// Agent Pages
import AgentHome from '../components/agent/AgentHome';
import AgentClients from '../components/agent/AgentClients';
import AgentSchedules from '../components/agent/AgentSchedules';
import AgentProperties from '../components/agent/AgentProperties';
import AgentProfile from '../components/agent/AgentProfile';
import CreateClient from '../components/agent/CreateClient';
import CreateSchedule from '../components/agent/CreateSchedule';
import CreateProperty from '../components/agent/CreateProperty';
import EditSchedule from '../components/agent/EditSchedule';

const AgentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const currentPath = location.pathname.split('/').pop() || 'home';

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'schedules', label: 'Schedules', icon: Calendar },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const handleNavigate = (section) => {
    navigate(`/agent/${section}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const header = (
    <div className="flex items-center justify-between p-4">
      <div>
        <h1 className="font-display text-xl font-semibold text-white">
          {navItems.find(item => item.id === currentPath)?.label || 'Dashboard'}
        </h1>
        <p className="text-xs text-brand-gold">{user?.name}</p>
      </div>
      <button
        onClick={handleLogout}
        className="p-2 rounded-lg bg-brand-gray border border-brand-border touch-feedback"
      >
        <LogOut className="w-5 h-5 text-brand-text" />
      </button>
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
    <MobileLayout header={header} bottomNav={bottomNav}>
      <Routes>
        <Route index element={<AgentHome />} />
        <Route path="home" element={<AgentHome />} />
        <Route path="clients" element={<AgentClients />} />
        <Route path="clients/new" element={<CreateClient />} />
        <Route path="schedules" element={<AgentSchedules />} />
        <Route path="schedules/new" element={<CreateSchedule />} />
        <Route path="schedules/:id/edit" element={<EditSchedule />} />
        <Route path="properties" element={<AgentProperties />} />
        <Route path="properties/new" element={<CreateProperty />} />
        <Route path="profile" element={<AgentProfile />} />
      </Routes>
    </MobileLayout>
  );
};

export default AgentDashboard;

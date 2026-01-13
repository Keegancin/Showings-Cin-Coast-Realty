import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';

// Auth
import Login from './pages/Login';

// Dashboards
import TeamLeadDashboard from './pages/TeamLeadDashboard';
import AgentDashboard from './pages/AgentDashboard';
import ClientPortal from './pages/ClientPortal';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Router Component
const DashboardRouter = () => {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'team_lead':
      return <Navigate to="/team-lead" replace />;
    case 'agent':
      return <Navigate to="/agent" replace />;
    case 'client':
      return <Navigate to="/client" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<DashboardRouter />} />

        <Route
          path="/team-lead/*"
          element={
            <ProtectedRoute allowedRoles={['team_lead']}>
              <TeamLeadDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agent/*"
          element={
            <ProtectedRoute allowedRoles={['agent']}>
              <AgentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client/*"
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientPortal />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

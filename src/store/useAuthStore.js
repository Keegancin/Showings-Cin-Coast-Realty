import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mock data - In production, this would come from a backend API
const MOCK_USERS = [
  {
    id: '1',
    email: 'Keegan@CinCoastRealty.com',
    password: '6262',
    role: 'team_lead',
    name: 'Keegan',
    title: 'Team Lead & Luxury Specialist',
    phone: '(555) 123-4567',
    bio: 'With over 15 years of experience in luxury real estate, I specialize in helping families find their perfect home.',
    profilePhoto: null,
    teamId: 'team1'
  },
  {
    id: '2',
    email: 'agent@cincoast.com',
    password: 'agent123',
    role: 'agent',
    name: 'Michael Chen',
    title: 'Real Estate Agent',
    phone: '(555) 234-5678',
    bio: 'Dedicated to providing exceptional service and finding the perfect home for my clients.',
    profilePhoto: null,
    teamId: 'team1',
    teamLeadId: '1'
  },
  {
    id: '3',
    email: 'client@example.com',
    password: 'client123',
    role: 'client',
    name: 'Sarah & Michael Johnson',
    phone: '(555) 345-6789',
    email: 'client@example.com',
    profilePhoto: null,
    agentId: '2'
  }
];

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      users: MOCK_USERS,
      isAuthenticated: false,

      login: (email, password) => {
        const user = get().users.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({ user: userWithoutPassword, isAuthenticated: true });
          return { success: true, user: userWithoutPassword };
        }

        return { success: false, error: 'Invalid email or password' };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (updates) => {
        const currentUser = get().user;
        if (!currentUser) return { success: false, error: 'Not authenticated' };

        const updatedUser = { ...currentUser, ...updates };
        const updatedUsers = get().users.map(u =>
          u.id === currentUser.id ? { ...u, ...updates } : u
        );

        set({ user: updatedUser, users: updatedUsers });
        return { success: true, user: updatedUser };
      },

      createAgent: (agentData) => {
        const currentUser = get().user;
        if (currentUser?.role !== 'team_lead') {
          return { success: false, error: 'Unauthorized' };
        }

        const newAgent = {
          id: `agent_${Date.now()}`,
          ...agentData,
          role: 'agent',
          teamId: currentUser.teamId,
          teamLeadId: currentUser.id,
          profilePhoto: null
        };

        set({ users: [...get().users, newAgent] });
        return { success: true, user: newAgent };
      },

      createClient: (clientData) => {
        const currentUser = get().user;
        if (!['team_lead', 'agent'].includes(currentUser?.role)) {
          return { success: false, error: 'Unauthorized' };
        }

        const newClient = {
          id: `client_${Date.now()}`,
          ...clientData,
          role: 'client',
          agentId: currentUser.id,
          profilePhoto: null
        };

        set({ users: [...get().users, newClient] });
        return { success: true, user: newClient };
      },

      getTeamMembers: () => {
        const currentUser = get().user;
        if (currentUser?.role !== 'team_lead') return [];

        return get().users.filter(u =>
          u.teamId === currentUser.teamId && u.role === 'agent'
        );
      },

      getMyClients: () => {
        const currentUser = get().user;
        if (!currentUser) return [];

        if (currentUser.role === 'team_lead') {
          const teamMembers = get().getTeamMembers();
          const memberIds = [currentUser.id, ...teamMembers.map(m => m.id)];
          return get().users.filter(u =>
            u.role === 'client' && memberIds.includes(u.agentId)
          );
        }

        if (currentUser.role === 'agent') {
          return get().users.filter(u =>
            u.role === 'client' && u.agentId === currentUser.id
          );
        }

        return [];
      },

      getAgentById: (agentId) => {
        return get().users.find(u => u.id === agentId);
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;

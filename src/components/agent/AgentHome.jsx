import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Building2, Plus } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useScheduleStore from '../../store/useScheduleStore';
import usePropertyStore from '../../store/usePropertyStore';

const AgentHome = () => {
  const navigate = useNavigate();
  const { user, getMyClients } = useAuthStore();
  const { getSchedulesByAgent } = useScheduleStore();
  const { properties } = usePropertyStore();

  const clients = getMyClients();
  const schedules = getSchedulesByAgent(user?.id);
  const upcomingSchedules = schedules.filter(s => s.status === 'scheduled');

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Welcome Section */}
      <div className="rounded-xl p-4 gold-gradient">
        <h2 className="font-display text-2xl font-semibold text-brand-dark mb-2">
          Welcome Back!
        </h2>
        <p className="text-sm text-brand-dark/80">
          You have {clients.length} active {clients.length === 1 ? 'client' : 'clients'} and {upcomingSchedules.length} upcoming {upcomingSchedules.length === 1 ? 'showing' : 'showings'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg p-3 text-center bg-brand-gray border border-brand-border">
          <p className="font-display text-2xl font-semibold text-brand-gold">{clients.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-brand-text">Clients</p>
        </div>
        <div className="rounded-lg p-3 text-center bg-brand-gray border border-brand-border">
          <p className="font-display text-2xl font-semibold text-brand-gold">{upcomingSchedules.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-brand-text">Showings</p>
        </div>
        <div className="rounded-lg p-3 text-center bg-brand-gray border border-brand-border">
          <p className="font-display text-2xl font-semibold text-brand-gold">{properties.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-brand-text">Properties</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="font-display text-lg font-semibold text-white mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/agent/clients/new')}
            className="p-4 rounded-xl bg-brand-gray border border-brand-border text-left touch-feedback"
          >
            <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center mb-2">
              <Plus className="w-5 h-5 text-brand-gold" />
            </div>
            <p className="text-sm font-medium text-white">New Client</p>
            <p className="text-xs text-brand-text mt-1">Add a client</p>
          </button>

          <button
            onClick={() => navigate('/agent/schedules/new')}
            className="p-4 rounded-xl bg-brand-gray border border-brand-border text-left touch-feedback"
          >
            <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 text-brand-gold" />
            </div>
            <p className="text-sm font-medium text-white">New Schedule</p>
            <p className="text-xs text-brand-text mt-1">Create showing</p>
          </button>

          <button
            onClick={() => navigate('/agent/properties/new')}
            className="p-4 rounded-xl bg-brand-gray border border-brand-border text-left touch-feedback"
          >
            <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center mb-2">
              <Building2 className="w-5 h-5 text-brand-gold" />
            </div>
            <p className="text-sm font-medium text-white">New Property</p>
            <p className="text-xs text-brand-text mt-1">Add listing</p>
          </button>

          <button
            onClick={() => navigate('/agent/clients')}
            className="p-4 rounded-xl bg-brand-gray border border-brand-border text-left touch-feedback"
          >
            <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-brand-gold" />
            </div>
            <p className="text-sm font-medium text-white">View Clients</p>
            <p className="text-xs text-brand-text mt-1">Manage clients</p>
          </button>
        </div>
      </div>

      {/* Recent Clients */}
      {clients.length > 0 && (
        <div>
          <h3 className="font-display text-lg font-semibold text-white mb-3">Recent Clients</h3>
          <div className="space-y-2">
            {clients.slice(0, 3).map((client) => {
              const clientSchedules = schedules.filter(s => s.clientId === client.id);

              return (
                <div
                  key={client.id}
                  onClick={() => navigate('/agent/clients')}
                  className="flex items-center justify-between p-3 rounded-lg bg-brand-gray border border-brand-border touch-feedback"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-brand-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{client.name}</p>
                      <p className="text-xs text-brand-text">{clientSchedules.length} schedules</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentHome;

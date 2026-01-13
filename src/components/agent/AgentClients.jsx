import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Calendar, Mail, Phone } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useScheduleStore from '../../store/useScheduleStore';

const AgentClients = () => {
  const navigate = useNavigate();
  const { getMyClients } = useAuthStore();
  const { getSchedulesByClient } = useScheduleStore();

  const clients = getMyClients();

  if (clients.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <Users className="w-16 h-16 text-brand-gold mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-white mb-2">No Clients Yet</h3>
          <p className="text-sm text-brand-text mb-4">
            Start by adding your first client
          </p>
          <button
            onClick={() => navigate('/agent/clients/new')}
            className="px-6 py-3 gold-gradient text-brand-dark font-medium rounded-lg touch-feedback"
          >
            Add Client
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-white">My Clients</h2>
          <p className="text-sm text-brand-text">{clients.length} total</p>
        </div>
        <button
          onClick={() => navigate('/agent/clients/new')}
          className="p-3 rounded-lg gold-gradient text-brand-dark touch-feedback"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {clients.map((client) => {
          const schedules = getSchedulesByClient(client.id);
          const upcomingSchedules = schedules.filter(s => s.status === 'scheduled');

          return (
            <div
              key={client.id}
              className="rounded-xl p-4 bg-brand-gray border border-brand-border"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold text-white">{client.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-brand-gold/20 text-brand-gold">
                      {schedules.length} {schedules.length === 1 ? 'schedule' : 'schedules'}
                    </span>
                    {upcomingSchedules.length > 0 && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-green-500/20 text-green-400">
                        {upcomingSchedules.length} upcoming
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                {client.email && (
                  <a
                    href={`mailto:${client.email}`}
                    className="flex items-center gap-2 text-xs text-brand-text-light"
                  >
                    <Mail className="w-3 h-3" />
                    {client.email}
                  </a>
                )}
                {client.phone && (
                  <a
                    href={`tel:${client.phone}`}
                    className="flex items-center gap-2 text-xs text-brand-text-light"
                  >
                    <Phone className="w-3 h-3" />
                    {client.phone}
                  </a>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/agent/schedules/new', { state: { clientId: client.id } })}
                  className="flex-1 py-2 px-3 rounded-lg bg-brand-gold/20 border border-brand-gold text-brand-gold text-xs font-medium touch-feedback flex items-center justify-center gap-1"
                >
                  <Calendar className="w-3 h-3" />
                  New Schedule
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentClients;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Mail, Phone, UserPlus } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useScheduleStore from '../../store/useScheduleStore';

const TeamLeadTeam = () => {
  const navigate = useNavigate();
  const { getTeamMembers, getMyClients } = useAuthStore();
  const { getSchedulesByAgent } = useScheduleStore();

  const teamMembers = getTeamMembers();
  const allClients = getMyClients();

  if (teamMembers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <Users className="w-16 h-16 text-brand-gold mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-white mb-2">No Team Members Yet</h3>
          <p className="text-sm text-brand-text mb-4">
            Start building your team by adding agents
          </p>
          <button
            onClick={() => navigate('/team-lead/team/new')}
            className="px-6 py-3 gold-gradient text-brand-dark font-medium rounded-lg touch-feedback flex items-center gap-2 mx-auto"
          >
            <UserPlus className="w-5 h-5" />
            Add Agent
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-white">Team Members</h2>
          <p className="text-sm text-brand-text">{teamMembers.length} agents</p>
        </div>
        <button
          onClick={() => navigate('/team-lead/team/new')}
          className="p-3 rounded-lg gold-gradient text-brand-dark touch-feedback"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {teamMembers.map((agent) => {
          const agentClients = allClients.filter(c => c.agentId === agent.id);
          const agentSchedules = getSchedulesByAgent(agent.id);

          return (
            <div
              key={agent.id}
              className="rounded-xl p-4 bg-brand-gray border border-brand-border"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-brand-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold text-white">{agent.name}</h3>
                  <p className="text-sm text-brand-text">{agent.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-brand-gold/20 text-brand-gold">
                      {agentClients.length} {agentClients.length === 1 ? 'client' : 'clients'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-brand-text/20 text-brand-text">
                      {agentSchedules.length} {agentSchedules.length === 1 ? 'schedule' : 'schedules'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-3 pt-3 border-t border-brand-border">
                {agent.email && (
                  <a
                    href={`mailto:${agent.email}`}
                    className="flex items-center gap-2 text-xs text-brand-text-light"
                  >
                    <Mail className="w-3 h-3" />
                    {agent.email}
                  </a>
                )}
                {agent.phone && (
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex items-center gap-2 text-xs text-brand-text-light"
                  >
                    <Phone className="w-3 h-3" />
                    {agent.phone}
                  </a>
                )}
              </div>

              {/* Agent's Clients */}
              {agentClients.length > 0 && (
                <div className="pt-3 border-t border-brand-border">
                  <p className="text-xs uppercase tracking-wider text-brand-text mb-2">Clients</p>
                  <div className="space-y-1">
                    {agentClients.slice(0, 3).map((client) => (
                      <div key={client.id} className="flex items-center gap-2 text-xs text-brand-text-light">
                        <div className="w-1 h-1 rounded-full bg-brand-gold"></div>
                        <span>{client.name}</span>
                      </div>
                    ))}
                    {agentClients.length > 3 && (
                      <p className="text-xs text-brand-text italic">+{agentClients.length - 3} more</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamLeadTeam;

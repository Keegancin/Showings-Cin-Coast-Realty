import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Building2, Plus, UserPlus, TrendingUp } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useScheduleStore from '../../store/useScheduleStore';
import usePropertyStore from '../../store/usePropertyStore';

const TeamLeadHome = () => {
  const navigate = useNavigate();
  const { user, getMyClients, getTeamMembers } = useAuthStore();
  const { schedules } = useScheduleStore();
  const { properties } = usePropertyStore();

  const teamMembers = getTeamMembers();
  const allClients = getMyClients();
  const upcomingSchedules = schedules.filter(s => s.status === 'scheduled');

  // Calculate team metrics
  const totalClientsShared = allClients.length;
  const teamSchedules = schedules.length;

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Welcome Section */}
      <div className="rounded-xl p-4 gold-gradient">
        <h2 className="font-display text-2xl font-semibold text-brand-dark mb-2">
          Team Dashboard
        </h2>
        <p className="text-sm text-brand-dark/80">
          Managing {teamMembers.length} {teamMembers.length === 1 ? 'agent' : 'agents'} with {totalClientsShared} total {totalClientsShared === 1 ? 'client' : 'clients'}
        </p>
      </div>

      {/* Team Overview Stats */}
      <div>
        <h3 className="font-display text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand-gold" />
          Team Overview
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg p-3 text-center bg-brand-gray border border-brand-border">
            <p className="font-display text-2xl font-semibold text-brand-gold">{teamMembers.length}</p>
            <p className="text-[10px] uppercase tracking-wider text-brand-text">Team Members</p>
          </div>
          <div className="rounded-lg p-3 text-center bg-brand-gray border border-brand-border">
            <p className="font-display text-2xl font-semibold text-brand-gold">{totalClientsShared}</p>
            <p className="text-[10px] uppercase tracking-wider text-brand-text">Total Clients</p>
          </div>
          <div className="rounded-lg p-3 text-center bg-brand-gray border border-brand-border">
            <p className="font-display text-2xl font-semibold text-brand-gold">{upcomingSchedules.length}</p>
            <p className="text-[10px] uppercase tracking-wider text-brand-text">Active Showings</p>
          </div>
          <div className="rounded-lg p-3 text-center bg-brand-gray border border-brand-border">
            <p className="font-display text-2xl font-semibold text-brand-gold">{properties.length}</p>
            <p className="text-[10px] uppercase tracking-wider text-brand-text">Properties</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="font-display text-lg font-semibold text-white mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/team-lead/team/new')}
            className="p-4 rounded-xl bg-brand-gray border-2 border-brand-gold text-left touch-feedback"
          >
            <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center mb-2">
              <UserPlus className="w-5 h-5 text-brand-dark" />
            </div>
            <p className="text-sm font-medium text-white">Add Agent</p>
            <p className="text-xs text-brand-text mt-1">Create new team member</p>
          </button>

          <button
            onClick={() => navigate('/team-lead/clients/new')}
            className="p-4 rounded-xl bg-brand-gray border border-brand-border text-left touch-feedback"
          >
            <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center mb-2">
              <Plus className="w-5 h-5 text-brand-gold" />
            </div>
            <p className="text-sm font-medium text-white">New Client</p>
            <p className="text-xs text-brand-text mt-1">Add a client</p>
          </button>

          <button
            onClick={() => navigate('/team-lead/schedules/new')}
            className="p-4 rounded-xl bg-brand-gray border border-brand-border text-left touch-feedback"
          >
            <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 text-brand-gold" />
            </div>
            <p className="text-sm font-medium text-white">New Schedule</p>
            <p className="text-xs text-brand-text mt-1">Create showing</p>
          </button>

          <button
            onClick={() => navigate('/team-lead/properties/new')}
            className="p-4 rounded-xl bg-brand-gray border border-brand-border text-left touch-feedback"
          >
            <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center mb-2">
              <Building2 className="w-5 h-5 text-brand-gold" />
            </div>
            <p className="text-sm font-medium text-white">New Property</p>
            <p className="text-xs text-brand-text mt-1">Add listing</p>
          </button>
        </div>
      </div>

      {/* Team Members Preview */}
      {teamMembers.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-lg font-semibold text-white">Team Members</h3>
            <button
              onClick={() => navigate('/team-lead/team')}
              className="text-xs text-brand-gold"
            >
              View All
            </button>
          </div>
          <div className="space-y-2">
            {teamMembers.slice(0, 3).map((agent) => {
              const agentClients = allClients.filter(c => c.agentId === agent.id);

              return (
                <div
                  key={agent.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-brand-gray border border-brand-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-brand-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{agent.name}</p>
                      <p className="text-xs text-brand-text">{agentClients.length} clients</p>
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

export default TeamLeadHome;

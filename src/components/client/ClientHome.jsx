import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Calendar, CheckCircle } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useScheduleStore from '../../store/useScheduleStore';
import { format } from 'date-fns';

const ClientHome = () => {
  const navigate = useNavigate();
  const { user, getAgentById } = useAuthStore();
  const { getCurrentSchedule } = useScheduleStore();

  const currentSchedule = getCurrentSchedule(user?.id);
  const agent = getAgentById(user?.agentId);

  return (
    <div className="px-4 py-6 space-y-4">
      {/* Welcome Header */}
      <div className="relative h-48 overflow-hidden rounded-xl">
        <div className="absolute inset-0 gold-gradient opacity-20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full gold-gradient flex items-center justify-center">
              <Home className="w-8 h-8 text-brand-dark" />
            </div>
            <p className="text-xs tracking-widest uppercase mb-1.5 text-brand-gold">Your Exclusive</p>
            <h1 className="font-display text-3xl font-semibold text-white">House Tour Guide</h1>
          </div>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="rounded-xl p-4 bg-brand-gray border border-brand-border animate-slide-up">
        <p className="text-xs uppercase tracking-widest mb-1 text-brand-gold">Welcome Back</p>
        <h2 className="font-display text-xl font-semibold mb-3 text-white">{user?.name}</h2>

        {currentSchedule && (
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-brand-dark" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-brand-text">Next Tour Date</p>
              <p className="text-sm font-medium text-white">
                {format(new Date(currentSchedule.date), 'EEEE, MMMM do, yyyy')}
              </p>
            </div>
          </div>
        )}

        {agent && (
          <div className="pt-3 border-t border-brand-border">
            <p className="text-xs leading-relaxed text-brand-text-light">
              {agent.bio || 'Your dedicated real estate agent is here to help you find your dream home.'}
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {currentSchedule && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg p-3 text-center bg-brand-gray border border-brand-border animate-slide-up">
            <p className="font-display text-2xl font-semibold text-brand-gold">
              {currentSchedule.items.filter(item => item.type === 'showing').length}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-brand-text">Properties</p>
          </div>
          <div className="rounded-lg p-3 text-center bg-brand-gray border border-brand-border animate-slide-up">
            <p className="font-display text-2xl font-semibold text-brand-gold">
              {Math.round(currentSchedule.items.reduce((sum, item) => sum + (item.duration || 0), 0) / 60)}hrs
            </p>
            <p className="text-[10px] uppercase tracking-wider text-brand-text">Est. Duration</p>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="rounded-lg p-4 bg-brand-gray border border-brand-border animate-slide-up">
        <h3 className="font-display text-base font-semibold mb-2 text-white">Quick Tips</h3>
        <ul className="space-y-1.5 text-xs text-brand-text-light">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-brand-gold mt-0.5 flex-shrink-0" />
            <span>Take photos & notes for each property</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-brand-gold mt-0.5 flex-shrink-0" />
            <span>Check water pressure & outlets</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-brand-gold mt-0.5 flex-shrink-0" />
            <span>Notice natural lighting</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-brand-gold mt-0.5 flex-shrink-0" />
            <span>Ask about neighborhood & HOA</span>
          </li>
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/client/schedule')}
          className="p-4 rounded-xl bg-brand-gold text-brand-dark font-medium touch-feedback"
        >
          View Schedule
        </button>
        <button
          onClick={() => navigate('/client/properties')}
          className="p-4 rounded-xl bg-brand-gray border border-brand-border text-white font-medium touch-feedback"
        >
          Browse Homes
        </button>
      </div>
    </div>
  );
};

export default ClientHome;

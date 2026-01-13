import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, Edit2, MapPin } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useScheduleStore from '../../store/useScheduleStore';
import usePropertyStore from '../../store/usePropertyStore';
import { format } from 'date-fns';

const AgentSchedules = () => {
  const navigate = useNavigate();
  const { user, getMyClients } = useAuthStore();
  const { getSchedulesByAgent } = useScheduleStore();
  const { getPropertyById } = usePropertyStore();

  const schedules = getSchedulesByAgent(user?.id);
  const clients = getMyClients();

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Unknown Client';
  };

  if (schedules.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-brand-gold mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-white mb-2">No Schedules Yet</h3>
          <p className="text-sm text-brand-text mb-4">
            Create your first showing schedule
          </p>
          <button
            onClick={() => navigate('/agent/schedules/new')}
            className="px-6 py-3 gold-gradient text-brand-dark font-medium rounded-lg touch-feedback"
          >
            Create Schedule
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-white">Showing Schedules</h2>
          <p className="text-sm text-brand-text">{schedules.length} total</p>
        </div>
        <button
          onClick={() => navigate('/agent/schedules/new')}
          className="p-3 rounded-lg gold-gradient text-brand-dark touch-feedback"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {schedules.map((schedule) => {
          const showingCount = schedule.items.filter(item => item.type === 'showing').length;

          return (
            <div
              key={schedule.id}
              className="rounded-xl p-4 bg-brand-gray border border-brand-border"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold text-white">
                    {getClientName(schedule.clientId)}
                  </h3>
                  <p className="text-sm text-brand-text mt-1">
                    {format(new Date(schedule.date), 'EEEE, MMMM do, yyyy')}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-brand-gold/20 text-brand-gold">
                      {showingCount} {showingCount === 1 ? 'property' : 'properties'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      schedule.status === 'scheduled'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-brand-text/20 text-brand-text'
                    }`}>
                      {schedule.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1 mb-3 max-h-24 overflow-y-auto">
                {schedule.items
                  .filter(item => item.type === 'showing')
                  .slice(0, 3)
                  .map((item) => {
                    const property = getPropertyById(item.propertyId);
                    if (!property) return null;

                    return (
                      <div key={item.id} className="flex items-center gap-2 text-xs text-brand-text-light">
                        <MapPin className="w-3 h-3 text-brand-gold flex-shrink-0" />
                        <span className="truncate">{property.address}</span>
                      </div>
                    );
                  })}
                {showingCount > 3 && (
                  <p className="text-xs text-brand-text italic">+{showingCount - 3} more</p>
                )}
              </div>

              <button
                onClick={() => navigate(`/agent/schedules/${schedule.id}/edit`)}
                className="w-full py-2 px-3 rounded-lg bg-brand-gold/20 border border-brand-gold text-brand-gold text-xs font-medium touch-feedback flex items-center justify-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                Edit Schedule
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentSchedules;

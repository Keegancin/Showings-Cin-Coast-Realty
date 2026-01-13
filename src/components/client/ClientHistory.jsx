import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useScheduleStore from '../../store/useScheduleStore';
import usePropertyStore from '../../store/usePropertyStore';
import { format } from 'date-fns';

const ClientHistory = () => {
  const { user } = useAuthStore();
  const { getPastSchedules } = useScheduleStore();
  const { getPropertyById } = usePropertyStore();

  const pastSchedules = getPastSchedules(user?.id);

  if (pastSchedules.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-brand-gold mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-white mb-2">No History Yet</h3>
          <p className="text-sm text-brand-text">
            Completed showing schedules will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-4 space-y-4">
      <div className="mb-4">
        <h2 className="font-display text-2xl font-semibold text-white mb-2">Showing History</h2>
        <p className="text-sm text-brand-text">Previous property tours</p>
      </div>

      <div className="space-y-4">
        {pastSchedules.map((schedule) => {
          const showingCount = schedule.items.filter(item => item.type === 'showing').length;

          return (
            <div key={schedule.id} className="rounded-xl p-4 bg-brand-gray border border-brand-border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">
                    {format(new Date(schedule.date), 'MMMM do, yyyy')}
                  </h3>
                  <p className="text-xs text-brand-text mt-1">
                    {showingCount} {showingCount === 1 ? 'property' : 'properties'} viewed
                  </p>
                </div>
                <div className="px-2 py-1 rounded bg-brand-gold/20 border border-brand-gold">
                  <span className="text-xs text-brand-gold font-medium">
                    {schedule.status === 'completed' ? 'Completed' : 'Past'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {schedule.items
                  .filter(item => item.type === 'showing')
                  .map((item) => {
                    const property = getPropertyById(item.propertyId);
                    if (!property) return null;

                    return (
                      <div key={item.id} className="flex items-center gap-2 text-xs text-brand-text-light">
                        <MapPin className="w-3 h-3 text-brand-gold flex-shrink-0" />
                        <span>{property.address}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientHistory;

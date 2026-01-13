import React from 'react';
import { Calendar, Clock, MapPin, Coffee } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useScheduleStore from '../../store/useScheduleStore';
import usePropertyStore from '../../store/usePropertyStore';
import { format } from 'date-fns';

const ClientSchedule = () => {
  const { user } = useAuthStore();
  const { getCurrentSchedule } = useScheduleStore();
  const { getPropertyById } = usePropertyStore();

  const schedule = getCurrentSchedule(user?.id);

  if (!schedule) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-brand-gold mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-white mb-2">No Upcoming Tours</h3>
          <p className="text-sm text-brand-text">
            Your next showing schedule will appear here.
          </p>
        </div>
      </div>
    );
  }

  const getItemDetails = (item) => {
    if (item.type === 'showing') {
      const property = getPropertyById(item.propertyId);
      return {
        title: property?.address || 'Property',
        subtitle: property ? `${property.beds} bed • ${property.baths} bath • $${(property.price / 1000).toFixed(0)}K` : '',
        icon: MapPin
      };
    }

    if (item.type === 'break') {
      return {
        title: item.title || 'Break',
        subtitle: item.notes || '',
        icon: Coffee
      };
    }

    return {
      title: item.title || 'Event',
      subtitle: item.location || item.notes || '',
      icon: MapPin
    };
  };

  return (
    <div className="px-4 pt-6 pb-4 space-y-4">
      {/* Date Header */}
      <div className="bg-brand-gray border border-brand-border rounded-xl p-4">
        <p className="text-xs uppercase tracking-wider text-brand-gold mb-1">Tour Date</p>
        <h2 className="font-display text-xl font-semibold text-white">
          {format(new Date(schedule.date), 'EEEE, MMMM do, yyyy')}
        </h2>
      </div>

      {/* Schedule Items */}
      <div className="space-y-3">
        {schedule.items.map((item, index) => {
          const details = getItemDetails(item);
          const Icon = details.icon;

          return (
            <div
              key={item.id}
              className={`rounded-lg p-3 bg-brand-gray border transition-all touch-feedback ${
                item.type === 'break' ? 'border-brand-gold' : 'border-brand-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-14 text-center flex-shrink-0">
                  <p className="font-display text-lg font-semibold text-brand-gold">{item.time}</p>
                  <p className="text-[10px] text-brand-text">
                    {parseInt(item.time.split(':')[0]) >= 12 ? 'PM' : 'AM'}
                  </p>
                </div>

                <div className="flex-1 border-l-2 border-brand-gold pl-3">
                  <div className="flex items-start gap-2">
                    <Icon className="w-4 h-4 text-brand-gold mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{details.title}</p>
                      {details.subtitle && (
                        <p className="text-xs text-brand-text mt-0.5">{details.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mt-1.5">
                    <Clock className="w-3 h-3 text-brand-text" />
                    <span className="text-[10px] text-brand-text">{item.duration} min</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {schedule.notes && (
        <div className="bg-brand-gray border border-brand-border rounded-xl p-4">
          <p className="text-xs uppercase tracking-wider text-brand-gold mb-2">Notes</p>
          <p className="text-sm text-brand-text-light">{schedule.notes}</p>
        </div>
      )}
    </div>
  );
};

export default ClientSchedule;

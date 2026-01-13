import React from 'react';
import { Star } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import usePropertyStore from '../../store/usePropertyStore';
import useScheduleStore from '../../store/useScheduleStore';

const ClientNotes = () => {
  const { user } = useAuthStore();
  const { properties } = usePropertyStore();
  const { setPropertyNote, getPropertyNote, setPropertyRating, getPropertyRating } = useScheduleStore();

  const handleNoteChange = (propertyId, note) => {
    setPropertyNote(user?.id, propertyId, note);
  };

  const handleRatingClick = (propertyId, rating) => {
    setPropertyRating(user?.id, propertyId, rating);
  };

  return (
    <div className="px-4 pt-6 pb-4 space-y-4">
      <div className="mb-4">
        <h2 className="font-display text-2xl font-semibold text-white mb-2">Property Notes</h2>
        <p className="text-sm text-brand-text">Rate and add notes for each property</p>
      </div>

      <div className="space-y-3">
        {properties.map((property) => {
          const currentRating = getPropertyRating(user?.id, property.id);
          const currentNote = getPropertyNote(user?.id, property.id);

          return (
            <div key={property.id} className="rounded-xl p-3 bg-brand-gray border border-brand-border">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-base font-semibold text-white">{property.address}</h3>
                  <p className="text-xs text-brand-text">{property.neighborhood}</p>
                </div>
                <span className="font-display text-sm font-semibold text-brand-gold ml-2 flex-shrink-0">
                  ${(property.price / 1000).toFixed(0)}K
                </span>
              </div>

              <div className="mb-2">
                <p className="text-[10px] uppercase tracking-wider text-brand-text mb-1.5">Your Rating</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingClick(property.id, star)}
                      className="touch-feedback"
                    >
                      <Star
                        className="w-6 h-6 transition-colors"
                        fill={star <= currentRating ? '#c9a96e' : 'none'}
                        stroke={star <= currentRating ? '#c9a96e' : '#2a2a2a'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor={`notes-${property.id}`}
                  className="text-[10px] uppercase tracking-wider text-brand-text mb-1.5 block"
                >
                  Notes
                </label>
                <textarea
                  id={`notes-${property.id}`}
                  value={currentNote}
                  onChange={(e) => handleNoteChange(property.id, e.target.value)}
                  placeholder="Add your thoughts..."
                  className="w-full rounded-lg p-2.5 text-xs resize-none bg-brand-dark border border-brand-border text-white focus:outline-none focus:border-brand-gold transition-colors"
                  style={{ minHeight: '70px' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientNotes;

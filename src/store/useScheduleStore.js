import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const INITIAL_SCHEDULES = [
  {
    id: '1',
    clientId: '3',
    agentId: '2',
    date: '2026-01-15',
    status: 'scheduled',
    items: [
      { id: 'item1', type: 'meeting', time: '9:00', duration: 30, location: '123 Main Street', title: 'Meet at Office' },
      { id: 'item2', type: 'showing', time: '9:30', duration: 30, propertyId: '1' },
      { id: 'item3', type: 'showing', time: '10:15', duration: 30, propertyId: '2' },
      { id: 'item4', type: 'showing', time: '11:00', duration: 45, propertyId: '3' },
      { id: 'item5', type: 'break', time: '12:00', duration: 60, title: 'Lunch Break', notes: 'Discussion & Questions' },
      { id: 'item6', type: 'showing', time: '13:00', duration: 30, propertyId: '4' },
      { id: 'item7', type: 'showing', time: '13:45', duration: 30, propertyId: '5' }
    ],
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const useScheduleStore = create(
  persist(
    (set, get) => ({
      schedules: INITIAL_SCHEDULES,
      propertyNotes: {},
      propertyRatings: {},

      createSchedule: (scheduleData) => {
        const newSchedule = {
          id: `schedule_${Date.now()}`,
          ...scheduleData,
          status: 'scheduled',
          items: scheduleData.items || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set({ schedules: [...get().schedules, newSchedule] });
        return { success: true, schedule: newSchedule };
      },

      updateSchedule: (scheduleId, updates) => {
        const updated = get().schedules.map(s =>
          s.id === scheduleId
            ? { ...s, ...updates, updatedAt: new Date().toISOString() }
            : s
        );
        set({ schedules: updated });
        return { success: true };
      },

      updateScheduleItems: (scheduleId, items) => {
        return get().updateSchedule(scheduleId, { items });
      },

      deleteSchedule: (scheduleId) => {
        set({ schedules: get().schedules.filter(s => s.id !== scheduleId) });
        return { success: true };
      },

      getScheduleById: (scheduleId) => {
        return get().schedules.find(s => s.id === scheduleId);
      },

      getSchedulesByClient: (clientId) => {
        return get().schedules.filter(s => s.clientId === clientId);
      },

      getSchedulesByAgent: (agentId) => {
        return get().schedules.filter(s => s.agentId === agentId);
      },

      getCurrentSchedule: (clientId) => {
        const now = new Date();
        return get().schedules.find(s =>
          s.clientId === clientId &&
          s.status === 'scheduled' &&
          new Date(s.date) >= now
        );
      },

      getPastSchedules: (clientId) => {
        const now = new Date();
        return get().schedules.filter(s =>
          s.clientId === clientId &&
          (s.status === 'completed' || new Date(s.date) < now)
        );
      },

      setPropertyNote: (clientId, propertyId, note) => {
        const key = `${clientId}_${propertyId}`;
        set({
          propertyNotes: {
            ...get().propertyNotes,
            [key]: note
          }
        });
      },

      getPropertyNote: (clientId, propertyId) => {
        const key = `${clientId}_${propertyId}`;
        return get().propertyNotes[key] || '';
      },

      setPropertyRating: (clientId, propertyId, rating) => {
        const key = `${clientId}_${propertyId}`;
        set({
          propertyRatings: {
            ...get().propertyRatings,
            [key]: rating
          }
        });
      },

      getPropertyRating: (clientId, propertyId) => {
        const key = `${clientId}_${propertyId}`;
        return get().propertyRatings[key] || 0;
      }
    }),
    {
      name: 'schedule-storage'
    }
  )
);

export default useScheduleStore;

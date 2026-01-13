import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, Plus, GripVertical, X } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useAuthStore from '../../store/useAuthStore';
import useScheduleStore from '../../store/useScheduleStore';
import usePropertyStore from '../../store/usePropertyStore';

const SortableItem = ({ id, item, property, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getItemDisplay = () => {
    if (item.type === 'showing' && property) {
      return {
        title: property.address,
        subtitle: `${property.beds} bed • ${property.baths} bath • $${(property.price / 1000).toFixed(0)}K`
      };
    }
    return {
      title: item.title || 'Event',
      subtitle: item.location || item.notes || ''
    };
  };

  const display = getItemDisplay();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-3 rounded-lg bg-brand-gray border border-brand-border"
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-feedback">
        <GripVertical className="w-5 h-5 text-brand-text" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{display.title}</p>
        {display.subtitle && <p className="text-xs text-brand-text truncate">{display.subtitle}</p>}
        <p className="text-xs text-brand-text mt-1">{item.time} • {item.duration} min</p>
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="p-1.5 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 touch-feedback"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const CreateSchedule = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getMyClients } = useAuthStore();
  const { createSchedule } = useScheduleStore();
  const { properties } = usePropertyStore();

  const clients = getMyClients();
  const preselectedClientId = location.state?.clientId;

  const [formData, setFormData] = useState({
    clientId: preselectedClientId || '',
    date: '',
    notes: ''
  });

  const [items, setItems] = useState([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({
    type: 'showing',
    propertyId: '',
    time: '09:00',
    duration: 30,
    title: '',
    location: '',
    notes: ''
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddItem = () => {
    const item = {
      id: `item_${Date.now()}`,
      ...newItem
    };
    setItems([...items, item]);
    setNewItem({
      type: 'showing',
      propertyId: '',
      time: '09:00',
      duration: 30,
      title: '',
      location: '',
      notes: ''
    });
    setShowAddItem(false);
  };

  const handleRemoveItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (items.length === 0) {
      alert('Please add at least one item to the schedule');
      return;
    }

    const result = createSchedule({
      ...formData,
      agentId: user?.id,
      items
    });

    if (result.success) {
      navigate('/agent/schedules');
    }
  };

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/agent/schedules')}
          className="p-2 rounded-lg bg-brand-gray border border-brand-border touch-feedback"
        >
          <ArrowLeft className="w-5 h-5 text-brand-gold" />
        </button>
        <h2 className="font-display text-2xl font-semibold text-white">New Schedule</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="clientId" className="block text-xs uppercase tracking-wider text-brand-text mb-2">
            Client *
          </label>
          <select
            id="clientId"
            value={formData.clientId}
            onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
            className="w-full bg-brand-gray border border-brand-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
            required
          >
            <option value="">Select a client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-xs uppercase tracking-wider text-brand-text mb-2">
            Tour Date *
          </label>
          <input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full bg-brand-gray border border-brand-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
            required
          />
        </div>

        {/* Schedule Items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs uppercase tracking-wider text-brand-text">
              Schedule Items ({items.length})
            </label>
            <button
              type="button"
              onClick={() => setShowAddItem(!showAddItem)}
              className="px-3 py-1.5 rounded-lg bg-brand-gold/20 border border-brand-gold text-brand-gold text-xs font-medium touch-feedback flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Add Item
            </button>
          </div>

          {/* Add Item Form */}
          {showAddItem && (
            <div className="mb-3 p-4 rounded-lg bg-brand-dark border border-brand-border space-y-3">
              <div>
                <label className="block text-xs text-brand-text mb-1">Type</label>
                <select
                  value={newItem.type}
                  onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full bg-brand-gray border border-brand-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-gold"
                >
                  <option value="showing">Property Showing</option>
                  <option value="meeting">Meeting</option>
                  <option value="break">Break</option>
                </select>
              </div>

              {newItem.type === 'showing' ? (
                <div>
                  <label className="block text-xs text-brand-text mb-1">Property</label>
                  <select
                    value={newItem.propertyId}
                    onChange={(e) => setNewItem(prev => ({ ...prev, propertyId: e.target.value }))}
                    className="w-full bg-brand-gray border border-brand-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-gold"
                    required
                  >
                    <option value="">Select property</option>
                    {properties.map(prop => (
                      <option key={prop.id} value={prop.id}>{prop.address}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs text-brand-text mb-1">Title</label>
                  <input
                    type="text"
                    value={newItem.title}
                    onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-brand-gray border border-brand-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-gold"
                    placeholder="e.g., Lunch Break"
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-brand-text mb-1">Time</label>
                  <input
                    type="time"
                    value={newItem.time}
                    onChange={(e) => setNewItem(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full bg-brand-gray border border-brand-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-gold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-brand-text mb-1">Duration (min)</label>
                  <input
                    type="number"
                    value={newItem.duration}
                    onChange={(e) => setNewItem(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className="w-full bg-brand-gray border border-brand-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-gold"
                    min="15"
                    step="15"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex-1 py-2 px-3 rounded-lg bg-brand-gold text-brand-dark text-xs font-medium touch-feedback"
                >
                  Add to Schedule
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddItem(false)}
                  className="px-3 py-2 rounded-lg bg-brand-gray border border-brand-border text-white text-xs touch-feedback"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Sortable Items List */}
          {items.length > 0 ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {items.map((item) => {
                    const property = item.propertyId ? properties.find(p => p.id === item.propertyId) : null;
                    return (
                      <SortableItem
                        key={item.id}
                        id={item.id}
                        item={item}
                        property={property}
                        onRemove={handleRemoveItem}
                      />
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="text-center py-8 text-brand-text text-sm">
              No items added yet. Click "Add Item" to start building the schedule.
            </div>
          )}
        </div>

        <div>
          <label htmlFor="notes" className="block text-xs uppercase tracking-wider text-brand-text mb-2">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full bg-brand-gray border border-brand-border rounded-lg px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-brand-gold transition-colors"
            rows="3"
            placeholder="Additional notes or instructions..."
          />
        </div>

        <button
          type="submit"
          className="w-full gold-gradient text-brand-dark font-medium py-3 rounded-lg flex items-center justify-center gap-2 touch-feedback"
        >
          <Save className="w-4 h-4" />
          Create Schedule
        </button>
      </form>
    </div>
  );
};

export default CreateSchedule;

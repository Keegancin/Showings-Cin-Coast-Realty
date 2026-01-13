import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mock property data
const INITIAL_PROPERTIES = [
  {
    id: '1',
    address: '456 Oak Avenue',
    neighborhood: 'Westside Heights',
    price: 725000,
    beds: 4,
    baths: 3,
    sqft: 2450,
    highlights: 'Updated kitchen, large backyard, close to schools, new HVAC',
    photos: [],
    mlsNumber: 'MLS12345',
    createdBy: '2',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    address: '789 Maple Drive',
    neighborhood: 'Downtown District',
    price: 650000,
    beds: 3,
    baths: 2.5,
    sqft: 1850,
    highlights: 'Modern townhouse, rooftop deck, walkable to shops, 2-car garage',
    photos: [],
    mlsNumber: 'MLS12346',
    createdBy: '2',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    address: '321 Pine Street',
    neighborhood: 'Lakewood Estates',
    price: 895000,
    beds: 5,
    baths: 4,
    sqft: 3200,
    highlights: 'Pool & spa, chef\'s kitchen, home office, lake views, gated community',
    photos: [],
    mlsNumber: 'MLS12347',
    createdBy: '2',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    address: '555 Cedar Lane',
    neighborhood: 'Riverside Park',
    price: 785000,
    beds: 4,
    baths: 3.5,
    sqft: 2800,
    highlights: 'Smart home, wine cellar, outdoor kitchen, recently renovated',
    photos: [],
    mlsNumber: 'MLS12348',
    createdBy: '2',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    address: '222 Willow Way',
    neighborhood: 'Sunset Gardens',
    price: 575000,
    beds: 3,
    baths: 2,
    sqft: 1650,
    highlights: 'Charming cottage, mature garden, workshop, quiet cul-de-sac',
    photos: [],
    mlsNumber: 'MLS12349',
    createdBy: '2',
    createdAt: new Date().toISOString()
  }
];

const usePropertyStore = create(
  persist(
    (set, get) => ({
      properties: INITIAL_PROPERTIES,
      savedProperties: {},

      addProperty: (propertyData, userId) => {
        const newProperty = {
          id: `prop_${Date.now()}`,
          ...propertyData,
          createdBy: userId,
          createdAt: new Date().toISOString(),
          photos: propertyData.photos || []
        };

        set({ properties: [...get().properties, newProperty] });
        return { success: true, property: newProperty };
      },

      updateProperty: (propertyId, updates) => {
        const updated = get().properties.map(p =>
          p.id === propertyId ? { ...p, ...updates } : p
        );
        set({ properties: updated });
        return { success: true };
      },

      deleteProperty: (propertyId) => {
        set({ properties: get().properties.filter(p => p.id !== propertyId) });
        return { success: true };
      },

      getPropertyById: (propertyId) => {
        return get().properties.find(p => p.id === propertyId);
      },

      toggleSavedProperty: (clientId, propertyId) => {
        const saved = get().savedProperties;
        const clientSaved = saved[clientId] || [];

        const isAlreadySaved = clientSaved.includes(propertyId);
        const newSaved = isAlreadySaved
          ? clientSaved.filter(id => id !== propertyId)
          : [...clientSaved, propertyId];

        set({
          savedProperties: {
            ...saved,
            [clientId]: newSaved
          }
        });

        return { success: true, isSaved: !isAlreadySaved };
      },

      getSavedProperties: (clientId) => {
        const savedIds = get().savedProperties[clientId] || [];
        return get().properties.filter(p => savedIds.includes(p.id));
      },

      isPropertySaved: (clientId, propertyId) => {
        const saved = get().savedProperties[clientId] || [];
        return saved.includes(propertyId);
      }
    }),
    {
      name: 'property-storage'
    }
  )
);

export default usePropertyStore;

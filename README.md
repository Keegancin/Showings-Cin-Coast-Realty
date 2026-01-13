# Cin Coast Realty - Showings Management App

A mobile-optimized web application for real estate teams to manage property showings, clients, and schedules.

## Features

### Three User Roles

#### 1. **Team Lead**
- View and manage all team members
- See all agents' clients and their showing schedules
- Create new agent accounts
- Create client accounts for the team
- Create and manage showing schedules
- Add and manage properties
- Full access to all team data and metrics

#### 2. **Agent**
- View and manage their own clients
- Create new client accounts
- Create and manage showing schedules with drag-and-drop reordering
- Add properties to the system
- Edit profile including bio, photo, email, and phone
- View client feedback and notes

#### 3. **Client**
- Access personalized portal with collapsible sidebar
- View current showing schedule
- Browse available properties
- Save favorite homes
- Rate properties and add notes
- View showing history
- Access agent bio and contact information
- Edit personal profile (name, email, phone, photo)

### Key Functionality

#### Collapsible Sidebar (Client Portal)
- Home
- Real Estate Agent Bio
- Current Showing Schedule
- History of Previous Showings
- Saved Homes
- Notes
- Agent Contacts
- Profile Settings

#### Drag-and-Drop Schedule Management
- Agents and team leads can create showing schedules
- Drag properties to rearrange showing order
- Add breaks and meetings to schedule
- Set custom times and durations
- Real-time updates feed to client portal

#### Property Management
- Add properties manually
- Display beds, baths, square footage, price
- Property highlights and descriptions
- **IDX Integration Ready**: Placeholder for pulling property data from public IDX websites
- Clients can save favorite properties
- Rate and add notes for each property

#### Profile Management
- All users can edit their profiles
- Update profile photo (placeholder)
- Edit email and phone number
- Agents can edit their bio (visible to clients)

## Technology Stack

- **Frontend**: React 18 with React Router
- **Styling**: Tailwind CSS with custom luxury real estate theme
- **State Management**: Zustand with persistence
- **Drag & Drop**: @dnd-kit for intuitive schedule reordering
- **Build Tool**: Vite
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Showings-Cin-Coast-Realty
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Demo Accounts

The app comes with pre-configured demo accounts:

**Team Lead:**
- Email: `lead@cincoast.com`
- Password: `lead123`

**Agent:**
- Email: `agent@cincoast.com`
- Password: `agent123`

**Client:**
- Email: `client@example.com`
- Password: `client123`

## Project Structure

```
src/
├── components/
│   ├── agent/              # Agent-specific components
│   ├── client/             # Client portal components
│   ├── teamlead/           # Team lead components
│   ├── BottomNav.jsx       # Mobile navigation
│   ├── MobileLayout.jsx    # Layout wrapper
│   └── PropertyCard.jsx    # Reusable property card
├── pages/
│   ├── Login.jsx           # Authentication
│   ├── AgentDashboard.jsx  # Agent routes
│   ├── ClientPortal.jsx    # Client routes
│   └── TeamLeadDashboard.jsx # Team lead routes
├── store/
│   ├── useAuthStore.js     # Authentication & users
│   ├── usePropertyStore.js # Property management
│   └── useScheduleStore.js # Schedule management
├── App.jsx                 # Main app & routing
├── main.jsx               # Entry point
└── index.css              # Global styles
```

## Features in Detail

### Role-Based Access Control
- Secure authentication with role-based routing
- Protected routes ensure users only access authorized features
- Persistent login sessions using local storage

### Mobile-First Design
- Optimized for phone screens
- Touch-friendly interface
- Smooth animations and transitions
- Bottom navigation for easy thumb access

### Schedule Management
- Visual timeline with property details
- Drag-and-drop reordering
- Add multiple types of items (showings, breaks, meetings)
- Custom time slots and durations
- Clients see real-time updates

### Client Experience
- Elegant, luxury-themed interface
- Easy navigation with collapsible sidebar
- Save and track favorite properties
- Rate properties with star ratings
- Add personal notes for each property
- View complete showing history

## Future Enhancements

### IDX Integration
The app is designed to integrate with public IDX (Internet Data Exchange) APIs to automatically fetch:
- Property photos
- Detailed specifications (beds, baths, sqft)
- Current pricing
- Property descriptions
- Location data

### Additional Features
- Push notifications for schedule updates
- Calendar integration
- Document sharing (contracts, disclosures)
- Virtual tour links
- Neighborhood information
- School district data
- Market analytics for team leads

## Mobile App Deployment

This web app can be packaged as a native mobile app using:
- **Capacitor**: For iOS and Android
- **PWA**: Progressive Web App for offline support

## Building for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## License

Proprietary - Cin Coast Realty

## Support

For questions or support, contact the development team.

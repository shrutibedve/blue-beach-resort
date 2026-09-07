# Blue Beach Resort Portal

![Blue Beach Resort Portal](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

A full-stack resort management prototype that connects guest services with staff operations. Guests can request assistance, reserve dining, submit feedback, and ask concierge questions. Resort staff can monitor feedback, rooms, work orders, inventory, and live operational activity from one dashboard.

> Live demo: [blue-beach-resort.onrender.com](https://blue-beach-resort.onrender.com/)

## Features

### Guest portal

- Guest sign-up and sign-in flow
- Multi-category stay feedback with optional image upload
- AI-assisted feedback sentiment analysis and reward coupon generation
- e-Butler service requests for housekeeping, maintenance, room service, concierge, and transport
- Dining reservations and resort activity browsing
- AI concierge for common guest questions
- Guest profile and stay information

### Staff portal

- Dashboard with feedback, sentiment, and operational metrics
- Live room-status grid for occupancy, cleaning, DND, and maintenance states
- Maintenance work-order tracking
- Guest query management with staff or AI-generated replies
- Service-request and dining-booking monitoring
- Staff performance overview and inventory tracking

## Tech Stack

- Frontend: React, TypeScript, Vite
- UI: Tailwind CSS, Framer Motion, Lucide React
- Backend: Node.js, Express
- Database: Supabase (PostgreSQL)
- Real-time updates: WebSockets and Supabase Realtime
- AI: Google Gemini
- Charts: Recharts

## How It Works

```text
Guest or staff action
        |
        v
React frontend
        |
        v
Express API -> Supabase database
        |
        +-> Gemini AI for feedback analysis and concierge replies
        |
        +-> WebSocket events for live dashboard updates
```

For example, when a guest submits feedback, the backend analyzes the written comments, stores the feedback and individual ratings in Supabase, creates a reward coupon, and broadcasts the new item to connected staff dashboards.

## Project Structure

```text
.
|-- pages/                 # Guest and staff application screens
|-- components/            # Reusable layouts and UI components
|-- context/               # Guest session state
|-- services/              # Frontend API, Supabase, Gemini, and WebSocket helpers
|-- backend/
|   |-- routes/            # Express API endpoints
|   |-- server.js          # API server and WebSocket setup
|   `-- gemini.js          # Server-side AI helpers
|-- supabase_schema.sql    # Database schema
|-- App.tsx                # Routes and application entry structure
`-- vite.config.ts         # Development server configuration
```

## Run Locally

### Prerequisites

- Node.js 18 or newer
- A Supabase project
- A Google Gemini API key (optional for mock/demo AI responses)

### 1. Clone and install dependencies

```bash
git clone https://github.com/shrutibedve/blue-beach-resort.git
cd blue-beach-resort
npm install
cd backend
npm install
cd ..
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BACKEND_WS_URL=ws://localhost:4000/ws
GEMINI_API_KEY=your_gemini_api_key
```

Create `backend/.env`:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key
PORT=4000
FRONTEND_URL=http://localhost:3000
```

Never commit either `.env` file. For a public deployment, keep Gemini calls on the backend so the API key is not exposed to browser users.

### 3. Start the application

Run these commands in two terminals:

```bash
npm run dev
```

```bash
cd backend
npm start
```

Open `http://localhost:3000`.

## Demo Behavior and Current Limitations

- The project includes fallback mock data so screens remain usable when the backend or Supabase is unavailable.
- Current guest and staff login flows are intended for demo use. They use browser storage and are not production-grade authentication.
- A production version should use secure authentication, role-based permissions, server-side AI requests, and validation for every API request.

## What I Learned

This project helped me practice building a complete application with separate guest and staff workflows. I worked with React routing and state, REST APIs, a Supabase database, real-time WebSocket events, data visualizations, and AI-powered user features.

## Future Improvements

- Add Supabase Auth with guest and staff roles
- Move all Gemini requests to protected backend endpoints
- Add automated tests for API routes and major user flows
- Add image storage for guest feedback uploads
- Add staff assignment, notifications, and audit history for work orders

## Author

Shruti Bedve

- GitHub: [@shrutibedve](https://github.com/shrutibedve)

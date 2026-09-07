<div align="center">

  
  # 🏖️ Blue Beach Resort Portal
  ### *The complete real-time guest experience & operational command center.*
</div>

---

## 🌟 Vision
The **Blue Beach Resort Portal** is a sophisticated, dual-sided ecosystem designed to bridge the gap between luxury guest service and high-efficiency resort operations. Featuring a real-time WebSocket-driven backend, advanced AI concierge capabilities, and a premium administrative dashboard.

## ✨ Core Platforms

### 📱 Guest Experience Portal
Designed for perfection on any device, the guest portal empowers visitors to manage their stay seamlessly:
*   **🛎️ e-Butler Service**: Instant requests for amenities, housekeeping, or room service.
*   **🍽️ Dining Reservations**: Real-time booking at resort venues (Azure Grill, The Horizon, etc.).
*   **💬 AI Concierge**: 24/7 assistance for Wi-Fi, pool hours, or local recommendations.
*   **⭐ Smart Feedback**: A multi-step sentiment-aware feedback system with image upload support.
*   **📄 Digital Folio**: Real-time itinerary and billing overview.

### 🏢 Staff Operational Command (Admin)
A high-performance sanctuary for resort staff to manage the pulse of the hotel:
*   **📊 Overview Dashboard**: Real-time KPI tracking (Net Sentiment, Work Order Volume, Feedback Trends).
*   **🚦 Live Operations Grid**: A color-coded, real-time map of all resort rooms showing occupancy and cleaning status.
*   **🤖 AI Concierge Desk**: Staff can manually reply or engage the **AI Copilot** to autonomously handle guest queries.
*   **🔧 Work Order Management**: Kanban-style tracking for maintenance and housekeeping tickets.
*   **📋 Staff & Inventory**: Interactive roster with performance metrics and a smart inventory tracker for resort supplies.

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion (premium animations)
- **Backend**: Node.js + Express.js
- **Database**: Supabase (PostgreSQL)
- **Real-time**: WebSockets (Broadcast & Listeners)
- **AI Engine**: Google Gemini 2.0 Flash (Feedback analysis & Autonomous replies)
- **Visualization**: Recharts

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Supabase Account
- Google AI Studio API Key (Gemini)

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

<div align="center">
  <img width="1200" height="475" alt="Blue Beach Resort Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
  
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

### 2. Environment Configuration
Create a `.env` file in the **root** for the frontend and a `.env` in the **backend** directory.

**Frontend (`.env`):**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_BACKEND_API_URL=http://localhost:4000/api
VITE_BACKEND_WS_URL=ws://localhost:4000/ws
```

**Backend (`backend/.env`):**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_api_key
PORT=4000
FRONTEND_URL=http://localhost:3000
```

### 3. Installation & Run
```bash
# Install root & backend dependencies
npm install
cd backend && npm install && cd ..

# Start the full-stack environment
# (Uses concurrently or run separately)
npm run dev      # Starts Frontend (Ports 3000)
node backend/server.js  # Starts Backend (Port 4000)
```

## 🧠 Smart Features

### Real-Time Reactor
The system utilizes a custom WebSocket relay. When a guest submits a request, it is saved to Supabase, broadcasted via the Express backend, and instantly appears on the Admin Dashboard without a page refresh.

### AI Copilot (Concierge)
Integrated Gemini AI analyzes guest feedback sentiment (Scale -1 to 1) and can autonomously reply to guest queries regarding Wi-Fi, resort hours, and basic services, freeing up staff for high-touch hospitality.

### Resilience Layer
The application implements a **Fallback In-Memory Database**. If the backend or database connection is interrupted, the UI remains fully functional using an extensive pool of high-quality mock data, ensuring a 100% uptime perception.

---
*Developed with focus on Luxury, Efficiency, and Real-time interactivity.*

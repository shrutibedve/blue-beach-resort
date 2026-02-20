<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Blue Beach Resort Portal

Welcome to the **Blue Beach Resort Portal**, a comprehensive web application designed to enhance hotel operations and guest experiences. This project acts as a dual-sided platform featuring a seamless **Guest Portal** and a powerful **Admin Dashboard** for hotel staff.

## 🌟 Overview

The Blue Beach Resort Portal bridges the gap between guest satisfaction and operational efficiency. 
Guests can use their portal to request room service, book tables, and provide detailed feedback about their stay. On the flip side, hotel staff can leverage the Admin Dashboard to monitor real-time hotel analytics, manage work orders, and respond to guest inquiries efficiently using an AI-powered concierge.

## ✨ Key Features

### For Guests
*   **e-Butler Service**: Request amenities like extra towels, room service, or maintenance directly from a mobile-friendly interface.
*   **Interactive Feedback System**: A dynamic, multi-step feedback form that allows guests to rate services (Dining, Spa, Room) using emojis, text, and photo uploads.
*   **Resort Information**: View ongoing resort activities (Events) and dining options with real-time open/close statuses.

### For Staff
*   **Analytics Dashboard**: Visual charts (powered by Recharts) showing guest sentiment trends, feedback mix, and overall satisfaction scores.
*   **Live Operations Grid**: A real-time grid view of all hotel rooms, indicating their current statuses (Clean, Dirty, Occupied, Maintenance).
*   **Work Order Management**: A kanban-style tracking system for maintenance and housekeeping tickets.
*   **AI Concierge**: Built-in integration with Google Gemini AI to auto-draft or auto-reply to common guest queries, saving staff time.

## 🛠️ Tech Stack

*   **Frontend**: React (v19)
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **Routing**: React Router (`react-router-dom`)
*   **Animations & Icons**: Framer Motion, Lucide React
*   **Data Visualization**: Recharts
*   **AI Integration**: Google Gemini API (`@google/genai`)
*   **Storage**: Simulated In-Memory Database + LocalStorage (for session persistence)

## 🚀 Setup & Execution

### Prerequisites
*   Node.js (v18 or higher recommended)
*   A Google Gemini API Key (for AI Concierge features)

### Installation Steps

1.  **Clone or Download the Repository:**
    Navigate to your project directory.

2.  **Install Dependencies:**
    Run the following command in your terminal to install all required packages:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    *   Locate the `.env.local` or `.env` file in the root directory.
    *   Add your Gemini API key:
        ```env
        VITE_GEMINI_API_KEY=your_api_key_here
        ```

4.  **Start the Development Server:**
    ```bash
    npm run dev
    ```

5.  **View the App:**
    Open your browser and navigate to `http://localhost:3000/` (or the port specified in your terminal).

## 🔮 Limitations & Future Improvements

This project serves as a robust frontend prototype, but there are areas for future enhancement:

1.  **Backend Integration**: The current application uses a simulated in-memory database (`services/db.ts`). A crucial next step is migrating to a real backend like Supabase, Firebase, or a custom Node.js/Express server with PostgreSQL to persist data across page refreshes.
2.  **Authentication**: Implement secure JWT-based authentication for both staff and guests (currently simulated with LocalStorage).
3.  **Responsive Design Refinement**: While mobile-friendly, the Admin Dashboard's dense data tables could be optimized further for smaller screens.
4.  **Real-Time Capabilities**: Introduce WebSockets (e.g., Socket.io) to make the live operations and concierge chat instantly react to new data without needing simulated delays or polling.

---
*Developed as a showcase of modern React frontend architecture and AI integration.*

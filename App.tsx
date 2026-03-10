
import React from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { GuestLayout, AdminLayout } from './components/Layouts';
import { GuestFeedback } from './pages/GuestFeedback';
import { GuestServices } from './pages/GuestServices';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLiveOps } from './pages/AdminLiveOps';
import { GuestQueries } from './pages/GuestQueries';
import { AdminWorkOrders } from './pages/AdminWorkOrders';
import { AdminStaff } from './pages/AdminStaff';
import { AdminInventory } from './pages/AdminInventory';
import { GuestDining } from './pages/GuestDining';
import { GuestActivities } from './pages/GuestActivities';
import { GuestProfile } from './pages/GuestProfile';
import { GuestProvider, useGuest } from './context/GuestContext';
import { Utensils, Calendar, BellRing, ArrowRight, ChevronRight } from 'lucide-react';

import { GuestLogin } from './pages/GuestLogin';
import { GuestSignup } from './pages/GuestSignup';
import { StaffLogin } from './pages/StaffLogin';
import { StaffSignup } from './pages/StaffSignup';
import { LandingPage } from './pages/LandingPage';
import { useRealtimeSocket } from './services/useRealtimeSocket';


// Protected Route for Guest
const GuestProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useGuest();
  if (!isAuthenticated) return <Navigate to="/guest/login" replace />;
  return <>{children}</>;
};

// Protected Route for Staff
const StaffProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuth = localStorage.getItem('staff_auth') === 'true';
  if (!isAuth) return <Navigate to="/staff/login" replace />;
  return <>{children}</>;
};

// Guest Landing within Portal Premium Redesign
const GuestHome = () => {
  const { guestName, roomNumber } = useGuest();
  const firstName = guestName ? guestName.split(' ')[0] : 'Guest';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const quickActions = [
    { to: '/guest/dining', icon: <Utensils size={26} />, label: 'Dining', sub: 'Reserve Table', bg: 'from-orange-100 to-amber-50', color: 'text-orange-500' },
    { to: '/guest/activities', icon: <Calendar size={26} />, label: 'Events', sub: 'Resort Guide', bg: 'from-purple-100 to-pink-50', color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-5 pb-28 relative">
      {/* Personalized Header */}
      <div className="flex justify-between items-center mt-4 mb-2">
        <div>
          <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">{greeting} ☀️</p>
          <h2 className="text-2xl font-serif font-bold text-slate-800 leading-tight">{firstName}<span className="text-blue-600">,</span></h2>
          <p className="text-slate-400 text-sm font-medium mt-0.5">Room {roomNumber || '—'} · Ocean View Suite</p>
        </div>
        <Link to="/guest/profile" className="w-14 h-14 bg-gradient-to-br from-blue-100 to-white rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-xl shadow-blue-500/10 hover:scale-105 transition-transform">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${guestName || 'Guest'}`} alt="Profile" className="w-full h-full object-cover" />
        </Link>
      </div>

      {/* Today's Highlights Strip */}
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
        {[
          { icon: '🌊', label: 'Pool', sub: 'Open · 06:00–22:00', color: 'bg-cyan-50 border-cyan-100' },
          { icon: '🧖', label: 'Spa', sub: 'Next slot 15:30', color: 'bg-rose-50 border-rose-100' },
          { icon: '🍹', label: 'Happy Hour', sub: 'Luna Bar · 17:00', color: 'bg-amber-50 border-amber-100' },
          { icon: '🎵', label: 'Live Music', sub: 'Tonight · 20:00', color: 'bg-purple-50 border-purple-100' },
        ].map((h, i) => (
          <div key={i} className={`flex-shrink-0 ${h.color} border rounded-2xl px-4 py-3 flex items-center gap-2.5`}>
            <span className="text-2xl">{h.icon}</span>
            <div>
              <p className="font-bold text-slate-800 text-sm leading-tight">{h.label}</p>
              <p className="text-xs text-slate-500 font-medium">{h.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Feedback CTA */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-7 text-white shadow-2xl shadow-blue-600/30 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-52 h-52 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-colors duration-700" />
        <h3 className="font-serif font-bold text-xl relative z-10 mb-1">How is your stay?</h3>
        <p className="text-blue-100 text-sm mb-5 relative z-10 leading-relaxed font-medium max-w-[85%]">Share your experience and earn exclusive resort rewards today.</p>
        <Link to="/guest/feedback" className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold text-sm px-5 py-2.5 rounded-full relative z-10 shadow-lg hover:bg-slate-50 transition-all">
          Rate My Stay <ArrowRight size={15} />
        </Link>
        <div className="absolute -right-3 -bottom-3 opacity-40 text-[7rem] rotate-12 group-hover:-rotate-6 transition-transform duration-700">⭐</div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((a, i) => (
          <Link key={i} to={a.to} className="bg-white/80 backdrop-blur-xl p-5 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center gap-3 hover:bg-white hover:-translate-y-1 transition-all group">
            <div className={`w-14 h-14 bg-gradient-to-tr ${a.bg} ${a.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300`}>
              {a.icon}
            </div>
            <div>
              <span className="font-bold text-slate-800 block font-serif">{a.label}</span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{a.sub}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* e-Butler Row */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-5 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-between group hover:bg-white transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-900/20 group-hover:scale-105 transition-transform">
            <BellRing size={20} />
          </div>
          <div>
            <h3 className="font-serif font-bold text-slate-800">e-Butler</h3>
            <p className="text-slate-500 text-xs font-medium">Towels · Food · Maintenance</p>
          </div>
        </div>
        <Link to="/guest/services" className="bg-slate-900 text-white hover:bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-md">
          <ChevronRight size={18} />
        </Link>
      </div>

      {/* Help / Queries */}
      <Link to="/guest/queries" className="bg-gradient-to-r from-slate-50 to-white border border-slate-100 rounded-[2rem] p-5 flex items-center gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="text-xl">💬</span>
        </div>
        <div className="flex-1">
          <p className="font-bold text-slate-800 font-serif">Need Help?</p>
          <p className="text-xs text-slate-500 font-medium">Chat with our AI Concierge</p>
        </div>
        <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
      </Link>
    </div>
  );
};

const App = () => {
  useRealtimeSocket(); // 🔌 connect to backend WebSocket for realtime events
  return (
    <GuestProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* Auth Routes */}
          <Route path="/guest/login" element={<GuestLogin />} />
          <Route path="/guest/signup" element={<GuestSignup />} />
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route path="/staff/signup" element={<StaffSignup />} />

          {/* Guest Routes */}
          <Route path="/guest" element={<GuestProtectedRoute><GuestLayout /></GuestProtectedRoute>}>
            <Route index element={<GuestHome />} />
            <Route path="feedback" element={<GuestFeedback />} />
            <Route path="services" element={<GuestServices />} />
            <Route path="dining" element={<GuestDining />} />
            <Route path="activities" element={<GuestActivities />} />
            <Route path="profile" element={<GuestProfile />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<StaffProtectedRoute><AdminLayout /></StaffProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="live-ops" element={<AdminLiveOps />} />
            <Route path="concierge" element={<GuestQueries />} />
            <Route path="work-orders" element={<AdminWorkOrders />} />
            <Route path="staff" element={<AdminStaff />} />
            <Route path="inventory" element={<AdminInventory />} />
          </Route>
        </Routes>
      </Router>
    </GuestProvider>
  );
};

export default App;

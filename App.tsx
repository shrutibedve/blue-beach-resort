
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
import { GuestProvider } from './context/GuestContext';
import { Utensils, Calendar, BellRing } from 'lucide-react';

// Landing Page (Role Selection)
const Home = () => (
  <div className="min-h-screen bg-blue-500 flex flex-col items-center justify-center p-4 text-center text-white relative overflow-hidden">
    <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center" />
    
    <div className="relative z-10 max-w-2xl">
      <h1 className="text-5xl font-serif font-bold mb-6 leading-tight">Luxury Defined by<br/>The Ocean Breeze</h1>
      <p className="text-blue-50 text-lg mb-10 max-w-lg mx-auto">Welcome to Blue Beach Resort. Select your portal to begin.</p>
      
      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <Link to="/guest" className="group px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-xl hover:bg-blue-50 transition-all transform hover:-translate-y-1">
          <span className="flex items-center gap-2">
             Guest Portal
          </span>
        </Link>
        <Link to="/admin/dashboard" className="px-8 py-4 bg-blue-800/80 backdrop-blur-sm text-white font-bold rounded-xl border border-blue-400/30 hover:bg-blue-700 transition-all">
          Staff Login
        </Link>
      </div>
    </div>
    
    <p className="absolute bottom-6 text-xs text-blue-200 opacity-75">Demo Version • Powered by Gemini AI & React</p>
  </div>
);

// Guest Landing within Portal
const GuestHome = () => (
  <div className="p-6 space-y-6 pb-24">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-serif font-bold text-slate-800">Welcome, Guest</h2>
      <Link to="/guest/profile" className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Guest" alt="Profile" />
      </Link>
    </div>
    
    <div className="grid gap-4">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <h3 className="font-bold text-lg relative z-10">How is your stay?</h3>
        <p className="text-blue-100 text-sm mb-4 relative z-10 max-w-[70%]">Unlock exclusive rewards by sharing your experience.</p>
        <Link to="/guest/feedback" className="inline-block bg-white text-blue-600 font-bold text-xs px-4 py-2 rounded-full relative z-10">Start Feedback</Link>
        <div className="absolute right-[-20px] bottom-[-20px] opacity-20 text-9xl">⭐</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link to="/guest/dining" className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-2 hover:bg-slate-50">
           <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center"><Utensils size={20}/></div>
           <span className="font-bold text-slate-700 text-sm">Dining</span>
        </Link>
        <Link to="/guest/activities" className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-2 hover:bg-slate-50">
           <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center"><Calendar size={20}/></div>
           <span className="font-bold text-slate-700 text-sm">Events</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800">e-Butler Service</h3>
          <p className="text-slate-500 text-xs">Towels, Food, Maintenance</p>
        </div>
        <Link to="/guest/services" className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
          <BellRing size={14}/> Request
        </Link>
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <GuestProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Guest Routes */}
          <Route path="/guest" element={<GuestLayout />}>
            <Route index element={<GuestHome />} />
            <Route path="feedback" element={<GuestFeedback />} />
            <Route path="services" element={<GuestServices />} />
            <Route path="dining" element={<GuestDining />} />
            <Route path="activities" element={<GuestActivities />} />
            <Route path="profile" element={<GuestProfile />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
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

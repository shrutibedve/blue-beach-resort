import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useGuest } from '../context/GuestContext';
import {
  Home, MessageSquarePlus, BellRing, LayoutDashboard,
  MessageSquare, Wrench, Users, Map, LogOut, Utensils, Calendar, Package, UserCircle, Search, Menu, X, Bell
} from 'lucide-react';

// --- GUEST LAYOUT (Mobile First Premium) ---
export const GuestLayout: React.FC = () => {
  const { logout } = useGuest();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path ? "text-blue-500 font-bold" : "text-slate-400 hover:text-slate-600";
  const iconActive = (path: string) => location.pathname === path ? "text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "text-slate-400";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-600">
      {/* Premium Glassmorphic Header */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 z-50 flex justify-between items-center px-6 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg shadow-blue-500/30">B</div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-xl text-slate-800 leading-tight">Blue Beach</span>
            <span className="text-[10px] text-blue-600 uppercase tracking-widest font-bold">Guest Portal</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-100"></span>
          </button>
          <Link to="/" onClick={logout} className="h-10 px-4 bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 text-sm font-bold rounded-full flex items-center transition-colors">
            End Stay
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-24 pb-28 px-4 sm:px-6 md:px-8 max-w-lg mx-auto w-full relative">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50 to-transparent -z-10" />
        <Outlet />
      </main>

      {/* Floating Glassmorphism Bottom Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-50">
        <nav className="bg-white/90 backdrop-blur-2xl border border-slate-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] rounded-3xl flex justify-between items-center h-20 px-6 relative">

          <Link to="/guest" className={`flex flex-col items-center gap-1.5 w-12 transition-all ${isActive('/guest')}`}>
            <Home size={22} className={iconActive('/guest')} />
            <span className="text-[10px] uppercase tracking-wider">Home</span>
          </Link>

          <Link to="/guest/dining" className={`flex flex-col items-center gap-1.5 w-12 transition-all ${isActive('/guest/dining')}`}>
            <Utensils size={22} className={iconActive('/guest/dining')} />
            <span className="text-[10px] uppercase tracking-wider">Dining</span>
          </Link>

          {/* Elevated Center FAB with glowing effect */}
          <Link to="/guest/feedback" className="relative group -translate-y-6">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className={`w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center border-[6px] border-[#F8FAFC] shadow-xl shadow-blue-500/30 transform transition-all duration-300 group-hover:scale-110 active:scale-95 relative z-10`}>
              <MessageSquarePlus size={26} className="text-white drop-shadow-md" />
            </div>
          </Link>

          <Link to="/guest/services" className={`flex flex-col items-center gap-1.5 w-12 transition-all ${isActive('/guest/services')}`}>
            <BellRing size={22} className={iconActive('/guest/services')} />
            <span className="text-[10px] uppercase tracking-wider">Butler</span>
          </Link>

          <Link to="/guest/profile" className={`flex flex-col items-center gap-1.5 w-12 transition-all ${isActive('/guest/profile')}`}>
            <UserCircle size={22} className={iconActive('/guest/profile')} />
            <span className="text-[10px] uppercase tracking-wider">Profile</span>
          </Link>

        </nav>
      </div>
    </div>
  );
};

// --- ADMIN LAYOUT (Desktop Dashboard Premium) ---
export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const navItemClass = (path: string) => `
    flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium whitespace-nowrap overflow-hidden
    ${location.pathname === path
      ? 'bg-blue-600/10 text-blue-600 drop-shadow-sm font-bold relative origin-left scale-100 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-8 before:bg-blue-600 before:rounded-r-full'
      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 hover:translate-x-1'}
  `;

  const handleLogout = () => {
    localStorage.removeItem('staff_auth');
  };

  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    if (path === 'dashboard') return 'Overview Dashboard';
    if (path === 'live-ops') return 'Live Operations Center';
    if (path === 'concierge') return 'AI Concierge Desk';
    if (path === 'work-orders') return 'Maintenance Work Orders';
    if (path === 'staff') return 'Staff & HR Roster';
    if (path === 'inventory') return 'Resource Inventory';
    return path?.replace('-', ' ');
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex font-sans selection:bg-blue-100 selection:text-blue-600 text-slate-800 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent pointer-events-none" />

      {/* Sidebar - Light/Glassy Theme */}
      <aside className={`bg-white/80 backdrop-blur-2xl border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col fixed h-full z-40 transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
          <div className={`flex items-center gap-3 overflow-hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 w-full' : 'opacity-0 w-0'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 rounded-xl flex items-center justify-center text-white font-serif font-bold text-xl shrink-0">B</div>
            <div className="flex flex-col shrink-0">
              <h1 className="font-bold text-lg text-slate-900 leading-tight">Admin OS</h1>
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Blue Beach Resort</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors shrink-0"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <p className={`text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 mt-2 px-4 transition-all ${isSidebarOpen ? 'opacity-100' : 'opacity-0 h-0 hidden'}`}>Operations</p>
          <div className="space-y-1">
            <Link title="Dashboard" to="/admin/dashboard" className={navItemClass('/admin/dashboard')}>
              <LayoutDashboard size={20} className="shrink-0" /> {isSidebarOpen && <span>Dashboard</span>}
            </Link>
            <Link title="Live Operations" to="/admin/live-ops" className={navItemClass('/admin/live-ops')}>
              <Map size={20} className="shrink-0" /> {isSidebarOpen && <span>Live Operations</span>}
            </Link>
            <Link title="AI Concierge" to="/admin/concierge" className={navItemClass('/admin/concierge')}>
              <MessageSquare size={20} className="shrink-0" /> {isSidebarOpen && <span>AI Concierge</span>}
            </Link>
            <Link title="Work Orders" to="/admin/work-orders" className={navItemClass('/admin/work-orders')}>
              <Wrench size={20} className="shrink-0" /> {isSidebarOpen && <span>Work Orders</span>}
            </Link>
          </div>

          <p className={`text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 mt-8 px-4 transition-all ${isSidebarOpen ? 'opacity-100' : 'opacity-0 h-0 hidden'}`}>Management</p>
          <div className="space-y-1">
            <Link title="Staff Roster" to="/admin/staff" className={navItemClass('/admin/staff')}>
              <Users size={20} className="shrink-0" /> {isSidebarOpen && <span>Staff Roster</span>}
            </Link>
            <Link title="Inventory" to="/admin/inventory" className={navItemClass('/admin/inventory')}>
              <Package size={20} className="shrink-0" /> {isSidebarOpen && <span>Inventory</span>}
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <Link
            to="/"
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white border border-rose-100 text-rose-600 hover:bg-rose-50 hover:shadow-sm transition-all group overflow-hidden ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
            title="Sign Out"
          >
            <LogOut size={20} className="shrink-0 group-hover:-translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="font-bold whitespace-nowrap">Sign Out Session</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-20'}`}>
        {/* Top Header */}
        <header className="h-20 bg-white/60 backdrop-blur-xl shadow-sm border-b border-white/40 flex items-center justify-between px-10 sticky top-0 z-30">
          <div>
            <h2 className="font-serif font-bold text-slate-800 text-2xl capitalize tracking-tight flex items-center gap-3">
              {getPageTitle()}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Welcome back, Admin. Here's what's happening today.</p>
          </div>

          <div className="flex items-center gap-6">
            {/* Global Search Placeholder */}
            <div className="hidden lg:flex items-center bg-white border border-slate-200 rounded-full px-4 py-2 w-64 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
              <Search size={16} className="text-slate-400 mr-2" />
              <input type="text" placeholder="Search guests, rooms, tickets..." className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder-slate-400" />
            </div>

            <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
              <button className="relative w-10 h-10 bg-white rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-colors shadow-sm">
                <Bell size={18} />
                <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>

              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">Admin User</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">General Manager</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-white">
                  AD
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Dashboard Canvas */}
        <main className="flex-1 p-8 lg:p-10 z-10">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

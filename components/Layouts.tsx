
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Home, MessageSquarePlus, BellRing, LayoutDashboard, 
  MessageSquare, Wrench, Users, Map, LogOut, Utensils, Calendar, Package, UserCircle
} from 'lucide-react';

// --- GUEST LAYOUT (Mobile First) ---
export const GuestLayout: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path ? "text-blue-600" : "text-slate-400";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-serif font-bold">B</div>
           <span className="font-serif font-bold text-lg text-slate-800">Blue Beach</span>
        </div>
        <Link to="/" className="text-xs text-slate-500 font-medium">Exit Guest Mode</Link>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Bottom Navigation - Expanded */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 z-50 pb-safe px-2">
        <Link to="/guest" className={`flex flex-col items-center gap-1 ${isActive('/guest')}`}>
           <Home size={20} />
           <span className="text-[9px] font-bold uppercase">Home</span>
        </Link>
        <Link to="/guest/dining" className={`flex flex-col items-center gap-1 ${isActive('/guest/dining')}`}>
           <Utensils size={20} />
           <span className="text-[9px] font-bold uppercase">Dining</span>
        </Link>
        
        {/* Center FAB */}
        <Link to="/guest/feedback" className="relative -top-5">
           <div className={`w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center border-4 border-slate-50 shadow-lg transform transition-transform active:scale-95`}>
             <MessageSquarePlus size={24} className="text-white" />
           </div>
        </Link>

        <Link to="/guest/services" className={`flex flex-col items-center gap-1 ${isActive('/guest/services')}`}>
           <BellRing size={20} />
           <span className="text-[9px] font-bold uppercase">Butler</span>
        </Link>
        <Link to="/guest/profile" className={`flex flex-col items-center gap-1 ${isActive('/guest/profile')}`}>
           <UserCircle size={20} />
           <span className="text-[9px] font-bold uppercase">Profile</span>
        </Link>
      </nav>
    </div>
  );
};

// --- ADMIN LAYOUT (Desktop Dashboard) ---
export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navItemClass = (path: string) => `
    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1
    ${location.pathname === path ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
  `;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-40">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-900 font-serif font-bold">B</div>
             <div>
               <h1 className="font-bold text-lg leading-tight">Admin Panel</h1>
               <p className="text-xs text-slate-500">Blue Beach Resort</p>
             </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
           <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4 mt-2">Operations</p>
           <Link to="/admin/dashboard" className={navItemClass('/admin/dashboard')}>
             <LayoutDashboard size={18} /> Dashboard
           </Link>
           <Link to="/admin/live-ops" className={navItemClass('/admin/live-ops')}>
             <Map size={18} /> Live Operations
           </Link>
           <Link to="/admin/concierge" className={navItemClass('/admin/concierge')}>
             <MessageSquare size={18} /> Concierge AI
           </Link>
           <Link to="/admin/work-orders" className={navItemClass('/admin/work-orders')}>
             <Wrench size={18} /> Work Orders
           </Link>

           <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4 mt-8">Management</p>
           <Link to="/admin/staff" className={navItemClass('/admin/staff')}>
             <Users size={18} /> Staff Roster
           </Link>
           <Link to="/admin/inventory" className={navItemClass('/admin/inventory')}>
             <Package size={18} /> Inventory
           </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
           <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
             <LogOut size={16} />
             <span className="text-sm">Sign Out</span>
           </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen overflow-hidden">
         <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 sticky top-0 z-30">
            <h2 className="font-bold text-slate-800 text-xl capitalize">
               {location.pathname.split('/').pop()?.replace('-', ' ')}
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                 A
              </div>
            </div>
         </header>
         <main className="flex-1 p-8 overflow-y-auto bg-slate-100 pb-20">
            <Outlet />
         </main>
      </div>
    </div>
  );
};

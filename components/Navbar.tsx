import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, MessageSquarePlus, MessageCircleQuestion } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path 
    ? "bg-blue-700 text-white" 
    : "text-blue-100 hover:bg-blue-600";

  return (
    <nav className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-600 font-bold font-serif">B</div>
            <span className="font-serif font-bold text-lg tracking-wide">Blue Beach Resort</span>
          </div>
          
          <div className="flex space-x-2">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${isActive('/')}`}
            >
              <Home size={16} />
              Home
            </Link>
            <Link 
              to="/feedback" 
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${isActive('/feedback')}`}
            >
              <MessageSquarePlus size={16} />
              Guest Feedback
            </Link>
            <Link 
              to="/queries" 
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${isActive('/queries')}`}
            >
              <MessageCircleQuestion size={16} />
              Concierge
            </Link>
            <Link 
              to="/admin" 
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${isActive('/admin')}`}
            >
              <LayoutDashboard size={16} />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
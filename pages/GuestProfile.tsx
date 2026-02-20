
import React from 'react';
import { useGuest } from '../context/GuestContext';
import { LogOut, CreditCard, FileText, Wifi } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const GuestProfile: React.FC = () => {
  const { guestName, roomNumber, logout } = useGuest();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
         <div className="flex items-center justify-between mb-6">
            <div>
               <p className="text-slate-400 text-xs uppercase tracking-wider">Guest</p>
               <h2 className="text-2xl font-serif font-bold">{guestName || 'Guest'}</h2>
            </div>
            <div className="text-right">
               <p className="text-slate-400 text-xs uppercase tracking-wider">Room</p>
               <p className="text-3xl font-mono font-bold">{roomNumber || '---'}</p>
            </div>
         </div>
         <div className="border-t border-slate-700 pt-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Wifi size={14} /> <span>BlueGuest / sandytoes2025</span>
            </div>
         </div>
      </div>

      <div className="space-y-2">
         <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><CreditCard size={20}/></div>
               <span className="font-medium text-slate-700">Current Bill</span>
            </div>
            <span className="font-bold text-slate-900">$452.50</span>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><FileText size={20}/></div>
               <span className="font-medium text-slate-700">My Bookings</span>
            </div>
            <span className="text-xs text-slate-400">2 Active</span>
         </div>
      </div>

      <Button variant="outline" className="w-full text-red-500 hover:bg-red-50 hover:text-red-600 border-red-100" onClick={handleLogout}>
        <LogOut size={16} className="mr-2" /> Sign Out of Room
      </Button>
    </div>
  );
};

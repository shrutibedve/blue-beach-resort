import React, { useState } from 'react';
import { useGuest } from '../context/GuestContext';
import { LogOut, CreditCard, FileText, Wifi, ShieldCheck, ChevronRight, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const GuestProfile: React.FC = () => {
   const { guestName, roomNumber, logout } = useGuest();
   const navigate = useNavigate();

   const [toastMessage, setToastMessage] = useState<string | null>(null);

   const handleLogout = () => {
      logout();
      navigate('/');
   };

   const showToast = (msg: string) => {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3000);
   };

   return (
      <div className="space-y-6 pb-24 relative mt-4">
         <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
               <User size={20} />
            </div>
            <div>
               <h2 className="text-2xl font-serif font-bold text-slate-800 tracking-tight">Guest Profile</h2>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Manage Stay</p>
            </div>
         </div>

         <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-indigo-900/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="flex items-start justify-between mb-8 relative z-10">
               <div>
                  <p className="text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-1">Registered Guest</p>
                  <h2 className="text-3xl font-serif font-bold tracking-tight">{guestName || 'Valued Guest'}</h2>
               </div>
               <div className="text-right bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                  <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-1">Suite / Room</p>
                  <p className="text-3xl font-mono font-bold">{roomNumber || '---'}</p>
               </div>
            </div>

            <div className="border-t border-white/10 pt-5 flex justify-between items-center relative z-10">
               <div className="flex flex-col gap-1">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1"><ShieldCheck size={12} /> Resort Wi-Fi Access</p>
                  <div className="flex items-center gap-2 text-sm text-slate-200 font-mono tracking-wide bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                     <Wifi size={14} className="text-blue-400" /> <span>SSID: BlueGuest | Pass: sandytoes25</span>
                  </div>
               </div>
            </div>
         </div>

         {toastMessage && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-bold shadow-xl flex items-center gap-2">
               <ShieldCheck size={16} className="text-blue-400" />
               {toastMessage}
            </div>
         )}

         <div className="space-y-3">
            <div onClick={() => showToast("Viewing folio is currently unavailable.")} className="bg-white/80 backdrop-blur-xl p-5 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center justify-between group hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all cursor-pointer">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-tr from-blue-50 to-indigo-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                     <CreditCard size={24} />
                  </div>
                  <div>
                     <span className="font-bold text-slate-800 block text-lg">Current Folio</span>
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Room Charges</span>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <span className="font-serif font-bold text-2xl text-slate-900">$452.50</span>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
               </div>
            </div>

            <div onClick={() => showToast("Loading itinerary module...")} className="bg-white/80 backdrop-blur-xl p-5 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center justify-between group hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all cursor-pointer">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-tr from-purple-50 to-pink-50 text-purple-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                     <FileText size={24} />
                  </div>
                  <div>
                     <span className="font-bold text-slate-800 block text-lg">My Itinerary</span>
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Upcoming Bookings</span>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full border border-purple-200">2 Active</span>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
               </div>
            </div>
         </div>

         <div className="pt-4">
            <button
               onClick={handleLogout}
               className="w-full bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all hover:shadow-md active:scale-95 group"
            >
               <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
               Checkout & End Session
            </button>
         </div>
      </div>
   );
};

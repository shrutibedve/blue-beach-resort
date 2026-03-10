
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, X, Clock, CheckCircle2, ChevronRight,
  Utensils, PaintBucket, Wrench, Briefcase, Car, Sparkles
} from 'lucide-react';
import { SERVICE_REQUEST_OPTIONS } from '../constants';
import { RequestCategory, ServiceRequest, TicketStatus } from '../types';
import { submitServiceRequest, getServiceRequests } from '../services/db';
import { Button } from '../components/ui/Button';
import { useGuest } from '../context/GuestContext';
import { supabase } from '../services/supabaseClient';

const CATEGORY_META: Record<string, { icon: any; color: string; bg: string; emoji: string }> = {
  [RequestCategory.HOUSEKEEPING]: { icon: PaintBucket, color: 'text-purple-600', bg: 'bg-purple-50', emoji: '🧹' },
  [RequestCategory.ROOM_SERVICE]: { icon: Utensils, color: 'text-orange-600', bg: 'bg-orange-50', emoji: '🍽️' },
  [RequestCategory.MAINTENANCE]: { icon: Wrench, color: 'text-blue-600', bg: 'bg-blue-50', emoji: '🔧' },
  [RequestCategory.CONCIERGE]: { icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50', emoji: '🛎️' },
  [RequestCategory.TRANSPORT]: { icon: Car, color: 'text-rose-600', bg: 'bg-rose-50', emoji: '🚗' },
};

export const GuestServices: React.FC = () => {
  const { guestName, roomNumber, isAuthenticated } = useGuest();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [activeCategory, setActiveCategory] = useState<RequestCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    loadRequests();

    // Supabase Realtime subscription for live request status updates
    const channel = supabase
      .channel('service_requests_rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'service_requests' }, () => {
        loadRequests();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isAuthenticated]);

  const loadRequests = async () => {
    const data = await getServiceRequests();
    setRequests(data);
  };

  const handleCategoryClick = (cat: RequestCategory) => {
    setActiveCategory(cat);
    setSelectedItem('');
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!activeCategory || !selectedItem) return;
    setLoading(true);
    await submitServiceRequest({ roomNumber, guestName, category: activeCategory, item: selectedItem, note });
    setLoading(false);
    setIsModalOpen(false);
    setNote('');
    setActiveCategory(null);
    setSuccessAnimation(true);
    setTimeout(() => setSuccessAnimation(false), 3000);
    loadRequests();
  };

  if (!isAuthenticated) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center h-[80vh]">
        <Bell size={48} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Please Sign In</h2>
        <p className="text-slate-500 mb-6">You need to identify your room to make requests.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 -mx-0 p-6 pb-14 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-blue-500/10" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Bell size={14} className="text-blue-300" />
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">e-Butler</span>
          </div>
          <h1 className="text-3xl font-serif font-bold mb-1">At Your Service</h1>
          <p className="text-slate-400 text-sm">Room {roomNumber} • We'll be right with you</p>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {successAnimation && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-4 -mt-2 mb-3 bg-emerald-500 text-white px-4 py-3 rounded-2xl flex items-center gap-3 shadow-lg shadow-emerald-200 relative z-20"
          >
            <CheckCircle2 size={20} />
            <div>
              <p className="font-bold text-sm">Request Submitted!</p>
              <p className="text-xs text-emerald-100">We'll be there within 15-30 minutes</p>
            </div>
            <Sparkles size={16} className="ml-auto" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Requests */}
      {requests.length > 0 && (
        <div className="mx-4 -mt-8 relative z-10 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Requests</h3>
            <span className="text-xs bg-blue-100 text-blue-600 font-bold px-2 py-0.5 rounded-full">{requests.filter(r => r.status === TicketStatus.OPEN).length} pending</span>
          </div>
          <div className="divide-y divide-slate-50 max-h-48 overflow-y-auto">
            {requests.slice(0, 5).map(req => (
              <div key={req.id} className="flex items-center gap-3 p-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${req.status === TicketStatus.OPEN ? 'bg-amber-50' : req.status === TicketStatus.IN_PROGRESS ? 'bg-blue-50' : 'bg-emerald-50'}`}>
                  {req.status === TicketStatus.OPEN && <Clock size={14} className="text-amber-500" />}
                  {req.status === TicketStatus.IN_PROGRESS && <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />}
                  {req.status === TicketStatus.DONE && <CheckCircle2 size={14} className="text-emerald-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-800 truncate">{req.item}</p>
                  <p className="text-xs text-slate-400">{req.category}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${req.status === TicketStatus.OPEN ? 'bg-amber-50 text-amber-600' :
                  req.status === TicketStatus.IN_PROGRESS ? 'bg-blue-50 text-blue-600' :
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                  {req.status === TicketStatus.OPEN ? 'Pending' : req.status === TicketStatus.IN_PROGRESS ? 'In Progress' : 'Done'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Grid */}
      <div className="p-4 mt-2">
        <h2 className="font-bold text-lg text-slate-800 mb-4">How can we help?</h2>
        <div className="grid grid-cols-2 gap-3">
          {SERVICE_REQUEST_OPTIONS.map((opt) => {
            const meta = CATEGORY_META[opt.category] || { icon: Bell, color: 'text-blue-600', bg: 'bg-blue-50', emoji: '🔔' };
            const Icon = meta.icon;
            return (
              <motion.button
                key={opt.category}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryClick(opt.category)}
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start gap-3 hover:shadow-md hover:border-slate-200 transition-all text-left"
              >
                <div className={`w-11 h-11 ${meta.bg} ${meta.color} rounded-xl flex items-center justify-center text-xl`}>
                  {meta.emoji}
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-800">{opt.category}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{opt.items.slice(0, 2).join(', ')}...</p>
                </div>
                <ChevronRight size={14} className={`${meta.color} ml-auto opacity-50`} />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Request Modal */}
      <AnimatePresence>
        {isModalOpen && activeCategory && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }} transition={{ type: 'spring', damping: 28 }} className="relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl">
              {/* Modal Header */}
              <div className={`p-5 flex justify-between items-center ${CATEGORY_META[activeCategory]?.bg || 'bg-blue-50'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{CATEGORY_META[activeCategory]?.emoji}</span>
                  <h3 className="font-bold text-xl text-slate-900">{activeCategory}</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white/70 rounded-full"><X size={18} /></button>
              </div>
              <div className="p-5 space-y-5">
                <div>
                  <label className="text-sm font-semibold text-slate-600 mb-3 block">Select what you need</label>
                  <div className="flex flex-wrap gap-2">
                    {SERVICE_REQUEST_OPTIONS.find(o => o.category === activeCategory)?.items.map(item => (
                      <button
                        key={item}
                        onClick={() => setSelectedItem(item)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${selectedItem === item ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600 mb-2 block">Special Instructions <span className="text-slate-400 font-normal">(optional)</span></label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
                    rows={3}
                    placeholder="E.g. Extra pillows please, or allergen info..."
                  />
                </div>
                {selectedItem && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${CATEGORY_META[activeCategory]?.bg} ${CATEGORY_META[activeCategory]?.color} flex items-center justify-center`}>
                      <Clock size={14} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Estimated arrival</p>
                      <p className="text-sm font-bold text-slate-800">15 – 30 minutes</p>
                    </div>
                  </div>
                )}
                <Button onClick={handleSubmit} className="w-full h-12 text-base" disabled={!selectedItem || loading} isLoading={loading}>
                  {loading ? 'Submitting...' : selectedItem ? `Request ${selectedItem}` : 'Select an item above'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

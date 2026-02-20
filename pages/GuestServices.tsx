
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Search, Plus, ChevronRight, Clock, CheckCircle2, X, 
  Utensils, PaintBucket, Wrench, Briefcase, Car
} from 'lucide-react';
import { SERVICE_REQUEST_OPTIONS } from '../constants';
import { RequestCategory, ServiceRequest, TicketStatus } from '../types';
import { submitServiceRequest, getServiceRequests } from '../services/db';
import { Button } from '../components/ui/Button';
import { useGuest } from '../context/GuestContext';
import { Link } from 'react-router-dom';

const CATEGORY_ICONS: Record<string, any> = {
  [RequestCategory.HOUSEKEEPING]: PaintBucket,
  [RequestCategory.ROOM_SERVICE]: Utensils,
  [RequestCategory.MAINTENANCE]: Wrench,
  [RequestCategory.CONCIERGE]: Briefcase,
  [RequestCategory.TRANSPORT]: Car
};

export const GuestServices: React.FC = () => {
  const { guestName, roomNumber, isAuthenticated } = useGuest();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [activeCategory, setActiveCategory] = useState<RequestCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) loadRequests();
  }, [isAuthenticated]);

  const loadRequests = async () => {
    const data = await getServiceRequests();
    // Filter for current guest ideally, but for mock we show all
    setRequests(data);
  };

  const handleCategoryClick = (cat: RequestCategory) => {
    setActiveCategory(cat);
    setSelectedItem('');
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if(!activeCategory || !selectedItem) return;
    setLoading(true);
    await submitServiceRequest({
      roomNumber: roomNumber, 
      guestName: guestName,
      category: activeCategory,
      item: selectedItem,
      note: note
    });
    await loadRequests();
    setLoading(false);
    setIsModalOpen(false);
    setNote('');
    setActiveCategory(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center h-[80vh]">
        <Bell size={48} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Please Sign In</h2>
        <p className="text-slate-500 mb-6">You need to identify your room to make requests.</p>
        <Link to="/guest/feedback" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg">
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <div className="bg-blue-600 -mx-4 -mt-4 p-6 pb-12 rounded-b-3xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-serif font-bold mb-1">e-Butler</h1>
          <p className="text-blue-100 text-sm">Room {roomNumber} • At your service.</p>
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-4 border-white/10"></div>
      </div>

      {requests.length > 0 && (
        <div className="-mt-8 relative z-20 bg-white rounded-xl shadow-md p-4 border border-slate-100">
           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Active Requests</h3>
           <div className="space-y-3 max-h-[200px] overflow-y-auto">
             {requests.map(req => (
               <div key={req.id} className="flex justify-between items-center border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                 <div className="flex items-center gap-3">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center ${req.status === TicketStatus.OPEN ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                     {req.status === TicketStatus.OPEN ? <Clock size={14} /> : <CheckCircle2 size={14} />}
                   </div>
                   <div>
                     <p className="font-medium text-sm text-slate-800">{req.item}</p>
                     <p className="text-xs text-slate-400">{req.category}</p>
                   </div>
                 </div>
                 <span className="text-xs font-bold text-slate-500">{req.status === TicketStatus.OPEN ? 'In Progress' : 'Done'}</span>
               </div>
             ))}
           </div>
        </div>
      )}

      <div>
        <h2 className="font-bold text-lg text-slate-800 mb-4">How can we help?</h2>
        <div className="grid grid-cols-2 gap-4">
           {SERVICE_REQUEST_OPTIONS.map((opt) => {
             const Icon = CATEGORY_ICONS[opt.category] || Bell;
             return (
               <motion.button
                 key={opt.category}
                 whileTap={{ scale: 0.95 }}
                 onClick={() => handleCategoryClick(opt.category)}
                 className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-3 hover:shadow-md transition-all"
               >
                 <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                   <Icon size={24} />
                 </div>
                 <span className="font-medium text-sm text-slate-700">{opt.category}</span>
               </motion.button>
             )
           })}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && activeCategory && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-slate-800">{activeCategory}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 rounded-full"><X size={18}/></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-2 block">Select Item</label>
                  <div className="flex flex-wrap gap-2">
                    {SERVICE_REQUEST_OPTIONS.find(o => o.category === activeCategory)?.items.map(item => (
                      <button key={item} onClick={() => setSelectedItem(item)} className={`px-4 py-2 rounded-full text-sm border transition-colors ${selectedItem === item ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>{item}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-2 block">Notes (Optional)</label>
                  <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500" rows={3} placeholder="Any specific instructions..." />
                </div>
                <Button onClick={handleSubmit} className="w-full h-12 text-lg mt-4" disabled={!selectedItem} isLoading={loading}>Request Service</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

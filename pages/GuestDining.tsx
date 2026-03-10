import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDining } from '../services/db';
import { DiningVenue } from '../types';
import { Star, X, Clock, ChevronRight, Utensils, Coffee, Wine, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { submitDiningBooking } from '../services/db';
import { RequestCategory } from '../types';
import { useGuest } from '../context/GuestContext';

const MENU_HIGHLIGHTS = [
  { name: 'Grilled Sea Bass', price: '$38', tag: 'Chef\'s Special', emoji: '🐟', desc: 'Sourced daily, Mediterranean herbs' },
  { name: 'Truffle Risotto', price: '$32', tag: 'Vegetarian', emoji: '🍄', desc: 'Aged parmesan, black truffle shavings' },
  { name: 'Wagyu Ribeye', price: '$95', tag: 'Premium Cut', emoji: '🥩', desc: 'Grade A5, smoked sea salt, asparagus' },
  { name: 'Lobster Thermidor', price: '$78', tag: 'Signature', emoji: '🦞', desc: 'Cognac cream sauce, gruyere crust' },
];

const VENUE_IMAGES: Record<string, string> = {
  default0: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
  default1: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
  default2: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
};

export const GuestDining: React.FC = () => {
  const [venues, setVenues] = useState<DiningVenue[]>([]);
  const [selected, setSelected] = useState<DiningVenue | null>(null);
  const [bookingVenue, setBookingVenue] = useState<DiningVenue | null>(null);
  const [bookingTime, setBookingTime] = useState('');
  const [bookingGuests, setBookingGuests] = useState(2);
  const [booked, setBooked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { guestName, roomNumber, isAuthenticated } = useGuest();

  useEffect(() => { getDining().then(setVenues); }, []);

  const getVenueImage = (venue: DiningVenue, index: number) =>
    venue.image || VENUE_IMAGES[`default${index % 3}`];

  const handleBook = async () => {
    if (!bookingTime || !bookingVenue) return;

    setIsSubmitting(true);

    if (isAuthenticated) {
      try {
        await submitDiningBooking({
          roomNumber,
          guestName,
          venueId: bookingVenue.id,
          venueName: bookingVenue.name,
          bookingTime,
          guestCount: bookingGuests
        });
      } catch (e) {
        console.error("Failed to book table:", e);
      }
    }

    setIsSubmitting(false);
    setBooked(true);
    setTimeout(() => {
      setBooked(false);
      setBookingVenue(null);
      setBookingTime('');
      setBookingGuests(2);
    }, 3000);
  };
  const displayVenues: DiningVenue[] = venues.length > 0 ? venues : [
    { id: '1', name: 'The Azure Grill', cuisine: 'Mediterranean Fine Dining', image: VENUE_IMAGES.default0, isOpen: true, rating: 4.9 },
    { id: '2', name: 'Sands Café', cuisine: 'Casual Beachfront Bites', image: VENUE_IMAGES.default1, isOpen: true, rating: 4.7 },
    { id: '3', name: 'Luna Rooftop Bar', cuisine: 'Cocktails & Small Plates', image: VENUE_IMAGES.default2, isOpen: false, rating: 4.8 },
  ];

  return (
    <div className="pb-28">
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-b-[3rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center gap-2 mb-2 relative z-10">
          <Utensils size={18} className="text-amber-400" />
          <span className="text-amber-400 text-[10px] font-bold uppercase tracking-widest">Gastronomy</span>
        </div>
        <h1 className="text-4xl font-serif font-bold mb-2 relative z-10 tracking-tight">Dining & Drinks</h1>
        <p className="text-slate-300 text-sm font-medium relative z-10">World-class cuisine crafted by Michelin-starred chefs</p>
      </div>

      {/* Menu Highlights Strip */}
      <div className="mt-8 px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif font-bold text-slate-800 text-xl">Today's Highlights</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar -mx-6 px-6 snap-x">
          {MENU_HIGHLIGHTS.map((item, i) => (
            <div key={i} className="flex-shrink-0 bg-white border border-slate-100 rounded-3xl p-5 flex flex-col gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-w-[240px] snap-center hover:-translate-y-1 transition-transform cursor-pointer">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-amber-100/50">{item.emoji}</div>
                <span className="text-xs bg-slate-50 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-full font-bold">{item.tag}</span>
              </div>
              <div>
                <p className="font-bold text-slate-800 text-lg">{item.name}</p>
                <p className="text-xs text-slate-400 font-medium line-clamp-1 mb-2">{item.desc}</p>
                <p className="font-bold text-amber-600 text-lg">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Venue Cards */}
      <div className="px-6 space-y-6">
        {displayVenues.map((venue, index) => (
          <motion.div
            key={venue.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected(venue)}
            className="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 cursor-pointer group"
          >
            <div className="h-64 relative overflow-hidden">
              <img
                src={getVenueImage(venue, index)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Status Badge */}
              <div className={`absolute top-5 left-5 px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 shadow-lg backdrop-blur-md ${venue.isOpen ? 'bg-emerald-500/90 text-white' : 'bg-slate-900/80 text-slate-300'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${venue.isOpen ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
                {venue.isOpen ? 'Open Now' : 'Closed'}
              </div>

              {/* Rating */}
              <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-lg text-slate-800">
                <Star size={12} className="text-amber-500 fill-amber-500" />
                {venue.rating}
              </div>

              {/* Title on image */}
              <div className="absolute bottom-5 left-5 right-5">
                <h3 className="text-2xl font-serif font-bold text-white mb-1 group-hover:text-amber-200 transition-colors">{venue.name}</h3>
                <p className="text-white/80 text-sm font-medium">{venue.cuisine}</p>
              </div>
            </div>

            <div className="px-6 py-4 flex items-center justify-between bg-white relative">
              <div className="flex items-center gap-6 text-xs text-slate-500 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-2"><Clock size={16} className="text-amber-500" /> {index === 0 ? '12pm – 11pm' : index === 1 ? '7am – 6pm' : '5pm – 2am'}</span>
                <span className="flex items-center gap-2"><Utensils size={16} className="text-slate-400" /> {index === 0 ? 'Table Service' : index % 2 === 0 ? 'Bar Seating' : 'Casual'}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <ChevronRight size={18} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Sheet */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="relative bg-white w-full max-w-lg rounded-t-[2.5rem] max-h-[90vh] overflow-y-auto hide-scrollbar shadow-2xl">
              <div className="relative">
                <div className="h-72 w-full relative">
                  <img src={getVenueImage(selected, displayVenues.indexOf(selected))} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90" />
                  <button onClick={() => setSelected(null)} className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-colors">
                    <X size={20} />
                  </button>
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block">Restaurant</span>
                    <h2 className="text-3xl font-serif font-bold text-white mb-1">{selected.name}</h2>
                    <p className="text-slate-300 text-sm font-medium">{selected.cuisine}</p>
                  </div>
                </div>

                <div className="p-6 space-y-8 bg-white rounded-t-[2.5rem] relative -mt-6">
                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:bg-slate-800 transition-colors active:scale-95"
                      onClick={() => { setBookingVenue(selected); setSelected(null); }}
                    >
                      Reserve Table <ArrowRight size={16} />
                    </button>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-slate-800 mb-4 text-xl flex items-center gap-2">
                      <Star size={18} className="text-amber-500 fill-amber-500" /> Signature Dishes
                    </h4>
                    <div className="space-y-4">
                      {MENU_HIGHLIGHTS.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 transition-colors group">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-white group-hover:shadow-sm transition-all">{item.emoji}</div>
                            <div>
                              <p className="font-bold text-slate-800 text-base">{item.name}</p>
                              <p className="text-xs text-slate-400 font-medium group-hover:text-slate-600 transition-colors">{item.desc}</p>
                            </div>
                          </div>
                          <span className="font-bold text-amber-600 text-lg bg-amber-50 px-3 py-1 rounded-full">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Premium Booking Modal */}
      <AnimatePresence>
        {bookingVenue && (
          <div className="fixed inset-0 z-[70] flex items-end justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setBookingVenue(null)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="relative bg-white w-full max-w-md rounded-t-[2.5rem] p-8 shadow-2xl">
              {booked ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-12 text-center">
                  <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-inner">🍽️</div>
                  <h3 className="text-3xl font-serif font-bold text-slate-900 mb-2">Table Confirmed</h3>
                  <p className="text-slate-500 font-medium">Your reservation at <span className="text-slate-800 font-bold">{bookingVenue.name}</span><br />is set for {bookingTime} for {bookingGuests} guests.</p>
                </motion.div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-amber-600 tracking-widest mb-1">Make Reservation</p>
                      <h3 className="text-2xl font-serif font-bold text-slate-900">{bookingVenue.name}</h3>
                    </div>
                    <button onClick={() => setBookingVenue(null)} className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 transition-colors"><X size={18} /></button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Select Time</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['6:00 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'].map(t => (
                          <button key={t} onClick={() => setBookingTime(t)}
                            className={`py-3 rounded-xl text-sm font-bold transition-all ${bookingTime === t ? 'bg-slate-900 text-white shadow-md scale-105' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:scale-105'}`}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Party Size</label>
                      <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-2 border border-slate-100">
                        <button onClick={() => setBookingGuests(Math.max(1, bookingGuests - 1))} className="w-12 h-12 bg-white shadow-sm rounded-xl font-bold text-xl text-slate-600 hover:text-slate-900">-</button>
                        <div className="flex flex-col items-center">
                          <span className="text-3xl font-serif font-bold text-slate-900">{bookingGuests}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Guests</span>
                        </div>
                        <button onClick={() => setBookingGuests(Math.min(12, bookingGuests + 1))} className="w-12 h-12 bg-white shadow-sm rounded-xl font-bold text-xl text-slate-600 hover:text-slate-900">+</button>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button onClick={handleBook} disabled={!bookingTime} className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${!bookingTime ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/30 active:scale-95'}`}>
                        Confirm Booking <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

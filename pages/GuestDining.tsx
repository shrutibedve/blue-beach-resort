
import React, { useEffect, useState } from 'react';
import { getDining } from '../services/db';
import { DiningVenue } from '../types';
import { Clock, Star, MapPin } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const GuestDining: React.FC = () => {
  const [venues, setVenues] = useState<DiningVenue[]>([]);

  useEffect(() => { getDining().then(setVenues); }, []);

  return (
    <div className="p-4 space-y-6 pb-24">
      <h1 className="text-2xl font-serif font-bold text-slate-800">Dining & Drinks</h1>
      <div className="space-y-6">
        {venues.map(venue => (
          <div key={venue.id} className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100">
            <div className="h-48 bg-slate-200 relative">
               <img src={venue.image} className="w-full h-full object-cover" />
               <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                 <Star size={12} className="text-yellow-500 fill-yellow-500" /> {venue.rating}
               </div>
               <div className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white ${venue.isOpen ? 'bg-green-500' : 'bg-red-500'}`}>
                 {venue.isOpen ? 'Open Now' : 'Closed'}
               </div>
            </div>
            <div className="p-5">
               <h3 className="text-xl font-bold text-slate-900 mb-1">{venue.name}</h3>
               <p className="text-slate-500 text-sm mb-4">{venue.cuisine}</p>
               <div className="flex gap-2">
                 <Button size="sm" className="flex-1">Book Table</Button>
                 <Button size="sm" variant="outline" className="flex-1">View Menu</Button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

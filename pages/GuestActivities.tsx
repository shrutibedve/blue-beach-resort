
import React, { useEffect, useState } from 'react';
import { getEvents } from '../services/db';
import { ResortEvent } from '../types';
import { Calendar, MapPin, Clock } from 'lucide-react';

export const GuestActivities: React.FC = () => {
  const [events, setEvents] = useState<ResortEvent[]>([]);

  useEffect(() => { getEvents().then(setEvents); }, []);

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="flex justify-between items-end">
        <h1 className="text-2xl font-serif font-bold text-slate-800">Daily Schedule</h1>
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Today</span>
      </div>
      
      <div className="relative border-l-2 border-blue-100 pl-6 space-y-8 ml-2">
        {events.map((evt, i) => (
          <div key={evt.id} className="relative">
            <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white"></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex gap-4">
               <img src={evt.image} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
               <div>
                 <span className="text-xs font-bold text-blue-600 block mb-1">{evt.time}</span>
                 <h3 className="font-bold text-slate-800">{evt.title}</h3>
                 <div className="flex items-center gap-1 text-xs text-slate-400 mt-1 mb-2">
                   <MapPin size={10} /> {evt.location}
                 </div>
                 <p className="text-xs text-slate-500 line-clamp-2">{evt.description}</p>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

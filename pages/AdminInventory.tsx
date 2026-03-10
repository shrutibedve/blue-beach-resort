
import React, { useEffect, useState } from 'react';
import { getInventory } from '../services/db';
import { InventoryItem } from '../types';
import { Package, AlertCircle } from 'lucide-react';
import { useSocketEvent } from '../services/useRealtimeSocket';

export const AdminInventory: React.FC = () => {
   const [items, setItems] = useState<InventoryItem[]>([]);

   const load = () => getInventory().then(setItems);

   useEffect(() => {
      load();
   }, []);

   useSocketEvent('inventory:updated', load);
   useSocketEvent('inventory:insert', load);

   return (
      <div className="space-y-6">
         <h1 className="text-2xl font-bold text-slate-800">Inventory & Stock</h1>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(item => (
               <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.status === 'CRITICAL' ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                        <Package size={24} />
                     </div>
                     <div>
                        <h3 className="font-bold text-slate-800">{item.name}</h3>
                        <p className="text-sm text-slate-500">{item.category} • Last: {item.lastRestocked}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-2xl font-bold text-slate-800">{item.quantity}</p>
                     <p className="text-xs text-slate-400 uppercase">{item.unit}</p>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};


import React, { useEffect, useState } from 'react';
import { getStaffStats, updateStaffStatus } from '../services/db';
import { StaffStat, StaffStatus } from '../types';
import { UserCheck, Clock, Star, Award } from 'lucide-react';

export const AdminStaff: React.FC = () => {
  const [staff, setStaff] = useState<StaffStat[]>([]);

  useEffect(() => { loadStaff(); }, []);

  const loadStaff = async () => {
    const data = await getStaffStats();
    setStaff(data);
  };

  const toggleStatus = async (id: string, current: StaffStatus) => {
    const next = current === StaffStatus.ON_SHIFT ? StaffStatus.OFF_SHIFT : StaffStatus.ON_SHIFT;
    await updateStaffStatus(id, next);
    loadStaff();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-slate-800">Staff Roster</h1>
         <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span> On Shift</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-300"></span> Off Shift</div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map(member => (
          <div key={member.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col gap-4 relative overflow-hidden">
            {member.status === StaffStatus.ON_SHIFT && <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-bl-full"></div>}
            
            <div className="flex items-start justify-between z-10">
              <div className="flex items-center gap-4">
                <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-full object-cover border-4 border-slate-50" />
                <div>
                   <h3 className="font-bold text-lg">{member.name}</h3>
                   <p className="text-slate-500 text-sm">{member.role}</p>
                </div>
              </div>
              <button 
                onClick={() => toggleStatus(member.id, member.status)}
                className={`px-3 py-1 rounded-full text-xs font-bold border ${member.status === StaffStatus.ON_SHIFT ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500'}`}
              >
                {member.status.replace('_', ' ')}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
               <div className="bg-slate-50 p-3 rounded-lg text-center">
                 <p className="text-xs text-slate-400 uppercase tracking-wider">Rating</p>
                 <div className="flex items-center justify-center gap-1 text-blue-600 font-bold text-lg">
                   {member.avgRating} <Star size={14} fill="currentColor" />
                 </div>
               </div>
               <div className="bg-slate-50 p-3 rounded-lg text-center">
                 <p className="text-xs text-slate-400 uppercase tracking-wider">Mentions</p>
                 <div className="flex items-center justify-center gap-1 text-purple-600 font-bold text-lg">
                   {member.positiveMentions} <Award size={14} />
                 </div>
               </div>
            </div>

            {member.shiftStart && (
              <div className="text-xs text-slate-400 flex items-center gap-1 mt-auto pt-2 border-t border-slate-100">
                <Clock size={12} /> Shift started at {member.shiftStart}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

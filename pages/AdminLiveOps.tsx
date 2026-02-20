
import React, { useEffect, useState } from 'react';
import { 
  Grid, List, Filter, RefreshCcw, CheckCircle, XCircle, 
  AlertTriangle, BedDouble, User
} from 'lucide-react';
import { RoomStatus, RoomState } from '../types';
import { getRoomStatusGrid, updateRoomStatus } from '../services/db';

export const AdminLiveOps: React.FC = () => {
  const [rooms, setRooms] = useState<RoomStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<RoomState | 'ALL'>('ALL');

  useEffect(() => {
    loadGrid();
  }, []);

  const loadGrid = async () => {
    setLoading(true);
    const data = await getRoomStatusGrid();
    setRooms(data);
    setLoading(false);
  };

  const handleStatusToggle = async (roomNumber: string, currentState: RoomState) => {
    // Simple toggle logic for demo: Clean -> Occupied -> Dirty -> Clean
    let nextState = RoomState.CLEAN;
    if(currentState === RoomState.CLEAN) nextState = RoomState.OCCUPIED;
    else if(currentState === RoomState.OCCUPIED) nextState = RoomState.DIRTY;
    else if(currentState === RoomState.DIRTY) nextState = RoomState.CLEAN;
    
    await updateRoomStatus(roomNumber, nextState);
    setRooms(prev => prev.map(r => r.roomNumber === roomNumber ? { ...r, state: nextState } : r));
  };

  const filteredRooms = filter === 'ALL' ? rooms : rooms.filter(r => r.state === filter);

  const getStatusColor = (state: RoomState) => {
    switch(state) {
      case RoomState.CLEAN: return 'bg-green-100 border-green-200 text-green-800';
      case RoomState.DIRTY: return 'bg-slate-200 border-slate-300 text-slate-600 opacity-75';
      case RoomState.OCCUPIED: return 'bg-blue-100 border-blue-200 text-blue-800';
      case RoomState.DND: return 'bg-red-100 border-red-200 text-red-800';
      case RoomState.MAINTENANCE: return 'bg-orange-100 border-orange-200 text-orange-800';
      default: return 'bg-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-lg text-slate-800">Room Status Grid</h2>
          {loading && <RefreshCcw className="animate-spin text-blue-500" size={16} />}
        </div>
        
        <div className="flex gap-2">
           {[
             { label: 'All', val: 'ALL' },
             { label: 'Clean', val: RoomState.CLEAN },
             { label: 'Occupied', val: RoomState.OCCUPIED },
             { label: 'Dirty', val: RoomState.DIRTY },
             { label: 'DND', val: RoomState.DND },
           ].map(f => (
             <button
               key={f.val}
               onClick={() => setFilter(f.val as any)}
               className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                 filter === f.val ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
               }`}
             >
               {f.label}
             </button>
           ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {filteredRooms.map(room => (
          <div 
            key={room.roomNumber}
            onClick={() => handleStatusToggle(room.roomNumber, room.state)}
            className={`
              relative aspect-square rounded-xl border-2 p-3 flex flex-col justify-between cursor-pointer hover:scale-105 transition-transform
              ${getStatusColor(room.state)}
            `}
          >
            <div className="flex justify-between items-start">
              <span className="font-black text-lg opacity-80">{room.roomNumber}</span>
              {room.state === RoomState.DND && <AlertTriangle size={16} />}
              {room.state === RoomState.CLEAN && <CheckCircle size={16} />}
            </div>

            <div className="text-xs font-medium truncate">
              {room.state === RoomState.OCCUPIED ? (
                <div className="flex items-center gap-1"><User size={12}/> {room.guestName}</div>
              ) : (
                <span className="uppercase">{room.state}</span>
              )}
            </div>
            
            {room.nextTask && (
               <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white border border-slate-200 shadow-sm px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap">
                 {room.nextTask}
               </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-6 justify-center text-xs text-slate-500 mt-8">
         <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-400"></div> Clean / Ready</div>
         <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-400"></div> Occupied</div>
         <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-400"></div> Dirty / Turnover</div>
         <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-400"></div> Do Not Disturb</div>
      </div>
    </div>
  );
};

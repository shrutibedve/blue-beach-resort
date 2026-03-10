
import React, { useEffect, useState } from 'react';
import {
  Grid, List, Filter, RefreshCcw, CheckCircle, XCircle,
  AlertTriangle, BedDouble, User
} from 'lucide-react';
import { RoomStatus, RoomState } from '../types';
import { getRoomStatusGrid, updateRoomStatus } from '../services/db';
import { useSocketEvent } from '../services/useRealtimeSocket';

export const AdminLiveOps: React.FC = () => {
  const [rooms, setRooms] = useState<RoomStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<RoomState | 'ALL'>('ALL');

  const loadGrid = async () => {
    setLoading(true);
    const data = await getRoomStatusGrid();
    setRooms(data);
    setLoading(false);
  };

  useEffect(() => {
    loadGrid();
  }, []);

  useSocketEvent('room:updated', loadGrid);

  const handleStatusToggle = async (roomNumber: string, currentState: RoomState) => {
    let nextState = RoomState.CLEAN;
    if (currentState === RoomState.CLEAN) nextState = RoomState.OCCUPIED;
    else if (currentState === RoomState.OCCUPIED) nextState = RoomState.DIRTY;
    else if (currentState === RoomState.DIRTY) nextState = RoomState.CLEAN;

    await updateRoomStatus(roomNumber, nextState);
    setRooms(prev => prev.map(r => r.roomNumber === roomNumber ? { ...r, state: nextState } : r));
  };

  const filteredRooms = filter === 'ALL' ? rooms : rooms.filter(r => r.state === filter);

  const getStatusColor = (state: RoomState) => {
    switch (state) {
      case RoomState.CLEAN: return 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-emerald-500/10 hover:shadow-emerald-500/20';
      case RoomState.DIRTY: return 'bg-slate-100 border-slate-200 text-slate-500 shadow-slate-500/5 hover:shadow-slate-500/10';
      case RoomState.OCCUPIED: return 'bg-blue-50 border-blue-200 text-blue-700 shadow-blue-500/10 hover:shadow-blue-500/20';
      case RoomState.DND: return 'bg-rose-50 border-rose-200 text-rose-700 shadow-rose-500/10 hover:shadow-rose-500/20';
      case RoomState.MAINTENANCE: return 'bg-amber-50 border-amber-200 text-amber-700 shadow-amber-500/10 hover:shadow-amber-500/20';
      default: return 'bg-white border-slate-100';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Premium Controls Header */}
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner border border-blue-100/50">
            <BedDouble size={24} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-serif font-bold text-2xl text-slate-900 tracking-tight">Live Room Status</h2>
              {loading && <RefreshCcw className="animate-spin text-blue-500" size={16} />}
            </div>
            <p className="text-sm font-medium text-slate-500 mt-0.5">Real-time occupancy and housekeeping grid</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 relative z-10 bg-slate-50/80 p-1.5 rounded-2xl border border-slate-100 shadow-inner">
          {[
            { label: 'All Rooms', val: 'ALL' },
            { label: 'Clean', val: RoomState.CLEAN },
            { label: 'Occupied', val: RoomState.OCCUPIED },
            { label: 'Dirty', val: RoomState.DIRTY },
            { label: 'DND', val: RoomState.DND },
          ].map(f => (
            <button
              key={f.val}
              onClick={() => setFilter(f.val as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === f.val ? 'bg-white text-blue-600 shadow-md transform scale-105' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-5">
        {filteredRooms.map(room => (
          <div
            key={room.roomNumber}
            onClick={() => handleStatusToggle(room.roomNumber, room.state)}
            className={`
              relative aspect-square rounded-[1.5rem] border-2 p-4 flex flex-col justify-between cursor-pointer hover:-translate-y-1 transition-all duration-300 shadow-lg group
              ${getStatusColor(room.state)}
            `}
          >
            <div className="flex justify-between items-start">
              <span className="font-serif font-bold text-3xl tracking-tighter opacity-90 group-hover:scale-110 origin-top-left transition-transform">{room.roomNumber}</span>
              <div className="w-8 h-8 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center shadow-sm">
                {room.state === RoomState.DND && <AlertTriangle size={14} className="text-rose-600" />}
                {room.state === RoomState.CLEAN && <CheckCircle size={14} className="text-emerald-600" />}
                {room.state === RoomState.DIRTY && <RefreshCcw size={14} className="text-slate-500" />}
                {room.state === RoomState.OCCUPIED && <User size={14} className="text-blue-600" />}
              </div>
            </div>

            <div className="text-[11px] font-bold uppercase tracking-widest truncate bg-white/40 backdrop-blur-md py-1.5 px-3 rounded-lg border border-white/20 shadow-sm mt-auto mb-1">
              {room.state === RoomState.OCCUPIED ? (
                <div className="flex items-center gap-1.5 truncate"><span className="truncate">{room.guestName}</span></div>
              ) : (
                <span>{room.state}</span>
              )}
            </div>

            {room.nextTask && (
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white shadow-xl px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest whitespace-nowrap z-10 border border-slate-700">
                {room.nextTask}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-8 justify-center items-center text-xs font-bold text-slate-500 mt-12 bg-white/60 backdrop-blur-md py-4 px-8 rounded-full shadow-sm border border-slate-100 w-max mx-auto uppercase tracking-widest">
        <div className="flex items-center gap-2.5"><div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div> Clean / Ready</div>
        <div className="flex items-center gap-2.5"><div className="w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]"></div> Occupied</div>
        <div className="flex items-center gap-2.5"><div className="w-3 h-3 rounded-full bg-slate-300"></div> Dirty / Turnover</div>
        <div className="flex items-center gap-2.5"><div className="w-3 h-3 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.5)]"></div> Do Not Disturb</div>
      </div>
    </div>
  );
};

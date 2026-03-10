import React, { useEffect, useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  LayoutDashboard, MessageSquare, AlertCircle, ThumbsUp, ThumbsDown,
  Search, Download, Menu, X, Calendar, Filter, Wrench, Users, Star, Award, CheckSquare, TrendingUp, TrendingDown, Clock, ChevronRight, Utensils, Bell
} from 'lucide-react';
import { getFeedbackStats, getMaintenanceTickets, getStaffStats, updateTicketStatus, getServiceRequests, getDiningBookings } from '../services/db';
import { FeedbackRecord, ServiceCategory, MaintenanceTicket, StaffStat, TicketStatus, TicketPriority } from '../types';
import { Button } from '../components/ui/Button';
import { useSocketEvent } from '../services/useRealtimeSocket';
import { supabase } from '../services/supabaseClient';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

type TimeFilter = 'day' | 'week' | 'month' | 'year';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<{ total: number; avgSentiment: number; records: FeedbackRecord[] } | null>(null);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [staffStats, setStaffStats] = useState<StaffStat[]>([]);
  const [butlerRequests, setButlerRequests] = useState<any[]>([]);
  const [diningBookings, setDiningBookings] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState('overview');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');

  const loadAll = async () => {
    const data = await getFeedbackStats();
    setStats(data);
    setTickets(await getMaintenanceTickets());
    setStaffStats(await getStaffStats());
    setButlerRequests(await getServiceRequests());
    setDiningBookings(await getDiningBookings());
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Real-time listeners via WebSocket
  useSocketEvent('feedback:insert', loadAll);
  useSocketEvent('query:new', loadAll);
  useSocketEvent('ticket:new', loadAll);
  useSocketEvent('ticket:updated', loadAll);
  useSocketEvent('service:new', loadAll);
  useSocketEvent('service:updated', loadAll);
  useSocketEvent('dining_booking:new', loadAll);
  useSocketEvent('dining_booking:updated', loadAll);

  const filteredRecords = useMemo(() => {
    if (!stats) return [];
    const now = new Date();
    return stats.records.filter(r => {
      const d = new Date(r.createdAt);
      if (timeFilter === 'day') return d.toDateString() === now.toDateString();
      if (timeFilter === 'week') return (now.getTime() - d.getTime()) / (1000 * 3600 * 24) <= 7;
      if (timeFilter === 'month') return (now.getTime() - d.getTime()) / (1000 * 3600 * 24) <= 30;
      if (timeFilter === 'year') return (now.getTime() - d.getTime()) / (1000 * 3600 * 24) <= 365;
      return true;
    });
  }, [stats, timeFilter]);

  const sentimentData = useMemo(() => {
    const grouped: Record<string, { sum: number, count: number }> = {};
    filteredRecords.forEach(r => {
      const dateKey = new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      if (!grouped[dateKey]) grouped[dateKey] = { sum: 0, count: 0 };
      grouped[dateKey].sum += r.overallSentiment;
      grouped[dateKey].count += 1;
    });
    return Object.keys(grouped).map(k => ({
      date: k,
      sentiment: grouped[k].sum / grouped[k].count
    })).reverse();
  }, [filteredRecords]);

  const categoryCounts = useMemo(() => {
    return filteredRecords.flatMap(r => r.items).reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [filteredRecords]);

  const pieData = Object.keys(categoryCounts).map(k => ({ name: k, value: categoryCounts[k] }));

  const handleTicketStatus = async (id: string, newStatus: TicketStatus) => {
    const updated = await updateTicketStatus(id, newStatus);
    setTickets(prev => prev.map(t => t.id === id ? updated : t));
  };

  const getSentimentColor = (val: number) => {
    if (val > 0) return 'text-emerald-500';
    if (val < 0) return 'text-rose-500';
    return 'text-amber-500';
  };

  const TicketCard: React.FC<{ ticket: MaintenanceTicket }> = ({ ticket }) => (
    <div className="bg-white p-4 justify-between flex flex-col rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 mb-4 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all cursor-pointer group">
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${ticket.priority === TicketPriority.URGENT ? 'bg-rose-50 text-rose-600 border border-rose-100' :
            ticket.priority === TicketPriority.HIGH ? 'bg-amber-50 text-amber-600 border border-amber-100' :
              'bg-blue-50 text-blue-600 border border-blue-100'
            }`}>
            {ticket.priority}
          </span>
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1"><Clock size={12} /> {new Date(ticket.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="font-bold text-slate-800 mb-1 leading-snug">Rm {ticket.roomNumber} - {ticket.category}</p>
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">{ticket.issueDescription}</p>
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 border border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-600">
            {ticket.assignedTo ? ticket.assignedTo[0] : '?'}
          </div>
          <span className="text-xs font-bold text-slate-600">{ticket.assignedTo || 'Unassigned'}</span>
        </div>
        {ticket.status !== TicketStatus.DONE && (
          <button
            onClick={(e) => { e.stopPropagation(); handleTicketStatus(ticket.id, ticket.status === TicketStatus.OPEN ? TicketStatus.IN_PROGRESS : TicketStatus.DONE); }}
            className="text-xs font-bold bg-slate-50 border border-slate-200 hover:bg-blue-600 hover:border-blue-600 text-slate-600 hover:text-white px-3 py-1.5 rounded-full transition-all group-hover:shadow-md flex items-center gap-1"
          >
            Move <ChevronRight size={12} />
          </button>
        )}
      </div>
    </div>
  );

  if (!stats) return <div className="min-h-[60vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-6">
      <div className="w-16 h-16 relative">
        <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-slate-500 font-bold uppercase tracking-widest text-sm animate-pulse">Initializing Dashboard...</p>
    </div>
  </div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex gap-1 overflow-x-auto w-full md:w-auto p-1">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'feedback', label: 'Live Feed', icon: MessageSquare },
            { id: 'maintenance', label: 'Work Orders', icon: Wrench },
            { id: 'staff', label: 'Staff Roster', icon: Users },
            { id: 'butler', label: 'Butler Requests', icon: Bell },
            { id: 'dining', label: 'Dining Bookings', icon: Utensils },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? 'text-blue-400' : ''} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 px-2 w-full md:w-auto justify-between md:justify-end">
          <div className="bg-slate-50 rounded-xl p-1 flex text-sm font-bold text-slate-500 border border-slate-100 shadow-inner">
            {(['day', 'week', 'month', 'year'] as TimeFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setTimeFilter(f)}
                className={`px-4 py-1.5 rounded-lg capitalize transition-all ${timeFilter === f ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' : 'hover:text-slate-800'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <button className="hidden sm:flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-bold px-4 py-2 rounded-xl transition-all shadow-sm text-sm">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* CONTENT AREAS */}

      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Premium KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-100 transition-colors" />
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100/50 shadow-inner">
                  <MessageSquare size={24} />
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100"><TrendingUp size={12} /> 12%</span>
              </div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1 relative z-10">Total Feedback</p>
              <div className="flex items-end gap-3 relative z-10">
                <p className="text-4xl font-serif font-bold text-slate-900">{filteredRecords.length}</p>
                <p className="text-sm text-slate-400 font-medium mb-1">submissions</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-100 transition-colors" />
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100/50 shadow-inner">
                  <ThumbsUp size={24} />
                </div>
              </div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1 relative z-10">Net Sentiment</p>
              <div className="flex items-end gap-3 relative z-10">
                <p className={`text-4xl font-serif font-bold ${getSentimentColor(filteredRecords.length > 0 ? (filteredRecords.reduce((a, b) => a + b.overallSentiment, 0) / filteredRecords.length) : 0)}`}>
                  {filteredRecords.length > 0
                    ? (filteredRecords.reduce((a, b) => a + b.overallSentiment, 0) / filteredRecords.length).toFixed(2)
                    : '0.00'}
                </p>
                <p className="text-sm text-slate-400 font-medium mb-1">scale -1 to +1</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-rose-100 transition-colors" />
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center border border-rose-100/50 shadow-inner">
                  <AlertCircle size={24} />
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100"><TrendingDown size={12} /> 3%</span>
              </div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1 relative z-10">Flagged Issues</p>
              <div className="flex items-end gap-3 relative z-10">
                <p className="text-4xl font-serif font-bold text-slate-900">{filteredRecords.filter(r => r.isFlagged).length}</p>
                <p className="text-sm text-slate-400 font-medium mb-1">needs review</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-100 transition-colors" />
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center border border-purple-100/50 shadow-inner">
                  <Award size={24} />
                </div>
              </div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1 relative z-10">Top Category</p>
              <div className="flex items-end gap-3 relative z-10">
                <p className="text-2xl font-serif font-bold text-slate-900 truncate">
                  {pieData.length > 0 ? pieData.sort((a, b) => b.value - a.value)[0].name : '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="font-serif font-bold text-2xl text-slate-900">Sentiment Trend</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">Average guest satisfaction over time</p>
                </div>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sentimentData}>
                    <defs>
                      <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="date" fontSize={12} stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} />
                    <YAxis domain={[-1, 1]} fontSize={12} stroke="#94a3b8" tickLine={false} axisLine={false} dx={-10} />
                    <RechartsTooltip
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', padding: '12px 20px', fontWeight: 'bold' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sentiment"
                      stroke="#3B82F6"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorSentiment)"
                      activeDot={{ r: 8, strokeWidth: 0, fill: '#2563EB' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <div>
                <h3 className="font-serif font-bold text-2xl text-slate-900">Feedback Mix</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">Distribution across categories</p>
              </div>
              <div className="h-72 w-full flex items-center justify-center mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={8}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 20px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-4">
                {pieData.slice(0, 4).map((entry, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-slate-600 font-medium bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                    <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    {entry.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-serif font-bold text-2xl text-slate-900">Live Guest Feed</h3>
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search feedback..." className="pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm font-medium w-64 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/50 text-slate-500">
                <tr>
                  <th className="px-8 py-5 font-bold uppercase tracking-widest text-[10px]">Date</th>
                  <th className="px-8 py-5 font-bold uppercase tracking-widest text-[10px]">Guest / Room</th>
                  <th className="px-8 py-5 font-bold uppercase tracking-widest text-[10px]">Sentiment</th>
                  <th className="px-8 py-5 font-bold uppercase tracking-widest text-[10px]">Topics Focus</th>
                  <th className="px-8 py-5 font-bold uppercase tracking-widest text-[10px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map(r => (
                  <tr key={r.id} className="hover:bg-blue-50/30 transition-colors cursor-pointer group">
                    <td className="px-8 py-5 text-slate-500 font-medium whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-slate-900 text-base">{r.guestName}</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Room {r.roomNumber}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${r.overallSentiment > 0 ? 'bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 border border-emerald-100' :
                          r.overallSentiment < 0 ? 'bg-gradient-to-br from-rose-100 to-rose-50 text-rose-600 border border-rose-100' : 'bg-gradient-to-br from-amber-100 to-amber-50 text-amber-600 border border-amber-100'
                          }`}>
                          {r.gesture === 'THUMBS_UP' && <ThumbsUp size={20} />}
                          {r.gesture === 'THUMBS_DOWN' && <ThumbsDown size={20} />}
                          {r.gesture === 'WAVE' && <span className="text-2xl drop-shadow-sm">👋</span>}
                          {r.gesture === 'NONE' && <span className="text-sm font-bold">{(r.overallSentiment * 100).toFixed(0)}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex gap-2 flex-wrap max-w-xs">
                        {r.items.map((i, idx) => (
                          <span key={idx} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm group-hover:border-blue-200 transition-colors">
                            {i.category}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${r.status === 'NEW' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                        r.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                        {r.status.toLowerCase().replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredRecords.length === 0 && (
                  <tr><td colSpan={5} className="px-8 py-10 text-center text-slate-500 font-medium">No feedback records found for this period.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-6 min-w-[1200px]">
            {/* Column: Open */}
            <div className="flex-1 bg-slate-50/50 rounded-3xl p-6 flex flex-col border border-slate-200 border-dashed h-[700px] relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-rose-500 rounded-t-3xl opacity-80" />
              <div className="flex justify-between items-center mb-6 mt-2">
                <h3 className="font-serif font-bold text-slate-800 text-xl flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div> Needs Action
                </h3>
                <span className="text-sm bg-white shadow-sm border border-slate-200 px-3 py-1 rounded-full text-slate-700 font-bold">{tickets.filter(t => t.status === TicketStatus.OPEN).length}</span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                {tickets.filter(t => t.status === TicketStatus.OPEN).map(t => (
                  <TicketCard key={t.id} ticket={t} />
                ))}
              </div>
            </div>

            {/* Column: In Progress */}
            <div className="flex-1 bg-slate-50/50 rounded-3xl p-6 flex flex-col border border-slate-200 border-dashed h-[700px] relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-500 rounded-t-3xl opacity-80" />
              <div className="flex justify-between items-center mb-6 mt-2">
                <h3 className="font-serif font-bold text-slate-800 text-xl flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse"></div> In Progress
                </h3>
                <span className="text-sm bg-white shadow-sm border border-slate-200 px-3 py-1 rounded-full text-slate-700 font-bold">{tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length}</span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                {tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).map(t => (
                  <TicketCard key={t.id} ticket={t} />
                ))}
              </div>
            </div>

            {/* Column: Done */}
            <div className="flex-1 bg-slate-50/50 rounded-3xl p-6 flex flex-col border border-slate-200 border-dashed h-[700px] relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500 rounded-t-3xl opacity-80" />
              <div className="flex justify-between items-center mb-6 mt-2">
                <h3 className="font-serif font-bold text-slate-800 text-xl flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div> Resolved
                </h3>
                <span className="text-sm bg-white shadow-sm border border-slate-200 px-3 py-1 rounded-full text-slate-700 font-bold">{tickets.filter(t => t.status === TicketStatus.DONE).length}</span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                {tickets.filter(t => t.status === TicketStatus.DONE).map(t => (
                  <div key={t.id} className="opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                    <TicketCard ticket={t} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-10 mb-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <h2 className="text-4xl font-serif font-bold mb-4 relative z-10">Staff Excellence Leaderboard</h2>
            <p className="text-blue-100 text-lg max-w-xl relative z-10 leading-relaxed font-medium">Recognizing our exceptional team members who provide unforgettable experiences based on real guest sentiment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {staffStats.sort((a, b) => b.avgRating - a.avgRating).map((staff, index) => (
              <div key={staff.id} className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all transform hover:-translate-y-2 group">
                {index === 0 && (
                  <div className="absolute top-0 right-0 bg-gradient-to-bl from-amber-400 to-yellow-500 text-yellow-950 text-xs font-bold px-4 py-2 rounded-bl-3xl flex items-center gap-2 shadow-md">
                    <Award size={14} /> Top Performer
                  </div>
                )}
                {index === 1 && (
                  <div className="absolute top-0 right-0 bg-slate-200 text-slate-700 text-[10px] font-bold px-4 py-1.5 rounded-bl-3xl">Rank 2</div>
                )}
                {index === 2 && (
                  <div className="absolute top-0 right-0 bg-orange-200 text-orange-800 text-[10px] font-bold px-4 py-1.5 rounded-bl-3xl">Rank 3</div>
                )}

                <div className="flex items-center gap-5 mb-8 mt-2">
                  <div className="relative">
                    <img src={staff.avatar} alt={staff.name} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-500 relative z-10" />
                    {index === 0 && <div className="absolute inset-0 border-4 border-amber-400 rounded-full z-20 scale-105 opacity-50"></div>}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-slate-900 group-hover:text-blue-600 transition-colors">{staff.name}</h3>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">{staff.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                  <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100 group-hover:border-blue-100 transition-colors">
                    <p className="text-3xl font-serif font-bold text-blue-600 mb-1">{staff.avgRating}</p>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Avg Rating</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100 group-hover:border-emerald-100 transition-colors">
                    <p className="text-3xl font-serif font-bold text-emerald-600 mb-1">{staff.positiveMentions}</p>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Pos. Mentions</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-center gap-2 bg-slate-50/50 py-3 rounded-full border border-slate-100">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={20} className={`${s <= Math.round(staff.avgRating) ? 'text-amber-400 fill-amber-400 drop-shadow-sm' : 'text-slate-200'}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'butler' && (
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100"><h3 className="font-serif font-bold text-2xl text-slate-900">Butler Requests</h3></div>
          <div className="p-6">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/50 text-slate-500">
                <tr><th className="px-4 py-2">Date</th><th className="px-4 py-2">Room</th><th className="px-4 py-2">Item</th><th className="px-4 py-2">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {butlerRequests.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">{new Date(r.created_at || r.createdAt || Date.now()).toLocaleString()}</td>
                    <td className="px-4 py-3">{r.room_number || r.roomNumber}</td>
                    <td className="px-4 py-3">{r.item} - {r.note}</td>
                    <td className="px-4 py-3 font-bold text-slate-600">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'dining' && (
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100"><h3 className="font-serif font-bold text-2xl text-slate-900">Dining Bookings</h3></div>
          <div className="p-6">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/50 text-slate-500">
                <tr><th className="px-4 py-2">Date</th><th className="px-4 py-2">Room</th><th className="px-4 py-2">Venue</th><th className="px-4 py-2">Time</th><th className="px-4 py-2">Guests</th><th className="px-4 py-2">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {diningBookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">{new Date(b.created_at || b.createdAt || Date.now()).toLocaleString()}</td>
                    <td className="px-4 py-3">{b.room_number || b.roomNumber}</td>
                    <td className="px-4 py-3 font-bold">{b.venue_name || b.venueName}</td>
                    <td className="px-4 py-3">{b.booking_time}</td>
                    <td className="px-4 py-3">{b.guest_count}</td>
                    <td className="px-4 py-3 font-bold text-slate-600">{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};


import React, { useEffect, useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import {
  LayoutDashboard, MessageSquare, AlertCircle, ThumbsUp, ThumbsDown,
  Search, Download, Menu, X, Calendar, Filter, Wrench, Users, Star, Award, CheckSquare
} from 'lucide-react';
import { getFeedbackStats, getMaintenanceTickets, getStaffStats, updateTicketStatus } from '../services/db';
import { FeedbackRecord, ServiceCategory, MaintenanceTicket, StaffStat, TicketStatus, TicketPriority } from '../types';
import { Button } from '../components/ui/Button';

const COLORS = ['#0B78D1', '#00C49F', '#FFBB28', '#FF8042', '#FF4D4D', '#8884d8', '#82ca9d', '#ec4899'];

type TimeFilter = 'day' | 'week' | 'month' | 'year';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<{ total: number; avgSentiment: number; records: FeedbackRecord[] } | null>(null);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [staffStats, setStaffStats] = useState<StaffStat[]>([]);

  const [activeTab, setActiveTab] = useState('overview');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');

  useEffect(() => {
    const load = async () => {
      const data = await getFeedbackStats();
      setStats(data);
      setTickets(await getMaintenanceTickets());
      setStaffStats(await getStaffStats());
    };
    load();
  }, []);

  // Filter Data based on Time Selection
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

  // Analytics Calculations
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

  // --- Components for Tabs ---

  const TicketCard: React.FC<{ ticket: MaintenanceTicket }> = ({ ticket }) => (
    <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 mb-3 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${ticket.priority === TicketPriority.URGENT ? 'bg-red-50 border-red-100 text-red-600' :
          ticket.priority === TicketPriority.HIGH ? 'bg-orange-50 border-orange-100 text-orange-600' :
            'bg-blue-50 border-blue-100 text-blue-600'
          }`}>
          {ticket.priority}
        </span>
        <span className="text-xs text-slate-400">{new Date(ticket.createdAt).toLocaleDateString()}</span>
      </div>
      <p className="font-semibold text-sm text-slate-800 mb-1">Rm {ticket.roomNumber} - {ticket.category}</p>
      <p className="text-xs text-slate-500 line-clamp-2 mb-2">{ticket.issueDescription}</p>
      <div className="flex justify-between items-center pt-2 border-t border-slate-50">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold">
            {ticket.assignedTo ? ticket.assignedTo[0] : '?'}
          </div>
          {ticket.assignedTo || 'Unassigned'}
        </div>
        {ticket.status !== TicketStatus.DONE && (
          <button
            onClick={() => handleTicketStatus(ticket.id, ticket.status === TicketStatus.OPEN ? TicketStatus.IN_PROGRESS : TicketStatus.DONE)}
            className="text-xs bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 px-2 py-1 rounded transition-colors"
          >
            Move &rarr;
          </button>
        )}
      </div>
    </div>
  );

  if (!stats) return <div className="min-h-[400px] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium">Crunching analytics...</p>
    </div>
  </div>;

  return (
    <div className="space-y-6">

      {/* Tab Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex bg-white p-1 rounded-xl border border-slate-200">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'feedback', label: 'Feed', icon: MessageSquare },
            { id: 'maintenance', label: 'Tickets', icon: Wrench },
            { id: 'staff', label: 'Staff', icon: Users },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white rounded-lg p-1 flex text-sm font-medium text-slate-600 border border-slate-200">
            {(['day', 'week', 'month', 'year'] as TimeFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setTimeFilter(f)}
                className={`px-3 py-1 rounded-md capitalize transition-all ${timeFilter === f ? 'bg-slate-100 text-blue-600 font-bold' : 'hover:text-slate-900'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <Button size="sm" variant="outline"><Download size={14} className="mr-2" /> Export</Button>
        </div>
      </div>

      {/* CONTENT AREAS */}

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Feedback</p>
                <MessageSquare size={16} className="text-blue-500 opacity-50" />
              </div>
              <p className="text-3xl font-bold text-slate-800">{filteredRecords.length}</p>
              <p className="text-xs text-slate-400 mt-1">in selected period</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Net Sentiment</p>
                <ThumbsUp size={16} className="text-green-500 opacity-50" />
              </div>
              <div className="flex items-baseline gap-2">
                <p className={`text-3xl font-bold ${filteredRecords.length > 0
                  ? (filteredRecords.reduce((a, b) => a + b.overallSentiment, 0) / filteredRecords.length > 0 ? 'text-green-600' : 'text-red-500')
                  : 'text-slate-400'
                  }`}>
                  {filteredRecords.length > 0
                    ? (filteredRecords.reduce((a, b) => a + b.overallSentiment, 0) / filteredRecords.length).toFixed(2)
                    : '0.00'}
                </p>
                <span className="text-xs text-slate-400">scale -1 to +1</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Flagged Issues</p>
                <AlertCircle size={16} className="text-red-500 opacity-50" />
              </div>
              <p className="text-3xl font-bold text-red-500">{filteredRecords.filter(r => r.isFlagged).length}</p>
              <p className="text-xs text-slate-400 mt-1">Requires attention</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Top Category</p>
                <Filter size={16} className="text-purple-500 opacity-50" />
              </div>
              <p className="text-xl font-bold text-slate-800 truncate">
                {pieData.length > 0 ? pieData.sort((a, b) => b.value - a.value)[0].name : '-'}
              </p>
              <p className="text-xs text-slate-400 mt-1">Most reviewed service</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4">Sentiment Trend</h3>
              <div className="h-72 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={300}>
                  <LineChart data={sentimentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="date" fontSize={12} stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} />
                    <YAxis domain={[-1, 1]} fontSize={12} stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <RechartsTooltip
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sentiment"
                      stroke="#0B78D1"
                      strokeWidth={3}
                      dot={{ r: 3, fill: '#0B78D1', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4">Feedback Mix</h3>
              <div className="h-72 w-full flex items-center justify-center min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {pieData.slice(0, 4).map((entry, index) => (
                  <div key={index} className="flex items-center gap-1 text-xs text-slate-500">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    {entry.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Guest</th>
                  <th className="px-6 py-4 font-medium">Sentiment</th>
                  <th className="px-6 py-4 font-medium">Topics</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map(r => (
                  <tr key={r.id} className="hover:bg-blue-50/50 transition-colors cursor-pointer group">
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{r.guestName}</p>
                      <p className="text-xs text-slate-400">Rm {r.roomNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${r.overallSentiment > 0 ? 'bg-green-100 text-green-600' :
                          r.overallSentiment < 0 ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                          }`}>
                          {r.gesture === 'THUMBS_UP' && <ThumbsUp size={18} />}
                          {r.gesture === 'THUMBS_DOWN' && <ThumbsDown size={18} />}
                          {r.gesture === 'WAVE' && <span className="text-xl">👋</span>}
                          {r.gesture === 'NONE' && <span className="text-xs font-bold">{(r.overallSentiment * 100).toFixed(0)}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {r.items.map((i, idx) => (
                          <span key={idx} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 shadow-sm">
                            {i.category}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${r.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                        r.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                        {r.status.toLowerCase().replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="overflow-x-auto">
          <div className="flex gap-6 min-w-[1000px]">
            {/* Column: Open */}
            <div className="flex-1 bg-slate-100 rounded-xl p-4 flex flex-col border border-slate-200/50 h-[600px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div> Open Tickets
                </h3>
                <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full text-slate-600">{tickets.filter(t => t.status === TicketStatus.OPEN).length}</span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2">
                {tickets.filter(t => t.status === TicketStatus.OPEN).map(t => (
                  <TicketCard key={t.id} ticket={t} />
                ))}
              </div>
            </div>

            {/* Column: In Progress */}
            <div className="flex-1 bg-slate-100 rounded-xl p-4 flex flex-col border border-slate-200/50 h-[600px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div> In Progress
                </h3>
                <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full text-slate-600">{tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length}</span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2">
                {tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).map(t => (
                  <TicketCard key={t.id} ticket={t} />
                ))}
              </div>
            </div>

            {/* Column: Done */}
            <div className="flex-1 bg-slate-100 rounded-xl p-4 flex flex-col border border-slate-200/50 h-[600px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div> Resolved
                </h3>
                <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full text-slate-600">{tickets.filter(t => t.status === TicketStatus.DONE).length}</span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2">
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
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900">Staff Excellence Leaderboard</h2>
            <p className="text-slate-500">Recognizing our top performers based on guest sentiment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffStats.sort((a, b) => b.avgRating - a.avgRating).map((staff, index) => (
              <div key={staff.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 relative overflow-hidden hover:shadow-md transition-all transform hover:-translate-y-1">
                {index === 0 && (
                  <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
                    <Award size={12} /> #1 Employee
                  </div>
                )}

                <div className="flex items-center gap-4 mb-4">
                  <img src={staff.avatar} alt={staff.name} className="w-16 h-16 rounded-full object-cover border-4 border-blue-50" />
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{staff.name}</h3>
                    <p className="text-sm text-slate-500">{staff.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{staff.avgRating}</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Avg Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{staff.positiveMentions}</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Mentions</p>
                  </div>
                </div>

                <div className="mt-4 flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={16} className={`${s <= Math.round(staff.avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

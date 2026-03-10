import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, Search, Bot, Send, User, Clock, CheckCircle2, Sparkles,
  MoreVertical, Filter
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { getQueries, updateQueryReply, autoReplyPendingQueries } from '../services/db';
import { GuestQuery, QueryStatus } from '../types';
import { useSocketEvent } from '../services/useRealtimeSocket';

export const GuestQueries: React.FC = () => {
  const [queries, setQueries] = useState<GuestQuery[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isAutoPilot, setIsAutoPilot] = useState(false);

  const loadQueries = async () => {
    const data = await getQueries();
    setQueries(data);
    if (data.length > 0 && !selectedId) setSelectedId(data[0].id);
  };

  useEffect(() => {
    loadQueries();
  }, []);

  useSocketEvent('query:new', loadQueries);
  useSocketEvent('query:replied', loadQueries);
  useSocketEvent('query:updated', loadQueries);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAutoPilot) {
      interval = setInterval(async () => {
        const updated = await autoReplyPendingQueries();
        setQueries(updated);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPilot]);

  const handleSendReply = async () => {
    if (!selectedId || !replyText.trim()) return;
    const updated = await updateQueryReply(selectedId, replyText, false);
    setQueries(prev => prev.map(q => q.id === selectedId ? updated : q));
    setReplyText('');
  };

  const toggleAutoPilot = async () => {
    const newState = !isAutoPilot;
    setIsAutoPilot(newState);
    if (newState) {
      const updated = await autoReplyPendingQueries();
      setQueries(updated);
    }
  };

  const selectedQuery = queries.find(q => q.id === selectedId);
  const pendingCount = queries.filter(q => q.status === QueryStatus.PENDING).length;

  return (
    <div className="flex h-[calc(100vh-100px)] bg-slate-50/50 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden m-4 relative animate-in fade-in duration-500">

      {/* Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 pointer-events-none" />

      {/* Left Sidebar - List */}
      <div className="w-[400px] bg-white/80 backdrop-blur-xl border-r border-slate-100 flex flex-col relative z-10 shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-white/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif font-bold text-2xl text-slate-900 flex items-center gap-3">
              Concierge Desk
            </h2>
            {pendingCount > 0 && (
              <div className="flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100 shadow-sm animate-pulse-slow">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-700">{pendingCount} Pending</span>
              </div>
            )}
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 z-10" size={16} />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 relative z-10 shadow-sm transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar bg-slate-50/30">
          {queries.length === 0 ? (
            <div className="p-8 text-center text-slate-400 flex flex-col items-center">
              <MessageCircle size={32} className="opacity-20 mb-3" />
              <p className="text-sm font-medium">No messages yet</p>
            </div>
          ) : queries.map(query => (
            <div
              key={query.id}
              onClick={() => setSelectedId(query.id)}
              className={`p-5 border-b border-slate-100 cursor-pointer transition-all relative ${selectedId === query.id ? 'bg-white shadow-[0_0_20px_rgba(0,0,0,0.03)] z-10 before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:bg-blue-600' : 'hover:bg-white/50'}`}
            >
              <div className="flex justify-between items-start mb-1.5 pl-1">
                <h3 className={`font-bold text-base tracking-tight ${selectedId === query.id ? 'text-blue-950' : 'text-slate-800'}`}>
                  {query.guestName}
                </h3>
                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                  {new Date(query.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">Suite {query.roomNumber}</p>
              <p className="text-sm text-slate-600 line-clamp-2 mb-3 pl-1 font-medium">{query.queryText}</p>

              <div className="flex items-center gap-2 pl-1">
                {query.status === QueryStatus.PENDING && (
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-rose-50 text-rose-600 rounded-md border border-rose-100">Needs Reply</span>
                )}
                {query.status === QueryStatus.REPLIED && (
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-md flex items-center gap-1 border border-emerald-100">
                    <CheckCircle2 size={12} className="text-emerald-500" /> Handled
                  </span>
                )}
                {query.status === QueryStatus.AUTO_REPLIED && (
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md flex items-center gap-1.5 border border-purple-100 shadow-sm">
                    <Sparkles size={10} className="text-purple-500" /> AI Resolved
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content - Chat Interface */}
      <div className="flex-1 flex flex-col relative z-0 bg-transparent">
        {/* Auto-Pilot Toggle Bar */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-4 flex justify-between items-center shadow-sm relative z-20">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner transition-colors ${isAutoPilot ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
              <Bot size={20} />
            </div>
            <div>
              <p className="font-serif font-bold text-lg text-slate-900 tracking-tight">AI Copilot</p>
              <p className="text-xs font-medium text-slate-500">Autonomous Concierge Response System</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl">
            <span className={`text-xs font-bold uppercase tracking-widest ${isAutoPilot ? 'text-purple-600' : 'text-slate-400'}`}>
              {isAutoPilot ? 'Monitoring' : 'Offline'}
            </span>
            <button
              onClick={toggleAutoPilot}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none shadow-inner ${isAutoPilot ? 'bg-purple-600' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${isAutoPilot ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {selectedQuery ? (
          <>
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 relative z-10 scroll-smooth">
              {/* Daily Divider */}
              <div className="flex items-center justify-center my-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-white/80 backdrop-blur px-4 py-1.5 rounded-full shadow-sm border border-slate-100">
                  {new Date(selectedQuery.createdAt).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
              </div>

              {/* Guest Message */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0 relative mt-4">
                  <User className="text-slate-500" size={18} />
                </div>
                <div className="max-w-xl">
                  <div className="flex items-baseline gap-2 mb-1 pl-1">
                    <span className="font-bold text-slate-800">{selectedQuery.guestName}</span>
                  </div>
                  <div className="bg-white p-5 rounded-[2rem] rounded-tl-sm shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 text-slate-700 font-medium leading-relaxed">
                    {selectedQuery.queryText}
                  </div>
                  <div className="mt-2 pl-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                    {new Date(selectedQuery.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              {/* Reply */}
              {selectedQuery.status !== QueryStatus.PENDING && (
                <div className="flex gap-4 flex-row-reverse">
                  <div className={`w-10 h-10 rounded-full border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0 relative mt-4 ${selectedQuery.isAiGenerated ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-slate-800'}`}>
                    {selectedQuery.isAiGenerated ? <Sparkles className="text-white drop-shadow-sm" size={16} /> : <User className="text-white" size={18} />}
                  </div>
                  <div className="max-w-xl flex flex-col items-end">
                    <div className="flex items-baseline gap-2 mb-1 pr-1">
                      <span className="font-bold text-slate-800">{selectedQuery.isAiGenerated ? 'AI Copilot' : 'Concierge'}</span>
                    </div>
                    <div className={`p-5 rounded-[2rem] rounded-tr-sm shadow-[0_4px_20px_rgb(0,0,0,0.06)] font-medium leading-relaxed ${selectedQuery.isAiGenerated ? 'bg-indigo-50 border border-indigo-100 text-indigo-900' : 'bg-blue-600 text-white border border-blue-500'}`}>
                      {selectedQuery.replyText}
                    </div>
                    <div className="mt-2 pr-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 text-slate-400">
                      {selectedQuery.isAiGenerated && <span className="text-purple-500 flex items-center gap-1"><Bot size={12} /> Auto-Generated</span>}
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            {selectedQuery.status === QueryStatus.PENDING && (
              <div className="bg-white/80 backdrop-blur-xl border-t border-slate-100 p-6 relative z-20">
                <div className="flex items-end gap-3 max-w-4xl mx-auto align-bottom">
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-[2rem] p-2 focus-within:bg-white focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all shadow-inner">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Draft a response..."
                      className="w-full bg-transparent px-4 py-3 outline-none resize-none text-sm font-medium text-slate-700 min-h-[50px] max-h-[150px]"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendReply(); }
                      }}
                    />
                  </div>
                  <Button onClick={handleSendReply} className="h-[64px] w-[64px] !p-0 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform">
                    <Send size={24} className="ml-1" />
                  </Button>
                </div>

                <div className="max-w-4xl mx-auto mt-4 px-4 flex justify-between items-center">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Press Enter ↵ to reply</p>
                  {!isAutoPilot && (
                    <button
                      onClick={async () => {
                        setReplyText("...");
                        setTimeout(() => {
                          const responses = [
                            "Certainly! I've sent a request to housekeeping. They will attend to your room shortly.",
                            "Our infinity pool remains open until 10:00 PM tonight. Enjoy your swim!",
                            "Yes, absolutely. The Azure Grill is open and we can reserve a table for you at 8 PM."
                          ];
                          setReplyText(responses[Math.floor(Math.random() * responses.length)]);
                        }, 600);
                      }}
                      className="text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest text-purple-600 bg-purple-50 border border-purple-100 flex items-center gap-1.5 hover:bg-purple-100 transition-colors"
                    >
                      <Bot size={12} /> Auto-Draft
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 relative z-10">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-6 relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20" />
              <MessageCircle size={32} className="text-slate-300" />
            </div>
            <p className="font-serif font-bold text-2xl text-slate-800 mb-2">No Conversation Selected</p>
            <p className="text-sm font-medium text-slate-500 max-w-xs text-center">Select a guest query from the sidebar to view details or send a response.</p>
          </div>
        )}
      </div>
    </div>
  );
};
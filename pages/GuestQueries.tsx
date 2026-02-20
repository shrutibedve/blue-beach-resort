import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Search, Bot, Send, User, Clock, CheckCircle2, Sparkles,
  MoreVertical, Filter
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { getQueries, updateQueryReply, autoReplyPendingQueries } from '../services/db';
import { GuestQuery, QueryStatus } from '../types';

export const GuestQueries: React.FC = () => {
  const [queries, setQueries] = useState<GuestQuery[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isAutoPilot, setIsAutoPilot] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadQueries();
  }, []);

  // Poll for updates when autopilot is on
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

  const loadQueries = async () => {
    const data = await getQueries();
    setQueries(data);
    if (data.length > 0 && !selectedId) setSelectedId(data[0].id);
  };

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
      // Trigger immediate run
      const updated = await autoReplyPendingQueries();
      setQueries(updated);
    }
  };

  const selectedQuery = queries.find(q => q.id === selectedId);

  const pendingCount = queries.filter(q => q.status === QueryStatus.PENDING).length;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-100 overflow-hidden">
      {/* Left Sidebar - List */}
      <div className="w-96 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl text-slate-800">Concierge</h2>
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
              <span className="relative flex h-2 w-2">
                {pendingCount > 0 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${pendingCount > 0 ? 'bg-blue-500' : 'bg-slate-300'}`}></span>
              </span>
              <span className="text-xs font-medium text-blue-700">{pendingCount} Pending</span>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search room or guest..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {queries.map(query => (
            <div 
              key={query.id}
              onClick={() => setSelectedId(query.id)}
              className={`p-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 ${selectedId === query.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className={`font-medium text-sm ${selectedId === query.id ? 'text-blue-900' : 'text-slate-800'}`}>
                  {query.guestName}
                </h3>
                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {new Date(query.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-2">Room {query.roomNumber}</p>
              <p className="text-sm text-slate-600 line-clamp-2 mb-2">{query.queryText}</p>
              
              <div className="flex items-center gap-2">
                {query.status === QueryStatus.PENDING && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">Pending</span>
                )}
                {query.status === QueryStatus.REPLIED && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={10} /> Replied
                  </span>
                )}
                {query.status === QueryStatus.AUTO_REPLIED && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full flex items-center gap-1">
                    <Bot size={10} /> AI Replied
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content - Chat Interface */}
      <div className="flex-1 flex flex-col bg-slate-50/50 relative">
        {/* Auto-Pilot Toggle Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center">
           <div className="flex items-center gap-2">
             <Bot className={isAutoPilot ? "text-purple-600" : "text-slate-400"} />
             <div>
               <p className="text-sm font-bold text-slate-800">AI Concierge Copilot</p>
               <p className="text-xs text-slate-500">Smart-reply active for specific hotel queries.</p>
             </div>
           </div>
           <div className="flex items-center gap-3">
             <span className={`text-xs font-medium ${isAutoPilot ? 'text-purple-600' : 'text-slate-400'}`}>
               {isAutoPilot ? 'Active & Monitoring' : 'Disabled'}
             </span>
             <button 
               onClick={toggleAutoPilot}
               className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${isAutoPilot ? 'bg-purple-600' : 'bg-slate-200'}`}
             >
               <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAutoPilot ? 'translate-x-6' : 'translate-x-1'}`} />
             </button>
           </div>
        </div>

        {selectedQuery ? (
          <>
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Guest Message */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                  <User className="text-slate-500" size={20} />
                </div>
                <div className="max-w-2xl">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-slate-800">{selectedQuery.guestName}</span>
                    <span className="text-xs text-slate-400">Room {selectedQuery.roomNumber}</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 text-slate-700">
                    {selectedQuery.queryText}
                  </div>
                  <div className="mt-1 text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={10} /> {new Date(selectedQuery.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Reply */}
              {selectedQuery.status !== QueryStatus.PENDING && (
                <div className="flex gap-4 flex-row-reverse">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${selectedQuery.isAiGenerated ? 'bg-purple-100' : 'bg-blue-100'}`}>
                    {selectedQuery.isAiGenerated ? <Bot className="text-purple-600" size={20} /> : <span className="text-blue-600 font-bold text-xs">STAFF</span>}
                  </div>
                  <div className="max-w-2xl">
                    <div className="flex items-baseline gap-2 mb-1 justify-end">
                      <span className="font-bold text-slate-800">{selectedQuery.isAiGenerated ? 'AI Concierge' : 'Front Desk'}</span>
                    </div>
                    <div className={`p-4 rounded-2xl rounded-tr-none shadow-sm text-slate-700 ${selectedQuery.isAiGenerated ? 'bg-purple-50 border border-purple-100' : 'bg-blue-600 text-white'}`}>
                      {selectedQuery.replyText}
                    </div>
                    {selectedQuery.isAiGenerated && (
                      <div className="mt-1 text-right text-xs text-purple-400 flex items-center justify-end gap-1">
                        <Sparkles size={10} /> Generated by Gemini
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            {selectedQuery.status === QueryStatus.PENDING && (
              <div className="bg-white border-t border-slate-200 p-4">
                <div className="flex items-start gap-2 max-w-4xl mx-auto">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm"
                    rows={2}
                  />
                  <Button onClick={handleSendReply} className="h-12 w-12 !p-0 rounded-xl">
                    <Send size={20} />
                  </Button>
                </div>
                <div className="max-w-4xl mx-auto mt-2 flex justify-between items-center">
                   <p className="text-xs text-slate-400">Press Enter to send</p>
                   {!isAutoPilot && (
                     <button 
                       onClick={async () => {
                         setReplyText("Thinking...");
                         // Trigger auto reply manually logic (simulated)
                         setTimeout(() => {
                            const responses = ["We have dispatched housekeeping to your room.", "The pool is open until 10pm.", "Room service is available 24/7."];
                            setReplyText(responses[Math.floor(Math.random() * responses.length)]);
                         }, 800);
                       }}
                       className="text-xs text-purple-600 font-medium flex items-center gap-1 hover:underline"
                     >
                       <Sparkles size={12} /> Generate Draft
                     </button>
                   )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <MessageCircle size={48} className="mb-4 opacity-20" />
            <p>Select a query to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};
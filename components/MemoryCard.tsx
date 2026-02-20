import React from 'react';
import { FeedbackRecord, GestureType } from '../types';
import { Share2, Download } from 'lucide-react';

interface MemoryCardProps {
  feedback: FeedbackRecord;
  prizeLabel?: string;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ feedback, prizeLabel }) => {
  return (
    <div className="w-full max-w-sm mx-auto bg-white p-6 rounded-none shadow-2xl border-8 border-white rotate-1 transform hover:rotate-0 transition-transform duration-500 relative overflow-hidden group">
      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 pointer-events-none"></div>
      
      {/* Header */}
      <div className="text-center border-b-2 border-slate-100 pb-4 mb-4 border-dashed">
        <h3 className="font-serif text-2xl font-bold text-blue-900 tracking-wider">Blue Beach</h3>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mt-1">Resort & Spa</p>
        <p className="text-[10px] text-slate-400 mt-2">{new Date().toLocaleDateString()}</p>
      </div>

      {/* Content */}
      <div className="space-y-4 relative z-10">
        <div className="flex justify-center items-center gap-4">
           <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center border-2 border-blue-100">
             {feedback.gesture === GestureType.THUMBS_UP && <span className="text-4xl">👍</span>}
             {feedback.gesture === GestureType.THUMBS_DOWN && <span className="text-4xl">👎</span>}
             {feedback.gesture === GestureType.WAVE && <span className="text-4xl">👋</span>}
             {feedback.gesture === GestureType.NONE && <span className="text-4xl">😎</span>}
           </div>
        </div>

        <div className="text-center">
          <p className="font-serif italic text-slate-600 text-lg">"{feedback.items[0]?.comment || 'An unforgettable stay.'}"</p>
        </div>

        {/* Top Emoji Ratings Row */}
        <div className="flex justify-center gap-3 py-2">
           {feedback.items.slice(0, 3).map((item, idx) => (
             <div key={idx} className="flex flex-col items-center">
               <span className="text-2xl filter drop-shadow-sm">{item.emoji || '⭐'}</span>
               <span className="text-[8px] uppercase font-bold text-slate-400 mt-1">{item.category.split(' ')[0]}</span>
             </div>
           ))}
        </div>

        {prizeLabel && (
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-center mt-4 transform -rotate-1">
            <p className="text-xs text-yellow-800 font-bold uppercase">Unlocked Reward</p>
            <p className="font-mono font-bold text-yellow-900 text-lg">{prizeLabel}</p>
          </div>
        )}

        <div className="pt-6 text-center">
           <p className="font-handwriting text-2xl text-blue-600 transform -rotate-3 font-bold opacity-80">See you soon!</p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-center">
        <button className="p-2 bg-slate-100 rounded-full hover:bg-blue-100 text-slate-600 hover:text-blue-600 transition-colors">
          <Share2 size={16} />
        </button>
        <button className="p-2 bg-slate-100 rounded-full hover:bg-blue-100 text-slate-600 hover:text-blue-600 transition-colors">
          <Download size={16} />
        </button>
      </div>
    </div>
  );
};
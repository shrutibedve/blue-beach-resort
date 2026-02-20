
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, ArrowLeft, Camera, Mic, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { GestureCapture } from '../components/GestureCapture';
import { TIMELINE_STAGES, EMOJI_RATINGS } from '../constants';
import { ServiceCategory, GestureType, FeedbackItem, Prize } from '../types';
import { submitFeedback } from '../services/db';
import { getRealTimeSuggestion, analyzeImageContent } from '../services/geminiService';
import { RewardWheel } from '../components/RewardWheel';
import { MemoryCard } from '../components/MemoryCard';
import { useGuest } from '../context/GuestContext';

export const GuestFeedback: React.FC = () => {
  const navigate = useNavigate();
  const { guestName, roomNumber, setGuestInfo, isAuthenticated } = useGuest();

  const [stageIndex, setStageIndex] = useState(isAuthenticated ? 0 : -1);
  const [loading, setLoading] = useState(false);
  const [prize, setPrize] = useState<Prize | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<any>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Local state for form inputs (login step)
  const [tempName, setTempName] = useState('');
  const [tempRoom, setTempRoom] = useState('');

  const [feedbackItems, setFeedbackItems] = useState<Record<string, FeedbackItem>>({});
  const [gesture, setGesture] = useState(GestureType.NONE);

  useEffect(() => {
    if (timelineRef.current && stageIndex >= 0 && stageIndex < TIMELINE_STAGES.length) {
      const el = timelineRef.current.children[stageIndex] as HTMLElement;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [stageIndex]);

  const handleLogin = () => {
    if (tempName && tempRoom) {
      setGuestInfo(tempName, tempRoom);
      setStageIndex(0);
    }
  };

  const currentStage = stageIndex >= 0 && stageIndex < TIMELINE_STAGES.length ? TIMELINE_STAGES[stageIndex] : null;

  const updateFeedbackItem = (cat: ServiceCategory, field: keyof FeedbackItem, value: any) => {
    setFeedbackItems(prev => ({
      ...prev,
      [cat]: {
        category: cat,
        rating: prev[cat]?.rating || 0,
        comment: prev[cat]?.comment || '',
        emoji: prev[cat]?.emoji,
        imageUrl: prev[cat]?.imageUrl,
        ...prev[cat],
        [field]: value
      }
    }));

    if (field === 'comment' && typeof value === 'string' && value.length > 5) {
      setAiSuggestion(null);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(async () => {
        const suggestion = await getRealTimeSuggestion(value, cat);
        if (suggestion) setAiSuggestion(suggestion);
      }, 2000);
    }
  };

  const handleEmojiSelect = (emojiData: typeof EMOJI_RATINGS[0]) => {
    if (!currentStage) return;
    updateFeedbackItem(currentStage.id, 'rating', emojiData.score);
    updateFeedbackItem(currentStage.id, 'emoji', emojiData.emoji);
  };

  const handleNext = () => {
    if (stageIndex < TIMELINE_STAGES.length - 1) {
      setStageIndex(prev => prev + 1);
    } else {
      setStageIndex(TIMELINE_STAGES.length);
    }
  };

  const handleSubmit = async (gestureOverride?: GestureType) => {
    setLoading(true);
    const finalGesture = gestureOverride || gesture;
    const items = Object.values(feedbackItems);

    try {
      const result = await submitFeedback({
        guestName: guestName,
        roomNumber: roomNumber,
        items,
        gesture: finalGesture
      });
      setSubmittedRecord(result.feedback);
      setStageIndex(TIMELINE_STAGES.length + 1);
    } catch (e) {
      console.error("Submission Error", e);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !currentStage) return;
    const file = e.target.files[0];
    setIsAnalyzingImage(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        updateFeedbackItem(currentStage.id, 'imageUrl', base64);
        const analysis = await analyzeImageContent(base64Data, currentStage.label);
        if (analysis) {
          updateFeedbackItem(currentStage.id, 'comment', analysis.caption);
          updateFeedbackItem(currentStage.id, 'rating', analysis.rating);
          updateFeedbackItem(currentStage.id, 'emoji', analysis.emoji);
        }
        setIsAnalyzingImage(false);
      };
    } catch (err) {
      console.error(err);
      setIsAnalyzingImage(false);
    }
  };

  // --- Sub-Components ---

  const WelcomeStage = () => (
    <div className="text-center space-y-8 px-4 py-8">
      <h1 className="text-3xl font-serif font-bold text-blue-900 mb-2">Your Story Matters</h1>
      <p className="text-slate-600 text-sm max-w-md mx-auto">Create a memory of your stay and unlock exclusive rewards.</p>
      <div className="max-w-sm mx-auto space-y-4 bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
        <input type="text" placeholder="Your Name" className="w-full p-3 bg-slate-50 rounded-lg border-b-2 border-slate-200" value={tempName} onChange={(e) => { e.preventDefault(); setTempName(e.target.value); }} />
        <input type="text" placeholder="Room Number" className="w-full p-3 bg-slate-50 rounded-lg border-b-2 border-slate-200" value={tempRoom} onChange={(e) => { e.preventDefault(); setTempRoom(e.target.value); }} />
        <Button className="w-full h-12 text-lg" onClick={handleLogin} disabled={!tempName || !tempRoom}>Start Journey</Button>
      </div>
    </div>
  );

  const TimelineStageView = () => {
    if (!currentStage) return null;
    const currentData: Partial<FeedbackItem> = feedbackItems[currentStage.id] || {};
    return (
      <div className="max-w-lg mx-auto w-full px-2">
        <div className="mb-8 overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex justify-between items-center min-w-[300px]" ref={timelineRef}>
            {TIMELINE_STAGES.map((stage, idx) => {
              const Icon = stage.icon;
              const isActive = idx === stageIndex;
              const isPast = idx < stageIndex;
              return (
                <div key={stage.id} className="flex flex-col items-center relative min-w-[60px] px-1">
                  {idx < TIMELINE_STAGES.length - 1 && (
                    <div className={`absolute left-1/2 top-4 w-full h-0.5 ${isPast ? 'bg-blue-500' : 'bg-slate-200'} -z-10`} style={{ width: 'calc(100%)' }}></div>
                  )}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-blue-600 text-white scale-110 shadow-md' : (isPast ? 'bg-blue-200 text-blue-700' : 'bg-slate-200 text-slate-400')}`}>
                    <Icon size={14} />
                  </div>
                  <span className={`text-[10px] mt-1 font-medium whitespace-nowrap ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>{stage.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={currentStage.id} className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative">
          <div className="p-6 text-center border-b border-slate-50 bg-slate-50/50">
            <h2 className="text-2xl font-bold text-slate-800">{currentStage.label}</h2>
            <p className="text-slate-500 text-sm">How was this part of your stay?</p>
          </div>
          <div className="p-6 flex flex-col items-center justify-center min-h-[180px] bg-slate-50/30 relative">
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
            <div className="flex gap-4 mb-6 w-full justify-center">
              <div className={`w-24 h-24 rounded-full border-4 border-dashed flex items-center justify-center transition-all duration-300 overflow-hidden relative group ${currentData.rating ? 'border-blue-500 bg-blue-50' : 'border-slate-300'}`}>
                {isAnalyzingImage ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  : currentData.imageUrl ? <img src={currentData.imageUrl} className="w-full h-full object-cover" />
                    : currentData.emoji ? <span className="text-4xl">{currentData.emoji}</span> : <currentStage.icon className="text-slate-300" size={32} />}
                {!currentData.imageUrl && !isAnalyzingImage && <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><Camera className="text-slate-600" /></button>}
              </div>
            </div>
            <div className="flex gap-2 justify-center w-full">
              {EMOJI_RATINGS.map(item => (
                <motion.button key={item.score} whileHover={{ scale: 1.2, y: -5 }} whileTap={{ scale: 0.9 }} onClick={() => handleEmojiSelect(item)} className={`text-2xl sm:text-3xl cursor-pointer p-1.5 sm:p-2 hover:bg-white rounded-full transition-colors ${currentData.rating === item.score ? 'bg-blue-100 ring-2 ring-blue-200' : ''}`}>{item.emoji}</motion.button>
              ))}
            </div>
          </div>
          <div className="p-6 pt-0 relative">
            <div className="relative group">
              <textarea placeholder="Any specific details?" className="w-full p-4 pr-12 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none" rows={3} value={currentData.comment || ''} onChange={(e) => { e.preventDefault(); updateFeedbackItem(currentStage.id, 'comment', e.target.value); }} />
              <AnimatePresence>
                {aiSuggestion && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute -top-10 right-0 bg-purple-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 max-w-[200px] z-20" onClick={() => { updateFeedbackItem(currentStage.id, 'comment', (currentData.comment || '') + " " + aiSuggestion); setAiSuggestion(null); }}>
                    <Sparkles size={10} className="text-yellow-300" /> {aiSuggestion}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="p-4 border-t border-slate-100 flex justify-between bg-white">
            <Button variant="ghost" onClick={() => setStageIndex(prev => prev - 1)} disabled={stageIndex === 0}><ArrowLeft size={18} /></Button>
            <Button onClick={handleNext} disabled={!currentData.rating}>Next <ArrowRight size={18} className="ml-2" /></Button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-3xl">
        <AnimatePresence mode="wait">
          {stageIndex === -1 && <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><WelcomeStage /></motion.div>}
          {stageIndex >= 0 && stageIndex < TIMELINE_STAGES.length && <motion.div key="timeline" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}><TimelineStageView /></motion.div>}
          {stageIndex === TIMELINE_STAGES.length && <motion.div key="gesture" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><GestureCapture onCapture={(g) => { setGesture(g); setTimeout(() => handleSubmit(g), 600); }} /></motion.div>}
          {stageIndex > TIMELINE_STAGES.length && <motion.div key="reward" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><div className="max-w-md mx-auto w-full text-center">{!prize ? <RewardWheel onSpinComplete={(p) => setPrize(p)} /> : <><h2 className="text-2xl font-bold text-blue-900 mb-4">Your Memory</h2><MemoryCard feedback={submittedRecord} prizeLabel={prize.label} /><Button className="mt-8" onClick={() => navigate('/guest')}>Home</Button></>}</div></motion.div>}
        </AnimatePresence>
      </div>
    </div>
  );
};

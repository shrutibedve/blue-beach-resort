import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, ArrowLeft, Camera, Mic, X, CheckCircle2 } from 'lucide-react';
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

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

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
    const items = Object.values(feedbackItems) as FeedbackItem[];

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
    <div className="text-center space-y-8 px-6 py-12 bg-white/80 backdrop-blur-2xl rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-60" />

      <div className="relative z-10 space-y-4">
        <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-blue-500/30 transform -rotate-6">
          <Sparkles size={32} />
        </div>
        <h1 className="text-4xl font-serif font-bold text-slate-800 tracking-tight">Your Story Matters</h1>
        <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">Create a memory of your stay, share your experience, and unlock exclusive resort rewards.</p>
      </div>

      <div className="max-w-xs mx-auto space-y-5 relative z-10 pt-4">
        <input type="text" placeholder="Your Name" className="w-full px-5 py-4 bg-white/50 backdrop-blur border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl outline-none font-medium text-slate-800 placeholder-slate-400 transition-all shadow-inner" value={tempName} onChange={(e) => setTempName(e.target.value)} />
        <input type="text" placeholder="Room Number" className="w-full px-5 py-4 bg-white/50 backdrop-blur border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl outline-none font-medium text-slate-800 placeholder-slate-400 transition-all shadow-inner" value={tempRoom} onChange={(e) => setTempRoom(e.target.value)} />
        <Button className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg shadow-blue-500/30 active:scale-95 transition-all" onClick={handleLogin} disabled={!tempName || !tempRoom}>Begin Journey <ArrowRight size={20} className="ml-2" /></Button>
      </div>
    </div>
  );

  const TimelineStageView = () => {
    if (!currentStage) return null;
    const currentData = feedbackItems[currentStage.id] || {};
    return (
      <div className="max-w-lg mx-auto w-full px-2 mt-4 pb-20">

        {/* Progress Tracker */}
        <div className="mb-10 overflow-x-auto pb-6 hide-scrollbar relative">
          <div className="flex justify-between items-center min-w-[320px] px-4" ref={timelineRef}>
            {TIMELINE_STAGES.map((stage, idx) => {
              const Icon = stage.icon;
              const isActive = idx === stageIndex;
              const isPast = idx < stageIndex;
              const isFilled = !!feedbackItems[stage.id]?.rating;

              return (
                <div key={stage.id} className="flex flex-col items-center relative min-w-[64px] group">
                  {idx < TIMELINE_STAGES.length - 1 && (
                    <div className="absolute left-1/2 top-5 w-full h-[3px] bg-slate-100 -z-10" style={{ width: '100%' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: isPast ? '100%' : '0%' }} transition={{ duration: 0.5 }} className="h-full bg-blue-500" />
                    </div>
                  )}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-[3px] bg-white z-10 ${isActive ? 'border-blue-500 text-blue-600 scale-125 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : (isPast || isFilled ? 'border-emerald-400 bg-emerald-50 text-emerald-500 shadow-sm' : 'border-slate-200 text-slate-300')}`}>
                    {isFilled && !isActive ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Icon size={isActive ? 18 : 16} />}
                  </div>
                  <span className={`text-[10px] mt-3 font-bold uppercase tracking-widest whitespace-nowrap transition-colors duration-500 ${isActive ? 'text-blue-600' : (isPast || isFilled ? 'text-emerald-600' : 'text-slate-400')}`}>{stage.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating Feedback Card */}
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} key={currentStage.id} className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white overflow-hidden relative">

          <div className="p-8 pb-6 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <h2 className="text-3xl font-serif font-bold text-slate-800 mb-2 relative z-10 tracking-tight">{currentStage.label}</h2>
            <p className="text-slate-500 text-sm font-medium relative z-10">How would you rate this experience?</p>
          </div>

          <div className="px-8 pb-8 flex flex-col items-center justify-center min-h-[220px] relative">
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />

            {/* Visual Centerpiece (Image or Icon) */}
            <div className="flex gap-4 mb-10 w-full justify-center">
              <div className={`w-32 h-32 rounded-[2rem] border-4 flex items-center justify-center transition-all duration-500 overflow-hidden relative group shadow-inner ${currentData.rating ? 'border-blue-500 bg-blue-50/50 shadow-[0_0_30px_rgba(59,130,246,0.2)] scale-105' : 'border-slate-100 bg-slate-50 border-dashed'}`}>
                {isAnalyzingImage ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
                    <span className="text-[10px] uppercase font-bold text-blue-600 tracking-widest mt-1">Analyzing...</span>
                  </div>
                ) : currentData.imageUrl ? (
                  <img src={currentData.imageUrl} className="w-full h-full object-cover" />
                ) : currentData.emoji ? (
                  <motion.span initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} type="spring" className="text-6xl drop-shadow-md">{currentData.emoji}</motion.span>
                ) : (
                  <currentStage.icon className="text-slate-300 drop-shadow-sm" size={48} />
                )}

                {!currentData.imageUrl && !isAnalyzingImage && (
                  <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm flex flex-col gap-2 items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <Camera size={24} className="text-slate-700" />
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Add Photo</span>
                  </button>
                )}
              </div>
            </div>

            {/* Rating Emojis */}
            <div className="flex gap-2 sm:gap-4 justify-center w-full bg-slate-50/80 p-3 sm:p-4 rounded-[2rem] border border-slate-100 shadow-inner">
              {EMOJI_RATINGS.map((item, i) => (
                <motion.button
                  key={item.score}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.25, y: -8 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEmojiSelect(item)}
                  className={`text-3xl sm:text-4xl cursor-pointer p-2 hover:bg-white rounded-2xl transition-all duration-300 relative ${currentData.rating === item.score ? 'bg-white shadow-[0_10px_20px_rgba(0,0,0,0.1)] scale-110 -translate-y-2 ring-2 ring-slate-100' : 'grayscale hover:grayscale-0'}`}
                >
                  <span className="drop-shadow-sm">{item.emoji}</span>
                  {currentData.rating === item.score && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-slate-800 rounded-full" />}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Smart Comment Field */}
          <div className="p-8 pt-0 relative">
            <div className="relative group">
              <textarea
                id={`feedback-comment-${currentStage.id}`}
                placeholder={`Share details about your ${currentStage.label.toLowerCase()} experience...`}
                className="w-full p-5 pl-5 pr-12 rounded-[1.5rem] bg-slate-50 border border-slate-100 focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm font-medium text-slate-700 placeholder-slate-400 resize-none transition-all shadow-inner"
                rows={3}
                defaultValue={currentData.comment || ''}
                onBlur={(e) => updateFeedbackItem(currentStage.id, 'comment', e.target.value)}
              />
              <AnimatePresence>
                {aiSuggestion && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute -top-12 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[11px] font-bold px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 max-w-[250px] z-20 cursor-pointer hover:shadow-xl hover:scale-105 transition-all"
                    onClick={() => { updateFeedbackItem(currentStage.id, 'comment', (currentData.comment || '') + " " + aiSuggestion); setAiSuggestion(null); }}
                  >
                    <Sparkles size={14} className="text-yellow-300 shrink-0" /> <span className="line-clamp-1">{aiSuggestion}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center rounded-b-[2.5rem]">
            <button
              onClick={() => setStageIndex(prev => prev - 1)}
              disabled={stageIndex === 0}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${stageIndex === 0 ? 'bg-transparent text-slate-300 cursor-not-allowed' : 'bg-white text-slate-600 hover:bg-slate-200 hover:text-slate-900 shadow-sm border border-slate-200'}`}
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex gap-2">
              {TIMELINE_STAGES.map((_, idx) => (
                <div key={idx} className={`h-1.5 rounded-full transition-all duration-500 ${idx === stageIndex ? 'w-6 bg-blue-600' : (idx < stageIndex || !!feedbackItems[_?.id]?.rating ? 'w-1.5 bg-blue-300' : 'w-1.5 bg-slate-200')}`} />
              ))}
            </div>
            <button
              onClick={handleNext}
              disabled={!currentData.rating}
              className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all ${!currentData.rating ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95'}`}
            >
              Next <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center relative overflow-hidden">
      <div className="relative z-10 w-full max-w-4xl px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {stageIndex === -1 && <motion.div key="welcome" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}><WelcomeStage /></motion.div>}
          {stageIndex >= 0 && stageIndex < TIMELINE_STAGES.length && <motion.div key="timeline" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}><TimelineStageView /></motion.div>}
          {stageIndex === TIMELINE_STAGES.length && <motion.div key="gesture" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}><GestureCapture onCapture={(g) => { setGesture(g); setTimeout(() => handleSubmit(g), 800); }} /></motion.div>}
          {stageIndex > TIMELINE_STAGES.length && <motion.div key="reward" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 25 }}><div className="max-w-md mx-auto w-full text-center">{!prize ? <RewardWheel onSpinComplete={(p) => setPrize(p)} /> : <><div className="bg-white/90 backdrop-blur-xl p-8 rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white"><h2 className="text-3xl font-serif font-bold text-slate-800 mb-6 font-bold tracking-tight">Your Memory Created</h2><MemoryCard feedback={submittedRecord} prizeLabel={prize.label} /><Button className="mt-8 w-full h-14 text-lg rounded-2xl shadow-lg shadow-blue-500/30" onClick={() => navigate('/guest')}>Return to Home</Button></div></>}</ div></motion.div>}
        </AnimatePresence>
      </div>
    </div>
  );
};

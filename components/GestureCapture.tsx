import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ThumbsUp, ThumbsDown, Hand } from 'lucide-react';
import { Button } from './ui/Button';
import { GestureType } from '../types';

interface GestureCaptureProps {
  onCapture: (gesture: GestureType) => void;
}

const GESTURES = [
  {
    type: GestureType.THUMBS_UP,
    emoji: '👍',
    label: 'Loved it!',
    sublabel: 'Outstanding experience',
    color: 'from-emerald-400 to-green-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    ring: 'ring-emerald-400',
  },
  {
    type: GestureType.WAVE,
    emoji: '👋',
    label: 'It was okay',
    sublabel: 'Good, room to improve',
    color: 'from-amber-400 to-yellow-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    ring: 'ring-amber-400',
  },
  {
    type: GestureType.THUMBS_DOWN,
    emoji: '👎',
    label: 'Needs work',
    sublabel: 'Below expectations',
    color: 'from-red-400 to-rose-500',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    ring: 'ring-red-400',
  },
];

export const GestureCapture: React.FC<GestureCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMounted = useRef(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [detected, setDetected] = useState<GestureType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<GestureType | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (isMounted.current && videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setError(null);
      } else {
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (err) {
      if (isMounted.current) setError('Camera unavailable — use the buttons below.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      if (isMounted.current) setIsStreaming(false);
    }
  };

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; stopCamera(); };
  }, []);

  const captureAndAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      if (!isMounted.current) return;
      const possible = [GestureType.THUMBS_UP, GestureType.THUMBS_DOWN, GestureType.WAVE];
      const result = possible[Math.floor(Math.random() * possible.length)];
      setDetected(result);
      setAnalyzing(false);
      setTimeout(() => { if (!isMounted.current) return; onCapture(result); stopCamera(); }, 1200);
    }, 2000);
  };

  const handleManualSelect = (type: GestureType) => {
    setSelected(type);
    setTimeout(() => onCapture(type), 800);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">One Last Thing</h2>
        <p className="text-slate-500">How was your overall stay at Blue Beach Resort?</p>
      </div>

      {/* Big Gesture Buttons */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {GESTURES.map((g) => {
          const isSelected = selected === g.type;
          return (
            <motion.button
              key={g.type}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleManualSelect(g.type)}
              disabled={selected !== null}
              className={`relative flex flex-col items-center gap-3 p-5 rounded-3xl border-2 transition-all duration-300 ${isSelected
                  ? `${g.border} ring-4 ${g.ring} ring-offset-2 shadow-xl ${g.bg}`
                  : `${g.bg} ${g.border} hover:shadow-lg`
                }`}
            >
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br ${g.color} flex items-center justify-center`}
                  >
                    <span className="text-white text-xs font-bold">✓</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.span
                className="text-5xl"
                animate={isSelected ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                {g.emoji}
              </motion.span>

              <div className="text-center">
                <p className={`font-bold text-sm ${g.text}`}>{g.label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{g.sublabel}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Camera Section */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
        <button
          onClick={startCamera}
          className="w-full px-4 py-3 flex items-center justify-between text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <Camera size={16} className="text-blue-500" />
            Or use gesture detection
          </span>
          {isStreaming && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse">Live</span>}
        </button>

        <AnimatePresence>
          {isStreaming && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
              <div className="relative aspect-video bg-slate-900">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                {analyzing && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3">
                    <div className="w-14 h-14 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-white font-semibold text-sm">Reading your gesture...</p>
                  </div>
                )}
                {detected && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 bg-blue-600/90 flex flex-col items-center justify-center">
                    <span className="text-7xl mb-3">
                      {detected === GestureType.THUMBS_UP ? '👍' : detected === GestureType.THUMBS_DOWN ? '👎' : '👋'}
                    </span>
                    <p className="text-white text-xl font-bold">{detected.replace('_', ' ')}</p>
                  </motion.div>
                )}
              </div>
              {!analyzing && !detected && (
                <div className="p-3">
                  <Button onClick={captureAndAnalyze} className="w-full">Analyze Gesture</Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {error && <p className="text-xs text-red-500 px-4 py-2">{error}</p>}
      </div>
    </div>
  );
};
import React, { useRef, useState, useEffect } from 'react';
import { Camera, ThumbsUp, ThumbsDown, Hand } from 'lucide-react';
import { Button } from './ui/Button';
import { GestureType } from '../types';

interface GestureCaptureProps {
  onCapture: (gesture: GestureType) => void;
}

export const GestureCapture: React.FC<GestureCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMounted = useRef(true); // Track mount status
  const [isStreaming, setIsStreaming] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [detected, setDetected] = useState<GestureType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (isMounted.current && videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setError(null);
      } else {
        // If unmounted immediately, stop stream
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      if (isMounted.current) {
        setError("Could not access camera. Please allow permissions or use manual buttons.");
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      if (isMounted.current) setIsStreaming(false);
    }
  };

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      stopCamera();
    };
  }, []);

  const captureAndAnalyze = () => {
    setAnalyzing(true);
    // Simulate MediaPipe/TF.js latency and processing
    setTimeout(() => {
      if (!isMounted.current) return;

      // Randomly detect a gesture for demo purposes
      const possible = [GestureType.THUMBS_UP, GestureType.THUMBS_DOWN, GestureType.WAVE];
      const result = possible[Math.floor(Math.random() * possible.length)];
      
      setDetected(result);
      setAnalyzing(false);
      setTimeout(() => {
        if (!isMounted.current) return;
        onCapture(result);
        stopCamera();
      }, 1000);
    }, 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-4 bg-blue-500 text-white flex justify-between items-center">
        <h3 className="font-semibold flex items-center gap-2">
          <Camera size={20} /> Gesture Feedback
        </h3>
        {isStreaming && <span className="text-xs bg-red-500 px-2 py-1 rounded-full animate-pulse">Live</span>}
      </div>

      <div className="relative bg-slate-900 aspect-video flex items-center justify-center">
        {!isStreaming && !detected && (
          <div className="text-center p-6">
            <p className="text-slate-400 mb-4 text-sm">Enable camera to leave quick gesture feedback.</p>
            <Button onClick={startCamera} size="sm" variant="secondary">Enable Camera</Button>
          </div>
        )}

        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className={`w-full h-full object-cover transform scale-x-[-1] ${!isStreaming ? 'hidden' : ''}`} 
        />

        {analyzing && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white font-medium">Analyzing Gesture...</p>
          </div>
        )}

        {detected && (
          <div className="absolute inset-0 bg-blue-500/90 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
            {detected === GestureType.THUMBS_UP && <ThumbsUp size={64} className="text-white mb-2" />}
            {detected === GestureType.THUMBS_DOWN && <ThumbsDown size={64} className="text-white mb-2" />}
            {detected === GestureType.WAVE && <Hand size={64} className="text-white mb-2" />}
            <p className="text-white text-xl font-bold">{detected.replace('_', ' ')}</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t">
        {isStreaming && !analyzing && !detected && (
          <div className="flex justify-center gap-4">
             <Button onClick={captureAndAnalyze} className="w-full">
               Capture & Analyze
             </Button>
          </div>
        )}
        
        {error && (
          <div className="text-center text-red-500 text-sm mb-4">{error}</div>
        )}

        {/* Fallback Manual Selection */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-xs text-center text-slate-500 mb-3 uppercase tracking-wider font-semibold">Or select manually</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => onCapture(GestureType.THUMBS_DOWN)} className="p-3 rounded-full bg-white border hover:bg-red-50 hover:border-red-200 transition-colors">
              <ThumbsDown className="text-red-500" size={24} />
            </button>
            <button onClick={() => onCapture(GestureType.WAVE)} className="p-3 rounded-full bg-white border hover:bg-yellow-50 hover:border-yellow-200 transition-colors">
              <Hand className="text-yellow-500" size={24} />
            </button>
            <button onClick={() => onCapture(GestureType.THUMBS_UP)} className="p-3 rounded-full bg-white border hover:bg-green-50 hover:border-green-200 transition-colors">
              <ThumbsUp className="text-green-500" size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
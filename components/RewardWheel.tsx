import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { WHEEL_PRIZES } from '../constants';
import { Prize } from '../types';
import { Gift, Sparkles } from 'lucide-react';

interface RewardWheelProps {
  onSpinComplete: (prize: Prize) => void;
}

export const RewardWheel: React.FC<RewardWheelProps> = ({ onSpinComplete }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const controls = useAnimation();
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);

  const spin = async () => {
    if (isSpinning) return;
    setIsSpinning(true);

    // Calculate random prize based on probabilities
    const rand = Math.random();
    let cumulative = 0;
    let winningPrize = WHEEL_PRIZES[0];
    
    for (const prize of WHEEL_PRIZES) {
      cumulative += prize.probability;
      if (rand <= cumulative) {
        winningPrize = prize;
        break;
      }
    }

    // Calculate rotation
    // 360 / length = degrees per segment
    // Add 5 full rotations (1800 deg) + target segment offset
    const segmentAngle = 360 / WHEEL_PRIZES.length;
    const prizeIndex = WHEEL_PRIZES.findIndex(p => p.id === winningPrize.id);
    
    // We want the pointer (top) to land on the segment.
    // If pointer is at 0deg (top), and we rotate clockwise:
    // To land on index 0, we need rotation such that index 0 is at top.
    // Rotation = 360 - (index * segmentAngle) + random jitter inside segment
    const targetRotation = 1800 + (360 - (prizeIndex * segmentAngle)) + (Math.random() * segmentAngle * 0.8 - segmentAngle * 0.4);

    await controls.start({
      rotate: targetRotation,
      transition: { duration: 4, ease: "circOut" }
    });

    setSelectedPrize(winningPrize);
    setTimeout(() => onSpinComplete(winningPrize), 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative w-64 h-64 mb-8">
        {/* Pointer */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-slate-800 filter drop-shadow-lg"></div>
        </div>

        {/* Wheel */}
        <motion.div 
          className="w-full h-full rounded-full overflow-hidden border-4 border-slate-800 shadow-2xl relative"
          animate={controls}
        >
          {WHEEL_PRIZES.map((prize, index) => {
            const rotation = (360 / WHEEL_PRIZES.length) * index;
            return (
              <div
                key={prize.id}
                className="absolute w-full h-full origin-center"
                style={{ 
                  transform: `rotate(${rotation}deg)`,
                  clipPath: 'polygon(0 0, 50% 50%, 100% 0)' 
                }}
              >
                 {/* Use a pseudo-element or inner div for background color to fill the clip-path area properly 
                     Simpler trick: Conic gradient or just overlapping divs. 
                     For this simpler implementation, we use a rotated half-circle sector trick or just SVG.
                     Let's use SVG for perfect segments.
                 */}
              </div>
            );
          })}
          
          {/* SVG Overlay for perfect segments */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full transform -rotate-90">
            {WHEEL_PRIZES.map((prize, index) => {
              const segmentAngle = 360 / WHEEL_PRIZES.length;
              // Calculate SVG path for segment
              // Using standard trig for pie slice
              const startAngle = index * segmentAngle;
              const endAngle = (index + 1) * segmentAngle;
              
              const x1 = 50 + 50 * Math.cos(Math.PI * startAngle / 180);
              const y1 = 50 + 50 * Math.sin(Math.PI * startAngle / 180);
              const x2 = 50 + 50 * Math.cos(Math.PI * endAngle / 180);
              const y2 = 50 + 50 * Math.sin(Math.PI * endAngle / 180);
              
              return (
                <path
                  key={prize.id}
                  d={`M50,50 L${x1},${y1} A50,50 0 0,1 ${x2},${y2} Z`}
                  fill={prize.color}
                  stroke="white"
                  strokeWidth="0.5"
                />
              );
            })}
          </svg>

          {/* Icons/Text on top of SVG */}
          {WHEEL_PRIZES.map((prize, index) => {
             const segmentAngle = 360 / WHEEL_PRIZES.length;
             const rotation = index * segmentAngle + segmentAngle / 2;
             return (
               <div
                 key={prize.id}
                 className="absolute top-0 left-0 w-full h-full flex justify-center pt-4"
                 style={{ transform: `rotate(${rotation}deg)` }}
               >
                 <span className="text-xs font-bold text-white transform rotate-180 drop-shadow-md" style={{ writingMode: 'vertical-rl' }}>
                   {prize.label}
                 </span>
               </div>
             )
          })}
        </motion.div>

        {/* Center Cap */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full border-4 border-slate-800 z-10 flex items-center justify-center shadow-lg">
          <Gift size={20} className="text-blue-600" />
        </div>
      </div>

      {!selectedPrize ? (
        <button
          onClick={spin}
          disabled={isSpinning}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform transition hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Sparkles /> {isSpinning ? 'Spinning...' : 'Spin for Reward'}
        </button>
      ) : (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-slate-800 mb-2">You Won!</h3>
          <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            {selectedPrize.label}
          </div>
        </motion.div>
      )}
    </div>
  );
};
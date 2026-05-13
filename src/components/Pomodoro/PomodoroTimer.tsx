import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import confetti from 'canvas-confetti';

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    let timer: any;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: isBreak ? ['#bc13fe', '#ff00ff'] : ['#00f3ff', '#0ff']
    });
    
    if (!isBreak) {
      setCycles(c => c + 1);
      setTimeLeft(5 * 60);
      setIsBreak(true);
    } else {
      setTimeLeft(25 * 60);
      setIsBreak(false);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="glass p-6 flex flex-col items-center justify-between gap-4 h-full">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 w-full mb-auto">Pomodoro Interface</h3>
      
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
          <circle 
            cx="80" cy="80" r="76" 
            stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent"
          />
          <motion.circle 
            cx="80" cy="80" r="76" 
            stroke={isBreak ? "#bc13fe" : "#00F2FF"} 
            strokeWidth="6" fill="transparent" 
            strokeDasharray="477"
            animate={{ strokeDashoffset: 477 - (477 * (timeLeft / (isBreak ? 5 * 60 : 25 * 60))) }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>
        <div className="text-4xl font-mono font-bold neon-text">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="w-full flex flex-col gap-3 mt-auto">
        <div className="flex gap-1 w-full justify-center mb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1 px-1 flex-1 rounded-full transition-all duration-500",
                i < cycles ? (isBreak ? "bg-neon-purple shadow-[0_0_5px_#bc13fe]" : "bg-neon-blue shadow-[0_0_5px_#00F2FF]") : "bg-white/10"
              )}
            />
          ))}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={toggleTimer}
            className={cn(
              "flex-1 py-3 text-[10px] font-bold uppercase rounded-xl tracking-[0.2em] transition-all active:scale-95",
              isActive 
                ? "bg-white/10 text-white border border-white/10" 
                : "bg-neon-blue text-black shadow-[0_0_20px_rgba(0,242,255,0.4)]"
            )}
          >
            {isActive ? 'Pause Focus' : 'Initiate Flow'}
          </button>
          <button
            onClick={resetTimer}
            className="p-3 bg-white/5 text-slate-400 hover:text-white rounded-xl border border-white/5 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

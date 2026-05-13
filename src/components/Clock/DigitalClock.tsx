import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export default function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatTime(time);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-baseline gap-4 text-[100px] font-mono font-bold tracking-tighter neon-text leading-none">
        <motion.span
          key={hours}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="tabular-nums"
        >
          {hours}
        </motion.span>
        <span className="animate-pulse opacity-50">:</span>
        <motion.span
          key={minutes}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="tabular-nums"
        >
          {minutes}
        </motion.span>
        <span className="text-3xl text-neon-purple/70 self-end mb-2 ml-4 tabular-nums font-medium">
          {seconds}
        </span>
      </div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-6 text-slate-400 font-medium tracking-[0.2em] uppercase text-sm"
      >
        {time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
      </motion.p>
    </div>
  );
}

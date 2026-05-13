import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

const LOCATIONS = [
  { name: 'Tokyo', zone: 'Asia/Tokyo' },
  { name: 'London', zone: 'Europe/London' },
  { name: 'New York', zone: 'America/New_York' },
  { name: 'San Francisco', zone: 'America/Los_Angeles' },
  { name: 'Dubai', zone: 'Asia/Dubai' },
];

export default function WorldClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass p-6">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-5 h-5 text-neon-blue" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Global Nodes</h3>
      </div>
      
      <div className="space-y-4">
        {LOCATIONS.map((loc) => {
          const locTime = new Intl.DateTimeFormat('en-US', {
            timeZone: loc.zone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).format(time);

          return (
            <div key={loc.name} className="flex items-center justify-between group">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 group-hover:text-neon-blue transition-colors">{loc.name}</span>
                <span className="text-[10px] text-slate-600 uppercase tracking-tighter">{loc.zone.split('/')[0]}</span>
              </div>
              <span className="text-xl font-mono text-white tracking-widest bg-white/5 px-3 py-1 rounded-lg border border-white/5 transition-all group-hover:border-neon-blue/30 group-hover:bg-neon-blue/5">
                {locTime}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

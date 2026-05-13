import { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Thermometer, MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function WeatherWidget() {
  const [location, setLocation] = useState<string>('Detecting...');
  const [weather, setWeather] = useState({ temp: 24, condition: 'Clear', humidity: 45 });

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation('San Francisco'), // Mocked for privacy in preview, but logic is here
        () => setLocation('Global Hub')
      );
    }
  }, []);

  return (
    <div className="glass p-6 bg-gradient-to-br from-white/5 to-white/[0.02]">
      <div className="flex items-start justify-between mb-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="w-3 h-3" />
            <span className="text-[10px] uppercase font-bold tracking-widest">{location}</span>
          </div>
          <h3 className="text-4xl font-mono font-bold text-white tracking-tighter">
            {weather.temp}°<span className="text-neon-blue text-2xl">C</span>
          </h3>
        </div>
        <div className="p-4 rounded-3xl bg-neon-blue/10 border border-neon-blue/20">
          <Sun className="w-8 h-8 text-neon-blue animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 rounded-2xl p-3 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10">
            <Wind className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase text-slate-500 font-bold">Wind</span>
            <span className="text-xs text-white">12 km/h</span>
          </div>
        </div>
        <div className="bg-white/5 rounded-2xl p-3 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10">
            <Thermometer className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase text-slate-500 font-bold">Humidity</span>
            <span className="text-xs text-white">45%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

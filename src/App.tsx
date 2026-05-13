import { useState, useEffect } from 'react';
import useAuth from './hooks/useAuth';
import DigitalClock from './components/Clock/DigitalClock';
import PomodoroTimer from './components/Pomodoro/PomodoroTimer';
import TaskManager from './components/Tasks/TaskManager';
import AIPlanner from './components/Assistant/AIPlanner';
import WorldClock from './components/Clock/WorldClock';
import WeatherWidget from './components/Clock/WeatherWidget';
import { 
  LogOut, 
  LayoutDashboard, 
  Plus, 
  User as UserIcon,
  Search,
  Bell,
  Cpu,
  Zap,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './lib/firebase';

export default function App() {
  const { user, loading, login, logout } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
      return onSnapshot(q, (snapshot) => {
        setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-neon-blue/20 border-t-neon-blue rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Cpu className="w-6 h-6 text-neon-blue animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center p-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,243,255,0.1),transparent_50%)]" />
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass p-12 max-w-md w-full relative z-10 text-center"
        >
          <div className="w-20 h-20 bg-neon-blue/10 rounded-3xl flex items-center justify-center mx-auto mb-8 neon-border-blue border">
            <Activity className="w-10 h-10 text-neon-blue animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter text-white mb-2">TimeFlow</h1>
          <p className="text-slate-500 text-sm mb-12 uppercase tracking-widest font-medium">Neural Productivity Engine</p>
          
          <button
            onClick={login}
            className="w-full group relative flex items-center justify-center gap-3 bg-white text-black font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <div className="w-5 h-5 bg-black rounded-full text-white flex items-center justify-center group-hover:rotate-12 transition-transform">G</div>
            Sync with Google Network
          </button>
          
          <p className="mt-8 text-[10px] text-slate-600 uppercase tracking-widest leading-relaxed">
            Initialization required. Authorized entities only.<br/>
            Neural encryption active.
          </p>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-neon-blue/5 rounded-full blur-3xl" />
        <div className="absolute top-20 right-20 w-40 h-40 bg-neon-purple/5 rounded-full blur-3xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-neon-blue selection:text-black">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Sidebar Navigation */}
      <nav className="fixed left-0 top-0 bottom-0 w-20 flex flex-col items-center py-8 gap-10 bg-black/40 backdrop-blur-2xl border-r border-white/10 z-50">
        <div className="p-3 bg-neon-blue/20 rounded-2xl neon-border-blue border">
          <Zap className="w-6 h-6 text-neon-blue animate-pulse" />
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <NavItem icon={<LayoutDashboard />} active />
          <NavItem icon={<Bell />} />
          <NavItem icon={<Activity />} />
          <NavItem icon={<UserIcon />} />
        </div>

        <button 
          onClick={logout}
          className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </nav>

      <main className="pl-20 min-h-screen">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-10 relative z-10 border-b border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">TF</div>
             <h1 className="text-xl font-bold tracking-tight uppercase">Time<span className="text-neon-blue">Flow</span></h1>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-400 mr-8">
               <a href="#" className="text-neon-blue">Dashboard</a>
               <a href="#" className="hover:text-white transition-colors">Schedule</a>
               <a href="#" className="hover:text-white transition-colors">Analytics</a>
               <a href="#" className="hover:text-white transition-colors">Settings</a>
            </nav>
            <div className="flex items-center gap-4 text-sm mr-4">
              <div className="flex flex-col items-end">
                <span className="font-bold uppercase tracking-wider text-[10px]">Status: Productive</span>
                <span className="text-[9px] text-slate-500 uppercase tracking-tighter">Focus Session Active</span>
              </div>
            </div>
            {user.photoURL && (
              <img src={user.photoURL} className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 shadow-lg object-cover" alt="Profile" />
            )}
          </div>
        </header>

        {/* Bento Dashboard Content */}
        <div className="p-8 grid grid-cols-4 grid-rows-3 gap-6 h-[calc(100vh-80px)] min-h-[800px] max-w-[1600px] mx-auto">
          
          {/* Daily Planner (Tasks) - Row 1 & 2, Col 1 */}
          <div className="col-span-1 row-span-2 overflow-hidden h-full">
            <TaskManager userId={user.uid} />
          </div>

          {/* Main Interface (Clock) - Row 1, Col 2 & 3 */}
          <div className="col-span-2 row-span-1 glass neon-border p-8 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute top-4 left-4 text-[10px] font-bold text-neon-blue uppercase tracking-widest bg-neon-blue/10 px-2 py-1 rounded">Main Interface</div>
            <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-transparent pointer-events-none" />
            <DigitalClock />
            <div className="absolute bottom-4 right-4 flex gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span className="opacity-40">24H MODE</span>
              <span className="text-neon-blue">UTC+2</span>
            </div>
          </div>

          {/* Pomodoro Timer - Row 1, Col 4 */}
          <div className="col-span-1 row-span-1">
            <PomodoroTimer />
          </div>

          {/* AI Recommendation (Assistant) - Row 2, Col 2 */}
          <div className="col-span-1 row-span-1">
            <AIPlanner tasks={tasks} />
          </div>

          {/* Weather Widget - Row 2, Col 3 */}
          <div className="col-span-1 row-span-1">
            <WeatherWidget />
          </div>

          {/* Analytics Pulse - Row 2, Col 4 */}
          <div className="glass p-6 col-span-1 row-span-1 flex flex-col justify-between overflow-hidden">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Analytics Monitoring</h3>
            <div className="flex flex-col gap-6 py-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                  <span>FOCUS SCORE</span>
                  <span className="text-neon-blue">88%</span>
                </div>
                <div className="stat-bar">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '88%' }}
                    className="stat-fill"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                  <span>TASKS DONE</span>
                  <span className="text-indigo-400">64%</span>
                </div>
                <div className="stat-bar">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '64%' }}
                    className="stat-fill bg-indigo-500 shadow-indigo-500/50"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse"></div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Live Neural Feed</span>
            </div>
          </div>

          {/* World Clock - Row 3, Col 1 & 2 */}
          <div className="col-span-2 row-span-1">
            <WorldClock />
          </div>

          {/* Quote / Footer Banner - Row 3, Col 3 & 4 */}
          <div className="glass p-8 col-span-2 row-span-1 flex items-center justify-center text-center bg-gradient-to-br from-neon-blue/5 to-purple-500/5 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="w-24 h-24 text-neon-blue rotate-12" />
            </div>
            <div className="max-w-md relative z-10">
              <p className="text-xl font-medium italic text-slate-300 leading-relaxed">
                "The future belongs to those who believe in the beauty of their dreams."
              </p>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-6 flex items-center justify-center gap-3">
                <div className="h-px w-8 bg-slate-800" />
                Eleanor Roosevelt
                <div className="h-px w-8 bg-slate-800" />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, active = false }: { icon: React.ReactNode, active?: boolean }) {
  return (
    <button className={cn(
      "p-3 rounded-2xl transition-all relative group",
      active ? "bg-neon-blue text-black shadow-lg neon-glow-blue" : "text-slate-500 hover:text-white hover:bg-white/5"
    )}>
      {icon}
      {active && (
        <motion.div 
          layoutId="nav-glow"
          className="absolute -inset-1 bg-neon-blue/20 blur-md rounded-2xl -z-10"
        />
      )}
      <div className="absolute left-full ml-4 px-2 py-1 bg-black text-[10px] uppercase tracking-widest border border-white/10 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
        System Node
      </div>
    </button>
  );
}

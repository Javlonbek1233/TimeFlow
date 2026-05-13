import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CheckCircle2, Circle, Plus, Trash2, Calendar, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: any;
}

export default function TaskManager({ userId }: { userId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskData: Task[] = [];
      snapshot.forEach((doc) => {
        taskData.push({ id: doc.id, ...doc.data() } as Task);
      });
      setTasks(taskData);
    });

    return () => unsubscribe();
  }, [userId]);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      await addDoc(collection(db, 'tasks'), {
        title: newTask,
        completed: false,
        userId: userId,
        priority: priority,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setNewTask('');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (task: Task) => {
    try {
      await updateDoc(doc(db, 'tasks', task.id), {
        completed: !task.completed,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
          Daily Planner 
          <span className="text-neon-blue ml-2">
            {tasks.filter(t => t.completed).length} of {tasks.length} Done
          </span>
        </h3>
      </div>

      <form onSubmit={addTask} className="space-y-3 mb-6">
        <div className="relative group">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Initialize objective..."
            className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 outline-none focus:border-neon-blue/30 focus:bg-white/10 transition-all text-sm text-white placeholder:text-slate-600"
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-neon-blue text-black rounded-lg hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex gap-2">
          {(['low', 'medium', 'high'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={cn(
                "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all",
                priority === p 
                  ? p === 'high' ? "border-red-500 bg-red-500/10 text-red-500" :
                    p === 'medium' ? "border-neon-blue bg-neon-blue/10 text-neon-blue" :
                    "border-slate-400 bg-slate-400/10 text-slate-400"
                  : "border-white/5 text-slate-600 hover:border-white/10"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </form>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-hide">
        <AnimatePresence initial={false}>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              layout
              className={cn(
                "group flex items-center gap-3 p-3 rounded-xl border transition-all duration-300",
                task.completed 
                  ? "bg-white/[0.02] border-white/5 opacity-40" 
                  : "bg-white/5 border-white/5 hover:border-white/10"
              )}
            >
              <button 
                onClick={() => toggleTask(task)}
                className="transition-transform active:scale-90"
              >
                <div className={cn(
                  "w-4 h-4 rounded border transition-all flex items-center justify-center",
                  task.completed ? "bg-neon-blue border-neon-blue" : "border-white/20 group-hover:border-neon-blue/50"
                )}>
                  {task.completed && <div className="w-1.5 h-1.5 bg-black rounded-sm" />}
                </div>
              </button>
              
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-xs font-medium truncate",
                  task.completed ? "line-through text-slate-500" : "text-slate-200"
                )}>
                  {task.title}
                </p>
              </div>

              <button 
                onClick={() => deleteTask(task.id)}
                className="p-1 opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-2 px-1">Optimization Queue</div>
        <div className="text-[10px] py-2 px-3 bg-white/5 rounded-lg border border-white/5 text-slate-400 italic">
          Weekly focus synchronization is recommended.
        </div>
      </div>
    </div>
  );
}

import { CheckSquare } from 'lucide-react';

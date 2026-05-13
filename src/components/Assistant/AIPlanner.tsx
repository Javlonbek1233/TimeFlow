import { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Brain, Sparkles, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../../lib/utils';

export default function AIPlanner({ tasks }: { tasks: any[] }) {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Neural voice link not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
    };

    recognition.start();
  };

  const getAIResponse = async () => {
    if (!prompt.trim()) return;

    const userMsg = { role: 'user' as const, content: prompt };
    setMessages(prev => [...prev, userMsg]);
    setPrompt('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const context = `You are a futuristic productivity assistant named TimeFlow AI. 
      The user current tasks are: ${tasks.map(t => `${t.title} (Priority: ${t.priority}, Completed: ${t.completed})`).join(', ')}.
      Provide advice, schedule recommendations, or motivational quotes. Keep it brief and futuristic.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: `${context}\n\nUser: ${prompt}` }] }
        ]
      });

      const aiMsg = { role: 'ai' as const, content: response.text || 'Error generating sequence.' };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', content: "Neural link failure. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="glass p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">AI Neural Link</h3>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse"></div>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">AI Insight Active</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <Brain className="w-10 h-10 text-neon-purple/20 mx-auto mb-4" />
              <p className="text-xs text-slate-500 italic px-4 leading-relaxed">
                "Your temporal flow is currently stable. Awaiting optimization query..."
              </p>
            </motion.div>
          )}
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={cn(
                "flex flex-col gap-1 max-w-[90%]",
                msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div className={cn(
                "p-3 rounded-xl text-xs leading-relaxed",
                msg.role === 'user' 
                  ? "bg-neon-blue text-black font-bold" 
                  : "bg-white/5 border border-white/5 text-slate-300"
              )}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
              <span className="text-[8px] uppercase tracking-tighter text-slate-600 px-1">
                {msg.role === 'user' ? 'Entity: User' : 'Entity: AI'}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <div className="flex gap-2 items-center text-neon-purple/50 animate-pulse ml-2">
            <div className="w-1 h-1 bg-current rounded-full" />
            <span className="text-[8px] uppercase font-bold tracking-[0.2em]">Processing...</span>
          </div>
        )}
      </div>

      <div className="relative mt-auto">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && getAIResponse()}
              placeholder="Query matrix..."
              className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-4 pr-10 outline-none focus:border-neon-purple/30 transition-all text-xs text-white"
            />
            <button
              onClick={startListening}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 transition-all p-1.5 rounded-lg",
                isListening ? "text-red-500 animate-pulse bg-red-500/10" : "text-slate-600 hover:text-white"
              )}
            >
              <Zap className={cn("w-3.5 h-3.5", isListening && "fill-current")} />
            </button>
          </div>
          <button
            onClick={getAIResponse}
            disabled={isTyping}
            className="p-3 bg-neon-purple text-white rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-neon-purple/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

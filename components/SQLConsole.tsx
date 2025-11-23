import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Step } from '../types';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface SQLConsoleProps {
  step: Step;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  canNext: boolean;
  canPrev: boolean;
}

export const SQLConsole: React.FC<SQLConsoleProps> = ({ step, onNext, onPrev, onReset, canNext, canPrev }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play logic
  useEffect(() => {
    let interval: any;
    if (isPlaying && canNext) {
      interval = setInterval(() => {
        onNext();
      }, 2000); // 2 segundos por paso
    } else if (!canNext) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, canNext, onNext]);

  const lines = [
    { id: 'select', html: <><span className="text-fuchsia-400">SELECT</span> User.Name, Order.Product, Order.Amount</>, activeStep: Step.SELECT },
    { id: 'from', html: <><span className="text-cyan-400">FROM</span> Users</>, activeStep: Step.FROM_JOIN },
    { id: 'join', html: <><span className="text-cyan-400">INNER JOIN</span> Orders</>, activeStep: Step.FROM_JOIN },
    { id: 'on', html: <><span className="text-slate-500 ml-4">ON</span> Users.ID = Orders.UID</>, activeStep: Step.ON },
    { id: 'where', html: <><span className="text-blue-400">WHERE</span> Country <span className="text-blue-400">IN</span> ('USA', 'Korea', 'UK')</>, activeStep: Step.WHERE },
    { id: 'group', html: <><span className="text-purple-400">GROUP BY</span> Country</>, activeStep: Step.GROUP_BY },
    { id: 'having', html: <><span className="text-blue-400">HAVING</span> SUM(Amount) {'>'} 200</>, activeStep: Step.HAVING },
    { id: 'order', html: <><span className="text-purple-400">ORDER BY</span> Amount <span className="text-purple-400">ASC</span></>, activeStep: Step.ORDER_BY },
    { id: 'limit', html: <><span className="text-emerald-400">LIMIT</span> 1</>, activeStep: Step.LIMIT },
  ];

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
      <div className="bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row items-center">
        
        {/* Left: Controls */}
        <div className="p-4 flex items-center gap-3 border-b md:border-b-0 md:border-r border-white/5 bg-slate-900/50">
           <button onClick={onReset} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors" title="Reset">
              <RotateCcw size={18} />
           </button>
           <div className="w-px h-6 bg-white/10 mx-1" />
           <button onClick={onPrev} disabled={!canPrev} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full text-white disabled:opacity-30 transition-all active:scale-95">
              <ChevronLeft size={20} />
           </button>
           
           <button 
             onClick={() => setIsPlaying(!isPlaying)} 
             className={`p-4 rounded-full text-white shadow-lg transition-all active:scale-95 flex items-center justify-center ${isPlaying ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-cyan-500 hover:bg-cyan-400'}`}
           >
              {isPlaying ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" className="ml-1" size={24} />}
           </button>

           <button onClick={onNext} disabled={!canNext} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full text-white disabled:opacity-30 transition-all active:scale-95">
              <ChevronRight size={20} />
           </button>
        </div>

        {/* Right: Code Display */}
        <div className="flex-1 p-5 font-mono text-sm overflow-hidden relative w-full">
           <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-slate-950/50 pointer-events-none z-10" />
           
           <div className="flex flex-col items-center md:items-start space-y-1">
              {lines.map((line) => {
                 const isActive = step === line.activeStep;
                 // Ocultamos las líneas que no son relevantes para reducir ruido visual, 
                 // o las mostramos muy tenues.
                 
                 return (
                    <motion.div 
                       key={line.id}
                       animate={{ 
                          opacity: isActive ? 1 : 0.2,
                          scale: isActive ? 1.05 : 1,
                          x: isActive ? 20 : 0,
                          filter: isActive ? 'blur(0px)' : 'blur(1.5px)',
                       }}
                       transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                       className={`w-full whitespace-nowrap transition-colors ${isActive ? 'font-bold' : ''}`}
                    >
                       {isActive && (
                          <motion.span layoutId="cursor" className="inline-block w-2 h-2 rounded-full bg-cyan-400 mr-3 align-middle" />
                       )}
                       {line.html}
                    </motion.div>
                 )
              })}
           </div>
        </div>

        {/* Status Indicator */}
        <div className="hidden md:flex px-6 py-2 bg-slate-900/30 text-[10px] font-mono text-slate-500 tracking-widest border-l border-white/5 h-full flex-col justify-center text-right">
           <span>STATUS</span>
           <span className={isPlaying ? "text-green-400 animate-pulse" : "text-slate-400"}>
              {isPlaying ? 'RUNNING' : 'PAUSED'}
           </span>
        </div>

      </div>
    </div>
  );
};
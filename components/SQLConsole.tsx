import React, { useEffect, useState, useRef } from 'react';
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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: any;
    if (isPlaying && canNext) {
      interval = setInterval(() => { onNext(); }, 4000); // 4s para compensar el slow motion
    } else if (!canNext) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, canNext, onNext]);

  useEffect(() => {
    if (scrollRef.current) {
        const activeEl = scrollRef.current.querySelector('[data-active="true"]');
        if (activeEl) {
            activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
  }, [step]);

  const lines = [
    { id: 'select', html: <><span className="text-fuchsia-400">SELECT</span> Country, <span className="text-cyan-400">SUM</span>(Amount) <span className="text-fuchsia-400">AS</span> TotalAmount</>, activeStep: Step.SELECT },
    { id: 'from', html: <><span className="text-cyan-400">FROM</span> Users</>, activeStep: Step.FROM_JOIN },
    { id: 'join', html: <><span className="text-cyan-400">INNER JOIN</span> Orders</>, activeStep: Step.FROM_JOIN },
    { id: 'on', html: <><span className="text-slate-500 ml-4">ON</span> Users.ID = Orders.UID</>, activeStep: Step.ON },
    { id: 'where', html: <><span className="text-blue-400">WHERE</span> Country <span className="text-blue-400">IN</span> ('USA', 'Korea', 'UK')</>, activeStep: Step.WHERE },
    { id: 'group', html: <><span className="text-purple-400">GROUP BY</span> Country</>, activeStep: Step.GROUP_BY }, // Actualizado a Country
    { id: 'having', html: <><span className="text-blue-400">HAVING</span> <span className="text-cyan-400">SUM</span>(Amount) {'>'} 200</>, activeStep: Step.HAVING },
    { id: 'order', html: <><span className="text-purple-400">ORDER BY</span> TotalAmount <span className="text-purple-400">ASC</span></>, activeStep: Step.ORDER_BY },
    { id: 'limit', html: <><span className="text-emerald-400">LIMIT</span> 1</>, activeStep: Step.LIMIT },
  ];

  // ... (El resto del render es igual)
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="relative bg-[#0B1121] border border-white/10 rounded-xl overflow-hidden shadow-inner flex flex-col h-[318px]">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div ref={scrollRef} className="flex-1 py-3 font-mono overflow-y-auto scrollbar-hide relative z-10 flex flex-col">
             <div className="flex flex-col w-full"> 
                {lines.map((line, idx) => {
                   const isActive = step === line.activeStep;
                   return (
                      <motion.div key={line.id} data-active={isActive} initial={{ opacity: 0 }} animate={{ opacity: isActive ? 1 : 0.5, backgroundColor: isActive ? 'rgba(255, 255, 255, 0.04)' : 'transparent', }} className={`relative flex items-center w-full px-4 py-2 transition-colors duration-200 ${isActive ? 'text-white font-semibold' : 'text-slate-500'}`}>
                         {isActive && <motion.div layoutId="lineMarker" className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400" />}
                         <span className="truncate text-[15px] tracking-wide font-medium leading-tight">{line.html}</span>
                      </motion.div>
                   )
                })}
             </div>
          </div>
          <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-[#0B1121] to-transparent pointer-events-none z-20" />
          <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-[#0B1121] to-transparent pointer-events-none z-20" />
      </div>

      <div className="flex items-center gap-3 bg-[#0B1121] p-2 pr-4 rounded-xl border border-white/10 shadow-lg">
           <button onClick={onReset} className="p-2.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all" title="Reset"><RotateCcw size={16} /></button>
           <div className="w-px h-6 bg-white/5" />
           <div className="flex items-center gap-1 flex-1 justify-center">
              <button onClick={onPrev} disabled={!canPrev} className="p-2.5 hover:bg-white/5 rounded-lg text-white disabled:opacity-20 transition-all"><ChevronLeft size={20} /></button>
              <button onClick={() => setIsPlaying(!isPlaying)} className={`mx-2 w-12 h-9 rounded-md flex items-center justify-center transition-all duration-300 ${isPlaying ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30'}`}>
                 {isPlaying ? <Pause fill="currentColor" size={16} /> : <Play fill="currentColor" size={16} />}
              </button>
              <button onClick={onNext} disabled={!canNext} className="p-2.5 hover:bg-white/5 rounded-lg text-white disabled:opacity-20 transition-all"><ChevronRight size={20} /></button>
           </div>
           <div className="text-[9px] font-mono tracking-widest text-slate-600 uppercase">{isPlaying ? <span className="text-cyan-500 animate-pulse">Running</span> : 'Paused'}</div>
      </div>
    </div>
  );
};
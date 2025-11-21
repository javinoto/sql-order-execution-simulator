
import React from 'react';
import { motion } from 'framer-motion';
import { Step } from '../types';

interface SQLConsoleProps {
  step: Step;
}

export const SQLConsole: React.FC<SQLConsoleProps> = ({ step }) => {
  const lines = [
    { id: 'select', text: <><span className="text-fuchsia-400">SELECT</span> User.Name, Order.Product, Order.Amount</>, activeStep: Step.SELECT },
    { id: 'from', text: <><span className="text-cyan-400">FROM</span> Users</>, activeStep: Step.FROM_JOIN },
    { id: 'join', text: <><span className="text-cyan-400">INNER JOIN</span> Orders</>, activeStep: Step.FROM_JOIN },
    { id: 'on', text: <><span className="text-slate-500 ml-4">ON</span> Users.ID = Orders.UID</>, activeStep: Step.ON },
    { id: 'where', text: <><span className="text-blue-400">WHERE</span> Country <span className="text-blue-400">IN</span> ('USA', 'Korea', 'UK')</>, activeStep: Step.WHERE },
    { id: 'group', text: <><span className="text-purple-400">GROUP BY</span> Country</>, activeStep: Step.GROUP_BY },
    { id: 'order', text: <><span className="text-purple-400">ORDER BY</span> Amount <span className="text-purple-400">ASC</span></>, activeStep: Step.ORDER_BY },
    { id: 'limit', text: <><span className="text-emerald-400">LIMIT</span> 2</>, activeStep: Step.LIMIT },
  ];

  return (
    <div className="absolute top-4 right-4 z-30 hidden md:block w-96 pointer-events-none">
       <div className="bg-slate-950/90 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden shadow-2xl">
          {/* Terminal Header */}
          <div className="bg-slate-900 px-4 py-2 border-b border-white/5 flex items-center justify-between">
             <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold font-mono">query.sql</span>
             <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
             </div>
          </div>
          
          {/* Code Body */}
          <div className="p-4 font-mono text-xs sm:text-sm leading-relaxed">
            {lines.map((line, index) => {
              const isActive = step === line.activeStep;
              const isFirstOfStep = index === lines.findIndex(l => l.activeStep === step);
              
              return (
                <motion.div 
                  key={line.id}
                  initial={false}
                  animate={{ 
                    opacity: isActive ? 1 : 0.3,
                    x: isActive ? 0 : 0,
                  }}
                  className={`relative flex items-center min-h-[1.5rem] pl-2 transition-colors duration-300 ${isActive ? 'bg-white/5 rounded' : ''}`}
                >
                   {isActive && isFirstOfStep && (
                      <motion.div 
                        layoutId="active-indicator"
                        className="absolute left-0 w-0.5 h-4 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                   )}
                   <span className="truncate">{line.text}</span>
                </motion.div>
              )
            })}
          </div>
       </div>
    </div>
  );
};

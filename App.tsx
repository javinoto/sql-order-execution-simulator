
import React, { useState } from 'react';
import { Animated3DTable } from './components/Animated3DTable';
import { SQLConsole } from './components/SQLConsole';
import { Step } from './types';
import { STEP_DESCRIPTIONS } from './constants';
import { ChevronRight, ChevronLeft, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>(Step.FROM_JOIN);

  const nextStep = () => {
    if (step < Step.LIMIT) setStep(s => s + 1);
  };

  const prevStep = () => {
    if (step > Step.FROM_JOIN) setStep(s => s - 1);
  };

  const currentInfo = STEP_DESCRIPTIONS[step];

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white font-sans overflow-hidden relative flex flex-col">
      
      {/* Ambient Background Orbs - Optimized opacity for performance */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] bg-fuchsia-900/15 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

      {/* Header */}
      <header className="z-20 w-full p-6 flex items-center justify-between border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
            <Database className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-400">
              Unified Particle Grid
            </h1>
            <p className="text-xs text-slate-400 font-mono">SQL EXECUTION VISUALIZER</p>
          </div>
        </div>
        
        {/* Step Progress Indicators */}
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((s) => (
            <div 
              key={s} 
              className={`h-1.5 w-8 rounded-full transition-all duration-300 ${s <= step ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-slate-800'}`}
            />
          ))}
        </div>
      </header>

      {/* Main Visualization Area */}
      <main className="flex-1 relative flex items-center justify-center z-10">
        <SQLConsole step={step} />
        <Animated3DTable step={step} />
      </main>

      {/* Controls Footer */}
      <footer className="z-20 w-full border-t border-white/5 bg-slate-900/80 backdrop-blur-xl p-6 pb-8">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between gap-8">
          
          <button 
            onClick={prevStep} 
            disabled={step === 0}
            className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex-1 flex flex-col items-center text-center min-h-[80px] justify-center">
             <AnimatePresence mode="wait">
                <motion.div 
                  key={step}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                   <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-3">
                      <span className="text-cyan-400 font-mono opacity-50">0{step}</span> 
                      {currentInfo.title}
                   </h2>
                   <p className="text-slate-400 max-w-lg mx-auto text-sm leading-relaxed">
                      {currentInfo.desc}
                   </p>
                </motion.div>
             </AnimatePresence>
          </div>

          <button 
            onClick={nextStep} 
            disabled={step === 7}
            className={`
              group relative p-4 rounded-full border transition-all duration-300 active:scale-95
              ${step === 7 ? 'bg-slate-800 border-slate-700 opacity-50 cursor-not-allowed' : 'bg-cyan-500/10 border-cyan-500/50 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]'}
            `}
          >
            <ChevronRight className={`w-6 h-6 ${step === 7 ? 'text-slate-500' : 'text-cyan-400'}`} />
            {step < 7 && (
              <span className="absolute inset-0 rounded-full animate-ping bg-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            )}
          </button>

        </div>
      </footer>
    </div>
  );
};

export default App;

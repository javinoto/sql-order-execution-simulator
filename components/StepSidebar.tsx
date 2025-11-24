import React from 'react';
import { motion } from 'framer-motion';
import { STEP_DESCRIPTIONS } from '../constants';
import { Step } from '../types';
import { SQLConsole } from './SQLConsole';

interface StepSidebarProps {
  currentStep: Step;
  onStepClick: (step: Step) => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  canNext: boolean;
  canPrev: boolean;
}

const getCleanTitle = (fullTitle: string) => {
  const t = fullTitle.toUpperCase();
  if (t.includes("FROM")) return "FROM & JOIN";
  if (t.includes("ON")) return "ON CONDITION";
  if (t.includes("WHERE")) return "WHERE";
  if (t.includes("GROUP")) return "GROUP BY";
  if (t.includes("HAVING")) return "HAVING";
  if (t.includes("ORDER")) return "ORDER BY";
  if (t.includes("SELECT")) return "SELECT";
  if (t.includes("LIMIT")) return "LIMIT";
  return fullTitle;
};

export const StepSidebar: React.FC<StepSidebarProps> = ({ 
    currentStep, onStepClick, onNext, onPrev, onReset, canNext, canPrev 
}) => {

  return (
    <aside className="w-full md:w-[480px] lg:w-[480px] h-full bg-[#020617] border-r border-white/5 flex flex-col z-40 shrink-0 relative shadow-2xl">
      
      {/* 1. HEADER */}
      <div className="h-20 flex items-end justify-center pb-5 flex-shrink-0 select-none border-b border-white/5 bg-[#020617] z-20">
         <div className="flex flex-col items-center gap-1.5">
            <span className="text-lg font-black text-white tracking-[0.3em] uppercase font-sans drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
               SQL ORDER EXECUTION
            </span>
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-80" />
         </div>
      </div>

      {/* 2. PIPELINE */}
      <div className="flex-1 overflow-y-auto relative scrollbar-hide flex flex-col py-4 w-full bg-[#020617]">
         
         <div className="space-y-1.5 px-8"> 
             {STEP_DESCRIPTIONS.map((info, index) => {
             const isActive = currentStep === index;
             const isPast = currentStep > index;
             const cleanTitle = getCleanTitle(info.title);

             return (
                 <div 
                    key={index}
                    onClick={() => onStepClick(index)}
                    className="group cursor-pointer relative flex justify-center items-center py-1" // py-2 da espacio para la placa flotante
                 >
                     {/* EL FONDO FLOTANTE (Magic Motion) */}
                     {isActive && (
                        <motion.div
                            layoutId="activeStepPlate" // Esto conecta todos los pasos
                            className="absolute inset-0 bg-[#0B1221] border border-cyan-500/30 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.1)] z-0"
                            initial={false}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30
                            }}
                        />
                     )}

                     {/* TEXTO */}
                     <span className={`
                         relative z-10 font-mono text-sm md:text-lg tracking-[0.08em] uppercase transition-colors duration-300
                         ${isActive 
                             ? 'text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' 
                             : isPast 
                                ? 'text-slate-600' // Pasados oscuros
                                : 'text-slate-500 group-hover:text-slate-300' // Futuros
                         }
                     `}>
                         {cleanTitle}
                     </span>
                 </div>
             );
             })}
         </div>
      </div>

      {/* 3. EXECUTION DECK */}
      <div className="flex-shrink-0 bg-[#050B19] border-t border-white/5 p-5 pb-6 relative shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.5)] z-20">
         <SQLConsole 
            step={currentStep}
            onNext={onNext}
            onPrev={onPrev}
            onReset={onReset}
            canNext={canNext}
            canPrev={canPrev}
         />
      </div>

    </aside>
  );
};
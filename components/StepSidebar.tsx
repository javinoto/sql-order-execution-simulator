import React from 'react';
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
    <aside className="w-full md:w-[480px] lg:w-[580px] h-full bg-[#020617] border-r border-white/5 flex flex-col z-40 shrink-0 relative shadow-2xl">
      
      {/* 1. HEADER */}
      <div className="h-20 flex items-end justify-center pb-5 flex-shrink-0 select-none border-b border-white/5 bg-[#020617]">
         <div className="flex flex-col items-center gap-1.5">
            <span className="text-lg font-black text-white tracking-[0.3em] uppercase font-sans drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
               SQL Engine
            </span>
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-80" />
         </div>
      </div>

      {/* 2. PIPELINE: Compactado */}
      <div className="flex-1 overflow-y-auto relative scrollbar-hide flex flex-col py-6 w-full bg-[#020617]">
         {/* Línea Vertebral */}
         <div className="absolute left-[39px] top-0 bottom-0 w-px bg-white/5" />

         <div className="space-y-4 px-8">  {/* Compactado: space-y-4 en lugar de 6 */}
             {STEP_DESCRIPTIONS.map((info, index) => {
             const isActive = currentStep === index;
             const isPast = currentStep > index;
             const cleanTitle = getCleanTitle(info.title);

             return (
                 <div 
                 key={index}
                 onClick={() => onStepClick(index)}
                 className="group cursor-pointer flex items-center gap-5 relative"
                 >
                     {/* Nodo */}
                     <div className={`
                         relative z-10 w-2.5 h-2.5 rounded-full border-[2px] transition-all duration-300 flex-shrink-0
                         ${isActive 
                             ? 'bg-[#020617] border-cyan-400 scale-125 shadow-[0_0_10px_cyan]' 
                             : isPast 
                                 ? 'bg-cyan-900 border-cyan-800' 
                                 : 'bg-[#020617] border-slate-800 group-hover:border-slate-500'
                         }
                     `} />

                     {/* Texto */}
                     <span className={`
                         font-mono text-sm md:text-lg tracking-[0.08em] transition-all duration-300 uppercase
                         ${isActive 
                             ? 'text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] pl-1' 
                             : 'text-slate-500 font-medium group-hover:text-slate-300'
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
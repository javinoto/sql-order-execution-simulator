import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STEP_DESCRIPTIONS } from '../constants';
import { Step } from '../types';

interface StepSidebarProps {
  currentStep: Step;
  onStepClick: (step: Step) => void;
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

export const StepSidebar: React.FC<StepSidebarProps> = ({ currentStep, onStepClick }) => {
  const activeInfo = STEP_DESCRIPTIONS[currentStep];

  return (
    <aside className="w-[300px] md:w-[380px] h-full bg-[#020617] border-r border-white/5 flex flex-col z-40 shrink-0 relative shadow-2xl">
      
      {/* 1. HEADER: White Glow + Laser Accent */}
      <div className="h-32 flex items-end justify-center pb-8 flex-shrink-0 select-none">
         <div className="flex flex-col items-center gap-3 px-4">
            
            {/* TEXTO: Ahora es grueso (Black), Blanco Puro y tiene un Resplandor (Drop Shadow) */}
            <span className="text-sm md:text-base font-semibold text-white tracking-[0.3em] uppercase font-sans drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
               Order Execution
            </span>
            
         </div>
      </div>

      {/* 2. LISTA DE PASOS (Centrado Óptico Mejorado) */}
      {/* Agregamos 'pt-8' para empujar el bloque un poco más abajo como pediste */}
      <div className="flex-1 overflow-y-auto relative scrollbar-hide flex flex-col justify-center items-center w-full pt-8">
        
        {/* La Línea Vertebral (Más sutil) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/5 to-transparent" />

        <div className="w-full space-y-1"> 
            {STEP_DESCRIPTIONS.map((info, index) => {
            const isActive = currentStep === index;
            const isPast = currentStep > index;
            const cleanTitle = getCleanTitle(info.title);

            return (
                <div 
                key={index}
                onClick={() => onStepClick(index)}
                className="group cursor-pointer relative flex justify-center items-center h-14 w-full"
                >
                    {/* Fondo Activo Sutil */}
                    {isActive && (
                        <motion.div 
                            layoutId="activePill"
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent z-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        />
                    )}

                    {/* Texto del Paso */}
                    <motion.div
                        className="relative z-10 flex items-center justify-center bg-[#020617] px-4 py-1" 
                        animate={{ 
                            scale: isActive ? 1.1 : 1,
                            opacity: isActive ? 1 : (isPast ? 0.4 : 0.25),
                        }}
                    >
                        <span className={`
                            font-mono text-lg tracking-widest transition-all duration-500
                            ${isActive 
                                ? 'text-cyan-400 font-bold drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]' 
                                : 'text-slate-500 font-medium hover:text-slate-300'
                            }
                        `}>
                            {cleanTitle}
                        </span>
                    </motion.div>
                </div>
            );
            })}
        </div>
      </div>

      {/* 3. DESCRIPCIÓN INFERIOR (Limpia) */}
      <div className="h-40 p-8 border-t border-white/5 bg-[#020617] text-center relative flex flex-col justify-center items-center flex-shrink-0 z-20">
         {/* Luz ambiental muy tenue */}
         <div className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 w-[150px] h-[100px] bg-cyan-500/5 blur-[60px] rounded-full pointer-events-none" />
         
         <AnimatePresence mode="wait">
            <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 5, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -5, filter: 'blur(4px)' }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative z-10"
            >
                <p className="text-sm font-light text-slate-400 leading-relaxed font-sans max-w-[260px] mx-auto tracking-wide">
                    {activeInfo.desc}
                </p>
            </motion.div>
         </AnimatePresence>
      </div>

    </aside>
  );
};
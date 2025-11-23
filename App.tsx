import React, { useState } from 'react';
import { Animated3DTable } from './components/Animated3DTable';
import { SQLConsole } from './components/SQLConsole';
import { StepSidebar } from './components/StepSidebar'; // Asegurate de importar esto
import { Step } from './types';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>(Step.FROM_JOIN);

  const nextStep = () => { if (step < Step.LIMIT) setStep(s => s + 1); };
  const prevStep = () => { if (step > Step.FROM_JOIN) setStep(s => s - 1); };
  const reset = () => setStep(Step.FROM_JOIN);

  return (
    <div className="h-screen w-full bg-slate-950 text-white font-sans overflow-hidden flex relative selection:bg-cyan-500/30">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[900px] h-[900px] bg-fuchsia-900/10 rounded-full blur-[150px] mix-blend-screen" />
          {/* Grid overlay subtle */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      {/* LEFT: Sidebar Pipeline */}
      <div className="relative z-20 shrink-0">
        <StepSidebar currentStep={step} onStepClick={setStep} />
      </div>

      {/* RIGHT: Main Visualization Area */}
      <main className="flex-1 relative flex flex-col items-center justify-center z-10 perspective-area">
        
        {/* Title Watermark (Optional, top right) */}
        <div className="absolute top-8 right-8 text-right opacity-30 pointer-events-none">
          <h1 className="text-2xl font-black italic tracking-tighter">Unified Particle Grid</h1>
          <p className="text-xs font-mono">V 2.0 // EXECUTION MODE</p>
        </div>

        {/* The 3D Table */}
        <div className="w-full h-full flex items-center justify-center scale-90 lg:scale-100 transition-transform duration-700">
           <Animated3DTable step={step} />
        </div>

        {/* BOTTOM: Floating Console & Controls */}
        <SQLConsole 
          step={step} 
          onNext={nextStep} 
          onPrev={prevStep}
          onReset={reset}
          canNext={step < Step.LIMIT} 
          canPrev={step > Step.FROM_JOIN}
        />

      </main>
    </div>
  );
};

export default App;
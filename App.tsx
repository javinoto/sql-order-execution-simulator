import React, { useState } from 'react';
import { Animated3DTable } from './components/Animated3DTable';
import { StepSidebar } from './components/StepSidebar';
import { Step } from './types';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>(Step.FROM_JOIN);

  // Lógica de navegación centralizada
  const nextStep = () => { if (step < Step.LIMIT) setStep(s => s + 1); };
  const prevStep = () => { if (step > Step.FROM_JOIN) setStep(s => s - 1); };
  const reset = () => setStep(Step.FROM_JOIN);

  return (
    <div className="h-screen w-full bg-[#020617] text-white font-sans overflow-hidden flex flex-col md:flex-row selection:bg-cyan-500/30">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150"></div>
      </div>

      {/* PANEL LATERAL */}
      <StepSidebar 
          currentStep={step} 
          onStepClick={setStep}
          onNext={nextStep}
          onPrev={prevStep}
          onReset={reset}
          canNext={step < Step.LIMIT}
          canPrev={step > Step.FROM_JOIN}
      />

      {/* ÁREA PRINCIPAL: Visualización */}
      <main className="flex-1 relative flex items-center justify-center z-10 bg-gradient-to-br from-[#020617] to-[#0B1221]">
        
        {/* Decoración de fondo específica para el área 3D */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* La Tabla 3D */}
        <div className="w-full h-full flex items-center justify-center scale-90 lg:scale-100 transition-transform duration-700">
           <Animated3DTable step={step} />
        </div>

      </main>
    </div>
  );
};

export default App;
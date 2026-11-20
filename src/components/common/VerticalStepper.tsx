import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export const VerticalStepper: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeSection = useAppStore((state) => state.activeSection);
  const setActiveSection = useAppStore((state) => state.setActiveSection);

  const steps = [
    { id: '01', label: 'Potential & Vision', path: '/' },
    { id: '02', label: 'Studio Engine', path: '/studio' },
    { id: '03', label: 'AI Director Chat', path: '/chat' },
  ];

  // Auto-detect current active step from pathname if applicable
  const currentStep = location.pathname === '/studio' ? '02' : location.pathname === '/chat' ? '03' : '01';

  const handleStepClick = (step: typeof steps[0]) => {
    setActiveSection(step.id);
    if (location.pathname !== step.path) {
      navigate(step.path);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <aside aria-label="Page navigation" className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center">
      <div className="flex flex-col gap-1.5 p-1.5 rounded-2xl bg-[#090C12]/90 backdrop-blur-md border border-white/10 shadow-2xl">
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step)}
              className={`w-8 h-8 rounded-xl font-mono text-[11px] font-medium flex items-center justify-center transition-all duration-300 relative group cursor-pointer ${
                isActive
                  ? 'bg-white/15 text-white border border-white/25 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}
              title={step.label}
            >
              <span>{step.id}</span>
              {/* Tooltip on hover */}
              <span className="absolute right-full mr-3 px-2.5 py-1 rounded-lg bg-[#0C1018] border border-white/10 text-[10px] text-zinc-300 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-xl">
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

import React from 'react';

interface ToolbarProps {
  onToggleCodeView: () => void;
  isCodeViewVisible: boolean;
  onToggleSimulation: () => void;
  isSimulationRunning: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onToggleCodeView,
  isCodeViewVisible,
  onToggleSimulation,
  isSimulationRunning,
}) => {
  return (
    <div className="h-14 glass flex items-center justify-between px-6 z-30 shadow-sm relative">
      <div className="flex items-center gap-3 select-none">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-md flex items-center justify-center shadow-lg shadow-blue-500/20">
           <span className="text-lg font-bold text-white">⚡</span>
        </div>
        <div className="flex flex-col justify-center leading-none">
          <h1 className="text-lg font-bold text-slate-100 tracking-tight">
            Arduino<span className="text-blue-400">Sim</span>
          </h1>
          <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">Prototyper</span>
        </div>
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={onToggleSimulation}
          className={`h-9 px-4 rounded-md font-medium text-sm transition-all flex items-center gap-2 border ${
            isSimulationRunning
              ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white border-transparent shadow-lg shadow-emerald-500/20'
          }`}
        >
          {isSimulationRunning ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Stop
            </>
          ) : (
             <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
              Run
            </>
          )}
        </button>

        <div className="w-px h-8 bg-slate-700 mx-1 self-center" />

        <button
          onClick={onToggleCodeView}
          className={`h-9 px-4 rounded-md font-medium text-sm transition-all border flex items-center gap-2 ${
            isCodeViewVisible
              ? 'bg-slate-700 text-blue-300 border-slate-600'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-750'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
          </svg>
          {isCodeViewVisible ? 'Code' : 'Code'}
        </button>
      </div>
    </div>
  );
};


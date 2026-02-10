import React from 'react';
import type { ComponentType } from '../types';

interface PaletteProps {
  onDragStart: (type: ComponentType) => void;
}

export const Palette: React.FC<PaletteProps> = ({ onDragStart }) => {
  const components: { type: ComponentType; label: string; icon: string; desc: string; color: string }[] = [
    { type: 'arduino-uno', label: 'Arduino Uno', icon: '🤖', desc: 'Controller', color: 'bg-teal-500/20 text-teal-300' },
    { type: 'led', label: 'LED', icon: '💡', desc: 'Output', color: 'bg-yellow-500/20 text-yellow-300' },
    { type: 'button', label: 'Push Button', icon: '🔘', desc: 'Input', color: 'bg-blue-500/20 text-blue-300' },
  ];

  return (
    <div className="w-60 glass-panel flex flex-col z-20 shadow-xl border-r border-slate-800">
      <div className="p-4 border-b border-slate-800/50">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Toolbox</h2>
      </div>
      
      <div className="p-3 space-y-2 overflow-y-auto">
        {components.map((comp) => (
          <div
            key={comp.type}
            draggable
            onDragStart={() => onDragStart(comp.type)}
            className="group relative bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all hover:shadow-md select-none"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-md flex items-center justify-center text-lg ${comp.color} transition-transform group-hover:scale-110`}>
                {comp.icon}
              </div>
              <div>
                <div className="text-sm font-medium text-slate-200">{comp.label}</div>
                <div className="text-[10px] text-slate-500">{comp.desc}</div>
              </div>
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-20">
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

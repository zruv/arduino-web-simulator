import React from 'react';
import type { CanvasComponent } from '../types';

interface PropertiesPanelProps {
  component: CanvasComponent | null;
  availablePins: number[];
  onPinChange: (id: string, newPin: number) => void;
  usedPins: number[];
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  component,
  availablePins,
  onPinChange,
  usedPins,
}) => {
  if (!component) {
    return (
      <div className="w-72 glass-panel flex flex-col items-center justify-center text-center p-6 text-slate-500">
        <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
            <span className="text-3xl opacity-50">⚙️</span>
        </div>
        <p className="font-medium text-sm text-slate-400">No Selection</p>
        <p className="text-xs opacity-50 mt-1 max-w-[200px]">Select a component to edit its properties.</p>
      </div>
    );
  }

  const isPinComponent = component.type === 'led' || component.type === 'button';

  return (
    <div className="w-72 glass-panel flex flex-col shadow-xl z-20 animate-fade-in">
      <div className="h-12 border-b border-slate-800 flex items-center px-4 bg-slate-800/30">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inspector</h2>
      </div>
      
      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        
        {/* ID Section */}
        <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">ID</label>
            <div className="font-mono text-xs text-slate-400 bg-slate-950/50 p-2 rounded border border-slate-800/50 select-all truncate">
                {component.id}
            </div>
        </div>

        {/* Type Section */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Type</label>
          <div className="flex items-center gap-2 p-2 bg-slate-800/50 rounded border border-slate-700/50">
             <span className="text-lg">
                {component.type === 'led' ? '💡' : component.type === 'button' ? '🔘' : '🤖'}
            </span>
            <span className="text-sm font-medium capitalize text-slate-200">
                {component.type.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Pin Selection */}
        {isPinComponent && (
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Digital Pin</label>
            <div className="relative group">
                <select
                className="w-full appearance-none bg-slate-900 hover:bg-slate-800 py-2 pl-3 pr-8 rounded text-sm text-white border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors cursor-pointer"
                value={component.pin !== undefined ? component.pin : ''}
                onChange={(e) => onPinChange(component.id, parseInt(e.target.value, 10))}
                >
                <option value="" disabled>Select Pin...</option>
                {availablePins.map((pin) => {
                    const isUsed = usedPins.includes(pin) && pin !== component.pin;
                    return (
                    <option key={pin} value={pin} disabled={isUsed} className="bg-slate-900">
                        Pin {pin} {isUsed ? '(Used)' : ''}
                    </option>
                    );
                })}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-slate-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
                Connects to the Arduino board.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

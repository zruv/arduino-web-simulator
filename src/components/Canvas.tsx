import React, { useEffect } from 'react';
import { Rnd } from 'react-rnd';
import type { CanvasComponent } from '../types';

interface CanvasProps {
  components: CanvasComponent[];
  setComponents: (components: CanvasComponent[]) => void;
  onDrop: (x: number, y: number) => void;
  availablePins: number[];
  onPinChange: (id: string, newPin: number) => void;
  isSimulationRunning: boolean;
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  ledState: boolean;
  onButtonPress: (pressed: boolean) => void;
}

const getArduinoPinOffset = (pin: number) => {
  if (pin >= 8 && pin <= 13) {
    const step = (66 - 48) / 5;
    return { x: 66 - (pin - 8) * step, y: 10 };
  }
  if (pin >= 0 && pin <= 7) {
    const step = (97 - 72) / 7;
    return { x: 97 - pin * step, y: 10 };
  }
  return { x: 50, y: 50 }; 
};

export const Canvas: React.FC<CanvasProps> = ({
  components,
  setComponents,
  onDrop,
  availablePins,
  onPinChange,
  isSimulationRunning,
  selectedComponentId,
  onSelectComponent,
  ledState,
  onButtonPress,
}) => {
  useEffect(() => {
    console.log('Canvas received components:', components);
  }, [components]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const canvasRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;
    onDrop(x, y);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectComponent(null);
    }
  };

  const renderWokwiElement = (component: CanvasComponent) => {
    switch (component.type) {
      case 'arduino-uno':
        return <wokwi-arduino-uno></wokwi-arduino-uno>;
      case 'led':
        return <wokwi-led color="red" pin={component.pin} value={isSimulationRunning && ledState ? 'true' : undefined}></wokwi-led>;
      case 'button':
        return (
          <div
            onMouseDown={() => isSimulationRunning && onButtonPress(true)}
            onMouseUp={() => isSimulationRunning && onButtonPress(false)}
            onMouseLeave={() => isSimulationRunning && onButtonPress(false)}
            className={isSimulationRunning ? 'cursor-pointer active:scale-95 transition-transform' : ''}
          >
            <wokwi-pushbutton pin={component.pin}></wokwi-pushbutton>
          </div>
        );
      default:
        return null;
    }
  };

  const arduino = components.find((c) => c.type === 'arduino-uno');

  return (
    <div
      className="flex-1 bg-slate-950 bg-grid-pattern p-4 relative overflow-hidden shadow-inner select-none"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div className="absolute top-6 left-6 z-0 pointer-events-none opacity-10">
        <h2 className="text-6xl font-black text-slate-500 tracking-tighter">CANVAS</h2>
      </div>
      
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 filter drop-shadow-md">
        <defs>
          <filter id="glow-led" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {arduino && components.map((comp) => {
          if (comp.id === arduino.id || comp.pin === undefined) return null;

          const pinOffset = getArduinoPinOffset(comp.pin);
          
          const startX = arduino.position.x + (arduino.width || 220) * (pinOffset.x / 100);
          const startY = arduino.position.y + (arduino.height || 160) * (pinOffset.y / 100);

          const endX = comp.position.x + (comp.width || 80) / 2;
          const endY = comp.position.y + (comp.height || 80);

          const cp1x = startX;
          const cp1y = startY - 50; 
          const cp2x = endX;
          const cp2y = endY + 50;   
          
          const isSelected = selectedComponentId === comp.id;
          const color = comp.type === 'led' ? '#f87171' : '#60a5fa';

          return (
            <g key={`wire-group-${comp.id}`}>
               <path
                d={`M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`}
                stroke={color}
                strokeWidth={isSelected ? 6 : 4}
                fill="none"
                className="opacity-20 transition-all duration-300"
              />
              <path
                d={`M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`}
                stroke={color}
                strokeWidth="2"
                fill="none"
                strokeDasharray={isSelected ? "none" : "4,4"}
                className={`transition-all duration-300 ${isSelected ? 'filter drop-shadow-[0_0_3px_rgba(255,255,255,0.5)]' : 'opacity-80'}`}
              />
              <circle cx={startX} cy={startY} r="3" fill={color} />
              <circle cx={endX} cy={endY} r="3" fill={color} />
            </g>
          );
        })}
      </svg>

      {components.map((component) => 
        isSimulationRunning ? (
          <div
            key={component.id}
            className="absolute z-10"
            style={{ left: component.position.x, top: component.position.y }}
          >
            {renderWokwiElement(component)}
          </div>
        ) : (
          <Rnd
            key={component.id}
            size={{ width: component.width || (component.type === 'arduino-uno' ? 220 : 80), height: component.height || (component.type === 'arduino-uno' ? 160 : 80) }}
            position={{ x: component.position.x, y: component.position.y }}
            onDragStop={(e, d) => {
              setComponents(prev => prev.map(c => 
                c.id === component.id ? { ...c, position: { x: d.x, y: d.y } } : c
              ));
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              setComponents(prev => prev.map(c => 
                c.id === component.id ? { 
                  ...c, 
                  width: ref.offsetWidth, 
                  height: ref.offsetHeight,
                  position,
                } : c
              ));
            }}
            onDragStart={() => onSelectComponent(component.id)}
            className={`p-1 z-10 transition-colors duration-200 ${
              selectedComponentId === component.id 
                ? 'ring-2 ring-blue-500/50 rounded-lg bg-blue-500/5' 
                : 'hover:ring-1 hover:ring-slate-600 rounded-lg'
            }`}
          >
            <div 
              className="w-full h-full flex flex-col items-center justify-center pointer-events-none"
            >
              <div className="pointer-events-auto" onClick={() => onSelectComponent(component.id)}>
                 {renderWokwiElement(component)}
              </div>
            </div>
            
            {selectedComponentId === component.id && (
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-lg whitespace-nowrap z-20">
                  {component.type}
               </div>
            )}
          </Rnd>
        )
      )}
    </div>
  );
};

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Canvas } from './components/Canvas';
import { Palette } from './components/Palette';
import { Toolbar } from './components/Toolbar';
import { CodeView } from './components/CodeView';
import { PropertiesPanel } from './components/PropertiesPanel';
import type { CanvasComponent, ComponentType } from './types';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_PIN_ASSIGNMENTS: Record<ComponentType, number> = {
  'led': 10,
  'button': 2,
  'arduino-uno': -1, 
};

const AVAILABLE_PINS = Array.from({ length: 12 }, (_, i) => i + 2); 

function App() {
  const [canvasComponents, setCanvasComponents] = useState<CanvasComponent[]>([]);
  const [isCodeViewVisible, setIsCodeViewVisible] = useState(false);
  const [draggedComponentType, setDraggedComponentType] = useState<ComponentType | null>(null);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [ledState, setLedState] = useState(false);

  useEffect(() => {
    if (isSimulationRunning) {
      if (buttonPressed) {
        setLedState(true);
      } else {
        setLedState(false);
      }
    } else {
      setLedState(false);
      setButtonPressed(false);
    }
  }, [isSimulationRunning, buttonPressed]);

  const selectedComponent = useMemo(() => 
    canvasComponents.find(c => c.id === selectedComponentId) || null
  , [canvasComponents, selectedComponentId]);

  const usedPins = useMemo(() => 
    canvasComponents.filter(c => c.pin !== undefined).map(c => c.pin!)
  , [canvasComponents]);

  useEffect(() => {
    console.log('canvasComponents updated:', canvasComponents);
  }, [canvasComponents]);

  const handleDragStart = (type: ComponentType) => {
    console.log('Dragging component:', type);
    setDraggedComponentType(type);
  };

  const handleDrop = (x: number, y: number) => {
    if (draggedComponentType) {
      const newComponent: CanvasComponent = {
        id: uuidv4(),
        type: draggedComponentType,
        position: { x, y },
        width: draggedComponentType === 'arduino-uno' ? 220 : 80,
        height: draggedComponentType === 'arduino-uno' ? 160 : 80,
      };

      if (draggedComponentType === 'led' || draggedComponentType === 'button') {
        const defaultPin = DEFAULT_PIN_ASSIGNMENTS[draggedComponentType];
        
        if (defaultPin !== -1 && AVAILABLE_PINS.includes(defaultPin) && !usedPins.includes(defaultPin)) {
          newComponent.pin = defaultPin;
        } else {
          const availablePin = AVAILABLE_PINS.find(pin => !usedPins.includes(pin));
          if (availablePin) {
            newComponent.pin = availablePin;
          } else {
            console.warn(`No available pins for ${draggedComponentType}. Add without pin.`);
          }
        }
      }
      console.log('Adding new component:', newComponent);
      setCanvasComponents((prev) => [...prev, newComponent]);
      setSelectedComponentId(newComponent.id);
      setDraggedComponentType(null); 
    }
  };

  const handlePinChange = useCallback((id: string, newPin: number) => {
    setCanvasComponents((prevComponents) =>
      prevComponents.map((comp) =>
        comp.id === id ? { ...comp, pin: newPin } : comp
      )
    );
  }, []);

  const handleDeleteComponent = (id: string) => {
    setCanvasComponents((prev) => prev.filter((c) => c.id !== id));
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    }
  };

  const toggleSimulation = () => {
    setIsSimulationRunning((prev) => !prev);
    if (!isSimulationRunning) setSelectedComponentId(null);
  };

  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col">
      <Toolbar
        onToggleCodeView={() => setIsCodeViewVisible(!isCodeViewVisible)}
        isCodeViewVisible={isCodeViewVisible}
        onToggleSimulation={toggleSimulation} 
        isSimulationRunning={isSimulationRunning} 
      />
      <div className="flex flex-1 overflow-hidden">
        <Palette onDragStart={handleDragStart} />
        <Canvas
          components={canvasComponents}
          setComponents={setCanvasComponents}
          onDrop={handleDrop}
          availablePins={AVAILABLE_PINS}
          onPinChange={handlePinChange}
          isSimulationRunning={isSimulationRunning}
          selectedComponentId={selectedComponentId}
          onSelectComponent={setSelectedComponentId}
          ledState={ledState}
          onButtonPress={setButtonPressed}
        />
        <PropertiesPanel
          component={selectedComponent}
          availablePins={AVAILABLE_PINS}
          onPinChange={handlePinChange}
          usedPins={usedPins}
          onDeleteComponent={handleDeleteComponent}
        />
        {isCodeViewVisible && <CodeView canvasComponents={canvasComponents} />}
      </div>
    </div>
  );
}

export default App;
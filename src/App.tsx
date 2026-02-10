import { useState, useCallback, useEffect, useMemo } from 'react'; // Added useMemo
import { Canvas } from './components/Canvas';
import { Palette } from './components/Palette';
import { Toolbar } from './components/Toolbar';
import { CodeView } from './components/CodeView';
import { PropertiesPanel } from './components/PropertiesPanel'; // Import PropertiesPanel
import type { CanvasComponent, ComponentType } from './types';
import { v4 as uuidv4 } from 'uuid';

// ... (rest of constants)
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
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null); // New state
  const [buttonPressed, setButtonPressed] = useState(false);
  const [ledState, setLedState] = useState(false);

  // Simulation Logic
  useEffect(() => {
    if (isSimulationRunning) {
      // In a real simulator, we'd parse the code. 
      // For this task, we hardcode the logic: Button -> LED.
      // We assume if ANY button is pressed, ALL LEDs turn on (simple logic level).
      // Or more strictly: Button on Pin X controls LED on Pin Y? 
      // The requirement says: "Button controls LED".
      if (buttonPressed) {
        setLedState(true);
      } else {
        setLedState(false);
      }
    } else {
      setLedState(false); // Reset when simulation stops
      setButtonPressed(false);
    }
  }, [isSimulationRunning, buttonPressed]);

  const selectedComponent = useMemo(() => 
    canvasComponents.find(c => c.id === selectedComponentId) || null
  , [canvasComponents, selectedComponentId]);

  const usedPins = useMemo(() => 
    canvasComponents.filter(c => c.pin !== undefined).map(c => c.pin!)
  , [canvasComponents]);

  // Log canvasComponents whenever it changes
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

      // Auto-assign pin for LED and Button
      if (draggedComponentType === 'led' || draggedComponentType === 'button') {
        const defaultPin = DEFAULT_PIN_ASSIGNMENTS[draggedComponentType];
        
        if (defaultPin !== -1 && AVAILABLE_PINS.includes(defaultPin) && !usedPins.includes(defaultPin)) {
          newComponent.pin = defaultPin;
        } else {
          // If default pin is not available, find the first available pin
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
      setSelectedComponentId(newComponent.id); // Select new component
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

  const toggleSimulation = () => {
    setIsSimulationRunning((prev) => !prev);
    if (!isSimulationRunning) setSelectedComponentId(null); // Clear selection when simulation starts
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
        />
        {isCodeViewVisible && <CodeView canvasComponents={canvasComponents} />}
      </div>
    </div>
  );
}

export default App;
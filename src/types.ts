export type ComponentType = 'arduino-uno' | 'led' | 'button'; // Updated 'arduino' to 'arduino-uno'

export interface CanvasComponent {
  id: string;
  type: ComponentType;
  position: { x: number; y: number };
  pin?: number; // Optional pin assignment for LED and Button
  width?: number; // Optional width for resizing
  height?: number; // Optional height for resizing
}

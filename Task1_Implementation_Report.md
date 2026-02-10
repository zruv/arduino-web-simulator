# Task 1: Web-Based Interface & Component Handling - Implementation Details

## Overview
This document details the implementation of **Task 1** for the OSHW Semester Long Internship screening task. The objective was to design a web-based interface that allows users to visually create a simple Arduino experiment, focusing on component handling (drag-and-drop), UI layout, and view switching.

## Achieved Objectives

### 1. Component Palette
**Requirement:** Provide a sidebar on the left with draggable components (Arduino Uno, LED, Push Button).

**Implementation:**
- Created a `Palette.tsx` component.
- Used standard HTML5 Drag and Drop API (`draggable` attribute and `onDragStart` event).
- Components available:
  - **Arduino Uno**
  - **LED**
  - **Push Button**
- When a user starts dragging an item, the `handleDragStart` function in `App.tsx` captures the component type (e.g., `'led'`, `'button'`).

### 2. Central Working Area (Canvas)
**Requirement:** A central area where users can drop and place components to build the circuit.

**Implementation:**
- Created a `Canvas.tsx` component acting as the drop target (`onDrop` and `onDragOver` handlers).
- Utilized the `react-rnd` library to make placed components **draggable** and **resizable** within the canvas.
- Integrated `@wokwi/elements` to render realistic SVG representations of the Arduino Uno, LED, and Push Button.
- **State Management:** The `App.tsx` component maintains a `canvasComponents` state array, tracking the ID, type, position (x, y), and pin assignments of every element on the canvas.

### 3. Toolbar & View Switching
**Requirement:** A toolbar option to switch between **Component View** and **Code View**. The code view should display generated Arduino code while keeping the circuit visible.

**Implementation:**
- Created a `Toolbar.tsx` component with:
  - **"Show Code" / "Hide Code" Button:** Toggles the `isCodeViewVisible` boolean state in `App.tsx`.
  - **"Start Simulation" / "Stop Simulation" Button:** Toggles the `isSimulationRunning` state.
- **Layout Logic:** 
  - The main layout uses a Flexbox container. 
  - When `isCodeViewVisible` is true, the `CodeView` component is conditionally rendered alongside the Canvas, resizing the interface dynamically to show both.

### 4. Simulation Controls
**Requirement:** Include **Start** and **Stop** buttons on the canvas.

**Implementation:**
- Added these buttons to the `Toolbar`.
- **State Behavior:** When "Start Simulation" is clicked (`isSimulationRunning` becomes `true`):
  - `react-rnd` wrappers are removed/disabled, locking components in place.
  - This prepares the visual state for the logic simulation (implemented in future tasks).

### 5. Code View Implementation
**Requirement:** Display automatically generated Arduino code.

**Implementation:**
- Created `CodeView.tsx`.
- Implemented a `useMemo` hook to generate C++ Arduino code strings dynamically based on the current state of `canvasComponents`.
- It iterates through the components to:
  - Define pin constants (e.g., `const int ledPin1 = 10;`).
  - Generate `setup()` blocks (e.g., `pinMode(..., OUTPUT);`).
  - Generate basic `loop()` logic (placeholder logic for now, fully implemented in Task 3).

## Technical Challenges & Solutions

### 1. The "Disappearing Component" Bug
**Issue:** Components would vanish or jump erratically when users tried to interact with the pin selection dropdown inside the draggable area.
**Root Cause:** The `react-rnd` drag listeners were capturing the `mousedown` events meant for the dropdown menu, causing the drag logic to misinterpret the click as a drag start coordinate update.
**Solution:** 
- Removed the inline pin dropdown from the component itself.
- Created a dedicated **Properties Panel** (`PropertiesPanel.tsx`) on the right side of the screen.
- Implemented a selection system: Clicking a component highlights it and populates the Properties Panel, completely decoupling interaction logic from drag logic.

### 2. Auto-Wiring Foundation
**Implementation:** 
- Implemented a `DEFAULT_PIN_ASSIGNMENTS` constant.
- When an LED is dropped, it automatically checks for availability of Pin 10. If taken, it scans for the next available digital pin (2-13).
- This fulfills the prerequisite for Task 2's auto-wiring logic while keeping the Task 1 drag-and-drop experience smooth.

## Summary of Files Created/Modified
- `src/App.tsx`: Main layout and state container.
- `src/components/Palette.tsx`: Draggable source items.
- `src/components/Canvas.tsx`: Drop target and component renderer.
- `src/components/Toolbar.tsx`: Control buttons.
- `src/components/CodeView.tsx`: Dynamic code generation display.
- `src/components/PropertiesPanel.tsx`: Component configuration UI.
- `src/types.ts`: TypeScript definitions for component structures.

This architecture provides a robust, extensible foundation for the advanced simulation features required in Tasks 2 and 3.

# Arduino Simulator Prototype - FOSSEE Screening Task

A minimal web-based Arduino simulator built for the FOSSEE OSHW Semester Internship screening task. This tool allows users to visually prototype a simple circuit with an Arduino Uno, an LED, and a Push Button, with automatic wiring and code generation.

## Features

- **Component Palette**: Drag-and-drop components (Arduino Uno, LED, Push Button) onto the canvas.
- **Auto-Wiring**: Logical and visual connections are automatically created when components are added.
- **Configurable Pins**: Change digital pin assignments (D2-D13) via the Properties Inspector.
- **Auto Code Generation**: Real-time Arduino code generation that reflects pin assignments.
- **Logic-Level Simulation**: Interactive simulation where a button press controls the LED state.
- **Modern UI**: Polished dark-mode interface with glassmorphism and responsive design.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Visualization**: [Wokwi Elements](https://github.com/wokwi/wokwi-elements)
- **Utilities**: `react-rnd` (Draggable components), `uuid`

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository or extract the project files.
2. Navigate to the project directory:
   ```bash
   cd arduino-simulator
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### Building for Production

To create a production build:
```bash
npm run build
```
The output will be in the `dist` folder.

## Submission Details

This project completes all three tasks (Task 1, Task 2, and Task 3) as outlined in the screening task description.

- **Task 1**: Interface & Component Handling
- **Task 2**: Auto-Wiring & Pin Configuration
- **Task 3**: Code Generation & Simulation


# SimuDuino: Arduino Web Simulator

A visually intuitive, web-based Arduino simulator built for prototyping circuits with an Arduino Uno, LEDs, and Push Buttons. This project features a drag-and-drop interface, automatic wiring, real-time code generation, and an interactive simulation environment.

## 🚀 Live Demo
**[View the Live Simulator](https://zruv.github.io/arduino-web-simulator/)**

## 🎥 Demo Video

<video src="sim-video.webm" controls="controls" width="100%"></video>

## ✨ Key Features

- **Interactive Canvas**: Drag-and-drop components (Arduino Uno, LED, Push Button) from the palette to build your circuit.
- **Visual & Logical Wiring**: Components automatically connect to the Arduino board with visual wire paths that update as you move elements.
- **Live Simulation**: Click "Start Simulation" to see your circuit in action. Press the physical button on the canvas to toggle the LED.
- **Properties Inspector**: 
  - Assign and change Digital Pins (D2-D13) on the fly.
  - Delete unwanted components with a single click.
- **Auto Code Generation**: A real-time `main.cpp` view that updates its logic based on your canvas layout and pin assignments.
- **Modern Design**: A dark-themed, glassmorphic UI built for a smooth developer experience.

## 🛠️ Tech Stack

- **Framework**: [React 18](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Web Components**: [@wokwi/elements](https://github.com/wokwi/wokwi-elements) for realistic hardware visualization.
- **Interactions**: `react-rnd` for resizing and dragging.

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/zruv/arduino-web-simulator.git
   cd arduino-web-simulator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run locally**:
   ```bash
   npm run dev
   ```

## 🚢 Deployment

This project is configured for **GitHub Actions**. Every time you push to the `main` branch, it automatically builds and deploys to GitHub Pages.

To set up manually:
1. Ensure `vite.config.ts` has the correct `base: '/arduino-web-simulator/'`.
2. Push your code: `git push origin main`.
3. In GitHub, go to **Settings > Pages** and set **Source** to **GitHub Actions**.

## 📝 License
This project was created as part of the FOSSEE OSHW Semester Internship screening task.
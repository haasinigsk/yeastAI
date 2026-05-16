# FermaSense AI — Fermentation Intelligence Platform

An AI-powered yeast fermentation monitoring dashboard prototype built with React, Tailwind CSS, Framer Motion, and Recharts.

## Features

- **Real-Time Sensor Monitoring** — Live temperature, pH, CO₂, and turbidity tracking
- **AI Predictions** — Health scores, yield estimates, and contamination risk analysis
- **Fermentation Simulation** — 7-stage biological lifecycle with 5 demo scenarios
- **Digital Twin** — Animated tank visualization with bubbles and health-reactive colors
- **Alert Management** — Dynamic alert generation with severity filtering
- **Device Management** — IoT device status tracking with live status changes
- **Reports & Analytics** — Trend analysis, batch comparison, and yield reports
- **Workflow Visualization** — Animated system architecture data flow

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- Framer Motion
- Recharts
- Lucide React Icons
- React Router v7

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000/landing` → Sign In (credentials pre-filled).

## Simulation

Navigate to `/simulation` and pick a scenario:
- **Normal Fermentation** — Healthy 60-second batch
- **Temperature Spike** — Cooling failure during peak activity
- **pH Failure** — Buffer depletion crisis
- **Sensor Disconnect** — Probe failure mid-batch
- **Critical Instability** — Multi-parameter cascade failure

## License

MIT

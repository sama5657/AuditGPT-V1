# AuditGPT

AI-Powered Security Auditor for Polygon PoS - The first production-grade autonomous auditor that combines deep static analysis with real-time on-chain monitoring.

## Overview

This is a React + TypeScript + Vite frontend application that provides smart contract auditing services powered by Google Gemini AI.

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (via CDN)
- **AI Integration**: Google Gemini 3.0 Pro
- **Blockchain**: Polygon PoS (via ethers.js)
- **Charts**: Recharts
- **PDF Generation**: jsPDF

## Project Structure

```
├── components/          # React components
│   ├── AuditDashboard.tsx
│   ├── Documentation.tsx
│   ├── Icons.tsx
│   ├── LandingPage.tsx
│   ├── LandingSections.tsx
│   ├── Logo.tsx
│   └── MonitoringDashboard.tsx
├── services/            # API services
│   ├── geminiService.ts
│   └── polygonService.ts
├── utils/               # Utility functions
│   └── pdfGenerator.ts
├── App.tsx              # Main app component
├── index.tsx            # Entry point
├── types.ts             # TypeScript types
└── vite.config.ts       # Vite configuration
```

## Running the Application

```bash
npm run dev
```

The application runs on port 5000.

## Building for Production

```bash
npm run build
```

Output is generated in the `dist` folder.

## Environment Variables

- `API_KEY` - Google Gemini API key for AI-powered auditing features

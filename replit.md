# AuditGPT

AI-Powered Smart Contract Security Auditor - A production-grade autonomous auditing platform that combines deep static analysis with AI-powered reasoning.

## Overview

This is a React + TypeScript + Vite frontend application that provides comprehensive smart contract auditing services powered by Google Gemini 3.0 Pro AI.

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (via CDN)
- **AI Integration**: Google Gemini 3.0 Pro
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
│   └── Logo.tsx
├── services/            # API services
│   └── geminiService.ts
├── utils/               # Utility functions
│   └── pdfGenerator.ts
├── App.tsx              # Main app component
├── index.tsx            # Entry point
├── types.ts             # TypeScript types
└── vite.config.ts       # Vite configuration
```

## Features

- **Deep Security Analysis**: Detects critical vulnerabilities using advanced AI reasoning
- **Gas Optimization**: Identifies cost reduction opportunities  
- **Economic Risk Modeling**: Simulates complex attack vectors
- **Upgradeability Checks**: Verifies proxy patterns and storage safety
- **Professional Reporting**: Generate executive PDF reports
- **Fast Turnaround**: Complete audits in under 60 seconds
- **No Configuration**: Works out-of-the-box

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

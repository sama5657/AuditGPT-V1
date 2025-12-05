# AuditGPT - AI-Powered Smart Contract Auditor for Polygon PoS

AuditGPT is a production-grade, autonomous smart contract auditing platform designed specifically for the Polygon Proof-of-Stake (PoS) ecosystem. It leverages the advanced reasoning capabilities of **Google Gemini 3.0 Pro (Thinking Mode)** to perform deterministic, deep-dive security analysis on Solidity source code, while simultaneously offering a real-time watchtower for deployed contracts.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Production-green.svg)
![Network](https://img.shields.io/badge/network-Polygon%20PoS-purple.svg)
![AI Model](https://img.shields.io/badge/AI-Gemini%203.0%20Pro-4285F4.svg)

## Key Features

### Deep Security Analysis (Source Code Mode)
- **Direct Code Input**: Paste Solidity source directly for line-by-line analysis.
- **Visual Progress Pipeline**: Real-time visualization of the audit steps (Static -> Gas -> Economic -> Upgrade).
- **Deterministic Audits**: Uses fixed seeds (`42`) and greedy decoding (`Temperature 0`, `TopK 1`) to ensure consistent, reproducible results.
- **Static Analysis Simulation**: Mimics industry-standard tools to identify:
  - Reentrancy (SWC-107)
  - Integer Overflows (SWC-101)
  - Access Control Failures (SWC-105)
  - Unchecked Return Values (SWC-104)

### Upgradeability & Proxy Checks
- **Proxy Patterns**: Detects UUPS, Transparent, Beacon, and Diamond proxy implementations.
- **Storage Safety**: Analyzes storage layout for collisions and validates initialization logic.
- **Self-Destruct**: Checks for unsafe `selfdestruct` or `delegatecall` usage.

### Gas & Economic Optimization
- **Gas Profiling**: Identifies expensive loops, storage packing inefficiencies, and redundant operations.
- **Economic Risk Modeling**: Simulates Flash Loan attacks, Price Oracle manipulation, and Front-running scenarios.

### Live Monitoring Dashboard
- **Real-Time Watchtower**: Connects directly to **Polygon Public RPCs** (`polygon-rpc.com`) to monitor live blockchain events.
- **Live Gas Tracker**: Visualizes real-time gas prices (Gwei) to help time deployments.
- **Event Feed**: Decodes live transactions and emits alerts for high-value transfers.
- **Resilience**: Built-in connection health monitoring, auto-reconnection logic, and manual **Retry Connection** capabilities.

### Professional Reporting
- **Executive PDF Export**: Generates detailed, professional-grade security reports.
- **Detailed Metrics**: Breakdown of vulnerabilities by severity, confidence, and impact.
- **Transparency**: Explicitly states the AI model version used for each audit.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **AI Engine**: Google Gemini 3.0 Pro (Thinking Mode, 32k Token Budget)
- **Blockchain**: Ethers.js v6 (Direct RPC Polling)
- **Visualization**: Recharts (Data Visualization)
- **Reporting**: jsPDF & jsPDF-AutoTable
- **Icons**: Lucide React

## Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/dinitheth/AuditGPT-V1
   cd auditgpt
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory with your Google Gemini API key:
   ```env
   API_KEY=your_google_genai_api_key_here
   ```
   *Get a free API key from [Google AI Studio](https://aistudio.google.com/).*

4. **Run Locally**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

## 📖 Usage Guide

### Mode 1: Security Audit
1. Navigate to the **Home** screen.
2. Paste your **Solidity Source Code** into the secure editor.
3. Click **"Start Security Audit"**.
4. Watch the **Green Progress Bar** as the system pipeline executes:
   - **Static Analysis**: Vulnerability detection.
   - **Gas Profiling**: Optimization suggestions.
   - **Economic Modeling**: Financial risk assessment.
   - **Upgradeability Check**: Proxy safety verification.
5. Review the interactive dashboard or export the **PDF Report**.

### Mode 2: Live Monitoring
1. Click **"Live Monitoring"** in the top navigation bar.
2. The dashboard automatically connects to the Polygon Mainnet via RPC.
3. **Add Contract**: Enter a name and address (e.g., a token or vault) to the watchlist.
4. **Configure Alerts**: Set thresholds for Gas Price (Gwei) or High-Value Transfers.
5. Watch the **Live Feed** for real-time transaction events.
6. If connection drops (e.g., Rate Limit 429), use the **Retry Connection** button.

## ⚠️ Disclaimer

AuditGPT is an advanced AI-assisted auditing tool. While it provides high-confidence insights and mimics professional analysis, **it does not replace a manual audit by a human security firm**. Always conduct rigorous testing and formal verification before deploying high-value smart contracts.

## 📄 License

This project is licensed under the MIT License.

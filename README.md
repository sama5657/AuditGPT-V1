# AuditGPT - AI-Powered Smart Contract Auditor

AuditGPT is a production-grade, autonomous smart contract auditing platform powered by **Google Gemini 3.0 Pro (Thinking Mode)**. It performs deterministic, deep-dive security analysis on Solidity source code to identify vulnerabilities, optimize gas usage, and assess economic risks using advanced AI reasoning.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Production-green.svg)
![AI Model](https://img.shields.io/badge/AI-Gemini%203.0%20Pro-4285F4.svg)

## Key Benefits

### 🔍 Comprehensive Security Analysis
- **Deep Vulnerability Detection**: Identifies critical security issues including Reentrancy, Integer Overflows, Access Control failures, and more using advanced AI reasoning
- **Deterministic Results**: Fixed-seed analysis ensures consistent, reproducible audit results
- **Fast Turnaround**: Complete security audits in under 60 seconds
- **No Configuration**: Works out-of-the-box - simply paste your code

### ⚡ Gas Optimization
- **Cost Reduction**: Identifies expensive loops, storage inefficiencies, and redundant operations to reduce execution costs
- **Performance Analysis**: Provides concrete gas savings estimates for each optimization

### 💰 Economic Risk Modeling
- **Attack Vector Simulation**: Analyzes complex attack scenarios including Flash Loan attacks, Price Oracle manipulation, and Front-running attacks
- **Financial Risk Assessment**: Evaluates incentive alignment and game-theoretic weaknesses

### 🔧 Proxy & Upgradeability Checks
- **Pattern Detection**: Identifies UUPS, Transparent, Beacon, and Diamond proxy implementations
- **Storage Safety**: Analyzes storage layout for collisions and validates initialization logic
- **Upgrade Validation**: Checks for unsafe delegatecall usage and selfdestruct vulnerabilities

### 📊 Professional Reporting
- **Executive Summaries**: Generate detailed PDF reports with severity scores and remediation steps
- **Code Fixes**: Automatic suggestions for fixing identified vulnerabilities
- **Transparency**: Clearly documents the AI model version used for each audit

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **AI Engine**: Google Gemini 3.0 Pro (Thinking Mode, 32k Token Budget)
- **Smart Contract Language**: Solidity (0.5 - 0.8+)
- **Visualization**: Recharts
- **Reporting**: jsPDF & jsPDF-AutoTable
- **Icons**: Lucide React

## Getting Started

### Installation

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
   Get a free API key from [Google AI Studio](https://aistudio.google.com/)

4. **Run Locally**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

## Usage Guide

### Smart Contract Audit
1. Navigate to the **Home** screen
2. Paste your **Solidity Source Code** into the editor
3. Click **"Start Security Audit"**
4. Watch the progress bar as the system executes the analysis pipeline:
   - **Static Analysis**: Vulnerability detection
   - **Gas Profiling**: Optimization suggestions
   - **Economic Modeling**: Financial risk assessment
   - **Upgradeability Check**: Proxy safety verification
5. Review the interactive dashboard or export the **PDF Report**

## Features

### Deep Static Analysis
Detects critical vulnerabilities using deterministic AI reasoning:
- Reentrancy vulnerabilities
- Integer overflows and underflows
- Access control failures
- Unchecked return values
- Logic errors and edge cases

### Security Lifecycle
From pre-deployment static analysis to comprehensive security assessment, AuditGPT covers every angle of smart contract security in one unified platform.

### Severity Classification
All findings are ranked by:
- **Severity Level**: High, Medium, Low, Info
- **Confidence Score**: How confident the AI is in the finding
- **Impact Assessment**: Potential consequences of the vulnerability

## API Requirements

AuditGPT requires:
- **Google Gemini API Key**: For AI-powered security analysis
- **Internet Connection**: To communicate with the Gemini API

## Disclaimer

AuditGPT is an advanced AI-assisted auditing tool. While it provides high-confidence insights and mimics professional analysis, **it does not replace a manual audit by a human security firm**. Always conduct rigorous testing and formal verification before deploying high-value smart contracts.

For critical production contracts, consider supplementing AuditGPT with:
- Professional manual security audits
- Formal verification and mathematical proofs
- Bug bounty programs
- Extensive testing and monitoring

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

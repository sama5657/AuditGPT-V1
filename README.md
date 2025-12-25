# AuditGPT - AI-Powered Smart Contract Auditor

AuditGPT is a production-grade, autonomous smart contract auditing platform powered by **Google Gemini 3.0 Pro (Thinking Mode)**. It performs deterministic, deep-dive security analysis on Solidity source code to identify vulnerabilities, optimize gas usage, assess economic risks, and provide comprehensive contract metrics using advanced AI reasoning.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Production-green.svg)
![AI Model](https://img.shields.io/badge/AI-Gemini%203.0%20Pro-4285F4.svg)

## Key Benefits for Web3 Developers

### 🔍 Comprehensive Security Analysis
- **Deep Vulnerability Detection**: Identifies critical security issues including Reentrancy, Integer Overflows, Access Control failures, and more using advanced AI reasoning
- **Deterministic Results**: Fixed-seed analysis ensures consistent, reproducible audit results across multiple runs
- **Fast Turnaround**: Complete security audits in under 60 seconds
- **No Configuration**: Works out-of-the-box - simply paste your code

### 📊 Contract Metrics & Analysis
- **Code Metrics**: Lines of code, function count, state variables, complexity estimation
- **Library Detection**: Automatically detects common libraries (OpenZeppelin, Uniswap, Aave, Chainlink, etc.)
- **Dependency Tracking**: Identifies all external calls and imported libraries
- **Inheritance Analysis**: Deep analysis of contract inheritance chains
- **Contract Complexity**: Estimates complexity level (Simple, Moderate, Complex, Very Complex)

### ⚡ Gas Optimization
- **Cost Reduction**: Identifies expensive loops, storage inefficiencies, and redundant operations to reduce execution costs
- **Performance Analysis**: Provides concrete gas savings estimates for each optimization
- **Storage Analysis**: Identifies packing opportunities and memory optimization
- **Opcode Efficiency**: Recommends calldata vs memory usage

### 💰 Economic Risk Modeling
- **Attack Vector Simulation**: Analyzes complex attack scenarios including Flash Loan attacks, Price Oracle manipulation, and Front-running attacks
- **Financial Risk Assessment**: Evaluates incentive alignment and game-theoretic weaknesses
- **Liquidity Analysis**: Checks for dependencies on spot balances

### 🔧 Proxy & Upgradeability Checks
- **Pattern Detection**: Identifies UUPS, Transparent, Beacon, and Diamond proxy implementations
- **Storage Safety**: Analyzes storage layout for collisions and validates initialization logic
- **Upgrade Validation**: Checks for unsafe delegatecall usage and selfdestruct vulnerabilities
- **Selector Clash Detection**: Identifies potential function selector collisions in proxies

### 📊 Professional Reporting
- **Executive Summaries**: Generate detailed PDF reports with severity scores and remediation steps
- **Code Fixes**: Automatic suggestions for fixing identified vulnerabilities
- **Model Transparency**: Clearly documents which AI model version used for each audit
- **Comprehensive Dashboard**: Interactive visualization with multiple analysis views

## New Developer-Friendly Features

✨ **Metrics Dashboard**: View contract statistics, complexity metrics, and detected libraries
✨ **Library Detection**: Automatic recognition of popular Web3 libraries and frameworks
✨ **Deterministic Analysis**: Consistent results across multiple audits with fixed seeds
✨ **EVM Compatible**: Works with any EVM-compatible blockchain (Ethereum, Polygon, Arbitrum, Optimism, etc.)

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
   GOOGLE_API_KEY=your_google_genai_api_key_here
   ```
   Or in Replit, add it as a secret via the 🔑 Secrets panel.
   
   Get a free API key from [Google AI Studio](https://aistudio.google.com/)

4. **Run Locally**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5000`

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
   - **Report Generation**: Dashboard and PDF compilation
5. Review results in the **interactive dashboard**:
   - **Security Tab**: Vulnerability details with severity, impact, and fixes
   - **Gas Tab**: Optimization opportunities with estimated savings
   - **Economic Tab**: Financial risk vectors and mitigation strategies
   - **Upgrade Tab**: Proxy pattern analysis and recommendations
   - **Metrics Tab**: Contract statistics and detected libraries
6. Export as **PDF Report** or audit another contract

## Audit Report Includes

### Security Analysis
- Critical vulnerability detection with SWC/Slither classifications
- Severity levels: High, Medium, Low, Info
- Confidence scores for each finding
- Line-number specific issue locations
- Code fixes and remediation strategies

### Gas Analysis
- Storage layout optimization
- Loop efficiency improvements
- Memory vs calldata recommendations
- Estimated gas savings

### Economic Risk Assessment
- Flash loan vulnerability analysis
- Oracle manipulation scenarios
- Front-running/sandwich attack vectors
- Incentive alignment checks

### Upgradeability Analysis
- Proxy pattern detection (UUPS, Transparent, Beacon, Diamond)
- Storage collision detection
- Initialization safety checks
- Upgrade authorization validation

### Contract Metrics
- Lines of code and complexity estimation
- Function and state variable count
- Inheritance depth analysis
- Detected library frameworks
- Code organization insights

## Features

### Deep Static Analysis
Detects critical vulnerabilities using deterministic AI reasoning:
- Reentrancy vulnerabilities
- Integer overflows and underflows
- Access control failures
- Unchecked return values
- Logic errors and edge cases
- Weak randomness
- Proxy implementation issues

### Deterministic & Reproducible
- Fixed seed analysis ensures consistent results
- Temperature 0 for greedy token selection
- Reproducible across multiple audits
- Perfect for compliance and documentation

### Production Ready
- Handles contracts of various sizes
- Graceful error handling
- Clear, actionable recommendations
- Professional reporting format
- Model version transparency

## API Requirements

AuditGPT requires:
- **Google Gemini API Key**: For AI-powered security analysis
- **Internet Connection**: To communicate with the Gemini API

## Disclaimer

AuditGPT is an advanced AI-assisted auditing tool. While it provides high-confidence insights and mimics professional analysis, **it does not replace a manual audit by a human security firm**. Always conduct rigorous testing and formal verification before deploying high-value smart contracts.

For critical production contracts, consider supplementing AuditGPT with:
- Professional manual security audits from reputable firms
- Formal verification and mathematical proofs
- Bug bounty programs
- Extensive testing on testnets
- Multi-stage deployment with monitoring

## Common Use Cases

✅ **Pre-Deployment Security Check** - Run audits before mainnet deployment
✅ **Code Review Assistance** - Use as a supplementary review tool for development
✅ **Upgrade Safety Verification** - Check proxy and upgrade patterns before upgrades
✅ **Gas Optimization** - Identify optimization opportunities in existing contracts
✅ **Library Integration** - Verify safe usage of external libraries and dependencies
✅ **Learning Tool** - Understand security patterns and best practices

## Performance Notes

- **Analysis Time**: Typically 30-60 seconds depending on contract size
- **Token Budget**: Uses up to 32k tokens for comprehensive analysis
- **Contract Size**: Supports contracts up to ~8000 lines of Solidity
- **Result Consistency**: Deterministic analysis for reproducible audits

## Support & Feedback

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Built with ❤️ for Web3 Developers**

AuditGPT - Making smart contract security accessible and affordable for everyone.

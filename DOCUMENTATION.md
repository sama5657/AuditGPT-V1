# AuditGPT Technical Documentation

## 1. System Architecture

AuditGPT operates as a high-performance Single Page Application (SPA) built with React and Vite. It orchestrates interactions between the user, smart contract code input, and the Google Gemini AI engine.

### High-Level Data Flow

1.  **Input Layer**: 
    - Users provide raw Solidity Source Code via the secure editor
    - Input is validated for length and basic syntax
2.  **Analysis Layer (`geminiService.ts`)**:
    - **Engine**: Google Gemini 3.0 Pro (Thinking Mode)
    - **Configuration**:
        - **Thinking Budget**: 32,768 tokens (Max reasoning capability)
        - **Determinism**: `temperature: 0`, `topK: 1`, `topP: 1`, `seed: 42`
        - **Fallback**: Automatically downgrades to Gemini 2.5 Flash if the Pro model is unavailable or rate-limited
    - **Output**: Strict JSON schema validation ensures predictable data structures
3.  **Presentation Layer**:
    - **Job Progress**: A state machine (`JobProgress`) tracks the audit lifecycle (Fetch -> Static -> Gas -> Economic -> Upgrade -> Report) and renders a visual progress bar
    - **AuditDashboard**: Interactive visualization of security findings using `recharts`
    - **PDF Generator**: Client-side PDF creation using `jspdf`, rendering code snippets and formatted tables

## 2. Core Modules

### 2.1 Security & Vulnerability Engine
Simulates static analysis tools to detect:
- **Critical Vulnerabilities**: Reentrancy, Overflow, Access Control
- **Logic Flaws**: Business logic errors often missed by automated tools
- **Classification**: Findings are ranked by Severity (High/Medium/Low) and Confidence

### 2.2 Gas Optimization Profiler
Analyzes EVM execution cost:
- **Storage Layout**: Checks for tight variable packing
- **Memory vs Calldata**: Optimizes data location for external calls
- **Opcode Efficiency**: Identifies expensive operations in hot loops

### 2.3 Economic Risk Modeler
Evaluates financial attack vectors:
- **Flash Loan Resilience**: Checks dependency on spot balances
- **Oracle Manipulation**: Validates price feed sources
- **Incentive Alignment**: Checks for game-theoretic weaknesses

### 2.4 Upgradeability & Proxy Analysis
Dedicated module for upgradeable contracts:
- **Proxy Pattern Detection**: UUPS, Transparent, Beacon, Diamond
- **Storage Collisions**: Checks for layout compatibility between upgrades
- **Initialization Safety**: Verifies `initialize` functions are protected

## 3. Services & APIs

### `performFullAudit(sourceCode, contractName)`
- **Purpose**: Main entry point for the AI auditing pipeline
- **Logic**: 
  1. Prepares prompts with strict system instructions
  2. Calls Gemini 3.0 Pro
  3. Falls back to 2.5 Flash on failure
  4. Parses and sanitizes JSON output using Regex to handle Markdown blocks
- **Returns**: `AuditReport` object

## 4. Data Types (`types.ts`)

The application enforces strict typing:
- `AuditReport`: Root object containing all analysis arrays
- `Vulnerability`: Schema for security findings
- `GasOptimization`: Schema for efficiency tips
- `EconomicRisk`: Schema for financial vectors
- `UpgradeabilityRisk`: Schema for proxy analysis

## 5. UI/UX Components

- **AuditDashboard**: Tabbed interface for viewing reports. Includes `recharts` for vulnerability distribution
- **App.tsx**: Manages global state (`AppState`) and the visual progress bar for audit jobs
- **Icons**: Centralized library based on `lucide-react`
- **PDF Generator**: Robust utility to export reports, featuring:
  - Automatic page breaks
  - Syntax highlighting-style boxes for code
  - Severity-colored badges

## 6. Key Features

### Security Analysis Pipeline
The audit process flows through multiple analysis stages:

1. **Initialization**: Setup and validation of input code
2. **Static Analysis**: Vulnerability detection using AI reasoning
3. **Gas Profiling**: Identification of gas optimization opportunities
4. **Economic Modeling**: Assessment of financial risks and attack vectors
5. **Upgradeability Analysis**: Proxy and upgrade pattern verification
6. **Report Generation**: Creation of comprehensive audit reports

### Deterministic Analysis
Using fixed seeds and greedy decoding ensures:
- Consistent results across multiple audits of the same code
- Reproducible findings for compliance and documentation
- Reliable testing and validation

### Production-Grade Reporting
- Executive summaries with overall security scores
- Detailed vulnerability classifications by severity and confidence
- Code snippets and remediation recommendations
- Professional PDF export for stakeholder review

## 7. Environment Variables

- `API_KEY`: Google Gemini API key for AI-powered security analysis

## 8. Error Handling

The application includes robust error handling:
- API failure recovery with fallback models
- Input validation with helpful error messages
- Network resilience for external API calls
- User-friendly error reporting in the UI

## 9. Performance Considerations

- **Analysis Time**: Typically completes in under 60 seconds
- **Token Budget**: Uses up to 32k tokens for comprehensive analysis
- **Client-Side Processing**: PDF generation and visualization happen locally
- **Efficient Caching**: Results are cached during the session

## 10. Security Practices

- **No Code Storage**: Source code is analyzed but never persisted
- **API Key Protection**: API keys should be kept in environment variables
- **Deterministic Seeds**: Ensures reproducible and verifiable analysis
- **Transparent AI Usage**: Clearly documents which AI model was used for each audit

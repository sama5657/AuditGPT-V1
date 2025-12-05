# AuditGPT Technical Documentation

## 1. System Architecture

AuditGPT operates as a high-performance Single Page Application (SPA) built with React and Vite. It orchestrates interactions between the user, the Polygon Blockchain (via RPC), and the Google Gemini AI engine.

### High-Level Data Flow

1.  **Input Layer**: 
    - Users provide raw Solidity Source Code via the secure editor.
    - Input is validated for length and basic syntax.
2.  **Analysis Layer (`geminiService.ts`)**:
    - **Engine**: Google Gemini 3.0 Pro (Thinking Mode).
    - **Configuration**:
        - **Thinking Budget**: 32,768 tokens (Max reasoning capability).
        - **Determinism**: `temperature: 0`, `topK: 1`, `topP: 1`, `seed: 42`.
        - **Fallback**: Automatically downgrades to Gemini 2.5 Flash if the Pro model is unavailable or rate-limited.
    - **Output**: Strict JSON schema validation ensures predictable data structures.
3.  **Monitoring Layer (`MonitoringDashboard.tsx`)**:
    - **Connection**: Direct HTTP polling to Polygon Public RPC nodes (e.g., `polygon-rpc.com`).
    - **Strategy**: Polls `getFeeData` and `getLogs` every **4 seconds** (aligned with Polygon block time).
    - **Resilience**: Implements timeouts, error catching for Rate Limits (HTTP 429), and manual retry mechanisms via a `retryTrigger` state.
4.  **Presentation Layer**:
    - **Job Progress**: A state machine (`JobProgress`) tracks the audit lifecycle (Fetch -> Static -> Gas -> Economic -> Upgrade -> Report) and renders a visual progress bar.
    - **AuditDashboard**: Interactive visualization of security findings using `recharts`.
    - **PDF Generator**: Client-side PDF creation using `jspdf`, rendering code snippets and formatted tables.

## 2. Core Modules

### 2.1 Security & Vulnerability Engine
Simulates static analysis tools to detect:
- **Critical Vulnerabilities**: Reentrancy, Overflow, Access Control.
- **Logic Flaws**: Business logic errors often missed by automated tools.
- **Classification**: Findings are ranked by Severity (High/Medium/Low) and Confidence.

### 2.2 Gas Optimization Profiler
Analyzes EVM execution cost:
- **Storage Layout**: checks for tight variable packing.
- **Memory vs Calldata**: Optimizes data location for external calls.
- **Opcode Efficiency**: Identifies expensive operations in hot loops.

### 2.3 Economic Risk Modeler
Evaluates financial attack vectors:
- **Flash Loan Resilience**: Checks dependency on spot balances.
- **Oracle Manipulation**: Validates price feed sources.
- **Incentive Alignment**: Checks for game-theoretic weaknesses.

### 2.4 Upgradeability & Proxy Analysis
Dedicated module for upgradeable contracts:
- **Proxy Pattern Detection**: UUPS, Transparent, Beacon, Diamond.
- **Storage Collisions**: Checks for layout compatibility between upgrades.
- **Initialization Safety**: Verifies `initialize` functions are protected.

### 2.5 Live Monitoring Dashboard
A real-time operational view:
- **Gas Tracker**: Plots Gwei trends.
- **Event Watcher**: Decodes logs for monitored contracts.
- **Alert System**: Configurable thresholds for value transfers and gas prices.

## 3. Services & APIs

### `performFullAudit(sourceCode, contractName)`
- **Purpose**: Main entry point for the AI auditing pipeline.
- **Logic**: 
  1. Prepares prompts with strict system instructions.
  2. Calls Gemini 3.0 Pro.
  3. Falls back to 2.5 Flash on failure.
  4. Parses and sanitizes JSON output using Regex to handle Markdown blocks.
- **Returns**: `AuditReport` object.

### `MonitoringDashboard.tsx` (Internal Service)
- **Purpose**: Manages blockchain connectivity.
- **Logic**:
  1. Initializes `ethers.JsonRpcProvider`.
  2. Polls for `blockNumber` and `feeData` every 4s.
  3. Filters logs for user-defined contract addresses.
  4. Updates local state with new events.
  5. Handles "Retry" actions by re-instantiating the provider.

## 4. Data Types (`types.ts`)

The application enforces strict typing:
- `AuditReport`: Root object containing all analysis arrays.
- `Vulnerability`: Schema for security findings.
- `GasOptimization`: Schema for efficiency tips.
- `EconomicRisk`: Schema for financial vectors.
- `UpgradeabilityRisk`: Schema for proxy analysis.
- `MonitoringEvent`: Schema for live blockchain events.

## 5. UI/UX Components

- **AuditDashboard**: Tabbed interface for viewing reports. Includes `recharts` for vulnerability distribution.
- **App.tsx**: Manages global state (`AppState`) and the visual progress bar for audit jobs.
- **Icons**: Centralized library based on `lucide-react`.
- **PDF Generator**: Robust utility to export reports, featuring:
  - Automatic page breaks.
  - Syntax highlighting-style boxes for code.
  - Severity-colored badges.
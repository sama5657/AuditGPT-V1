# AuditGPT Product Roadmap

## Phase 1: Foundation (✅ Completed)
- [x] **Core Analysis Engine**: Integration with Google Gemini 3.0 Pro (Thinking Mode).
- [x] **Deterministic Audits**: Implementation of seeded, greedy decoding for consistent results.
- [x] **Multi-Vector Audits**: Security, Gas, Economic, and Upgradeability analysis modules.
- [x] **Reporting**: Interactive Web Dashboard and Professional PDF Export.
- [x] **Source Code Mode**: Direct input for pre-deployment checks.

## Phase 2: Live Operations (✅ Completed)
- [x] **Real-Time Monitoring**: Client-side connection to Polygon RPC nodes.
- [x] **Live Gas Tracking**: Real-time Gwei charting.
- [x] **Event Watchtower**: Live decoding of contract events and alerts.
- [x] **Resilience**: Robust error handling, RPC fallbacks, and connection retry mechanisms.

## Phase 3: Advanced Analysis (In Progress)
- [ ] **Custom RPC Support**: Allow users to bring their own RPC endpoints (e.g., Alchemy, Infura).
- [ ] **Bytecode Decompilation**: Audit unverified contracts directly from raw bytecode.
- [ ] **Formal Verification**: Integration with symbolic execution engines for mathematical proofs.
- [ ] **Dependency Scanning**: Auto-detect imported libraries (OpenZeppelin) and check against known CVE databases.

## Phase 4: Ecosystem Integration
- [ ] **IDE Plugins**: VS Code extension to run AuditGPT directly in the editor.
- [ ] **CI/CD Pipelines**: GitHub Action to block PRs if critical vulnerabilities are found.
- [ ] **Wallet Integration**: "One-Click Audit" for any contract interaction via MetaMask Snap.

## Phase 5: Enterprise Features
- [ ] **Team Collaboration**: Shared audit workspaces and commenting.
- [ ] **Historical Diffing**: Compare audits between upgradeable proxy implementation versions.
- [ ] **API Access**: Developer API for programmatic access to the audit engine.
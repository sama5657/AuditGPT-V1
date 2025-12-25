
export enum Severity {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
  INFO = 'Info'
}

export enum AnalysisStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface Vulnerability {
  id: string; // e.g., SWC-107 or SLITHER-1
  title: string;
  severity: Severity;
  description: string;
  lineNumber: number;
  remediation: string;
  codeFix: string;
  impact: string;
  confidence: 'High' | 'Medium' | 'Low';
}

export interface GasOptimization {
  category: string; // e.g., "State Variable Packing"
  description: string;
  potentialSavings: string; // e.g., "High (~2000 gas/call)"
  codeSnippet: string;
}

export interface EconomicRisk {
  vector: string; // e.g., "Flash Loan Attack"
  riskLevel: Severity;
  scenario: string;
  mitigation: string;
}

export interface UpgradeabilityRisk {
  type: string; // e.g., "Storage Collision", "Unsafe Selfdestruct"
  severity: Severity;
  proxyType?: string; // e.g., "UUPS", "Transparent", "Beacon", "Diamond"
  description: string;
  recommendation: string;
}

export interface AuditReport {
  contractName: string;
  contractAddress?: string;
  network: string;
  auditDate: string;
  overallScore: number;
  summary: string;
  vulnerabilities: Vulnerability[];
  gasAnalysis: GasOptimization[];
  economicAnalysis: EconomicRisk[];
  upgradeabilityAnalysis: UpgradeabilityRisk[];
  formalVerificationSuggestions: string[];
  modelUsed?: string; // Track which AI model generated the report
}

export interface JobProgress {
  fetch: AnalysisStatus;
  staticAnalysis: AnalysisStatus;
  gasAnalysis: AnalysisStatus;
  economicAnalysis: AnalysisStatus;
  upgradeAnalysis: AnalysisStatus;
  reportGeneration: AnalysisStatus;
}

export enum AppState {
  LANDING = 'LANDING',
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR',
  DOCUMENTATION = 'DOCUMENTATION'
}

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'process';
}

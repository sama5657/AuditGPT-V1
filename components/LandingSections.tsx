
import React from 'react';
import { Icons } from './Icons';

export const LandingSections: React.FC = () => {
  return (
    <div className="w-full space-y-24 py-12 animate-in fade-in duration-700">
      
      {/* Trust Badge Strip */}
      <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
        <div className="flex items-center gap-2 text-slate-300 font-bold text-sm">
          <Icons.Cpu className="w-5 h-5" /> Google Gemini 3.0
        </div>
        <div className="flex items-center gap-2 text-slate-300 font-bold text-sm">
          <Icons.Code className="w-5 h-5" /> Solidity Auditing
        </div>
        <div className="flex items-center gap-2 text-slate-300 font-bold text-sm">
          <Icons.Shield className="w-5 h-5" /> Deterministic AI
        </div>
      </div>

      {/* Feature List */}
      <section>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Complete Security Lifecycle</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            From pre-deployment static analysis to real-time on-chain monitoring, AuditGPT covers every angle of smart contract security.
          </p>
        </div>

        <div className="flex flex-col max-w-4xl mx-auto border-t border-slate-800">
          <FeatureRow 
            title="Deep Static Analysis"
            desc="Detects critical vulnerabilities like Reentrancy, Overflows, and Access Control failures using deterministic AI reasoning."
          />
          <FeatureRow 
            title="Gas Optimization"
            desc="Identifies expensive loops, storage inefficiencies, and redundant operations to reduce execution costs."
          />
          <FeatureRow 
            title="Economic Risk Modeling"
            desc="Simulates complex attack vectors like Flash Loans, Oracle Manipulation, and Sandwich attacks."
          />
           <FeatureRow 
            title="Upgradeability Checks"
            desc="Verifies proxy patterns (Diamond, UUPS), storage slot collisions, and initialization safety."
          />
          <FeatureRow 
            title="Professional Reports"
            desc="Generates executive PDF reports with severity scores, remediation steps, and auto-generated code fixes."
          />
        </div>
      </section>

      {/* How it Works */}
      <section className="relative overflow-hidden bg-slate-800/30 rounded-3xl p-8 md:p-12 border border-slate-700/50">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/5 to-blue-500/5 pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Step 
              num="01" 
              title="Input Source" 
              desc="Paste your Solidity code into the secure editor. No setup required." 
            />
            <Step 
              num="02" 
              title="AI Analysis" 
              desc="Gemini 3.0 Pro performs a deep-dive audit with 32k token reasoning budget." 
            />
            <Step 
              num="03" 
              title="Get Results" 
              desc="Receive a detailed dashboard and PDF report with fix suggestions." 
            />
          </div>
        </div>
      </section>

      {/* Stats / Footer */}
      <div className="border-t border-slate-800 pt-12 pb-6 text-center">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
            <Stat val="0" label="Configuration Needed" />
            <Stat val="< 60s" label="Audit Time" />
            <Stat val="AI-Powered" label="Security Analysis" />
        </div>
        <p className="text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} AuditGPT. AI-Powered Smart Contract Security.
        </p>
      </div>

    </div>
  );
};

const FeatureRow = ({ title, desc }: any) => (
  <div className="py-6 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-baseline gap-2 md:gap-12 hover:bg-slate-800/30 transition-colors px-4 rounded-lg">
    <h3 className="text-lg font-bold text-blue-400 md:w-64 shrink-0">{title}</h3>
    <p className="text-slate-400 text-base leading-relaxed">{desc}</p>
  </div>
);

const Step = ({ num, title, desc }: any) => (
  <div className="text-center space-y-3 relative group">
    <div className="text-5xl font-black text-slate-800 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 scale-150 opacity-50 select-none z-0">{num}</div>
    <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-purple-400 to-blue-500 font-mono relative z-10">{num}</div>
    <h3 className="text-xl font-bold text-white relative z-10 pt-2">{title}</h3>
    <p className="text-slate-400 text-sm relative z-10">{desc}</p>
  </div>
);

const Stat = ({ val, label }: any) => (
  <div>
    <div className="text-3xl font-bold text-white mb-1">{val}</div>
    <div className="text-xs text-slate-500 uppercase tracking-wider">{label}</div>
  </div>
);

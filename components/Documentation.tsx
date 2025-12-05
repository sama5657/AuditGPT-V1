
import React from 'react';
import { Icons } from './Icons';

interface DocumentationProps {
  onBack: () => void;
}

export const Documentation: React.FC<DocumentationProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-slate-300 animate-in fade-in duration-500">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <Icons.ChevronRight className="w-4 h-4 rotate-180" />
        Back to Auditor
      </button>

      <h1 className="text-3xl font-bold text-white mb-8">Documentation</h1>

      <div className="space-y-12">
        <section>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Icons.Shield className="w-5 h-5 text-purple-400" />
            Introduction
          </h2>
          <p className="leading-relaxed mb-4 text-slate-400">
            AuditGPT is an autonomous AI-powered smart contract auditor designed specifically for the Polygon PoS ecosystem.
            It leverages advanced LLMs (Google Gemini) alongside static analysis heuristics to detect vulnerabilities, logic errors, and gas inefficiencies in Solidity code.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Icons.Terminal className="w-5 h-5 text-blue-400" />
            How to Use
          </h2>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 space-y-4 shadow-lg">
            <div>
              <h3 className="font-medium text-white mb-1 flex items-center gap-2"><Icons.FileCode className="w-4 h-4"/> Source Code Mode</h3>
              <p className="text-sm text-slate-400">
                Paste your Solidity smart contract code directly into the editor. This provides the AI with the most context and allows for precise line-by-line analysis and remediation suggestions.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Icons.Activity className="w-5 h-5 text-green-400" />
            Vulnerability Severity Levels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/15 transition-colors">
              <span className="text-red-400 font-bold text-sm uppercase tracking-wider">High</span>
              <p className="text-xs mt-2 text-slate-300">Critical vulnerabilities that can lead to loss of funds, ownership takeover, or contract locking. Immediate action required.</p>
            </div>
            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg hover:bg-orange-500/15 transition-colors">
              <span className="text-orange-400 font-bold text-sm uppercase tracking-wider">Medium</span>
              <p className="text-xs mt-2 text-slate-300">Issues that could impact contract function or lead to partial loss under specific conditions. Fix recommended before deployment.</p>
            </div>
             <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg hover:bg-yellow-500/15 transition-colors">
              <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">Low</span>
              <p className="text-xs mt-2 text-slate-300">Minor issues, gas inefficiencies, or best practice violations. Should be addressed for code quality.</p>
            </div>
             <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/15 transition-colors">
              <span className="text-blue-400 font-bold text-sm uppercase tracking-wider">Info</span>
              <p className="text-xs mt-2 text-slate-300">Informational observations, stylistic suggestions, or architectural notes.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Icons.Zap className="w-5 h-5 text-yellow-400" />
            Supported Analysis
          </h2>
          <ul className="list-disc list-inside space-y-2 text-slate-400 text-sm">
             <li>Reentrancy Attacks (SWC-107)</li>
             <li>Integer Overflow/Underflow (SWC-101)</li>
             <li>Unchecked Return Values (SWC-104)</li>
             <li>Access Control Logic Errors</li>
             <li>Gas Optimization Suggestions</li>
             <li>Front-Running Opportunities</li>
          </ul>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Icons.Info className="w-5 h-5 text-indigo-400" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
             <FAQItem 
               question="Is AuditGPT a replacement for manual audits?"
               answer="No. While AuditGPT provides production-grade static analysis and can catch many critical vulnerabilities, it should be used as a pre-deployment tool. High-value contracts should always undergo a manual audit by a reputable security firm."
             />
             <FAQItem 
               question="Which networks does AuditGPT support?"
               answer="The Live Monitoring features are specifically tuned for the Polygon PoS Mainnet. However, the static code analysis engine works for any EVM-compatible Solidity code (Ethereum, Arbitrum, Optimism, etc.)."
             />
             <FAQItem 
               question="Does AuditGPT store my source code?"
               answer="No. Your code is sent to the Google Gemini API for analysis and returned immediately. We do not persist your contract code in any database."
             />
             <FAQItem 
               question="How does the 'Thinking Mode' work?"
               answer="AuditGPT uses Google Gemini 3.0 Pro with a high 'thinking budget' (32k tokens). This forces the model to perform a chain-of-thought reasoning process before outputting the final report, significantly reducing hallucinations and increasing the depth of the security review."
             />
             <FAQItem 
               question="Why do I see 'Rate Limit' errors in monitoring?"
               answer="The monitoring dashboard connects to public Polygon RPC nodes. These free nodes often have rate limits. If you encounter issues, try the 'Retry' button or wait a few seconds. The system auto-recovers from transient network errors."
             />
          </div>
        </section>
      </div>
    </div>
  );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => (
  <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700 hover:bg-slate-800 transition-colors">
    <h3 className="text-white font-medium mb-2 flex items-start gap-2">
      <Icons.ChevronRight className="w-4 h-4 text-purple-400 mt-1 shrink-0" />
      {question}
    </h3>
    <p className="text-slate-400 text-sm leading-relaxed pl-6">
      {answer}
    </p>
  </div>
);

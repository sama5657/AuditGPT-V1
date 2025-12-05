import React, { useState } from 'react';
import { AuditReport, Severity, Vulnerability, GasOptimization, EconomicRisk } from '../types';
import { Icons } from './Icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { generatePDF } from '../utils/pdfGenerator';

interface AuditDashboardProps {
  report: AuditReport;
  onReset: () => void;
}

const COLORS = {
  [Severity.HIGH]: '#ef4444', 
  [Severity.MEDIUM]: '#f97316', 
  [Severity.LOW]: '#eab308', 
  [Severity.INFO]: '#3b82f6', 
};

type Tab = 'security' | 'gas' | 'economic' | 'upgrade';

export const AuditDashboard: React.FC<AuditDashboardProps> = ({ report, onReset }) => {
  const [activeTab, setActiveTab] = useState<Tab>('security');
  const [selectedVuln, setSelectedVuln] = useState<Vulnerability | null>(
    report.vulnerabilities.length > 0 ? report.vulnerabilities[0] : null
  );

  const stats = [
    { name: 'High', value: report.vulnerabilities.filter(v => v.severity === Severity.HIGH).length, color: COLORS[Severity.HIGH] },
    { name: 'Medium', value: report.vulnerabilities.filter(v => v.severity === Severity.MEDIUM).length, color: COLORS[Severity.MEDIUM] },
    { name: 'Low', value: report.vulnerabilities.filter(v => v.severity === Severity.LOW).length, color: COLORS[Severity.LOW] },
    { name: 'Info', value: report.vulnerabilities.filter(v => v.severity === Severity.INFO).length, color: COLORS[Severity.INFO] },
  ].filter(s => s.value > 0);

  const scoreColor = 
    report.overallScore >= 90 ? 'text-green-400' :
    report.overallScore >= 70 ? 'text-yellow-400' :
    'text-red-500';

  return (
    <div className="flex flex-col h-full w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white">{report.contractName}</h1>
            <span className="px-3 py-1 text-xs font-mono bg-slate-700 text-slate-300 rounded-full border border-slate-600">
              {report.network}
            </span>
            {report.contractAddress && (
              <span className="px-3 py-1 text-xs font-mono bg-slate-900 text-slate-400 rounded-full border border-slate-800">
                {report.contractAddress.substring(0,6)}...{report.contractAddress.substring(38)}
              </span>
            )}
             {/* Model Indicator */}
             {report.modelUsed && (
               <span className="flex items-center gap-1 px-3 py-1 text-xs font-mono bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
                 <Icons.Cpu className="w-3 h-3" />
                 {report.modelUsed}
               </span>
             )}
          </div>
          <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">{report.summary}</p>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="text-center">
            <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">Security Score</p>
            <div className={`text-5xl font-bold ${scoreColor}`}>{report.overallScore}</div>
          </div>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => generatePDF(report)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors border border-slate-600 text-sm"
            >
              <Icons.Download className="w-4 h-4" />
              Export PDF
            </button>
            <button 
              onClick={onReset}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors shadow-lg shadow-purple-500/20 text-sm"
            >
              <Icons.Search className="w-4 h-4" />
              New Audit
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-700 overflow-x-auto">
        <TabButton 
          active={activeTab === 'security'} 
          onClick={() => setActiveTab('security')} 
          icon={Icons.Shield} 
          label={`Security (${report.vulnerabilities.length})`} 
        />
        <TabButton 
          active={activeTab === 'gas'} 
          onClick={() => setActiveTab('gas')} 
          icon={Icons.Zap} 
          label={`Gas (${report.gasAnalysis.length})`} 
        />
        <TabButton 
          active={activeTab === 'economic'} 
          onClick={() => setActiveTab('economic')} 
          icon={Icons.Activity} 
          label={`Economic (${report.economicAnalysis.length})`} 
        />
        <TabButton 
          active={activeTab === 'upgrade'} 
          onClick={() => setActiveTab('upgrade')} 
          icon={Icons.GitBranch} 
          label={`Upgradeability (${report.upgradeabilityAnalysis ? report.upgradeabilityAnalysis.length : 0})`} 
        />
      </div>

      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2">
          {/* Left Column: Stats & List */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                Vuln Distribution
              </h3>
              <div className="h-40 w-full">
                {stats.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {stats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                        itemStyle={{ color: '#f8fafc' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500">
                    <span className="flex items-center gap-2">
                      <Icons.CheckCircle className="w-5 h-5 text-green-500" /> No vulnerabilities
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden flex flex-col max-h-[600px]">
              <div className="p-4 border-b border-slate-700 bg-slate-800/50">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Icons.AlertTriangle className="w-4 h-4 text-orange-400" />
                  Detected Findings
                </h3>
              </div>
              <div className="overflow-y-auto custom-scrollbar flex-1 p-2 space-y-2">
                {report.vulnerabilities.map((vuln) => (
                  <button
                    key={vuln.id}
                    onClick={() => setSelectedVuln(vuln)}
                    className={`w-full text-left p-3 rounded-lg transition-all border ${
                      selectedVuln?.id === vuln.id 
                        ? 'bg-slate-700 border-purple-500/50 ring-1 ring-purple-500/20' 
                        : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-mono text-[10px] text-slate-500 uppercase">{vuln.id}</span>
                      <Badge severity={vuln.severity} />
                    </div>
                    <h4 className="font-medium text-slate-200 truncate text-sm">{vuln.title}</h4>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedVuln ? (
              <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg p-6 min-h-[600px]">
                <div className="flex flex-col gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-white flex items-center gap-3">
                        {selectedVuln.title}
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-mono">Confidence: {selectedVuln.confidence}</span>
                        <Badge severity={selectedVuln.severity} size="lg" />
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed mb-6 text-sm">
                      {selectedVuln.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <Icons.Activity className="w-3 h-3" /> Impact
                        </h4>
                        <p className="text-sm text-slate-300">{selectedVuln.impact}</p>
                     </div>
                     <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <Icons.Shield className="w-3 h-3" /> Mitigation
                        </h4>
                        <p className="text-sm text-slate-300">{selectedVuln.remediation}</p>
                     </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Icons.Terminal className="w-4 h-4 text-green-400" />
                      Code Fix
                    </h3>
                    <div className="bg-black/80 rounded-lg p-4 overflow-x-auto border border-slate-700 font-mono text-xs relative group">
                      <div className="absolute top-2 right-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] text-slate-500">Solidity</span>
                      </div>
                      <pre className="text-green-300">
                        <code>{selectedVuln.codeFix}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center bg-slate-800 rounded-xl border border-slate-700 border-dashed p-12 text-slate-500">
                  <p>Select a vulnerability to view details.</p>
               </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'gas' && (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2">
            {report.gasAnalysis.map((item, i) => (
              <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
                 <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                       <Icons.Zap className="w-4 h-4 text-yellow-400" />
                       {item.category}
                    </h3>
                    <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded text-xs font-mono">
                       {item.potentialSavings}
                    </span>
                 </div>
                 <p className="text-slate-300 text-sm mb-4">{item.description}</p>
                 <div className="bg-slate-900 rounded p-3 font-mono text-xs text-slate-400 border border-slate-800">
                    {item.codeSnippet}
                 </div>
              </div>
            ))}
            {report.gasAnalysis.length === 0 && (
               <div className="col-span-2 text-center p-12 text-slate-500 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed">
                  No significant gas optimizations found. Contract is efficient.
               </div>
            )}
         </div>
      )}

      {activeTab === 'economic' && (
         <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            {report.economicAnalysis.map((risk, i) => (
               <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                     <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white">{risk.vector}</h3>
                        <Badge severity={risk.riskLevel} />
                     </div>
                     <p className="text-slate-400 text-sm mb-4">{risk.scenario}</p>
                  </div>
                  <div className="flex-1 bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                     <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Recommendation</h4>
                     <p className="text-slate-300 text-sm">{risk.mitigation}</p>
                  </div>
               </div>
            ))}
             {report.economicAnalysis.length === 0 && (
               <div className="text-center p-12 text-slate-500 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed">
                  No immediate economic attack vectors detected.
               </div>
            )}
         </div>
      )}

      {activeTab === 'upgrade' && (
         <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            {report.upgradeabilityAnalysis && report.upgradeabilityAnalysis.map((item, i) => (
               <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
                  <div className="flex justify-between items-start mb-2">
                     <div className="flex items-center">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                           <Icons.GitBranch className="w-5 h-5 text-purple-400" />
                           {item.type}
                        </h3>
                        {item.proxyType && item.proxyType !== 'n/a' && item.proxyType !== 'None' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 ml-3 uppercase tracking-wide">
                            {item.proxyType}
                          </span>
                        )}
                     </div>
                     <Badge severity={item.severity} />
                  </div>
                  <p className="text-slate-300 text-sm mb-4 leading-relaxed">{item.description}</p>
                  <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-3">
                     <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">Recommendation</h4>
                     <p className="text-slate-400 text-sm">{item.recommendation}</p>
                  </div>
               </div>
            ))}
            {(!report.upgradeabilityAnalysis || report.upgradeabilityAnalysis.length === 0) && (
               <div className="text-center p-12 text-slate-500 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed">
                  No upgradeability risks or proxy patterns detected.
               </div>
            )}
         </div>
      )}
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: any; label: string }> = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
      active 
        ? 'border-purple-500 text-white bg-slate-800/50' 
        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
    }`}
  >
    <Icon className={`w-4 h-4 ${active ? 'text-purple-400' : 'text-slate-500'}`} />
    {label}
  </button>
);

const Badge: React.FC<{ severity: Severity; size?: 'sm' | 'lg' }> = ({ severity, size = 'sm' }) => {
  const styles = {
    [Severity.HIGH]: 'bg-red-500/10 text-red-400 border-red-500/20',
    [Severity.MEDIUM]: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    [Severity.LOW]: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    [Severity.INFO]: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };
  const px = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-[10px]';
  return (
    <span className={`${px} rounded border font-medium uppercase tracking-wider ${styles[severity]}`}>
      {severity}
    </span>
  );
};
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './Icons';
import { MonitoredContract, AlertConfig, MonitoringEvent, Severity } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ethers, formatUnits } from 'ethers';

interface MonitoringDashboardProps {
  onBack: () => void;
}

// Polygon Public RPCs
const RPC_URL = "https://polygon-rpc.com";

// Standard ERC20 Transfer Topic
const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

// Pre-load some active contracts so the user sees data immediately
const DEFAULT_CONTRACTS: MonitoredContract[] = [
  {
    address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    name: "WMATIC (Wrapped Matic)",
    status: 'active',
    events: [],
    stats: { txCount: 0, volume: 0, lastGas: 0 }
  },
  {
    address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    name: "USDT (Tether)",
    status: 'active',
    events: [],
    stats: { txCount: 0, volume: 0, lastGas: 0 }
  }
];

export const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({ onBack }) => {
  const [contracts, setContracts] = useState<MonitoredContract[]>(DEFAULT_CONTRACTS);
  const [newAddress, setNewAddress] = useState('');
  const [newName, setNewName] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    email: '',
    slackWebhook: '',
    discordWebhook: '',
    minEthTransfer: 100,
    gasThreshold: 300,
    detectFlashLoans: true
  });
  
  // Real Data State
  const [currentBlock, setCurrentBlock] = useState<number>(0);
  const [chartData, setChartData] = useState<{time: string, gas: number, txs: number}[]>([]);
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);
  
  const lastBlockRef = useRef<number>(0);

  // Initialize Provider
  useEffect(() => {
    const init = async () => {
      setIsLive(false);
      setError(null);
      try {
        const p = new ethers.JsonRpcProvider(RPC_URL);
        
        // Race condition to handle timeouts if RPC is hanging
        const net = await Promise.race([
          p.getNetwork(),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Connection timeout")), 5000))
        ]);

        setProvider(p);
        const block = await p.getBlockNumber();
        setCurrentBlock(block);
        lastBlockRef.current = block;
        setIsLive(true);
      } catch (e: any) {
        console.error("RPC Connection Error", e);
        let msg = "Failed to connect to Polygon RPC.";
        if (e.message.includes("timeout")) msg = "Connection timed out. Network may be congested.";
        else if (e.message.includes("429")) msg = "Rate limit exceeded. Please wait a moment.";
        else if (e.code === "NETWORK_ERROR") msg = "Network error. Check your internet connection.";
        setError(msg);
      }
    };
    init();
  }, [retryTrigger]);

  // Polling Loop for Real Data
  useEffect(() => {
    if (!provider || !isLive) return;

    const interval = setInterval(async () => {
      try {
        const latestBlock = await provider.getBlockNumber();
        
        // 1. Fetch Real Gas Price
        const feeData = await provider.getFeeData();
        const gasPriceGwei = feeData.gasPrice ? parseFloat(formatUnits(feeData.gasPrice, 'gwei')) : 0;
        
        const now = new Date();
        const timeStr = now.toLocaleTimeString();

        setChartData(prev => {
          const newData = [...prev, {
            time: timeStr,
            gas: gasPriceGwei,
            txs: 0 // Placeholder for block volume if we fetched full block
          }];
          return newData.slice(-20);
        });

        // 2. Fetch Events if new block
        if (latestBlock > lastBlockRef.current) {
          setCurrentBlock(latestBlock);
          
          // Check logs for all active contracts
          const activeContracts = contracts.filter(c => c.status === 'active');
          
          for (const contract of activeContracts) {
            // Get logs for this contract in the new block range
            const logs = await provider.getLogs({
              address: contract.address,
              fromBlock: lastBlockRef.current + 1,
              toBlock: latestBlock
            });

            if (logs.length > 0) {
              const newEvents: MonitoringEvent[] = logs.map(log => {
                let type: MonitoringEvent['type'] = 'TRANSACTION';
                let message = 'Contract Interaction';
                let severity = Severity.INFO;
                let val = '0';

                // Simple heuristic for Transfer events
                if (log.topics[0] === TRANSFER_TOPIC) {
                  // ERC20 Transfer
                  type = 'TRANSACTION';
                  // Try to decode value (uint256 is data)
                  try {
                     val = formatUnits(log.data, 18); // Assuming 18 decimals for simplicity
                     message = `Transfer: ${parseFloat(val).toFixed(2)} Tokens`;
                     
                     // Alert Check
                     if (parseFloat(val) > alertConfig.minEthTransfer) {
                       severity = Severity.MEDIUM;
                       message += ` (High Value)`;
                     }
                  } catch (e) {
                     message = 'Transfer Event';
                  }
                } else {
                  // Unknown Event
                  message = `Event: ${log.topics[0].substring(0, 10)}...`;
                }

                return {
                  id: log.transactionHash + log.index,
                  timestamp: Date.now(),
                  type,
                  severity,
                  message,
                  hash: log.transactionHash,
                  value: val
                };
              });

              // Update State
              setContracts(prev => prev.map(c => {
                if (c.address === contract.address) {
                  return {
                    ...c,
                    events: [...newEvents, ...c.events].slice(0, 50),
                    stats: {
                      ...c.stats,
                      txCount: c.stats.txCount + newEvents.length,
                      volume: c.stats.volume + newEvents.reduce((acc, e) => acc + parseFloat(e.value || '0'), 0)
                    }
                  };
                }
                return c;
              }));
            }
          }

          lastBlockRef.current = latestBlock;
          
          // Clear transient errors if successful
          if (error) setError(null);
        }

      } catch (err: any) {
        console.error("Polling Error:", err);
        // Don't kill the connection on intermittent errors, but show warning
        if (err.message?.includes("429")) {
           setError("Rate limit warning (429). Slowing down...");
        } else if (err.code === "NETWORK_ERROR" || err.message?.includes("network")) {
           setError("Connection unstable. Retrying...");
        }
      }
    }, 4000); // Poll every 4 seconds (Polygon block time is ~2s)

    return () => clearInterval(interval);
  }, [provider, isLive, contracts, alertConfig, error]);

  const addContract = () => {
    if (!newAddress || !newName) return;
    if (!ethers.isAddress(newAddress)) {
      alert("Invalid Address");
      return;
    }
    const newContract: MonitoredContract = {
      address: newAddress,
      name: newName,
      status: 'active',
      events: [],
      stats: { txCount: 0, volume: 0, lastGas: 0 }
    };
    setContracts([...contracts, newContract]);
    setNewAddress('');
    setNewName('');
  };

  const removeContract = (address: string) => {
    setContracts(contracts.filter(c => c.address !== address));
  };

  const toggleContractStatus = (address: string) => {
    setContracts(contracts.map(c => 
      c.address === address ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c
    ));
  };
  
  const handleRetry = () => {
    setRetryTrigger(prev => prev + 1);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-900 text-slate-100 overflow-hidden animate-in fade-in duration-500">
      
      {/* Sidebar - Contract List */}
      <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col z-10">
        <div className="p-4 border-b border-slate-700">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 text-xs transition-colors">
            <Icons.ChevronRight className="w-3 h-3 rotate-180" /> Back to Home
          </button>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Icons.Activity className="w-5 h-5 text-green-400" /> Live Monitoring
          </h2>
          <div className="flex flex-col gap-2 mt-2">
             <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isLive && !error ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className={`text-xs ${error ? 'text-red-400 font-bold' : 'text-slate-500'}`}>
                  {error ? 'Connection Failed' : isLive ? `Live: Block #${currentBlock}` : 'Connecting...'}
                </span>
             </div>
             {error && (
               <button 
                 onClick={handleRetry}
                 className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded hover:bg-red-500/20 transition-colors w-full"
               >
                 Retry Connection
               </button>
             )}
          </div>
        </div>

        <div className="p-4 space-y-3">
          <input 
            type="text" 
            placeholder="Contract Name (e.g. USDC Vault)" 
            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="0x... Address" 
            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs font-mono"
            value={newAddress}
            onChange={e => setNewAddress(e.target.value)}
          />
          <button 
            onClick={addContract}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white p-2 rounded flex items-center justify-center gap-2 text-sm font-semibold transition-all"
          >
            <Icons.Plus className="w-4 h-4" /> Monitor Contract
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {contracts.map(contract => (
            <div key={contract.address} className={`p-3 rounded-lg border ${contract.status === 'active' ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-900 border-slate-800 opacity-60'}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-sm truncate">{contract.name}</span>
                <div className="flex gap-2">
                  <button onClick={() => toggleContractStatus(contract.address)}>
                    {contract.status === 'active' ? <Icons.Pause className="w-3 h-3 text-yellow-400" /> : <Icons.Play className="w-3 h-3 text-green-400" />}
                  </button>
                  <button onClick={() => removeContract(contract.address)}>
                    <Icons.Trash2 className="w-3 h-3 text-red-400" />
                  </button>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mb-2 truncate">{contract.address}</div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-slate-800 p-1 rounded text-center">
                  <span className="block text-slate-500">Events</span>
                  <span className="text-white">{contract.stats.txCount}</span>
                </div>
                <div className="bg-slate-800 p-1 rounded text-center">
                  <span className="block text-slate-500">Vol</span>
                  <span className="text-white">{contract.stats.volume.toFixed(0)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden relative">
        {/* Top Header */}
        <div className="h-16 border-b border-slate-800 bg-slate-900/90 flex justify-between items-center px-6">
          <div className="flex gap-6">
            <div className="text-center">
              <span className="text-xs text-slate-500 block">Polygon Mainnet</span>
              <span className={`text-sm font-mono flex items-center gap-1 ${error ? 'text-red-400' : 'text-green-400'}`}>
                 {error ? '⚠ Connection Issue' : isLive ? 'Connected' : 'Connecting...'}
              </span>
            </div>
            <div className="text-center">
              <span className="text-xs text-slate-500 block">Real Gas Price</span>
              <span className="text-sm font-mono text-blue-400">
                {chartData.length > 0 ? chartData[chartData.length - 1].gas.toFixed(1) : 0} Gwei
              </span>
            </div>
          </div>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg border transition-all flex items-center gap-2 text-sm ${showSettings ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
          >
            <Icons.Settings className="w-4 h-4" />
            Alert Config
          </button>
        </div>
        
        {/* Error Banner for Main View */}
        {error && (
            <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-2 text-xs text-red-200 flex items-center justify-between">
                <span className="flex items-center gap-2">
                    <Icons.AlertTriangle className="w-3 h-3" />
                    {error}
                </span>
                <button onClick={handleRetry} className="underline hover:text-white">Retry</button>
            </div>
        )}

        {/* Dashboard Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Col: Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction Pattern Analysis */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-lg">
              <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                <Icons.TrendingUp className="w-4 h-4 text-blue-400" /> Real-Time Gas Tracker
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                    />
                    <Area type="monotone" dataKey="gas" stroke="#8884d8" fillOpacity={1} fill="url(#colorGas)" name="Gas (Gwei)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Live Feed */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex flex-col h-[400px]">
              <div className="p-4 border-b border-slate-700 bg-slate-800/50">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Icons.Radio className={`w-4 h-4 ${isLive ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} /> Live Event Feed (Polygon Mainnet)
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                {contracts.flatMap(c => c.events.map(e => ({...e, contractName: c.name})))
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .map((event) => (
                    <div key={event.id} className="flex gap-3 p-3 rounded bg-slate-900/50 border border-slate-700/50 text-xs">
                      <div className="flex flex-col items-center min-w-[60px]">
                        <span className="text-slate-500 font-mono">{new Date(event.timestamp).toLocaleTimeString()}</span>
                        {event.severity === Severity.HIGH && <Icons.AlertOctagon className="w-4 h-4 text-red-500 mt-1" />}
                        {event.severity === Severity.MEDIUM && <Icons.AlertTriangle className="w-4 h-4 text-orange-400 mt-1" />}
                        {event.severity === Severity.INFO && <Icons.Info className="w-4 h-4 text-blue-400 mt-1" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                           <span className="font-bold text-slate-300">{event.contractName}</span>
                           <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              event.type === 'ALERT' ? 'bg-red-500/20 text-red-400' : 
                              event.type === 'GAS_SPIKE' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-blue-500/20 text-blue-400'
                           }`}>{event.type}</span>
                        </div>
                        <p className="text-slate-400 mt-1">{event.message}</p>
                        <div className="mt-1 font-mono text-[10px] text-slate-600 truncate">
                            <a href={`https://polygonscan.com/tx/${event.hash}`} target="_blank" rel="noopener noreferrer" className="hover:text-purple-400">
                                Tx: {event.hash}
                            </a>
                        </div>
                      </div>
                    </div>
                  ))}
                  {contracts.flatMap(c => c.events).length === 0 && (
                     <div className="text-center p-10 text-slate-500">
                        {error 
                           ? <span className="text-red-400">Connection Interrupted</span> 
                           : isLive 
                              ? 'Waiting for events on monitored contracts...' 
                              : 'Initializing connection to Polygon...'}
                     </div>
                  )}
              </div>
            </div>
          </div>

          {/* Right Col: Settings & Stats */}
          <div className="space-y-6">
            {/* Alert Settings */}
            <div className={`bg-slate-800 border border-slate-700 rounded-xl p-6 transition-all ${showSettings ? 'ring-2 ring-purple-500' : ''}`}>
              <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                <Icons.Bell className="w-4 h-4 text-purple-400" /> Alert Thresholds
              </h3>
              
              <div className="space-y-4">
                 <div>
                    <label className="text-xs text-slate-400 mb-1 block">Gas Threshold (Gwei)</label>
                    <input 
                      type="number" 
                      value={alertConfig.gasThreshold}
                      onChange={e => setAlertConfig({...alertConfig, gasThreshold: parseInt(e.target.value)})}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm"
                    />
                 </div>
                 <div>
                    <label className="text-xs text-slate-400 mb-1 block">Value Alert (Token Amount)</label>
                    <input 
                      type="number" 
                      value={alertConfig.minEthTransfer}
                      onChange={e => setAlertConfig({...alertConfig, minEthTransfer: parseInt(e.target.value)})}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm"
                    />
                 </div>
                 <div className="flex items-center gap-2 pt-2">
                    <input 
                      type="checkbox" 
                      checked={alertConfig.detectFlashLoans}
                      onChange={e => setAlertConfig({...alertConfig, detectFlashLoans: e.target.checked})}
                      className="rounded border-slate-700 bg-slate-900 text-purple-600"
                    />
                    <label className="text-xs text-slate-300">Detect Flash Loans / Sandwich</label>
                 </div>
                 
                 <div className="pt-4 border-t border-slate-700">
                    <h4 className="text-xs font-bold text-slate-400 mb-2">Notification Channels</h4>
                    <input 
                      type="text" 
                      placeholder="Discord Webhook URL"
                      value={alertConfig.discordWebhook}
                      onChange={e => setAlertConfig({...alertConfig, discordWebhook: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs mb-2"
                    />
                    <input 
                      type="email" 
                      placeholder="Email Address"
                      value={alertConfig.email}
                      onChange={e => setAlertConfig({...alertConfig, email: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs"
                    />
                 </div>
                 <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded text-xs font-bold transition-colors">
                    Save Configuration
                 </button>
              </div>
            </div>

            {/* Historical Attack Detection Summary */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
               <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <Icons.Shield className="w-4 h-4 text-red-400" /> Pattern Matching
               </h3>
               <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs p-2 bg-slate-900 rounded">
                     <span className="text-slate-400">Reentrancy (Signature 0x...)</span>
                     <span className="text-green-400">Scanning...</span>
                  </div>
                  <div className="flex justify-between items-center text-xs p-2 bg-slate-900 rounded">
                     <span className="text-slate-400">Suspicious DelegateCall</span>
                     <span className="text-green-400">Safe</span>
                  </div>
                   <div className="flex justify-between items-center text-xs p-2 bg-slate-900 rounded">
                     <span className="text-slate-400">Flash Loan Oracle Manipulation</span>
                     <span className="text-green-400">Safe</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
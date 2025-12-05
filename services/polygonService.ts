import { ethers } from 'ethers';

// List of fallback RPCs to try in order
const RPC_URLS = [
  "https://polygon-rpc.com",
  "https://rpc.ankr.com/polygon",
  "https://1rpc.io/matic",
  "https://rpc-mainnet.matic.network", 
  "https://matic-mainnet.chainstacklabs.com",
  "https://polygon-bor.publicnode.com"
];

const POLYGONSCAN_API_URL = "https://api.polygonscan.com/api";
// Use provided key as fallback to avoid rate limits
const DEFAULT_POLYGONSCAN_KEY = "A9S24XYT5PVINRYUXTF5IY79ZYSSXABZ7W";

interface ContractData {
  name: string;
  sourceCode: string;
  isVerified: boolean;
}

export const isValidAddress = (address: string): boolean => {
  return ethers.isAddress(address);
};

// Helper to try multiple RPCs
const getWorkingProvider = async (logger: (msg: string) => void): Promise<ethers.JsonRpcProvider> => {
  for (const url of RPC_URLS) {
    try {
      const provider = new ethers.JsonRpcProvider(url);
      
      // Enforce a timeout for the network check
      const checkNetwork = Promise.race([
        provider.getNetwork(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
      ]);

      await checkNetwork;
      return provider;
    } catch (e) {
      // logger(`RPC ${url} failed/slow, trying next...`);
      continue;
    }
  }
  throw new Error("All Polygon RPC nodes failed. Please check your internet connection.");
};

export const fetchContractData = async (
  address: string, 
  apiKey: string = '', 
  logger: (msg: string, type: 'info' | 'success' | 'warning' | 'error') => void
): Promise<ContractData> => {
  
  // 1. Verify existence on chain using fallback RPCs
  logger(`Connecting to Polygon PoS Mainnet...`, 'info');
  
  try {
    const provider = await getWorkingProvider((msg) => logger(msg, 'warning'));
    const code = await provider.getCode(address);
    if (code === '0x') {
      throw new Error('Address is not a contract or does not exist on Polygon PoS.');
    }
    logger('✓ Contract bytecode verified on-chain.', 'success');
  } catch (error: any) {
    // If it's our specific error, rethrow it
    if (error.message.includes('Address is not a contract')) {
      throw error;
    }
    logger(`RPC Verification Warning: ${error.message}. Proceeding to fetch source...`, 'warning');
    // We proceed even if RPC check fails, assuming PolygonScan might still have data
  }

  // 2. Fetch source from PolygonScan
  logger('Fetching verified source code from PolygonScan...', 'info');
  
  // Use user key or default
  const activeKey = apiKey.trim() || DEFAULT_POLYGONSCAN_KEY;
  const keyParam = `&apikey=${activeKey}`;
  const url = `${POLYGONSCAN_API_URL}?module=contract&action=getsourcecode&address=${address}${keyParam}`;

  let data;
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
    }
    data = await response.json();
  } catch (e: any) {
    throw new Error(`Failed to connect to PolygonScan API: ${e.message}`);
  }

  if (data.status !== '1' || !data.result || data.result.length === 0) {
    const msg = data.message || 'Unknown error';
    if (msg.includes('NOTOK')) {
       throw new Error(`PolygonScan Rate Limit Exceeded. ${apiKey ? 'Check your API Key.' : 'Please add a free API Key or wait a moment.'}`);
    }
    throw new Error(`PolygonScan Error: ${msg}`);
  }

  const result = data.result[0];

  if (!result.SourceCode) {
    throw new Error('Contract source code is not verified on PolygonScan.');
  }

  let finalSource = result.SourceCode;
  let contractName = result.ContractName || "Unknown Contract";

  // Handle multi-file source formatting
  // Logic: 
  // 1. Sometimes it is a raw string of source.
  // 2. Sometimes it is {{ ... }} (double braces JSON)
  // 3. Sometimes it is { ... } (single brace JSON)
  
  if (finalSource.startsWith('{{') || (finalSource.startsWith('{') && finalSource.includes('sources'))) {
    try {
      let rawJson = finalSource;
      // Remove outer braces if double wrapped like {{ ... }}
      if (rawJson.startsWith('{{') && rawJson.endsWith('}}')) {
        rawJson = rawJson.slice(1, -1);
      }
      
      const parsed = JSON.parse(rawJson);
      
      if (parsed.sources) {
        finalSource = Object.entries(parsed.sources)
          .map(([path, content]: any) => `// ==================================================\n// File: ${path}\n// ==================================================\n\n${content.content}`)
          .join('\n\n');
      } else {
        // Fallback for some flattened formats
        finalSource = Object.entries(parsed)
          .map(([path, content]: any) => `// File: ${path}\n${content.content}`)
          .join('\n\n');
      }
      logger('✓ Multi-file source code successfully flattened.', 'success');
    } catch (e) {
      logger('Warning: Could not parse multi-file JSON. Using raw output.', 'warning');
      // We do not throw here, we just use the raw string as fallback
    }
  } else {
    logger('✓ Single file contract source retrieved.', 'success');
  }

  if (!finalSource || finalSource.trim().length === 0) {
      throw new Error("Retrieved source code is empty.");
  }

  return {
    name: contractName,
    sourceCode: finalSource,
    isVerified: true
  };
};
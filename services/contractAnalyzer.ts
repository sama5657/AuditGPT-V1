// Contract code analyzer for metrics and patterns
export interface ContractMetrics {
  lineCount: number;
  functionCount: number;
  stateVariables: number;
  publicFunctions: number;
  internalFunctions: number;
  externalCalls: string[];
  importedLibraries: string[];
  estimatedComplexity: 'Simple' | 'Moderate' | 'Complex' | 'Very Complex';
  usesOpenZeppelin: boolean;
  hasEvents: boolean;
  hasModifiers: boolean;
  inheritanceDepth: number;
}

export const analyzeContractMetrics = (sourceCode: string): ContractMetrics => {
  const lines = sourceCode.split('\n');
  const lineCount = lines.length;
  
  // Count functions (including constructors)
  const functionMatches = sourceCode.match(/function\s+\w+\s*\(/g) || [];
  const constructorMatches = sourceCode.match(/constructor\s*\(/g) || [];
  const functionCount = functionMatches.length + constructorMatches.length;
  
  // Count state variables
  const stateVarMatches = sourceCode.match(/^\s+(uint|int|bool|address|bytes|string|mapping)\s+\w+/gm) || [];
  const stateVariables = stateVarMatches.length;
  
  // Count visibility levels
  const publicFunctions = (sourceCode.match(/function\s+\w+.*\spublic/g) || []).length;
  const internalFunctions = (sourceCode.match(/function\s+\w+.*\sinternal/g) || []).length;
  
  // Detect external calls
  const callPatterns = sourceCode.match(/\w+\.\w+\s*\(/g) || [];
  const externalCalls = [...new Set(callPatterns.map(c => c.replace(/\s*\(/, '')))];
  
  // Detect imported libraries
  const importMatches = sourceCode.match(/import\s+["']([^"']+)["']/g) || [];
  const importedLibraries = importMatches.map(m => m.replace(/import\s+["'|]/g, '').replace(/["']/g, ''));
  
  // Detect OpenZeppelin usage
  const usesOpenZeppelin = sourceCode.includes('@openzeppelin') || 
                          sourceCode.includes('OpenZeppelin') ||
                          importedLibraries.some(lib => lib.includes('openzeppelin'));
  
  // Check for events
  const hasEvents = sourceCode.includes('event ') && sourceCode.includes('emit ');
  
  // Check for modifiers
  const hasModifiers = sourceCode.includes('modifier ');
  
  // Calculate inheritance depth
  const inheritanceMatches = sourceCode.match(/is\s+\w+(\s*,\s*\w+)*/g) || [];
  const inheritanceDepth = Math.max(
    ...inheritanceMatches.map(m => m.split(',').length - 1),
    inheritanceMatches.length > 0 ? 1 : 0
  );
  
  // Estimate complexity based on metrics
  let complexity: 'Simple' | 'Moderate' | 'Complex' | 'Very Complex' = 'Simple';
  const complexityScore = functionCount + stateVariables + (inheritanceDepth * 2) + (externalCalls.length / 2);
  
  if (complexityScore > 50) complexity = 'Very Complex';
  else if (complexityScore > 30) complexity = 'Complex';
  else if (complexityScore > 10) complexity = 'Moderate';
  
  return {
    lineCount,
    functionCount,
    stateVariables,
    publicFunctions,
    internalFunctions,
    externalCalls,
    importedLibraries,
    estimatedComplexity: complexity,
    usesOpenZeppelin,
    hasEvents,
    hasModifiers,
    inheritanceDepth
  };
};

export const detectCommonLibraries = (sourceCode: string): string[] => {
  const libraries: string[] = [];
  
  const libraryPatterns = {
    'OpenZeppelin': /@openzeppelin|from.*openzeppelin/gi,
    'Uniswap': /uniswap|IUniswapV/gi,
    'Aave': /aave|ILendingPool/gi,
    'Curve': /curve|ICurvePool/gi,
    'Balancer': /balancer|IVault/gi,
    'Compound': /compound|cToken/gi,
    'MakerDAO': /maker|Dai/gi,
    'Yearn': /yearn|IVault/gi,
    'Lido': /lido|stETH/gi,
    'Chainlink': /chainlink|AggregatorV/gi,
    'SafeMath': /SafeMath/gi,
    'ERC20': /ERC20/gi,
    'ERC721': /ERC721/gi,
    'ERC1155': /ERC1155/gi,
    'Ownable': /Ownable/gi,
    'AccessControl': /AccessControl/gi,
    'ReentrancyGuard': /ReentrancyGuard/gi,
  };
  
  Object.entries(libraryPatterns).forEach(([name, pattern]) => {
    if (pattern.test(sourceCode)) {
      libraries.push(name);
    }
  });
  
  return libraries;
};


  // ✅ Asset Class Mock Data
  export const assetClassData = [
    {
      id: 1,
      name: 'Equities',
      allocation: 40,
      risk: 'High',
      expectedReturn: 8,
      liquidity: 'High',
      volatility: 15,
      marketCap: 25000,
      region: 'Global',
      taxImplication: 'Capital Gains',
    },
    {
      id: 2,
      name: 'Bonds',
      allocation: 25,
      risk: 'Low',
      expectedReturn: 3,
      liquidity: 'Medium',
      volatility: 5,
      marketCap: 18000,
      region: 'US',
      taxImplication: 'Interest Income',
    },
    {
      id: 3,
      name: 'Real Estate',
      allocation: 15,
      risk: 'Medium',
      expectedReturn: 6,
      liquidity: 'Low',
      volatility: 10,
      marketCap: 9000,
      region: 'Domestic',
      taxImplication: 'Rental Income',
    },
  ];




// ✅ Holdings Mock Data
export const holdingData = [
  {
    id: 1,
    name: 'Apple Inc.',
    assetClass: 'Equities',
    ticker: 'AAPL',
    quantity: 50,
    purchasePrice: 120,
    currentPrice: 150,
    marketValue: 7500,
    gainLoss: 1500,
    weight: 15,
  },
  {
    id: 2,
    name: 'US Treasury Bond 10Y',
    assetClass: 'Bonds',
    ticker: 'UST10Y',
    quantity: 100,
    purchasePrice: 95,
    currentPrice: 98,
    marketValue: 9800,
    gainLoss: 300,
    weight: 20,
  },
  {
    id: 3,
    name: 'Vanguard REIT ETF',
    assetClass: 'Real Estate',
    ticker: 'VNQ',
    quantity: 30,
    purchasePrice: 85,
    currentPrice: 90,
    marketValue: 2700,
    gainLoss: 150,
    weight: 10,
  },
];

export const performanceHistory = [
  { date: '2023-01', value: 18000 },
  { date: '2023-03', value: 22000 },
  { date: '2023-06', value: 26000 },
  { date: '2023-09', value: 24000 },
  { date: '2023-12', value: 27000 },
  { date: '2024-03', value: 29500 },
];
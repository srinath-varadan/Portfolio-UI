import React, { useState } from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, TextField } from '@mui/material';

interface CryptoTicker {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    price_change_percentage_24h: number;
  }
  
  interface CryptoTickerVisualizerProps {
    tickers: CryptoTicker[];
  }
  
  const CryptoTickerVisualizer: React.FC<CryptoTickerVisualizerProps> = ({ tickers }) => {
    if (!tickers) return <p>No Crypto data available.</p>;
    const [sortField, setSortField] = useState<'market_cap_rank' | 'symbol' | 'current_price' | 'price_change_percentage_24h'>('market_cap_rank');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [filterText, setFilterText] = useState<string>('');
  
    const handleSort = (field: typeof sortField) => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    };
  
    const filteredTickers = tickers.filter(ticker =>
      ticker.symbol.toLowerCase().includes(filterText.toLowerCase()) ||
      ticker.name.toLowerCase().includes(filterText.toLowerCase())
    );
  
    const sortedTickers = [...filteredTickers].sort((a, b) => {
      let aValue: string | number = a[sortField];
      let bValue: string | number = b[sortField];
  
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
  
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  
    const getHeaderStyle = (field: typeof sortField) => ({
      cursor: 'pointer',
      fontWeight: sortField === field ? 'bold' : 'normal',
      color: sortField === field ? 'primary.main' : 'text.primary',
      userSelect: 'none' as const,
    });
  
    return (
      <>
        <TextField
          label="Filter by Symbol or Name"
          variant="outlined"
          size="small"
          fullWidth
          margin="normal"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <TableContainer component={Paper} style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell onClick={() => handleSort('market_cap_rank')} style={getHeaderStyle('market_cap_rank')}>
                  Rank {sortField === 'market_cap_rank' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell onClick={() => handleSort('symbol')} style={getHeaderStyle('symbol')}>
                  Symbol {sortField === 'symbol' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                </TableCell>
                <TableCell onClick={() => handleSort('current_price')} align="right" style={getHeaderStyle('current_price')}>
                  Price {sortField === 'current_price' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                </TableCell>
                <TableCell onClick={() => handleSort('price_change_percentage_24h')} align="right" style={getHeaderStyle('price_change_percentage_24h')}>
                  24h Change {sortField === 'price_change_percentage_24h' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                </TableCell>
              </TableRow>
            </TableHead>
  
            <TableBody>
              {sortedTickers.map((ticker) => (
                <TableRow key={ticker.id}>
                  <TableCell>{ticker.market_cap_rank}</TableCell>
                  <TableCell>
                    <img src={ticker.image} alt={ticker.name} width={24} height={24} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                    {ticker.name}
                  </TableCell>
                  <TableCell>{ticker.symbol.toUpperCase()}</TableCell>
                  <TableCell align="right">${ticker.current_price.toLocaleString()}</TableCell>
                  <TableCell
                    align="right"
                    style={{ color: ticker.price_change_percentage_24h >= 0 ? 'green' : 'red', fontWeight: 'bold' }}
                  >
                    {ticker.price_change_percentage_24h.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };
  
  export default CryptoTickerVisualizer;
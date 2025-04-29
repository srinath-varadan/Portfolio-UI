import React, { useState } from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, TextField } from '@mui/material';

interface Stock {
  symbol: string;
  name: string;
  change: number;
  price: number;
  changesPercentage: number;
}

interface TrendingStocksVisualizerProps {
  stocks: Stock[];
}

type SortField = 'symbol' | 'name' | 'price' | 'changesPercentage';
type SortDirection = 'asc' | 'desc';

const TrendingStocksVisualizer: React.FC<TrendingStocksVisualizerProps> = ({ stocks }) => {
    if (!stocks || !Array.isArray(stocks)|| stocks.length === 0) return <p>No Trending Stocks data available.</p>;
  const [sortField, setSortField] = useState<SortField>('changesPercentage');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterText, setFilterText] = useState<string>('');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
console.log(stocks)
  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(filterText.toLowerCase()) ||
    stock.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const sortedStocks = [...filteredStocks].sort((a, b) => {
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

  const getHeaderStyle = (field: SortField) => ({
    cursor: 'pointer',
    fontWeight: sortField === field ? 'bold' : 'normal',
    color: sortField === field ? 'primary.main' : 'text.primary',
    userSelect: 'none' as const, // <- fix
  });

  return (
    <>
      <TextField
        label="Filter by Symbol or Company"
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
              <TableCell>Rank</TableCell>
              <TableCell onClick={() => handleSort('symbol')} style={getHeaderStyle('symbol')}>
                Symbol {sortField === 'symbol' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </TableCell>
              <TableCell onClick={() => handleSort('name')} style={getHeaderStyle('name')}>
                Company {sortField === 'name' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </TableCell>
              <TableCell onClick={() => handleSort('price')} align="right" style={getHeaderStyle('price')}>
                Price ($) {sortField === 'price' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </TableCell>
              <TableCell onClick={() => handleSort('changesPercentage')} align="right" style={getHeaderStyle('changesPercentage')}>
                Change (%) {sortField === 'changesPercentage' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedStocks.map((stock, index) => (
              <TableRow key={stock.symbol}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{stock.symbol}</TableCell>
                <TableCell>{stock.name}</TableCell>
                <TableCell align="right">${stock.price.toFixed(2)}</TableCell>
                <TableCell
                  align="right"
                  style={{ color: stock.changesPercentage >= 0 ? 'green' : 'red', fontWeight: 'bold' }}
                >
                  {stock.changesPercentage.toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TrendingStocksVisualizer;
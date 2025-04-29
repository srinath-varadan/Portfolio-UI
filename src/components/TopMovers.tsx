import React, { useState, useMemo } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableSortLabel,
  TextField,
  Box,
} from '@mui/material';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
}

interface TopMoversProps {
  stocks: Stock[];
}

type Order = 'asc' | 'desc';

const TopMovers: React.FC<TopMoversProps> = ({ stocks }) => {
  if (!stocks || !Array.isArray(stocks)|| stocks.length === 0) return <p>No Stocks data available.</p>;
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Stock>('symbol');
  const [filterText, setFilterText] = useState('');

  const handleRequestSort = (property: keyof Stock) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredStocks = useMemo(() => {
    return stocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(filterText.toLowerCase()) ||
        stock.name.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [stocks, filterText]);

  const sortedStocks = useMemo(() => {
    return filteredStocks.slice().sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
        if (aValue < bValue) return order === 'asc' ? -1 : 1;
        if (aValue > bValue) return order === 'asc' ? 1 : -1;
        return 0;
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }, [filteredStocks, order, orderBy]);

  if (!stocks || stocks.length === 0)
    return <p>No top movers available.</p>;

  return (
    <Paper sx={{ width: '100%', overflowX: 'auto' }}>
      <Box sx={{ padding: 2 }}>
        <TextField
          label="Search by Symbol or Company"
          variant="outlined"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          fullWidth
          size="small"
        />
      </Box>
      <Table stickyHeader aria-label="top movers table">
        <TableHead>
          <TableRow>
            <TableCell sortDirection={orderBy === 'symbol' ? order : false}>
              <TableSortLabel
                active={orderBy === 'symbol'}
                direction={orderBy === 'symbol' ? order : 'asc'}
                onClick={() => handleRequestSort('symbol')}
              >
                Symbol
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === 'name' ? order : false}>
              <TableSortLabel
                active={orderBy === 'name'}
                direction={orderBy === 'name' ? order : 'asc'}
                onClick={() => handleRequestSort('name')}
              >
                Company Name
              </TableSortLabel>
            </TableCell>
            <TableCell align="right" sortDirection={orderBy === 'price' ? order : false}>
              <TableSortLabel
                active={orderBy === 'price'}
                direction={orderBy === 'price' ? order : 'asc'}
                onClick={() => handleRequestSort('price')}
              >
                Price ($)
              </TableSortLabel>
            </TableCell>
            <TableCell align="right" sortDirection={orderBy === 'changesPercentage' ? order : false}>
              <TableSortLabel
                active={orderBy === 'changesPercentage'}
                direction={orderBy === 'changesPercentage' ? order : 'asc'}
                onClick={() => handleRequestSort('changesPercentage')}
              >
                Change (%)
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedStocks.slice(0, 10).map((stock, index) => (
            <TableRow key={index} hover>
              <TableCell>{stock.symbol}</TableCell>
              <TableCell>{stock.name}</TableCell>
              <TableCell align="right">{stock.price.toFixed(2)}</TableCell>
              <TableCell align="right">{stock.changesPercentage.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default TopMovers;
import React, { useState, useEffect, useMemo } from 'react';
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

interface ForexRate {
  currency: string;
  rate: number;
}

type Order = 'asc' | 'desc';

const ForexRates: React.FC = () => {
  const [rates, setRates] = useState<ForexRate[]>([]);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof ForexRate>('currency');
  const [filterText, setFilterText] = useState('');

  const selectedCurrencies = ['EUR', 'INR', 'GBP', 'JPY', 'CAD'];

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://v6.exchangerate-api.com/v6/1a3228ce8027ff0773e3496f/latest/USD');
        const data = await response.json();
        const filteredRates: ForexRate[] = selectedCurrencies.map((currency) => ({
          currency,
          rate: data.conversion_rates[currency],
        }));
        setRates(filteredRates);
      } catch (error) {
        console.error('Error fetching forex rates:', error);
      }
    };

    fetchRates();
  }, []);

  const handleRequestSort = (property: keyof ForexRate) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredRates = useMemo(() => {
    return rates.filter((rate) =>
      rate.currency.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [rates, filterText]);

  const sortedRates = useMemo(() => {
    return filteredRates.slice().sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }, [filteredRates, order, orderBy]);

  return (
    <Paper sx={{ width: '100%', overflowX: 'auto' }}>
      <Box sx={{ padding: 2 }}>
        <TextField
          label="Search Currency"
          variant="outlined"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          fullWidth
          size="small"
        />
      </Box>
      <Table stickyHeader aria-label="forex rates table">
        <TableHead>
          <TableRow>
            <TableCell sortDirection={orderBy === 'currency' ? order : false}>
              <TableSortLabel
                active={orderBy === 'currency'}
                direction={orderBy === 'currency' ? order : 'asc'}
                onClick={() => handleRequestSort('currency')}
              >
                Currency
              </TableSortLabel>
            </TableCell>
            <TableCell align="right" sortDirection={orderBy === 'rate' ? order : false}>
              <TableSortLabel
                active={orderBy === 'rate'}
                direction={orderBy === 'rate' ? order : 'asc'}
                onClick={() => handleRequestSort('rate')}
              >
                Rate (USD →)
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRates.map((rate) => (
            <TableRow key={rate.currency} hover>
              <TableCell>{rate.currency}</TableCell>
              <TableCell align="right">{rate.rate.toFixed(4)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default ForexRates;
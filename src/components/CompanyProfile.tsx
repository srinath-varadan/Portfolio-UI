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
  Link,
} from '@mui/material';

interface CompanyProfile {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  country: string;
  ceo: string;
  fullTimeEmployees: string;
  ipoDate: string;
  website: string;
  marketCap: number;
}

interface TopCompaniesProps {
  companies: CompanyProfile[];
}

type Order = 'asc' | 'desc';

const formatMarketCap = (value: number) => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  return `$${value}`;
};

const CompanyProfile: React.FC<TopCompaniesProps> = ({ companies }) => {
    if (!companies || !Array.isArray(companies)|| companies.length === 0) return <p>No Companies data available.</p>;
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof CompanyProfile>('symbol');
  const [filterText, setFilterText] = useState('');

  const handleRequestSort = (property: keyof CompanyProfile) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter(
      (company) =>
        company.symbol.toLowerCase().includes(filterText.toLowerCase()) ||
        company.name.toLowerCase().includes(filterText.toLowerCase()) ||
        company.sector.toLowerCase().includes(filterText.toLowerCase()) ||
        company.industry.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [companies, filterText]);

  const sortedCompanies = useMemo(() => {
    return filteredCompanies.slice().sort((a, b) => {
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
  }, [filteredCompanies, order, orderBy]);

  if (!companies || companies.length === 0)
    return <p>No company profiles available.</p>;

  return (
    <Paper sx={{ width: '100%', overflowX: 'auto' }}>
      <Box sx={{ padding: 2 }}>
        <TextField
          label="Search by Symbol, Company, Sector or Industry"
          variant="outlined"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          fullWidth
          size="small"
        />
      </Box>
      <Table stickyHeader aria-label="top companies table">
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
            <TableCell sortDirection={orderBy === 'sector' ? order : false}>
              <TableSortLabel
                active={orderBy === 'sector'}
                direction={orderBy === 'sector' ? order : 'asc'}
                onClick={() => handleRequestSort('sector')}
              >
                Sector
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === 'industry' ? order : false}>
              <TableSortLabel
                active={orderBy === 'industry'}
                direction={orderBy === 'industry' ? order : 'asc'}
                onClick={() => handleRequestSort('industry')}
              >
                Industry
              </TableSortLabel>
            </TableCell>
            <TableCell>Country</TableCell>
            <TableCell>CEO</TableCell>
            <TableCell>Employees</TableCell>
            <TableCell>IPO Date</TableCell>
            <TableCell>Website</TableCell>
            <TableCell align="right" sortDirection={orderBy === 'marketCap' ? order : false}>
              <TableSortLabel
                active={orderBy === 'marketCap'}
                direction={orderBy === 'marketCap' ? order : 'asc'}
                onClick={() => handleRequestSort('marketCap')}
              >
                Market Cap
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedCompanies.slice(0, 10).map((company, index) => (
            <TableRow key={index} hover>
              <TableCell>{company.symbol}</TableCell>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.sector}</TableCell>
              <TableCell>{company.industry}</TableCell>
              <TableCell>{company.country}</TableCell>
              <TableCell>{company.ceo}</TableCell>
              <TableCell>{company.fullTimeEmployees}</TableCell>
              <TableCell>{company.ipoDate}</TableCell>
              <TableCell>
                <Link href={company.website} target="_blank" rel="noopener noreferrer">
                  {company.website}
                </Link>
              </TableCell>
              <TableCell align="right">{formatMarketCap(company.marketCap)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default CompanyProfile;
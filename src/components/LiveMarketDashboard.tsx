import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import TrendingStocks from './TrendingStocks';
import TopMovers from './TopMovers';
import CryptoTicker from './CryptoTicker';
import ForexRates from './ForexRates';
import CompanyProfile from './CompanyProfile';
import LiveStreamingSection from './StreamingSection';

const LiveMarketDashboard: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const [trendingStocks, setTrendingStocks] = useState<any[]>([]);
  const [topMovers, setTopMovers] = useState<any[]>([]);
  const [cryptoPrices, setCryptoPrices] = useState<any[]>([]);
  const [companyProfile, setCompanyProfile] = useState<any>(null);

  const BACKEND_API = "https://stock-stream-api.onrender.com";

  const [liveStockData, setLiveStockData] = useState<any[]>([]);
  const [streaming, setStreaming] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const startStreaming = () => {
    if (streaming) return;
    setStreaming(true);
    eventSourceRef.current = new EventSource(`${BACKEND_API}/stream/stocks`);
    eventSourceRef.current.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      setLiveStockData(prevData =>
        Array.isArray(parsed)
          ? [...prevData, ...parsed]
          : [...prevData, parsed]
      );
    };
    eventSourceRef.current.onerror = (event: Event) => {
      console.error("Streaming error event:", event);
    
      // Access the underlying connection error if available
      if ((event as any).target?.readyState === EventSource.CLOSED) {
        console.warn("EventSource connection was closed by the server.");
      } else {
        console.warn("An error occurred, but connection is still open or status unknown.");
      }
    
      // Optional: Stop only if it's a permanent failure
      stopStreaming();
    };
  };

  const stopStreaming = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    fetch(`${BACKEND_API}/stop`, { method: "POST" });
    setStreaming(false);
  };

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const trending = await fetch('https://financialmodelingprep.com/api/v3/stock_market/actives?apikey=q3fPr5j0KtiOFVyZqv5AMmkrWeSKPDFi').then(res => res.json());
        const crypto = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd').then(res => res.json());
        const profile = await fetch('https://financialmodelingprep.com/api/v3/profile/AAPL?apikey=q3fPr5j0KtiOFVyZqv5AMmkrWeSKPDFi').then(res => res.json());

        setTrendingStocks(trending);
        setTopMovers(trending);
        setCryptoPrices(crypto);
        setCompanyProfile(profile[0]);
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };

    fetchMarketData(); // Initial call immediately
  }, []);

  return (
    <Box sx={{ width: '100%', typography: 'body1', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
     <Tabs
  value={tabIndex}
  onChange={handleTabChange}
  variant="scrollable"
  scrollButtons="auto"
  aria-label="Market Dashboard Tabs"
>
        <Tab label="Trending Stocks" />
        <Tab label="Top Movers" />
        <Tab label="Crypto Ticker" />
        <Tab label="Forex Rates" />
        <Tab label="Company Profile" />
        <Tab label="Live Streaming" />
      </Tabs>

      <Box sx={{ p: 3 }}>
        {tabIndex === 0 && <TrendingStocks stocks={trendingStocks} />}
        {tabIndex === 1 && <TopMovers stocks={topMovers} />}
        {tabIndex === 2 && <CryptoTicker tickers={cryptoPrices} />}
        {tabIndex === 3 && <ForexRates/>}
        {tabIndex === 4 && <CompanyProfile companies={companyProfile} />}
        {tabIndex === 5 && <LiveStreamingSection liveStockData={liveStockData} streaming={streaming} startStreaming={startStreaming} stopStreaming={stopStreaming} />}
      </Box>
    </Box>
  );
};

export default LiveMarketDashboard;
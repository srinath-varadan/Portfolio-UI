import { timeFormat } from 'd3-time-format';
import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { groupBy } from 'lodash';

interface StockData {
  symbol: string;
  price: number;
  timestamp: number; // or string, if not using UNIX time
  color: string;
}

interface LiveStreamingSectionProps {
  liveStockData: StockData[];
  streaming: boolean;
  startStreaming: () => void;
  stopStreaming: () => void;
}

const LiveStreamingSection: React.FC<LiveStreamingSectionProps> = ({ liveStockData, streaming, startStreaming, stopStreaming }) => {
  const groupedData = useMemo(() => {
    return groupBy(liveStockData, 'symbol');
  }, [liveStockData]);

  return (
    <section>
      <h2>Live Stock Prices</h2>

      <button
        onClick={streaming ? stopStreaming : startStreaming}
        style={{
          marginBottom: '1rem',
          backgroundColor: streaming ? '#FF4136' : '#2ECC40',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '5px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        {streaming ? 'Stop Streaming' : 'Start Streaming'}
      </button>

      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {Object.entries(groupedData).map(([symbol, data]) => (
          <div key={symbol} style={{ display: 'flex', alignItems: 'center', marginRight: '1rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: (data as StockData[])[0]?.color || '#000', marginRight: '5px' }} />
            <span style={{ fontSize: '0.9rem' }}>{symbol}</span>
          </div>
        ))}
      </div>

      <div style={{ width: "100%", height: "400px" }}>
      <ResponsiveContainer width="100%" height={300}>
            <LineChart data={liveStockData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="timestamp" tickFormatter={(t) => new Date(t).toLocaleTimeString()} />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#FF5733" name="Stock Price" />
            </LineChart>
          </ResponsiveContainer>
      </div>
    </section>
  );
};

export default LiveStreamingSection;
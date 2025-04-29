import React, { useState, useEffect } from 'react';
import { ChartCanvas, Chart, XAxis, YAxis, CandlestickSeries, withSize, discontinuousTimeScaleProvider } from 'react-financial-charts';

interface PerformanceChartProps {
  data: any[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const xAccessor = (d: { date?: Date | string }) => {
    if (!d || !d.date) return new Date();
    return d.date instanceof Date ? d.date : new Date(d.date);
  };

  const { data: chartData, xScale, xAccessor: inputXAccessor, displayXAccessor } = discontinuousTimeScaleProvider.inputDateAccessor((d) => {
    return d.date instanceof Date ? d.date : new Date(d.date);
  })(data);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ChartCanvas
        height={400}
        width={800}
        ratio={3}
        margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
        seriesName="Performance"
        data={chartData}
        xScale={xScale}
        xAccessor={inputXAccessor}
        displayXAccessor={displayXAccessor}
      >
        <Chart id={0} yExtents={d => [d.high, d.low]}>
          <XAxis />
          <YAxis />
          <CandlestickSeries />
        </Chart>
      </ChartCanvas>
    </div>
  );
};

const PerformanceChartWithDropdown: React.FC<{ data: any[] }> = ({ data }) => {
  const [selectedName, setSelectedName] = useState('');
  const [filteredData, setFilteredData] = useState<any[]>([]);

  // Set default selectedName and filteredData on load
  useEffect(() => {
    if (data.length > 0) {
      const defaultName = data[0].name;
      setSelectedName(defaultName);
      setFilteredData(data.filter(d => d.name === defaultName));
    }
  }, [data]);

  // Update filteredData when selectedName changes
  useEffect(() => {
    setFilteredData(data.filter(d => d.name === selectedName));
  }, [selectedName, data]);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="stock-select">Select Stock: </label>
        <select
          id="stock-select"
          value={selectedName}
          onChange={(e) => setSelectedName(e.target.value)}
        >
          {[...new Set(data.map(d => d.name))].map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>
      <PerformanceChart data={filteredData} />
    </div>
  );
};

export default PerformanceChartWithDropdown;
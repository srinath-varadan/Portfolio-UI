import React from 'react';
import {
  ChartCanvas,
  Chart,
  CandlestickSeries,
  XAxis,
  YAxis,
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
  OHLCTooltip,
} from 'react-financial-charts';
import { timeParse, timeFormat } from 'd3-time-format';
import { discontinuousTimeScaleProvider } from 'react-financial-charts';

interface StockChartProps {
  liveData: any[];
}

const StockChart: React.FC<StockChartProps> = ({ liveData }) => {
  const scaleProvider = discontinuousTimeScaleProvider.inputDateAccessor((d: any) => d.date);
  const { data: chartData, xScale, xAccessor, displayXAccessor } = scaleProvider(liveData ?? []);

  return (
    <ChartCanvas
      height={400}
      width={800}
      ratio={3}
      margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
      seriesName="StockChart"
      data={chartData}
      xScale={xScale}
      xAccessor={xAccessor}
      displayXAccessor={displayXAccessor}
    >
      <Chart id={1} yExtents={(d: any) => [d.high, d.low]}>
        <XAxis />
        <YAxis />
        <CandlestickSeries />
        <MouseCoordinateX
  at="bottom" // or 'top'
  orient="bottom"
  displayFormat={(d) => timeFormat("%Y-%m-%d")(d)}
/>
<MouseCoordinateY
  at="right" // or 'left'
  orient="right"
  displayFormat={(d) => d.toFixed(2)}
/>
        <OHLCTooltip origin={[-40, 0]} />
      </Chart>
      <CrossHairCursor />
    </ChartCanvas>
  );
};

export default StockChart;
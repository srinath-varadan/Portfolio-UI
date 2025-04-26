// App.tsx - AG Grid + Service Fetch Integration
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ModuleRegistry,
  ClientSideRowModelModule,
  ValidationModule,
  NumberFilterModule,
  ColDef,
  TextEditorModule,
  ColumnAutoSizeModule,
  NumberEditorModule
} from 'ag-grid-community';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FiPlus, FiTrash2, FiCheck } from 'react-icons/fi';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts';
import { saveData, deleteData, fetchData } from './Service';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule,
  NumberFilterModule,
  TextEditorModule,
  ColumnAutoSizeModule,
  NumberEditorModule
]);

const App: React.FC = () => {
  const assetClassColumns: ColDef[] = [
    { headerName: 'ID', field: 'id' },
    { headerName: 'Asset Class Name', field: 'name', editable: true },
    { headerName: 'Allocation (%)', field: 'allocation', editable: true, filter: 'agNumberColumnFilter' },
    { headerName: 'Risk Level', field: 'risk', editable: true },
    { headerName: 'Expected Return (%)', field: 'expectedReturn', editable: true },
    { headerName: 'Liquidity', field: 'liquidity', editable: true },
    { headerName: 'Volatility (%)', field: 'volatility', editable: true },
    { headerName: 'Market Cap ($B)', field: 'marketCap', editable: true },
    { headerName: 'Region', field: 'region', editable: true },
    { headerName: 'Tax Implication', field: 'taxImplication', editable: true },
  ];

  const holdingColumns: ColDef[] = [
    { headerName: 'ID', field: 'id' },
    { headerName: 'Holding Name', field: 'name', editable: true },
    { headerName: 'Asset Class', field: 'assetClass', editable: true },
    { headerName: 'Ticker', field: 'ticker', editable: true },
    { headerName: 'Quantity', field: 'quantity', editable: true, filter: 'agNumberColumnFilter' },
    { headerName: 'Purchase Price ($)', field: 'purchasePrice', editable: true },
    { headerName: 'Current Price ($)', field: 'currentPrice', editable: true },
    { headerName: 'Market Value ($)', field: 'marketValue', editable: true },
    { headerName: 'Gain/Loss ($)', field: 'gainLoss', editable: true },
    { headerName: 'Weight (%)', field: 'weight', editable: true },
  ];

  const [assetClasses, setAssetClasses] = useState<any[]>([]);
  const [holdings, setHoldings] = useState<any[]>([]);
  const [performanceHistory, setPerformanceHistory] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const assets = await fetchData('api/Asset');
      const holds = await fetchData('api/Holding');
      const performance = await fetchData('api/Performance');
      setAssetClasses(assets);
      setHoldings(holds);
      setPerformanceHistory(performance);
    };
    loadData();
  }, []);

  const saveAssetClass = async (data: any) => {
    await saveData('api/Asset', data);
  };

  const saveHolding = async (data: any) => {
    await saveData('api/Holding', data);
  };

  const [liveStockData, setLiveStockData] = useState<any[]>([]);
  const [streaming, setStreaming] = useState(false);
  const stockHistory = useRef<any[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);
  const BACKEND_API = "https://stock-stream-api.onrender.com/stream/stocks";

  const deleteAssetClass = useCallback(async (id: number) => {
    await deleteData('api/Asset', id);
    setAssetClasses(prev => prev.filter(a => a.id !== id));
  }, []);

  const startStreaming = async () => {
    try {
      await fetch(`${BACKEND_API}/start`, { method: "POST" });
      eventSourceRef.current = new EventSource(`${BACKEND_API}/stream/stocks`);

      eventSourceRef.current.onmessage = (event) => {
        const stock = JSON.parse(event.data);
        stockHistory.current = [...stockHistory.current.slice(-50), stock];
        setLiveStockData([...stockHistory.current]);
      };

      eventSourceRef.current.onerror = (err) => {
        console.error('Streaming error:', err);
        eventSourceRef.current?.close();
      };

      setStreaming(true);
    } catch (error) {
      console.error("Failed to start streaming", error);
    }
  };

  const stopStreaming = async () => {
    try {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      await fetch(`${BACKEND_API}/stop`, { method: "POST" });
      setStreaming(false);
    } catch (error) {
      console.error("Failed to stop streaming", error);
    }
  };

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);
  const deleteHolding = useCallback(async (id: number) => {
    await deleteData('api/Holding', id);
    setHoldings(prev => prev.filter(h => h.id !== id));
  }, []);

  const addAssetClass = () => {
    const nextId = Math.max(0, ...assetClasses.map(a => a.id)) + 1;
    setAssetClasses([...assetClasses, {
      id: nextId,
      name: `New Asset ${nextId}`,
      allocation: 0,
      risk: '',
      expectedReturn: 0,
      liquidity: '',
      volatility: 0,
      marketCap: 0,
      region: '',
      taxImplication: ''
    }]);
  };

  const addHolding = () => {
    const nextId = Math.max(0, ...holdings.map(h => h.id)) + 1;
    setHoldings([...holdings, {
      id: nextId,
      name: `New Holding ${nextId}`,
      assetClass: '',
      ticker: '',
      quantity: 0,
      purchasePrice: 0,
      currentPrice: 0,
      marketValue: 0,
      gainLoss: 0,
      weight: 0
    }]);
  };

  const assetClassCols = useMemo(() => [
    ...assetClassColumns,
    {
      headerName: '',
      field: 'save',
      width: 50,
      cellRenderer: (params: any) => (
        <button onClick={() => saveAssetClass(params.data)} style={{ background: 'none', border: 'none' }}>
          <FiCheck color="#2ecc71" />
        </button>
      )
    },
    {
      headerName: '',
      field: 'delete',
      width: 50,
      cellRenderer: (params: any) => (
        <button onClick={() => deleteAssetClass(params.data.id)} style={{ background: 'none', border: 'none' }}>
          <FiTrash2 color="#d11a2a" />
        </button>
      )
    },
  ], [deleteAssetClass]);

  const holdingCols = useMemo(() => [
    ...holdingColumns,
    {
      headerName: '',
      field: 'save',
      width: 50,
      cellRenderer: (params: any) => (
        <button onClick={() => saveHolding(params.data)} style={{ background: 'none', border: 'none' }}>
          <FiCheck color="#2ecc71" />
        </button>
      )
    },
    {
      headerName: '',
      field: 'delete',
      width: 50,
      cellRenderer: (params: any) => (
        <button onClick={() => deleteHolding(params.data.id)} style={{ background: 'none', border: 'none' }}>
          <FiTrash2 color="#d11a2a" />
        </button>
      )
    },
  ], [deleteHolding]);

  const handleGridReady = (params: any) => {
    params.api.sizeColumnsToFit();
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      <h1>Investment Portfolio Dashboard</h1>

      <div className="section-row">
        <section className="section-box asset-classes">
          <h2>Asset Classes</h2>
          <button onClick={addAssetClass} style={{ marginBottom: '1rem', backgroundColor: '#2ECC40', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiPlus /> Add Asset
          </button>
          <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
            <AgGridReact
              rowData={assetClasses}
              columnDefs={assetClassCols}
              rowModelType="clientSide"
              animateRows={true}
              theme="legacy"
              defaultColDef={{ resizable: true, sortable: true, filter: true }}
              groupDisplayType="groupRows"
              onGridReady={handleGridReady}
            />
          </div>
        </section>

        <section className="section-box holdings">
          <h2>Holdings</h2>
          <button onClick={addHolding} style={{ marginBottom: '1rem', backgroundColor: '#0074D9', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiPlus /> Add Holding
          </button>
          <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
            <AgGridReact
              rowData={holdings}
              columnDefs={holdingCols}
              rowModelType="clientSide"
              animateRows={true}
              theme="legacy"
              defaultColDef={{ resizable: true, sortable: true, filter: true }}
              groupDisplayType="groupRows"
              onGridReady={handleGridReady}
            />
          </div>
        </section>

        <section className="section-box performance">
          <h2 className="section-title">Performance Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceHistory}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section className="section-box live-stocks">
          <h2 className="section-title">Live Stock Prices</h2>

          <div style={{ marginTop: "1rem" }}>
            {!streaming ? (
              <button
                onClick={startStreaming}
                style={{ backgroundColor: '#2ECC40', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Start Streaming
              </button>
            ) : (
              <button
                onClick={stopStreaming}
                style={{ backgroundColor: '#FF4136', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Stop Streaming
              </button>
            )}
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={liveStockData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="timestamp" tickFormatter={(t) => new Date(t).toLocaleTimeString()} />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#FF5733" name="Stock Price" />
            </LineChart>
          </ResponsiveContainer>

        
        </section>
      </div>
    </div>
  );
};

export default App;

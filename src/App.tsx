// App.tsx - AG Grid + Service Fetch Integration
import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
      const assets = await fetchData('api/assets');
      const holds = await fetchData('api/holdings');
      const performance = await fetchData('api/performance');
      setAssetClasses(assets);
      setHoldings(holds);
      setPerformanceHistory(performance);
    };
    loadData();
  }, []);

  const saveAssetClass = async (data: any) => {
    await saveData('assetClasses', data);
  };

  const saveHolding = async (data: any) => {
    await saveData('holdings', data);
  };

  const deleteAssetClass = useCallback(async (id: number) => {
    await deleteData('assetClasses', id);
    setAssetClasses(prev => prev.filter(a => a.id !== id));
  }, []);

  const deleteHolding = useCallback(async (id: number) => {
    await deleteData('holdings', id);
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
      </div>
    </div>
  );
};

export default App;

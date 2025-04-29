import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { FiCheck, FiTrash2, FiPlus } from 'react-icons/fi';
import { ModuleRegistry, ClientSideRowModelModule, ValidationModule, NumberFilterModule, TextEditorModule, ColumnAutoSizeModule, NumberEditorModule } from 'ag-grid-community';

interface HoldingsSectionProps {
  holdings: any[];
  setHoldings: (data: any[]) => void;
  saveHolding: (data: any) => Promise<void>;
  deleteHolding: (id: number) => Promise<void>;
}
ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    ValidationModule,
    NumberFilterModule,
    TextEditorModule,
    ColumnAutoSizeModule,
    NumberEditorModule
  ]);
  

const HoldingsSection: React.FC<HoldingsSectionProps> = ({ holdings, setHoldings, saveHolding, deleteHolding }) => {
  const holdingColumns = [
    { headerName: 'ID', field: 'id' },
    { headerName: 'Holding Name', field: 'name', editable: true },
    { headerName: 'Asset Class', field: 'assetClass', editable: true },
    { headerName: 'Ticker', field: 'ticker', editable: true },
    { headerName: 'Quantity', field: 'quantity', editable: true },
    { headerName: 'Purchase Price ($)', field: 'purchasePrice', editable: true },
    { headerName: 'Current Price ($)', field: 'currentPrice', editable: true },
    { headerName: 'Market Value ($)', field: 'marketValue', editable: true },
    { headerName: 'Gain/Loss ($)', field: 'gainLoss', editable: true },
    { headerName: 'Weight (%)', field: 'weight', editable: true },
  ];

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
    }
  ], [deleteHolding]);

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

  return (
    <section>
      <h2>Holdings</h2>
      <button onClick={addHolding} style={{ marginBottom: '1rem', backgroundColor: '#0074D9', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FiPlus /> Add Holding
      </button>

      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          rowData={holdings}
          columnDefs={holdingCols}
          defaultColDef={{ resizable: true, sortable: true, filter: true }}
          animateRows
          onGridReady={(params) => params.api.sizeColumnsToFit()}
        />
      </div>
    </section>
  );
};

export default HoldingsSection;
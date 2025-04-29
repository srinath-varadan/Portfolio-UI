import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { FiCheck, FiTrash2, FiPlus } from 'react-icons/fi';
import { ModuleRegistry, ClientSideRowModelModule, ValidationModule, NumberFilterModule, TextEditorModule, ColumnAutoSizeModule, NumberEditorModule } from 'ag-grid-community';

interface AssetClassesSectionProps {
  assetClasses: any[];
  setAssetClasses: (data: any[]) => void;
  saveAssetClass: (data: any) => Promise<void>;
  deleteAssetClass: (id: number) => Promise<void>;
}

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    ValidationModule,
    NumberFilterModule,
    TextEditorModule,
    ColumnAutoSizeModule,
    NumberEditorModule
  ]);
  

const AssetClassesSection: React.FC<AssetClassesSectionProps> = ({ assetClasses, setAssetClasses, saveAssetClass, deleteAssetClass }) => {
  const assetClassColumns = [
    { headerName: 'ID', field: 'id' },
    { headerName: 'Asset Class Name', field: 'name', editable: true },
    { headerName: 'Allocation (%)', field: 'allocation', editable: true },
    { headerName: 'Risk Level', field: 'risk', editable: true },
    { headerName: 'Expected Return (%)', field: 'expectedReturn', editable: true },
    { headerName: 'Liquidity', field: 'liquidity', editable: true },
    { headerName: 'Volatility (%)', field: 'volatility', editable: true },
    { headerName: 'Market Cap ($B)', field: 'marketCap', editable: true },
    { headerName: 'Region', field: 'region', editable: true },
    { headerName: 'Tax Implication', field: 'taxImplication', editable: true },
  ];

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
    }
  ], [deleteAssetClass]);

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

  return (
    <section>
      <h2>Asset Classes</h2>
      <button onClick={addAssetClass} style={{ marginBottom: '1rem', backgroundColor: '#2ECC40', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FiPlus /> Add Asset
      </button>

      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          rowData={assetClasses}
          columnDefs={assetClassCols}
          defaultColDef={{ resizable: true, sortable: true, filter: true }}
          animateRows
          onGridReady={(params) => params.api.sizeColumnsToFit()}
        />
      </div>
    </section>
  );
};

export default AssetClassesSection;
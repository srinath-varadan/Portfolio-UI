import React, { useEffect, useRef, useState, useMemo } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, ClientSideRowModelModule, ValidationModule, NumberFilterModule, TextEditorModule, ColumnAutoSizeModule, NumberEditorModule } from 'ag-grid-community';
ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    ValidationModule,
    NumberFilterModule,
    TextEditorModule,
    ColumnAutoSizeModule,
    NumberEditorModule
  ]);

const AILogDashboard: React.FC = () => {
  const [rowData, setRowData] = useState<any[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [loading, setLoading] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const BACKEND_API = "https://stock-stream-api.onrender.com";
  const columnDefs = [
    { headerName: 'Timestamp', field: 'timestamp', flex: 1},
    { headerName: 'Info Logs', field: 'info_logs_count', flex: 1},
    { headerName: 'Warnings', field: 'warning_logs_count', flex: 1},
    { headerName: 'Errors', field: 'error_logs_count', flex: 1},
    { headerName: 'Critical', field: 'critical_logs_count', flex: 1},
    { headerName: 'Anomaly', field: 'anomalies_detected', flex: 1},
    { 
      headerName: 'Summary', 
      field: 'summary', 
      flex: 4, 
      autoHeight: true, 
      cellStyle: { whiteSpace: 'normal', lineHeight: '1.4', wordBreak: 'break-word' } 
    },
  ];

  const overlayStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
  };

  const filteredData = useMemo(() => {
    return rowData.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [rowData, filterText]);

  const startStreaming = () => {
    if (eventSourceRef.current) return;

    setLoading(true);
    const source = new EventSource(`${BACKEND_API}/stream/loki`);
    eventSourceRef.current = source;
    setIsStreaming(true);

    source.onmessage = (event) => {
      try {
        const raw = JSON.parse(event.data);
        let log;
        if (typeof raw.log === 'string') {
          try {
            log = JSON.parse(raw.log);
          } catch {
            log = { summary: raw.log };
          }
        } else {
          log = raw.log;
        }
        setRowData((prev) => [
          { timestamp: new Date().toLocaleString(), ...log },
          ...prev,
        ]);
        setLoading(false);
      } catch (err) {
        console.error('Failed to parse log message:', err);
        setLoading(false);
      }
    };

    source.onerror = (err) => {
      console.error('Stream error:', err);
      setLoading(false);
      stopStreaming();
    };
  };

  const stopStreaming = () => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    setIsStreaming(false);
  };

  useEffect(() => {
    return () => {
      stopStreaming();
    };
  }, []);

  return (
    <div style={{ width: '100%' }}>
      {loading && (
        <div style={overlayStyle}>
          <ClipLoader size={60} color="#fff" loading={loading} />
        </div>
      )}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
      <button
        onClick={isStreaming ? stopStreaming : startStreaming}
        style={{
          marginBottom: '1rem',
          backgroundColor: isStreaming ? '#FF4136' : '#2ECC40',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '5px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        {isStreaming ? 'Stop Streaming' : 'Start Streaming'}
      </button>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search logs..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        />
      </div>
      <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
        <AgGridReact
          rowData={filteredData}
          columnDefs={columnDefs}
          defaultColDef={{
            filter: true,
            sortable: true,
            resizable: true,
          }}
        />
      </div>
    </div>
  );
};

export default AILogDashboard;
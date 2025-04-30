import React, { useEffect, useRef, useState } from 'react';
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
  const eventSourceRef = useRef<EventSource | null>(null);
  const BACKEND_API = "https://stock-stream-api.onrender.com";
  const columnDefs = [
    { headerName: 'Timestamp', field: 'timestamp', flex: 1 },
    { headerName: 'Info Logs', field: 'info_logs_count', flex: 1 },
    { headerName: 'Warnings', field: 'warning_logs_count', flex: 1 },
    { headerName: 'Errors', field: 'error_logs_count', flex: 1 },
    { headerName: 'Critical', field: 'critical_logs_count', flex: 1 },
    { headerName: 'Anomaly', field: 'anomalies_detected', flex: 1 },
    { headerName: 'Summary', field: 'summary', flex: 4 },
  ];

  const startStreaming = () => {
    if (eventSourceRef.current) return;

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
          { timestamp: new Date().toISOString(), ...log },
          ...prev.slice(0, 499),
        ]);
      } catch (err) {
        console.error('Failed to parse log message:', err);
      }
    };

    source.onerror = (err) => {
      console.error('Stream error:', err);
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
      <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
        <AgGridReact rowData={rowData} columnDefs={columnDefs} />
      </div>
    </div>
  );
};

export default AILogDashboard;
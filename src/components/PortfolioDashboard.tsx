import React, { useEffect, useState } from 'react';
import { fetchData, saveData, deleteData } from '../Service';
import AssetClassTable from './AssetClassTable';
import HoldingTable from './HoldingTable';
import PerformanceChart from './PerformanceChart';
import ClipLoader from 'react-spinners/ClipLoader';

const overlayStyle = {
  position: 'fixed' as const,
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.4)', // darker for better contrast
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10000, // make sure it's on top of all other content
};

const PortfolioDashboard: React.FC = () => {
  const [assetClasses, setAssetClasses] = useState<any[]>([]);
  const [holdings, setHoldings] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadPortfolio() {
      setLoading(true);
      const assetData = await fetchData('api/Asset');
      const holdingData = await fetchData('api/Holding');
      const perfData = await fetchData('api/Performance');
      setAssetClasses(assetData);
      setHoldings(holdingData);
      setPerformanceData(perfData);
      setLoading(false);
    }
    loadPortfolio();
  }, []);

  // Save AssetClass
  const saveAssetClass = async (assetClass: any) => {
    setLoading(true);
    const saved = await saveData(`api/Asset/${assetClass.id}`, assetClass);
    setAssetClasses((prev) => {
      const idx = prev.findIndex((a: any) => a.id === saved.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = saved;
        setLoading(false);
        return updated;
      }
      setLoading(false);
      return [...prev, saved];
    });
  };

  // Delete AssetClass
  const deleteAssetClass = async (assetClassId: any) => {
    setLoading(true);
    await deleteData('api/Asset', assetClassId);
    setAssetClasses((prev) => {
      const filtered = prev.filter((a: any) => a.id !== assetClassId);
      setLoading(false);
      return filtered;
    });
  };

  // Save Holding
  const saveHolding = async (holding: any) => {
    setLoading(true);
    const saved = await saveData(`api/Holding/${holding.id}`, holding);
    setHoldings((prev) => {
      const idx = prev.findIndex((h: any) => h.id === saved.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = saved;
        setLoading(false);
        return updated;
      }
      setLoading(false);
      return [...prev, saved];
    });
  };

  // Delete Holding
  const deleteHolding = async (holdingId: any) => {
    setLoading(true);
    await deleteData('api/Holding', holdingId);
    setHoldings((prev) => {
      const filtered = prev.filter((h: any) => h.id !== holdingId);
      setLoading(false);
      return filtered;
    });
  };

  return (
    <div>
      <h2>Portfolio Dashboard</h2>

      {loading && (
        <div style={overlayStyle}>
          <ClipLoader size={60} color="#123abc" loading={loading} />
        </div>
      )}

      <AssetClassTable
        assetClasses={assetClasses}
        setAssetClasses={setAssetClasses}
        saveAssetClass={saveAssetClass}
        deleteAssetClass={deleteAssetClass}
      />

      <HoldingTable
        holdings={holdings}
        setHoldings={setHoldings}
        saveHolding={saveHolding}
        deleteHolding={deleteHolding}
      />

      <h3>Performance</h3>
      <PerformanceChart data={performanceData} />
    </div>
  );
};

export default PortfolioDashboard;
import React, { useEffect, useState } from 'react';
import { fetchData, saveData, deleteData } from '../Service';
import AssetClassTable from './AssetClassTable';
import HoldingTable from './HoldingTable';
import PerformanceChart from './PerformanceChart';

const PortfolioDashboard: React.FC = () => {
  const [assetClasses, setAssetClasses] = useState<any[]>([]);
  const [holdings, setHoldings] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  useEffect(() => {
    async function loadPortfolio() {
      const assetData = await fetchData('api/Asset');
      const holdingData = await fetchData('api/Holding');
      const perfData = await fetchData('api/Performance');
      setAssetClasses(assetData);
      setHoldings(holdingData);
      setPerformanceData(perfData);
    }
    loadPortfolio();
  }, []);

  // Save AssetClass
  const saveAssetClass = async (assetClass: any) => {
    const saved = await saveData('api/Asset', assetClass);
    // Optionally refresh list or update state
    setAssetClasses((prev) => {
      const idx = prev.findIndex((a: any) => a.id === saved.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = saved;
        return updated;
      }
      return [...prev, saved];
    });
  };

  // Delete AssetClass
  const deleteAssetClass = async (assetClassId: any) => {
    await deleteData('api/Asset', assetClassId);
    setAssetClasses((prev) => prev.filter((a: any) => a.id !== assetClassId));
  };

  // Save Holding
  const saveHolding = async (holding: any) => {
    const saved = await saveData('api/Holding', holding);
    setHoldings((prev) => {
      const idx = prev.findIndex((h: any) => h.id === saved.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = saved;
        return updated;
      }
      return [...prev, saved];
    });
  };

  // Delete Holding
  const deleteHolding = async (holdingId: any) => {
    await deleteData('api/Holding', holdingId);
    setHoldings((prev) => prev.filter((h: any) => h.id !== holdingId));
  };

  return (
    <div>
      <h2>Portfolio Dashboard</h2>

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
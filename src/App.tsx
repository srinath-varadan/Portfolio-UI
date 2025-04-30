import React, { useState } from 'react';
import ArsenalLogo from './assets/arsenal-logo.png';
import styled from 'styled-components';
import PortfolioDashboard from './components/PortfolioDashboard';
import LiveMarketDashboard from './components/LiveMarketDashboard';
import AILogDashboard from './components/AILogDashboard';

const Container = styled.div`
  padding: 2rem;
  background-color: #f4f4f4;
  min-height: 100vh;
`;

const TabButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.5rem;
  background-color: ${({ $active }) => ($active ? '#0074D9' : '#ccc')};
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
`;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'live' | 'ai-logs'>('portfolio');

  return (
    <Container>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
  <img
    src={ArsenalLogo}
    alt="Arsenal FC Logo"
    style={{
      width: '60px',
      height: '60px',
      borderRadius: '50%', // makes it circular
      objectFit: 'cover', // ensures image doesn't stretch
    }}
  />
  <h1>Arsenal Portfolio</h1>
</div>

      <TabButtons>
        <TabButton $active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')}>
          Portfolio
        </TabButton>
        <TabButton $active={activeTab === 'live'} onClick={() => setActiveTab('live')}>
          Live Market
        </TabButton>
        <TabButton $active={activeTab === 'ai-logs'} onClick={() => setActiveTab('ai-logs')}>
          AI Logs
        </TabButton>
      </TabButtons>

      {activeTab === 'portfolio' && <PortfolioDashboard />}
      {activeTab === 'live' && <LiveMarketDashboard />}
      {activeTab === 'ai-logs' && <AILogDashboard />}
    </Container>
  );
};

export default App;
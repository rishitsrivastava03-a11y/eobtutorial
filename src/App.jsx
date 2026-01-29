import React, { useState } from 'react';
import { Activity, ArrowLeft } from 'lucide-react';
import ACOAntivirusScanner from './components/ACOAntivirusScanner';

// ==================== MAIN APP WITH ROUTING ====================
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const HomePage = () => (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%)'}}>
      <div style={{maxWidth: '700px', textAlign: 'center', position: 'relative', zIndex: 10}}>
        <div style={{marginBottom: '48px'}}>
          <div style={{display: 'inline-flex', padding: '24px', background: 'rgba(76, 175, 80, 0.08)', borderRadius: '50%', marginBottom: '32px', border: '1px solid rgba(76, 175, 80, 0.2)', color: '#66bb6a'}}>
            <Activity size={48} strokeWidth={1.5} />
          </div>
          <h1 style={{fontSize: '48px', fontWeight: 600, background: 'linear-gradient(135deg, #e8eaed 0%, #a0a4a8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px', lineHeight: 1.2}}>
            Ant Colony Optimization
          </h1>
          <span style={{display: 'block', fontSize: '20px', fontWeight: 400, color: '#9aa0a6', marginTop: '12px'}}>
            Swarm Intelligence for Malware Detection
          </span>
        </div>

        <div style={{marginBottom: '48px'}}>
          <p style={{fontSize: '18px', lineHeight: 1.8, color: '#bdc1c6', marginBottom: '40px'}}>
            Watch as a colony of autonomous agents uses pheromone trails and collective intelligence to efficiently detect threats across a file system.
          </p>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '32px'}}>
            {['Self-organizing swarm behavior', 'Dynamic pheromone trail formation', 'Emergent threat clustering detection', 'Adaptive resource allocation'].map((feature, idx) => (
              <div key={idx} style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '14px', color: '#bdc1c6', textAlign: 'left'}}>
                <div style={{width: '8px', height: '8px', background: '#66bb6a', borderRadius: '50%', flexShrink: 0, boxShadow: '0 0 8px rgba(102, 187, 106, 0.5)'}}></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => setCurrentPage('simulation')} style={{padding: '16px 40px', fontSize: '18px', fontWeight: 500, background: 'linear-gradient(135deg, #66bb6a 0%, #4caf50 100%)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)', transition: 'all 0.3s ease'}}>
          Begin Simulation
        </button>

        <p style={{marginTop: '48px', fontSize: '14px', color: '#5f6368', fontWeight: 300}}>
          Inspired by biological systems · Built with React
        </p>
      </div>
    </div>
  );

  const SimulationPage = () => (
    <div style={{minHeight: '100vh', padding: '32px', background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%)'}}>
      <div style={{maxWidth: '1400px', margin: '0 auto'}}>
        <nav style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)'}}>
          <button onClick={() => setCurrentPage('home')} style={{display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#e8eaed', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer'}}>
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px'}}>
            <span style={{fontWeight: 600, color: '#66bb6a'}}>ACO</span>
            <span style={{color: '#5f6368'}}>/</span>
            <span style={{color: '#9aa0a6'}}>Antivirus Scanner</span>
          </div>
        </nav>

        <div style={{textAlign: 'center', marginBottom: '32px', paddingTop: '16px'}}>
          <h2 style={{fontSize: '32px', fontWeight: 600, color: '#e8eaed', marginBottom: '8px'}}>Live Simulation</h2>
          <p style={{color: '#9aa0a6', fontSize: '16px', fontWeight: 300}}>Observing emergent behavior in real-time</p>
        </div>

        <div style={{background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '32px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'}}>
          <ACOAntivirusScanner />
        </div>
      </div>
    </div>
  );

  return currentPage === 'home' ? <HomePage /> : <SimulationPage />;
};

export default App;

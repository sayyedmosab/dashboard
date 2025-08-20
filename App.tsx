import React, { useState } from 'react';
import { fetchEdgeFunction } from './api/edgeFunction';
import { DashboardData, Dimension } from './types';
import SpiderChart from './components/SpiderChart';
import ExecSummary from './components/ExecSummary';
import DimensionsPanel from './components/DimensionsPanel';
import InsightsPanel from './components/InsightsPanel';
import MacroEconomicsPanel from './components/MacroEconomicsPanel';

export default function App() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [year, setYear] = useState(2025);
  const [quarter, setQuarter] = useState('Q1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiSummary, setAISummary] = useState('Summary of key metrics and trends.');
  const [aiInsights, setAIInsights] = useState<{[k:number]: string}>({});

  const fetchDashboard = async () => {
    setLoading(true); setError(null);
    try {
      const data = await fetchEdgeFunction(year, quarter);
      setDashboardData(data);
      setAISummary('Summary of key metrics and trends.');
      setAIInsights({});
    } catch (e: any) {
      setError(e.message || 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  // Example: Manipulate insights from dimensions (replace with your real logic)
  function getInsights(dimensions: Dimension[], data: DashboardData): any[] {
    // Example: group by health state, or any custom logic you want
    if (!dimensions) return [];
    return [
      { title: 'Top Healthy', dims: dimensions.filter(d => d.health_state === 'Healthy') },
      { title: 'At Risk', dims: dimensions.filter(d => d.health_state === 'At Risk') },
      { title: 'Distressed', dims: dimensions.filter(d => d.health_state === 'Distressed') },
    ];
  }

  const insights = dashboardData ? getInsights(dashboardData.dimensions, dashboardData) : [];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Dashboard</h1>
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <SpiderChart dimensions={dashboardData?.dimensions || []} datasetB={dashboardData?.dimensions?.map(d=>d.kpi_actual) || []} />
        <ExecSummary summary={aiSummary} onAIAnalyze={() => setAISummary('AI-generated summary (placeholder)')} />
      </div>
      <div style={{ marginTop: 24 }}>
        <label>
          Year:
          <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} style={{ width: 80, marginLeft: 8 }} />
        </label>
        <label style={{ marginLeft: 16 }}>
          Quarter:
          <select value={quarter} onChange={e => setQuarter(e.target.value)} style={{ marginLeft: 8 }}>
            <option value="Q1">Q1</option>
            <option value="Q2">Q2</option>
            <option value="Q3">Q3</option>
            <option value="Q4">Q4</option>
          </select>
        </label>
        <button onClick={fetchDashboard} disabled={loading} style={{ padding: '8px 16px', fontWeight: 'bold', marginLeft: 24 }}>
          {loading ? 'Loading...' : 'Fetch Dashboard Data'}
        </button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </div>
      {dashboardData && <>
        <DimensionsPanel dimensions={dashboardData.dimensions} />
        <InsightsPanel insights={insights.map((insight, idx) => ({ ...insight, ai: aiInsights[idx] }))} onAIAnalyze={idx => setAIInsights(ai => ({ ...ai, [idx]: 'AI-generated insight (placeholder)' }))} />
        {/* <MacroEconomicsPanel data={dashboardData.outcomes} /> */}
      </>}
    </div>
  );
}

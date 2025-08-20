import React from 'react';

export default function InsightsPanel({ insights, onAIAnalyze }: { insights: any[]; onAIAnalyze: (idx: number) => void }) {
  return (
    <div style={{ marginTop: 24 }}>
      <b>Insights</b>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
        {insights.map((insight, idx) => (
          <div key={idx} style={{ border: '1px solid #eee', borderRadius: 6, padding: 12, background: '#f7f7fa' }}>
            <div style={{ fontWeight: 500 }}>Insight {idx + 1}</div>
            <div style={{ color: '#666', fontSize: 13 }}>{insight?.title || 'No title'}</div>
            <button onClick={() => onAIAnalyze(idx)} style={{ marginTop: 8 }}>AI Analyze</button>
          </div>
        ))}
      </div>
    </div>
  );
}

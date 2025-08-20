import React from 'react';

export default function ExecSummary({ summary, onAIAnalyze }: { summary: string; onAIAnalyze: () => void }) {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, minWidth: 250, flex: 1 }}>
      <b>Executive Summary</b>
      <div style={{ margin: '12px 0' }}>{summary}</div>
      <button onClick={onAIAnalyze}>AI Analyze</button>
    </div>
  );
}

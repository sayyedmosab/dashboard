import React from 'react';
import { Dimension } from '../types';

// This is a placeholder. Replace with a real charting library for production use.
export function SpiderChart({ dimensions, comparison }: { dimensions: Dimension[]; comparison: Dimension[] }) {
  // For now, just render the dimension titles and health for both datasets
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, minWidth: 350, flex: 1 }}>
      <b>Spider Chart</b>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>(2 datasets, real chart coming soon)</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {dimensions.map((dim, idx) => (
          <div key={dim.id}>
            <span>{dim.title}: </span>
            <span style={{ color: '#1976d2' }}>Current {dim.health}</span>
            {comparison[idx] && (
              <span style={{ color: '#d2691e', marginLeft: 8 }}>
                | Previous {comparison[idx].health}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

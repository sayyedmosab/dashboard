import React from 'react';
import { Dimension } from '../types';

export default function DimensionsPanel({ dimensions }: { dimensions: Dimension[] }) {
  return (
    <div style={{ marginTop: 24 }}>
      <b>Dimensions</b>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 8 }}>
        {dimensions.map((dim) => (
          <div key={dim.id} style={{ border: '1px solid #eee', borderRadius: 6, padding: 12, minWidth: 200, background: '#fafbfc' }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{dim.title}</div>
            <div style={{ color: '#888', fontSize: 12 }}>{dim.kpi_description}</div>
            <div style={{ marginTop: 8 }}>Health: <b>{dim.health}</b> <span style={{ color: '#888', fontSize: 12 }}>({dim.health_state})</span></div>
            <div>KPI: {dim.kpi}</div>
            <div>Label: {dim.label}</div>
            <div>Trend: {dim.trend_direction}</div>
            <div>Projections: {dim.projections?.join(', ')}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

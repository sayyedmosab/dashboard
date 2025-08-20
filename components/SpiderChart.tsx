import React from 'react';
import { Dimension } from '../types';

// TODO: Replace with a real radar/spider chart (e.g., Chart.js, Recharts, or custom SVG)
export default function SpiderChart({ dimensions, datasetB }: { dimensions: Dimension[]; datasetB?: number[] }) {
  // For now, just show a table of the two datasets
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, minWidth: 350, flex: 1 }}>
      <b>Spider Chart</b>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>(2 datasets, radar chart placeholder)</div>
      <table style={{ width: '100%', fontSize: 13 }}>
        <thead>
          <tr>
            <th>Dimension</th>
            <th>Dataset A</th>
            <th>Dataset B</th>
          </tr>
        </thead>
        <tbody>
          {dimensions.map((dim, i) => (
            <tr key={dim.id}>
              <td>{dim.title}</td>
              <td>{dim.health}</td>
              <td>{datasetB ? datasetB[i] : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

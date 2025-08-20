import React from 'react';

export default function MacroEconomicsPanel({ data }: { data: any }) {
  if (!data) return null;
  return (
    <div style={{ marginTop: 24 }}>
      <b>Macro Economics</b>
      <div style={{ color: '#888', fontSize: 12 }}>(Optional section)</div>
      {/* Render macro data here if needed */}
    </div>
  );
}

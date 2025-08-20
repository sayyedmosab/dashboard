import React from 'react';
import DimensionModule from './DimensionModule';
import type { Dimension } from '../types';

interface InternalOutputsProps {
  dimensions: Dimension[];
}

const InternalOutputs: React.FC<InternalOutputsProps> = ({ dimensions }) => {
  // Debug: Log the dimensions to see if there are duplicates
  console.log('🔍 InternalOutputs dimensions received:', {
    count: dimensions.length,
    dimensions: dimensions.map(d => ({ 
      id: d.id, 
      title: d.title, 
      kpi: d.kpi,
      kpi_actual: d.kpi_actual,
      trend: d.trend,
      health: d.health
    }))
  });
  
  return (
    <section>
      <h2 className="text-2xl font-bold text-[var(--component-text-primary)] mb-4">Internal Transformation Outputs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {dimensions.map((dim, index) => (
          <DimensionModule key={`${dim.id}-${index}`} dimension={dim} />
        ))}
      </div>
    </section>
  );
};

export default InternalOutputs;
import React from 'react';
import DimensionModule from './DimensionModule';
import type { Dimension } from '../types';

interface InternalOutputsProps {
  dimensions: Dimension[];
}

const InternalOutputs: React.FC<InternalOutputsProps> = ({ dimensions }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-light-text mb-4">Internal Transformation Outputs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {dimensions.map(dim => (
          <DimensionModule key={dim.id} dimension={dim} />
        ))}
      </div>
    </section>
  );
};

export default InternalOutputs;

import React from 'react';
import { Bar } from 'react-chartjs-2';
import Panel from './Panel';
import type { Dimension } from '../types';
import { getCssVar } from '../utils/styleHelper';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface DimensionModuleProps {
  dimension: Dimension;
}

const DimensionModule: React.FC<DimensionModuleProps> = ({ dimension }) => {
  const { title, health, kpi, label, trend } = dimension;

  const healthColor = health > 80 
    ? getCssVar('--component-color-success') 
    : health > 60 
    ? getCssVar('--component-color-warning') 
    : getCssVar('--component-color-danger');
  
  const maxVal = Math.max(trend.actual, trend.target, trend.baseline) * 1.2;
  const poorBand = trend.bands[0];
  const satisfactoryBand = trend.bands[1] - trend.bands[0];
  const goodBand = maxVal - trend.bands[1];
  
  const chartData = {
    labels: [''],
    datasets: [
      { label: 'Poor', data: [poorBand], backgroundColor: 'rgba(74, 74, 88, 0.5)', stack: 'background' },
      { label: 'Satisfactory', data: [satisfactoryBand], backgroundColor: 'rgba(90, 90, 104, 0.5)', stack: 'background' },
      { label: 'Good', data: [goodBand], backgroundColor: 'rgba(106, 106, 120, 0.5)', stack: 'background' },
      { 
        label: 'Baseline', 
        data: [trend.baseline],
        backgroundColor: getCssVar('--component-text-muted'), 
        barPercentage: 0.15,
        stack: 'markers'
      },
      { 
        label: 'Actual', 
        data: [trend.actual], 
        backgroundColor: healthColor, 
        barPercentage: 0.35,
        stack: 'markers',
        borderRadius: 2
      },
      {
        label: 'Target',
        data: [trend.target],
        backgroundColor: getCssVar('--component-text-primary'),
        barPercentage: 0.15,
        stack: 'markers'
      }
    ]
  };

  const chartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { 
          enabled: true,
          mode: 'index' as const,
          intersect: true,
          callbacks: {
              label: function(context: any) {
                  const label = context.dataset.label || '';
                  if (['Poor', 'Satisfactory', 'Good'].includes(label)) {
                      return null;
                  }
                  return `${label}: ${context.formattedValue}`;
              }
          }
      }
    },
    scales: {
      x: { display: false, stacked: false, max: maxVal },
      y: { display: false, stacked: true }
    },
    animation: false as const
  };

  return (
    <Panel className="text-left p-4">
      <div className="flex justify-between items-center mb-1">
        <h3 className="font-semibold text-[var(--component-text-primary)] opacity-90 text-sm">{title}</h3>
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: healthColor }}></div>
      </div>
      <div className="text-3xl font-bold text-[var(--component-text-primary)] my-1">{kpi}</div>
      <div className="text-xs text-[var(--component-text-muted)]">{label}</div>
      <div className="h-6 mt-4 relative">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </Panel>
  );
};

export default DimensionModule;

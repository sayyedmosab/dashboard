import React, { useMemo } from 'react';
import { Bubble, Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, Tooltip, Legend, BubbleController
} from 'chart.js';
import Panel from './Panel';
import type { DashboardData, InsightId } from '../types';
import { getCssVar } from '../utils/styleHelper';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, BubbleController);

interface StrategicInsightsProps {
  data: DashboardData;
  onAnalyze: (id: InsightId) => void;
  isIntegrationMode: boolean;
}

const StrategicInsights: React.FC<StrategicInsightsProps> = ({ data, onAnalyze, isIntegrationMode }) => {
  const { insight1, insight2, insight3 } = data;

  const chartOptionsBase = useMemo(() => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
          legend: { labels: { color: getCssVar('--component-text-primary') } },
          tooltip: {
              backgroundColor: getCssVar('--component-bg-primary'),
              titleColor: getCssVar('--component-text-accent'),
              bodyColor: getCssVar('--component-text-primary'),
              borderColor: getCssVar('--component-panel-border'),
              borderWidth: 1,
              padding: 10,
              cornerRadius: 8,
          }
      },
      scales: {
          x: { ticks: { color: getCssVar('--component-text-muted') }, grid: { color: getCssVar('--component-panel-border') } },
          y: { ticks: { color: getCssVar('--component-text-muted') }, grid: { color: getCssVar('--component-panel-border') } }
      }
  }), []);

  // Chart 1: Investment Portfolio
  const insight1Data = {
    datasets: insight1.initiatives.map(d => ({
        label: d.name,
        data: [{ x: d.risk, y: d.alignment, r: d.budget * 2 }],
        backgroundColor: 'rgba(0, 174, 239, 0.7)'.replace('0, 174, 239', getCssVar('--component-text-accent').replace('rgb(', '').replace(')', ''))
    }))
  };
  const insight1Options = { ...chartOptionsBase, scales: { x: { min: 0, max: 5, title: { display: true, text: 'Risk Level', color: getCssVar('--component-text-primary') }, ...chartOptionsBase.scales.x }, y: { min: 0, max: 5, title: { display: true, text: 'Strategic Alignment', color: getCssVar('--component-text-primary') }, ...chartOptionsBase.scales.y } }, plugins: { ...chartOptionsBase.plugins, legend: { display: false } } };

  // Chart 2: Delivery & Adoption
  const insight2Data = {
    labels: insight2.labels,
    datasets: [
        { label: 'Delivery Output', data: insight2.delivery.actual, backgroundColor: `color-mix(in srgb, ${getCssVar('--component-text-accent')} 50%, transparent)`, borderColor: getCssVar('--component-text-accent'), borderWidth: 1, type: 'bar' as const },
        { label: 'User Adoption (k)', data: insight2.adoption.actual, type: 'line' as const, borderColor: getCssVar('--component-color-success'), tension: 0.4, yAxisID: 'y1' }
    ]
  };
  const insight2Options = { ...chartOptionsBase, scales: { ...chartOptionsBase.scales, y: { beginAtZero: true, position: 'left' as const, title: { display: true, text: 'Delivery Output', color: getCssVar('--component-text-primary') } }, y1: { beginAtZero: true, position: 'right' as const, grid: { drawOnChartArea: false }, title: { display: true, text: 'User Adoption (k)', color: getCssVar('--component-text-primary') } } } };
    
  // Chart 3: Internal-to-External Impact
  const insight3Data = {
    labels: insight3.labels,
    datasets: [
        { type: 'bar' as const, label: 'Internal Efficiency Gains', data: insight3.internalEfficiency.actual, backgroundColor: `color-mix(in srgb, ${getCssVar('--component-text-accent')} 50%, transparent)` },
        { type: 'line' as const, label: 'External Citizen Value', data: insight3.externalValue.actual, borderColor: getCssVar('--component-color-success'), tension: 0.4, yAxisID: 'y1' }
    ]
  };
  const insight3Options = { ...chartOptionsBase, scales: { ...chartOptionsBase.scales, y: { title: { display: true, text: 'Efficiency Index', color: getCssVar('--component-text-primary') } }, y1: { position: 'right' as const, grid: { drawOnChartArea: false }, title: { display: true, text: 'Citizen Value Score', color: getCssVar('--component-text-primary') } } } };


  return (
    <section>
      <h2 className="text-2xl font-bold text-[var(--component-text-primary)] mb-4">Strategic Insights</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel className="col-span-1">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-semibold">{insight1.title}</h3>
                    <p className="text-xs text-[var(--component-text-muted)] mt-1">{insight1.subtitle}</p>
                </div>
                {!isIntegrationMode && <button onClick={() => onAnalyze('insight1')} className="text-sm bg-[var(--component-text-accent)] bg-opacity-80 hover:bg-opacity-100 px-3 py-1 rounded-md flex-shrink-0 ml-2">✨ Analyze</button>}
            </div>
            <div className="flex-grow min-h-[250px]"><Bubble data={insight1Data} options={insight1Options} /></div>
        </Panel>
        <Panel className="col-span-1">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-semibold">{insight2.title}</h3>
                    <p className="text-xs text-[var(--component-text-muted)] mt-1">{insight2.subtitle}</p>
                </div>
                {!isIntegrationMode && <button onClick={() => onAnalyze('insight2')} className="text-sm bg-[var(--component-text-accent)] bg-opacity-80 hover:bg-opacity-100 px-3 py-1 rounded-md flex-shrink-0 ml-2">✨ Analyze</button>}
            </div>
            <div className="flex-grow min-h-[250px]"><Chart type='bar' data={insight2Data} options={insight2Options} /></div>
        </Panel>
        <Panel className="col-span-1">
             <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-semibold">{insight3.title}</h3>
                    <p className="text-xs text-[var(--component-text-muted)] mt-1">{insight3.subtitle}</p>
                </div>
                {!isIntegrationMode && <button onClick={() => onAnalyze('insight3')} className="text-sm bg-[var(--component-text-accent)] bg-opacity-80 hover:bg-opacity-100 px-3 py-1 rounded-md flex-shrink-0 ml-2">✨ Analyze</button>}
            </div>
            <div className="flex-grow min-h-[250px]"><Chart type='bar' data={insight3Data} options={insight3Options} /></div>
        </Panel>
      </div>
    </section>
  );
};

export default StrategicInsights;

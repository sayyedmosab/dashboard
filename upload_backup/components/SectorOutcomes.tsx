import React, { useMemo } from 'react';
import { Chart, Doughnut } from 'react-chartjs-2';
import Panel from './Panel';
import type { OutcomesData, InsightId } from '../types';
import { getCssVar } from '../utils/styleHelper';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
  
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend
);

interface SectorOutcomesProps {
  outcomes: OutcomesData;
  onAnalyze: (id: InsightId) => void;
  isIntegrationMode: boolean;
}

const SectorOutcomes: React.FC<SectorOutcomesProps> = ({ outcomes, onAnalyze, isIntegrationMode }) => {

    const chartOptionsBase = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: getCssVar('--component-text-primary') }, position: 'top' as const, align: 'end' as const },
            tooltip: {
                backgroundColor: getCssVar('--component-bg-primary'), titleColor: getCssVar('--component-text-accent'), bodyColor: getCssVar('--component-text-primary'),
                borderColor: getCssVar('--component-panel-border'), borderWidth: 1, padding: 10, cornerRadius: 8
            }
        },
        scales: {
            x: { ticks: { color: getCssVar('--component-text-muted') }, grid: { color: getCssVar('--component-panel-border') } },
            y: { ticks: { color: getCssVar('--component-text-muted') }, grid: { color: getCssVar('--component-panel-border') } }
        }
    }), []);

    const doughnutTextPlugin = (actual: number, target: number) => ({
        id: 'doughnutText',
        afterDraw(chart: ChartJS) {
            const { ctx, chartArea: { width, height } } = chart;
            ctx.save();
            ctx.font = 'bold 24px Inter';
            ctx.fillStyle = getCssVar('--component-text-primary');
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const text = `${actual}%`;
            ctx.fillText(text, width / 2, height / 2 - 8);

            ctx.font = 'normal 12px Inter';
            ctx.fillStyle = getCssVar('--component-text-muted');
            const subtext = `vs ${target}% Target`;
            ctx.fillText(subtext, width / 2, height / 2 + 12);
            ctx.restore();
        }
    });

    // Outcome 1 Chart
    const outcome1Data = {
        labels: outcomes.outcome1.macro.labels,
        datasets: [
            { type: 'bar' as const, label: 'Jobs Created (k)', data: outcomes.outcome1.macro.jobs.actual, backgroundColor: `color-mix(in srgb, ${getCssVar('--component-text-accent')} 70%, transparent)` },
            { type: 'line' as const, label: 'FDI ($B)', data: outcomes.outcome1.macro.fdi.actual, yAxisID: 'y1', borderColor: getCssVar('--component-color-success') },
            { type: 'line' as const, label: 'FDI Target', data: outcomes.outcome1.macro.fdi.target, yAxisID: 'y1', borderColor: getCssVar('--component-color-success'), borderDash: [5, 5], pointRadius: 0 },
        ]
    };
    const outcome1Options = { ...chartOptionsBase, scales: { ...chartOptionsBase.scales, y: { beginAtZero: true, title: { display: true, text: 'Jobs (k)', color: getCssVar('--component-text-primary') } }, y1: { position: 'right' as const, grid: { drawOnChartArea: false }, title: { display: true, text: 'USD ($B)', color: getCssVar('--component-text-primary') } } } };

    // Outcome 2 Chart
    const { actual: pppActual, target: pppTarget } = outcomes.outcome2.partnerships;
    const outcome2Data = {
        labels: ['PPP Spending', ''],
        datasets: [{ data: [pppActual, 100-pppActual], backgroundColor: [getCssVar('--component-text-accent'), getCssVar('--component-panel-border')], borderWidth: 0 }]
    };
    const outcome2Options = { responsive: true, maintainAspectRatio: true, cutout: '70%', plugins: { ...chartOptionsBase.plugins, legend: {display: false}, tooltip: { enabled: false } } };

    // Outcome 3 Chart
    const outcome3Data = {
        labels: outcomes.outcome3.qol.labels,
        datasets: [
            { type: 'bar' as const, label: 'Coverage %', data: outcomes.outcome3.qol.coverage.actual, backgroundColor: `color-mix(in srgb, ${getCssVar('--component-text-accent')} 70%, transparent)` },
            { label: 'Quality Score', data: outcomes.outcome3.qol.quality.actual.map(q => q*10), type: 'line' as const, borderColor: getCssVar('--component-color-success'), tension: 0.4 },
            { label: 'Quality Target', data: outcomes.outcome3.qol.quality.target.map(q => q*10), type: 'line' as const, borderColor: getCssVar('--component-color-success'), borderDash: [5, 5], pointRadius: 0 }
        ]
    };
    const outcome3Options = { ...chartOptionsBase, scales: { ...chartOptionsBase.scales, y: { ...chartOptionsBase.scales.y, max: 100, title: {display: true, text: 'Index (0-100)', color: getCssVar('--component-text-primary')} } } };

    // Outcome 4 Chart
    const { actual: commActual, target: commTarget } = outcomes.outcome4.community;
    const outcome4Data = {
        labels: ['Engaged', ''],
        datasets: [{ data: [commActual, 100-commActual], backgroundColor: [getCssVar('--component-text-accent'), getCssVar('--component-panel-border')], borderWidth: 0 }]
    };
    const outcome4Options = { responsive: true, maintainAspectRatio: true, cutout: '70%', plugins: { ...chartOptionsBase.plugins, legend: {display: false}, tooltip: { enabled: false } } };
  
    return (
    <section>
      <h2 className="text-2xl font-bold text-[var(--component-text-primary)] mb-4">Sector-Level Outcomes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Panel>
              <div className="flex justify-between items-center mb-4"><h3 className="font-semibold">{outcomes.outcome1.title}</h3>{!isIntegrationMode && <button onClick={() => onAnalyze('outcome1')} className="text-sm bg-[var(--component-text-accent)] bg-opacity-80 hover:bg-opacity-100 px-3 py-1 rounded-md">✨ Analyze</button>}</div>
              <div className="flex-grow min-h-[250px]"><Chart type="bar" data={outcome1Data} options={outcome1Options} /></div>
          </Panel>
          <Panel>
              <div className="flex justify-between items-center mb-4"><h3 className="font-semibold">{outcomes.outcome2.title}</h3>{!isIntegrationMode && <button onClick={() => onAnalyze('outcome2')} className="text-sm bg-[var(--component-text-accent)] bg-opacity-80 hover:bg-opacity-100 px-3 py-1 rounded-md">✨ Analyze</button>}</div>
              <div className="flex-grow min-h-[250px] flex items-center justify-center"><div className="w-full max-w-[180px]"><Doughnut data={outcome2Data} options={outcome2Options} plugins={[doughnutTextPlugin(pppActual, pppTarget)]} /></div></div>
          </Panel>
          <Panel>
              <div className="flex justify-between items-center mb-4"><h3 className="font-semibold">{outcomes.outcome3.title}</h3>{!isIntegrationMode && <button onClick={() => onAnalyze('outcome3')} className="text-sm bg-[var(--component-text-accent)] bg-opacity-80 hover:bg-opacity-100 px-3 py-1 rounded-md">✨ Analyze</button>}</div>
              <div className="flex-grow min-h-[250px]"><Chart type="bar" data={outcome3Data} options={outcome3Options} /></div>
          </Panel>
          <Panel>
              <div className="flex justify-between items-center mb-4"><h3 className="font-semibold">{outcomes.outcome4.title}</h3>{!isIntegrationMode && <button onClick={() => onAnalyze('outcome4')} className="text-sm bg-[var(--component-text-accent)] bg-opacity-80 hover:bg-opacity-100 px-3 py-1 rounded-md">✨ Analyze</button>}</div>
              <div className="flex-grow min-h-[250px] flex items-center justify-center"><div className="w-full max-w-[180px]"><Doughnut data={outcome4Data} options={outcome4Options} plugins={[doughnutTextPlugin(commActual, commTarget)]} /></div></div>
          </Panel>
      </div>
    </section>
  );
};

export default SectorOutcomes;

import React, { useState, useEffect, useMemo } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Tooltip, Legend,
  type ChartOptions, type ChartType,
} from 'chart.js';
import Panel from './Panel';
import { fetchExecutiveSummary } from '../api/gemini';
import type { Dimension } from '../types';
import { getCssVar } from '../utils/styleHelper';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Tooltip, Legend);

declare module 'chart.js' {
  interface PluginOptionsByType<TType extends ChartType> {
      pointLabelsPlugin?: {
          dimensions?: Dimension[];
      };
  }
}

interface TransformationHealthProps {
  dimensions: Dimension[];
  apiKey?: string;
}

const TransformationHealth: React.FC<TransformationHealthProps> = ({ dimensions, apiKey }) => {
  const [executiveSummary, setExecutiveSummary] = useState('Generating holistic summary...');
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);

  useEffect(() => {
    // This effect runs when the component mounts and whenever `dimensions` data changes.
    const getSummary = async () => {
      setIsSummaryLoading(true);
      setExecutiveSummary("Generating holistic summary...");
      try {
        const summary = await fetchExecutiveSummary(dimensions, apiKey);
        setExecutiveSummary(summary);
      } catch (error) {
        console.error("Failed to fetch executive summary:", error);
        setExecutiveSummary("Could not generate a summary at this time. Please check the connection or API key.");
      } finally {
        setIsSummaryLoading(false);
      }
    };
    getSummary();
  }, [dimensions]); // Dependency array ensures this re-runs if data is updated via postMessage

  const overallActual = Math.round(dimensions.reduce((acc, dim) => acc + dim.trend.actual, 0) / dimensions.length);
  const overallTarget = Math.round(dimensions.reduce((acc, dim) => acc + dim.trend.target, 0) / dimensions.length);

  const spiderData = useMemo(() => ({
    labels: dimensions.map(d => d.title.replace(/ /g, '\n')),
    datasets: [{
      label: 'Health Score',
      data: dimensions.map(d => d.trend.actual),
      backgroundColor: `color-mix(in srgb, ${getCssVar('--component-text-accent')} 20%, transparent)`,
      borderColor: getCssVar('--component-text-accent'),
      borderWidth: 2,
      pointBackgroundColor: getCssVar('--component-text-accent'),
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: getCssVar('--component-text-accent')
    }]
  }), [dimensions]);
  
  const pointLabelsPlugin = useMemo(() => ({
    id: 'pointLabelsPlugin',
    afterDatasetsDraw(chart: ChartJS) {
      const { ctx } = chart;
      const dimensionData = chart.config.options?.plugins?.pointLabelsPlugin?.dimensions || [];
      
      const scale = chart.scales.r as RadialLinearScale;
      const centerX = scale.xCenter;
      const centerY = scale.yCenter;

      const meta = chart.getDatasetMeta(0);

      meta.data.forEach((element, index) => {
        const { x, y } = element.getProps(['x', 'y']);
        const actual = dimensionData[index]?.trend.actual || 0;
        const target = dimensionData[index]?.trend.target || 0;

        const angle = Math.atan2(y - centerY, x - centerX);
        const padding = 22;

        const labelX = x + padding * Math.cos(angle);
        const labelY = y + padding * Math.sin(angle);
        
        ctx.fillStyle = getCssVar('--component-text-primary');
        ctx.font = 'bold 11px Inter';

        if (Math.abs(angle) > Math.PI / 2) ctx.textAlign = 'right';
        else ctx.textAlign = 'left';
        
        if (angle > 0) ctx.textBaseline = 'top';
        else ctx.textBaseline = 'bottom';

        if (Math.abs(x - centerX) < 10) {
            ctx.textAlign = 'center';
            ctx.textBaseline = angle > 0 ? 'top' : 'bottom';
        }

        ctx.fillText(`${actual}/${target}`, labelX, labelY);
      });
    }
  }), []);

  const spiderOptions: ChartOptions<'radar'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true, backgroundColor: getCssVar('--component-bg-primary'), titleColor: getCssVar('--component-text-accent'), bodyColor: getCssVar('--component-text-primary') },
      pointLabelsPlugin: {
        dimensions: dimensions
      }
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: { display: false },
        pointLabels: {
          font: { size: 11, weight: 500 },
          color: getCssVar('--component-text-muted')
        },
        grid: { color: getCssVar('--component-panel-border') },
        angleLines: { color: getCssVar('--component-panel-border') }
      }
    }
  }), [dimensions]);

  return (
    <section>
      <h1 className="text-3xl font-bold text-[var(--component-text-primary)] mb-4">Transformation Health</h1>
      <div className="grid grid-cols-12 gap-6">
        <Panel className="col-span-12 lg:col-span-7">
          <div className="flex flex-col lg:flex-row items-center justify-center h-full">
            <div className="w-full lg:w-3/4 h-full flex items-center justify-center">
              <div className="w-full h-full relative">
                <Radar data={spiderData} options={spiderOptions} plugins={[pointLabelsPlugin]}/>
              </div>
            </div>
            <div className="w-full lg:w-1/4 flex flex-col items-center justify-center text-center p-4 mt-4 lg:mt-0 lg:border-l lg:border-t-0 border-t border-[var(--component-panel-border)]">
                <h3 className="text-lg font-semibold text-[var(--component-text-muted)]">Overall Score</h3>
                <div className="my-2">
                    <span className="text-5xl font-bold text-[var(--component-text-accent)]">{overallActual}</span>
                    <span className="text-2xl text-[var(--component-text-muted)]">/{overallTarget}</span>
                </div>
                <p className="text-xs text-[var(--component-text-muted)]">Actual vs. Target Average</p>
            </div>
          </div>
        </Panel>
        <Panel className="col-span-12 lg:col-span-5">
            <h3 className="font-semibold mb-4">Executive Summary</h3>
            <div className={`summary-text flex-grow text-[var(--component-text-muted)] whitespace-pre-wrap ${isSummaryLoading ? 'animate-pulse' : ''}`}>
                {isSummaryLoading ? 'Generating summary...' : executiveSummary}
            </div>
        </Panel>
      </div>
    </section>
  );
};

export default TransformationHealth;

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

interface TransformationHealthProps {
  dimensions: Dimension[];
  apiKey?: string;
}

const TransformationHealth: React.FC<TransformationHealthProps> = ({ dimensions, apiKey }) => {
  const [executiveSummary, setExecutiveSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  const [showSummarizeButton, setShowSummarizeButton] = useState<boolean>(true);
  
  const handleSummarize = async () => {
    if (dimensions.length === 0) return; // Don't run if there's no data
    setIsSummaryLoading(true);
    setExecutiveSummary("Generating holistic summary...");
    try {
      // Pass the API key to the fetchExecutiveSummary function
      const summary = await fetchExecutiveSummary(dimensions, apiKey);
      setExecutiveSummary(summary);
      setShowSummarizeButton(false);
    } catch (error) {
      console.error("Failed to fetch executive summary:", error);
      let errorMessage = "Could not generate a summary at this time.";
      if (error instanceof Error) {
        // Add more specific error message based on the error type
        if (error.message.includes('API_KEY')) {
          errorMessage += ' Please check that your API key is configured correctly in the .env.local file.';
        } else {
          errorMessage += ` Error: ${error.message}`;
        }
      }
      setExecutiveSummary(errorMessage);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  // Calculate overall health score using actual values from edge function
  const overallActual = Math.round(dimensions.length > 0 ? 
    dimensions.reduce((acc, dim) => acc + (dim.trend?.actual || dim.kpi_actual || 0), 0) / dimensions.length : 0);
  const overallTarget = 100; // The target for health is always 100

  const spiderData = useMemo(() => ({
    labels: dimensions.map(d => d.title.replace(/ /g, '\n')),
    datasets: [
      {
        label: 'Planned Performance',
        data: dimensions.map(d => d.trend?.target || d.kpi_planned || 0),
        backgroundColor: `color-mix(in srgb, ${getCssVar('--component-text-accent')} 20%, transparent)`,
        borderColor: getCssVar('--component-text-accent'),
        borderWidth: 2,
        pointBackgroundColor: getCssVar('--component-text-accent'),
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: getCssVar('--component-text-accent')
      },
      {
        label: 'Actual Performance',
        data: dimensions.map(d => d.trend?.actual || d.kpi_actual || 0),
        backgroundColor: `color-mix(in srgb, ${getCssVar('--component-color-success')} 20%, transparent)`,
        borderColor: getCssVar('--component-color-success'),
        borderWidth: 2,
        pointBackgroundColor: getCssVar('--component-color-success'),
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: getCssVar('--component-color-success')
      }
    ]
  }), [dimensions]);
  
  const pointLabelsPlugin = useMemo(() => ({
    id: 'pointLabelsPlugin',
    afterDatasetsDraw(chart: ChartJS) {
      const { ctx } = chart;
      const dimensionData = dimensions; // Use all dimensions from API (already limited to 8)
      
      const scale = chart.scales.r as any; // Use 'any' to avoid TypeScript issues
      const centerX = scale.xCenter || scale.x || 0;
      const centerY = scale.yCenter || scale.y || 0;

      // Get meta data for both datasets
      const plannedMeta = chart.getDatasetMeta(0);
      const actualMeta = chart.getDatasetMeta(1);

      dimensionData.forEach((dimension, index) => {
        // Calculate health deviation using your formula with edge function data
        const planned = dimension.trend?.target || dimension.kpi_planned || 0;
        const actual = dimension.trend?.actual || dimension.kpi_actual || 0;
        const healthDeviation = planned !== 0 ? ((actual - planned) / planned) * 100 : 0;
        
        // Get health color based on your thresholds
        const getHealthColor = (deviation: number) => {
          const absDeviation = Math.abs(deviation);
          if (absDeviation <= 5) return getCssVar('--component-color-success');
          if (absDeviation <= 15) return getCssVar('--component-color-warning');
          return getCssVar('--component-color-danger');
        };

        const healthColor = getHealthColor(healthDeviation);

        // Get position for actual point only (cleaner display)
        const actualElement = actualMeta.data[index];
        
        if (actualElement) {
          const actualProps = actualElement.getProps(['x', 'y']);
          
          const angle = Math.atan2(actualProps.y - centerY, actualProps.x - centerX);
          const padding = 25;

          const labelX = actualProps.x + padding * Math.cos(angle);
          const labelY = actualProps.y + padding * Math.sin(angle);

          ctx.save();
          ctx.font = 'bold 10px Inter';
          ctx.textAlign = Math.abs(angle) > Math.PI / 2 ? 'right' : 'left';
          ctx.textBaseline = 'middle';

          if (Math.abs(actualProps.x - centerX) < 10) {
            ctx.textAlign = 'center';
          }

          // Draw health deviation with color
          ctx.fillStyle = healthColor;
          ctx.fillText(`${healthDeviation >= 0 ? '+' : ''}${healthDeviation.toFixed(1)}%`, labelX, labelY);
          
          ctx.restore();
        }
      });
    }
  }), [dimensions]);

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
        max: 105, // FIX: Give labels at edge some breathing room
        ticks: { 
          display: false,
          stepSize: 25 // Helps ensure grid lines are drawn
        },
        pointLabels: {
          font: { size: 11, weight: 500 },
          color: getCssVar('--component-text-muted'),
          padding: 30 // FIX: Push dimension titles out to avoid overlap
        },
        grid: { color: getCssVar('--component-panel-border') },
        angleLines: { color: getCssVar('--component-panel-border') }
      }
    }
  }), [dimensions]);

  return (
    <section>
      <h2 className="text-2xl font-bold text-[var(--component-text-primary)] mb-4">Transformation Health</h2>
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
                    <span className="text-5xl font-bold text-[var(--component-text-accent)]">{overallActual || 0}</span>
                    <span className="text-2xl text-[var(--component-text-muted)]">/100</span>
                </div>
                <p className="text-xs text-[var(--component-text-muted)]">Actual vs. Target Average</p>
            </div>
          </div>
        </Panel>
        <Panel className="col-span-12 lg:col-span-5">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-semibold">Executive Summary</h3>
                    <p className="text-xs text-[var(--component-text-muted)] mt-1">Key takeaways from the dashboard data</p>
                </div>
                <button 
                    onClick={handleSummarize}
                    disabled={isSummaryLoading}
                    className="text-sm bg-[var(--component-text-accent)] text-white px-4 py-2 rounded-md"
                >
                    <span className="flex items-center">
                        <span className="ml-1">{isSummaryLoading ? 'Generating...' : 'Generate Executive Summary'}</span>
                    </span>
                </button>
            </div>
            <div className="flex-grow">
                {isSummaryLoading ? (
                    <div className="flex justify-center items-center min-h-[100px]">
                        <div className="text-center text-[var(--component-text-muted)]">
                            <div className="animate-spin h-8 w-8 border-4 border-[var(--component-text-accent)] border-t-transparent rounded-full mx-auto mb-2"></div>
                            <p>Generating executive summary...</p>
                        </div>
                    </div>
                ) : (
                    <div className="prose prose-sm max-w-none text-[var(--component-text-primary)] whitespace-pre-wrap min-h-[100px]">
                        {executiveSummary ? (
                            <div dangerouslySetInnerHTML={{ __html: executiveSummary.replace(/\n/g, '<br />') }} />
                        ) : (
                            <p className="text-[var(--component-text-muted)] text-center italic mt-8">
                                Click the "Generate Summary" button to create an executive summary
                            </p>
                        )}
                    </div>
                )}
            </div>
        </Panel>
      </div>
    </section>
  );
};

export default TransformationHealth;
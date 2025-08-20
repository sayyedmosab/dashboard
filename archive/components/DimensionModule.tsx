import React from 'react';
import Panel from './Panel';
import type { Dimension } from '../types';
import { getCssVar } from '../utils/styleHelper';

interface DimensionModuleProps {
  dimension: Dimension;
}

const DimensionModule: React.FC<DimensionModuleProps> = ({ dimension }) => {
  // 🔍 DEBUG: Log what dimension data we're receiving
  console.log('🧩 DimensionModule received dimension:', {
    id: dimension.id,
    title: dimension.title,
    health: dimension.health,
    kpi: dimension.kpi,
    actualValue: dimension.trend?.actual,
    plannedValue: dimension.trend?.target,
    fullDimension: dimension
  });

  const { 
    title, 
    health, 
    kpi, 
    label, 
    trend,
    kpi_actual,
    kpi_planned,
    kpi_base_value,
    kpi_next_target,
    kpi_final_target,
    kpi_description,
    health_state,
    trend_direction,
    projections
  } = dimension;

  // Health formula using edge function data: (actual-planned)/planned x 100
  const actualValue = trend?.actual || kpi_actual || 0;
  const plannedValue = trend?.target || kpi_planned || 0;
  const healthDeviation = plannedValue !== 0 ? ((actualValue - plannedValue) / plannedValue) * 100 : 0;
  
  // Health state based on deviation thresholds
  const getHealthState = (deviation: number) => {
    const absDeviation = Math.abs(deviation);
    if (absDeviation <= 5) return { state: 'Healthy', color: getCssVar('--component-color-success') };
    if (absDeviation <= 15) return { state: 'At Risk', color: getCssVar('--component-color-warning') };
    return { state: 'Distressed', color: getCssVar('--component-color-danger') };
  };

  const healthState = getHealthState(healthDeviation);
  const healthColor = healthState.color;

  // Calculate health score using your formula with edge function data
  const delta = actualValue - plannedValue;
  const deltaPercent = plannedValue !== 0 ? ((delta / plannedValue) * 100).toFixed(1) : '0.0';
  
  // Get trend arrow
  const getTrendArrow = () => {
    switch (trend_direction) {
      case 'Rise': return '↗';
      case 'Decline': return '↘';
      case 'Steady': return '→';
      default: return '→';
    }
  };

  // Get trend color
  const getTrendColor = () => {
    switch (trend_direction) {
      case 'Rise': return getCssVar('--component-color-success');
      case 'Decline': return getCssVar('--component-color-danger');
      case 'Steady': return getCssVar('--component-color-warning');
      default: return getCssVar('--component-text-muted');
    }
  };

  // Calculate next quarter projection (assuming we want the next value from projections array)
  const nextQuarterProjection = projections && projections.length > 0 ? projections[0] : (kpi_actual || 0);

  return (
    <Panel className="text-left p-4">
      {/* Header with title and health indicator */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-[var(--component-text-primary)] opacity-90 text-sm">{title}</h3>
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: healthColor }}></div>
      </div>
      
      {/* Main KPI Display with Trend and Projection */}
      <div className="flex items-baseline gap-3 mb-2">
        <div className="text-3xl font-bold text-[var(--component-text-primary)]">{kpi}</div>
        <div className="flex items-center gap-1">
          <span 
            className="text-lg font-bold" 
            style={{ color: getTrendColor() }}
          >
            {getTrendArrow()}
          </span>
          <div className="text-lg font-semibold text-[var(--component-text-muted)]">
            {nextQuarterProjection.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* KPI Description */}
      <div className="text-xs text-[var(--component-text-muted)] mb-3">{label || kpi_description || 'Performance metric'}</div>
      
      {/* Delta Display - Now called Health Score */}
      <div className="flex justify-between items-center text-xs mb-3 p-2 bg-[var(--component-panel-border)] bg-opacity-20 rounded">
        <span className="font-bold text-[var(--component-text-muted)]">
          Health Score:
        </span>
        <span 
          className="font-semibold"
          style={{ color: healthColor }}
        >
          {healthDeviation >= 0 ? '+' : ''}{healthDeviation.toFixed(1)}% ({healthState.state})
        </span>
      </div>

      {/* Performance Comparison Bars */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[var(--component-text-muted)] w-16">Baseline</span>
          <div className="flex-1 mx-2 h-2 bg-gray-200 rounded-full relative">
            <div 
              className="h-full rounded-full bg-gray-400" 
              style={{ width: `${Math.min((trend?.baseline || kpi_base_value || 0), 100)}%` }}
            ></div>
          </div>
          <span className="w-12 text-right" style={{ color: getCssVar('--component-text-muted') }}>
            {(trend?.baseline || kpi_base_value || 0).toFixed(1)}%
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[var(--component-text-muted)] w-16">Planned</span>
          <div className="flex-1 mx-2 h-2 bg-gray-200 rounded-full relative">
            <div 
              className="h-full rounded-full" 
              style={{ 
                width: `${Math.min(plannedValue, 100)}%`,
                backgroundColor: getCssVar('--component-text-accent')
              }}
            ></div>
          </div>
          <span className="w-12 text-right" style={{ color: getCssVar('--component-text-accent') }}>
            {plannedValue.toFixed(1)}%
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[var(--component-text-muted)] w-16">Actual</span>
          <div className="flex-1 mx-2 h-2 bg-gray-200 rounded-full relative">
            <div 
              className="h-full rounded-full" 
              style={{ 
                width: `${Math.min(actualValue, 100)}%`,
                backgroundColor: healthColor
              }}
            ></div>
          </div>
          <span className="w-12 text-right" style={{ color: healthColor }}>
            {actualValue.toFixed(1)}%
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[var(--component-text-muted)] w-16">Target</span>
          <div className="flex-1 mx-2 h-2 bg-gray-200 rounded-full relative">
            <div 
              className="h-full rounded-full" 
              style={{ 
                width: `${Math.min((trend?.bands?.[1] || kpi_final_target || 0), 100)}%`,
                backgroundColor: getCssVar('--component-text-primary')
              }}
            ></div>
          </div>
          <span className="w-12 text-right" style={{ color: getCssVar('--component-text-primary') }}>
            {(trend?.bands?.[1] || kpi_final_target || 0).toFixed(1)}%
          </span>
        </div>
      </div>
    </Panel>
  );
};

export default DimensionModule;

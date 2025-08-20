import React, { useState, useCallback, useMemo, useEffect } from 'react';
// ❌ REMOVED: Mock data import - forces real data only
// import { DASHBOARD_DATA } from './constants';
import type { InsightId, AnalysisData, DashboardData, DashboardModuleProps } from './types';
import { fetchDashboardData, type DashboardQueryParams } from './api/database';
import TransformationHealth from './components/TransformationHealth';
import StrategicInsights from './components/StrategicInsights';
import InternalOutputs from './components/InternalOutputs';
import SectorOutcomes from './components/SectorOutcomes';
import GeminiAnalysisModal from './components/GeminiAnalysisModal';
import { fetchInsightAnalysis } from './api/gemini';

const DashboardModule: React.FC<DashboardModuleProps> = ({
  data,
  geminiApiKey,
  enableAI = true,
  enableDatabase = true,
  databaseQueryParams,
  theme,
  disabledFeatures = [],
  onAnalyze,
  onDataChange,
  onDataLoadError,
  className = '',
  style = {}
}) => {
  // Empty dashboard structure - forces real data fetching
  const EMPTY_DASHBOARD: DashboardData = {
    dimensions: [],
    insight1: { title: 'No Data', subtitle: 'Click Refresh Data to load', initiatives: [] },
    insight2: { title: 'No Data', subtitle: 'Click Refresh Data to load', labels: [], delivery: { actual: [], target: [], baseline: [] }, adoption: { actual: [], target: [], baseline: [] } },
    insight3: { title: 'No Data', subtitle: 'Click Refresh Data to load', labels: [], internalEfficiency: { actual: [], target: 0, baseline: 0 }, externalValue: { actual: [], target: 0, baseline: 0 } },
    outcomes: {
      outcome1: { title: 'No Data', macro: { labels: [], fdi: { actual: [], target: [], baseline: [] }, trade: { actual: [], target: [], baseline: [] }, jobs: { actual: [], target: [], baseline: [] } } },
      outcome2: { title: 'No Data', partnerships: { actual: 0, target: 0, baseline: 0 } },
      outcome3: { title: 'No Data', qol: { labels: [], coverage: { actual: [], target: [], baseline: [] }, quality: { actual: [], target: [], baseline: [] } } },
      outcome4: { title: 'No Data', community: { actual: 0, target: 0, baseline: 0 } }
    }
  };

  const [dashboardData, setDashboardData] = useState<DashboardData>(data || EMPTY_DASHBOARD);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [dataLoadError, setDataLoadError] = useState<string | null>(null);

  console.log('🔍 DashboardModule - Current dashboard data:', {
    dimensionsCount: dashboardData.dimensions?.length,
    firstDimension: dashboardData.dimensions?.[0],
    dataSource: data ? 'prop' : 'state'
  });

  // Load dashboard data from database or use provided data
  useEffect(() => {
    const loadDashboardData = async () => {
      // If data is provided as prop, use it directly
      if (data) {
        setDashboardData(data);
        onDataChange?.(data);
        return;
      }

      // If database is disabled, use empty structure
      if (!enableDatabase) {
        setDashboardData(EMPTY_DASHBOARD);
        onDataChange?.(EMPTY_DASHBOARD);
        return;
      }

      // Load data from database
      setIsDataLoading(true);
      setDataLoadError(null);

      try {
        const fetchedData = await fetchDashboardData(databaseQueryParams);
        setDashboardData(fetchedData);
        onDataChange?.(fetchedData);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load dashboard data';
        console.error('Dashboard data loading failed:', error);
        setDataLoadError(errorMessage);
        onDataLoadError?.(error);
        
        // Use empty structure if database fails - no fallback to mock data
        setDashboardData(EMPTY_DASHBOARD);
        onDataChange?.(EMPTY_DASHBOARD);
      } finally {
        setIsDataLoading(false);
      }
    };

    loadDashboardData();
  }, [data, enableDatabase, databaseQueryParams, onDataChange, onDataLoadError]);

  // Auto-refresh data based on environment configuration
  useEffect(() => {
    if (!enableDatabase || data) return; // Skip if database disabled or data provided

    const refreshInterval = import.meta.env.VITE_DASHBOARD_REFRESH_INTERVAL;
    if (!refreshInterval) return;

    const interval = setInterval(async () => {
      try {
        const fetchedData = await fetchDashboardData(databaseQueryParams);
        setDashboardData(fetchedData);
        onDataChange?.(fetchedData);
      } catch (error) {
        console.error('Auto-refresh failed:', error);
      }
    }, parseInt(refreshInterval));

    return () => clearInterval(interval);
  }, [enableDatabase, databaseQueryParams, data, onDataChange]);

  // Apply theme variables to CSS custom properties
  useEffect(() => {
    if (!theme) return;
    
    const root = document.documentElement;
    const themeMapping = {
      primaryColor: '--dashboard-component-text-primary',
      backgroundColor: '--dashboard-component-bg-primary',
      panelBackground: '--dashboard-component-panel-bg',
      textColor: '--dashboard-component-text-primary',
      mutedTextColor: '--dashboard-component-text-muted',
      accentColor: '--dashboard-component-text-accent',
      successColor: '--dashboard-component-color-success',
      warningColor: '--dashboard-component-color-warning',
      dangerColor: '--dashboard-component-color-danger',
    };

    Object.entries(theme).forEach(([key, value]) => {
      if (value && themeMapping[key as keyof typeof themeMapping]) {
        root.style.setProperty(themeMapping[key as keyof typeof themeMapping], value as string);
      }
    });

    // Cleanup function to remove theme variables when component unmounts
    return () => {
      Object.values(themeMapping).forEach(cssVar => {
        root.style.removeProperty(cssVar);
      });
    };
  }, [theme]);

  const handleAnalyze = useCallback(async (insightId: InsightId) => {
    // Check if AI is disabled
    if (!enableAI || disabledFeatures.includes('ai') || disabledFeatures.includes(insightId)) {
      return;
    }

    // Allow parent to handle analysis if provided
    if (onAnalyze) {
      const fullDataSet = { ...dashboardData, ...dashboardData.outcomes };
      const dataForAnalysis = fullDataSet[insightId];
      onAnalyze(insightId, dataForAnalysis);
      return;
    }

    // Default AI analysis behavior
    setIsModalOpen(true);
    setIsAnalysisLoading(true);
    
    const fullDataSet = { ...dashboardData, ...dashboardData.outcomes };
    const dataForAnalysis = fullDataSet[insightId];

    setAnalysisData({ title: `${dataForAnalysis.title} - AI Analysis`, content: '' });

    try {
      const analysis = await fetchInsightAnalysis(dataForAnalysis, geminiApiKey);
      setAnalysisData(prev => prev ? { ...prev, content: analysis } : null);
    } catch (error) {
      console.error(`Failed to fetch analysis for ${insightId}:`, error);
      setAnalysisData(prev => prev ? { ...prev, content: 'Failed to generate the analysis.' } : null);
    } finally {
      setIsAnalysisLoading(false);
    }
  }, [dashboardData, enableAI, disabledFeatures, onAnalyze, geminiApiKey]);

  const closeModal = () => {
    setIsModalOpen(false);
    setAnalysisData(null);
  };

  // Determine if features should be shown
  const showAnalyzeButtons = enableAI && !disabledFeatures.includes('ai');

  // Show loading state
  if (isDataLoading) {
    return (
      <div
        className={`dashboard-module min-h-screen text-[var(--dashboard-component-text-primary)] font-[var(--dashboard-component-font-family)] p-4 sm:p-6 lg:p-8 ${className}`}
        style={style}
      >
        <div className="mx-auto max-w-[1920px] flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--dashboard-component-text-accent)] mx-auto mb-4"></div>
            <p className="text-lg">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`dashboard-module min-h-screen text-[var(--dashboard-component-text-primary)] font-[var(--dashboard-component-font-family)] p-4 sm:p-6 lg:p-8 ${className} bg-blue-500`}
      style={style}
    >
      {/* Show data load error if present */}
      {dataLoadError && (
        <div className="mx-auto max-w-[1920px] mb-4">
          <div className="bg-[var(--dashboard-component-color-danger)] bg-opacity-20 border border-[var(--dashboard-component-color-danger)] rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-[var(--dashboard-component-color-danger)]">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-[var(--dashboard-component-color-danger)]">
                  Data Loading Error
                </h3>
                <div className="mt-2 text-sm text-[var(--dashboard-component-text-muted)]">
                  <p>{dataLoadError}</p>
                  <p className="mt-1">Using fallback data. Check your database configuration.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1920px] space-y-8">
        
        {!disabledFeatures.includes('transformation-health') && (
          <TransformationHealth
            dimensions={dashboardData.dimensions}
            apiKey={geminiApiKey}
          />
        )}

        {!disabledFeatures.includes('strategic-insights') && (
          <StrategicInsights
            data={dashboardData}
            onAnalyze={handleAnalyze}
            isIntegrationMode={false}
            showAnalyzeButtons={showAnalyzeButtons}
          />
        )}

        {!disabledFeatures.includes('internal-outputs') && (
          <InternalOutputs
            dimensions={dashboardData.dimensions}
          />
        )}

        {!disabledFeatures.includes('sector-outcomes') && (
          <SectorOutcomes
            outcomes={dashboardData.outcomes}
            isIntegrationMode={false}
            showAnalyzeButtons={showAnalyzeButtons}
          />
        )}
      </div>

      {enableAI && (
        <GeminiAnalysisModal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={analysisData?.title ?? 'Analysis'}
          analysis={analysisData?.content ?? ''}
          isLoading={isAnalysisLoading}
        />
      )}
    </div>
  );
};

export default DashboardModule;
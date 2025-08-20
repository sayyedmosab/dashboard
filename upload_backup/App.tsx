import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DASHBOARD_DATA } from './constants';
import type { InsightId, AnalysisData, DashboardData } from './types';
import Header from './components/Header';
import TransformationHealth from './components/TransformationHealth';
import StrategicInsights from './components/StrategicInsights';
import InternalOutputs from './components/InternalOutputs';
import SectorOutcomes from './components/SectorOutcomes';
import GeminiAnalysisModal from './components/GeminiAnalysisModal';
import { fetchInsightAnalysis } from './api/gemini';
import { fetchDataForYear, transformRawDataToDashboardData } from './api/supabase';

const App: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>(DASHBOARD_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [isDataFetching, setIsDataFetching] = useState(false);

  // Determine mode based on URL query parameter
  const isIntegrationMode = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('integration') === 'true';
  }, []);

  // Set up listener for postMessage API in integration mode
  useEffect(() => {
    if (!isIntegrationMode) return;

    const handleMessage = (event: MessageEvent) => {
      // --- SECURITY: Always validate the origin of the message in a real application ---
      // if (event.origin !== 'https://your-trusted-parent-app.com') {
      //   console.warn('Message from untrusted origin ignored:', event.origin);
      //   return;
      // }

      if (event.data && event.data.type === 'UPDATE_COMPONENT_DATA') {
        console.log('Received new data from parent:', event.data.payload);
        // Add validation here to ensure payload matches DashboardData type
        setDashboardData(event.data.payload);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isIntegrationMode]);

  const handleFetchData = useCallback(async (year: number) => {
    setIsDataFetching(true);
    try {
      const rawData = await fetchDataForYear(year);
      const transformedData = transformRawDataToDashboardData(rawData);
      setDashboardData(transformedData);
    } catch (error) {
      console.error(`Failed to fetch data for year ${year}:`, error);
      // You could add a user-facing error message here (e.g., a toast notification)
    } finally {
      setIsDataFetching(false);
    }
  }, []);

  useEffect(() => {
    if (!isIntegrationMode) {
      // Fetch data for the default year when the component mounts
      const defaultYear = 2025;
      handleFetchData(defaultYear);
    }
  }, [isIntegrationMode, handleFetchData]);


  const handleAnalyze = useCallback(async (insightId: InsightId) => {
    setIsModalOpen(true);
    setIsAnalysisLoading(true);
    
    const fullDataSet = { ...dashboardData, ...dashboardData.outcomes };
    const dataForAnalysis = fullDataSet[insightId];

    setAnalysisData({ title: `${dataForAnalysis.title} - AI Analysis`, content: '' });

    try {
      const analysis = await fetchInsightAnalysis(dataForAnalysis);
      setAnalysisData(prev => prev ? { ...prev, content: analysis } : null);
    } catch (error) {
      console.error(`Failed to fetch analysis for ${insightId}:`, error);
      setAnalysisData(prev => prev ? { ...prev, content: 'Failed to generate the analysis.' } : null);
    } finally {
      setIsAnalysisLoading(false);
    }
  }, [dashboardData]);

  const closeModal = () => {
    setIsModalOpen(false);
    setAnalysisData(null);
  };

  return (
    <main className="min-h-screen text-[var(--component-text-primary)] font-[var(--component-font-family)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1920px] space-y-8">
        
        <Header 
          onFetch={handleFetchData}
          isFetching={isDataFetching}
          isIntegrationMode={isIntegrationMode}
        />

        <TransformationHealth 
          dimensions={dashboardData.dimensions}
        />

        <StrategicInsights 
          data={dashboardData} 
          onAnalyze={handleAnalyze} 
          isIntegrationMode={isIntegrationMode}
        />

        <InternalOutputs 
          dimensions={dashboardData.dimensions}
        />

        <SectorOutcomes 
          outcomes={dashboardData.outcomes}
          onAnalyze={handleAnalyze} 
          isIntegrationMode={isIntegrationMode}
        />
      </div>

      <GeminiAnalysisModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={analysisData?.title ?? 'Analysis'}
        analysis={analysisData?.content ?? ''}
        isLoading={isAnalysisLoading}
      />
    </main>
  );
};

export default App;
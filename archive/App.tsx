import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DASHBOARD_DATA } from './constants';
import type { InsightId, AnalysisData, DashboardData } from './types';
import SimpleHeader from './components/SimpleHeader';
import Footer from './components/Footer';
import TransformationHealth from './components/TransformationHealth';
import StrategicInsights from './components/StrategicInsights';
import InternalOutputs from './components/InternalOutputs';
import SectorOutcomes from './components/SectorOutcomes';
import GeminiAnalysisModal from './components/GeminiAnalysisModal';
import { fetchInsightAnalysis } from './api/gemini';
import { fetchDashboardData } from './api/database';
import './styles/navbar.css';
import './styles/dashboard.css';

const App: React.FC = () => {
  // Start with empty dashboard data - no mock data pollution
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    dimensions: [],
    insight1: { title: '', subtitle: '', initiatives: [] },
    insight2: { title: '', subtitle: '', labels: [], delivery: { actual: [], target: [], baseline: [] }, adoption: { actual: [], target: [], baseline: [] } },
    insight3: { title: '', subtitle: '', labels: [], internalEfficiency: { actual: [], target: 0, baseline: 0 }, externalValue: { actual: [], target: 0, baseline: 0 } },
    outcomes: {
      outcome1: { title: '', macro: { labels: [], fdi: { actual: [], target: [], baseline: [] }, trade: { actual: [], target: [], baseline: [] }, jobs: { actual: [], target: [], baseline: [] } } },
      outcome2: { title: '', partnerships: { actual: 0, target: 0, baseline: 0 } },
      outcome3: { title: '', qol: { labels: [], coverage: { actual: [], target: [], baseline: [] }, quality: { actual: [], target: [], baseline: [] } } },
      outcome4: { title: '', community: { actual: 0, target: 0, baseline: 0 } }
    }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [currentAnalysisId, setCurrentAnalysisId] = useState<InsightId | null>(null);
  const [isDataFetching, setIsDataFetching] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [hasDataLoaded, setHasDataLoaded] = useState(false);

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

  const handleFetchData = useCallback(async (year: number, quarter: string = 'Q1') => {
    console.log('🔄 Starting data fetch for year:', year, 'quarter:', quarter);
    setIsDataFetching(true);
    setDataError(null);
    
    try {
      console.log('📅 Fetching data with params:', {
        year: year,
        quarter: quarter
      });
      
      const dashboardData = await fetchDashboardData(year, quarter);
      
      console.log('✅ Successfully fetched dashboard data:', dashboardData);
      console.log('🔍 Dashboard data structure:', {
        dimensionsCount: dashboardData.dimensions?.length,
        firstDimension: dashboardData.dimensions?.[0],
        hasInsight1: !!dashboardData.insight1,
        hasOutcomes: !!dashboardData.outcomes
      });
      setDashboardData(dashboardData);
      setHasDataLoaded(true);
      setDataError(null);
    } catch (error) {
      console.error('❌ Failed to fetch data for year', year);
      console.error('Full error object:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      let errorMessage = 'Failed to load dashboard data. ';
      let debugInfo = '';
      
      if (error instanceof Error) {
        debugInfo = `\n\nDebug Info:\n- Error Type: ${error.constructor.name}\n- Error Message: ${error.message}`;
        
        if (error.message.includes('Supabase configuration missing')) {
          errorMessage += 'Please check your Supabase configuration in .env.local file.';
          debugInfo += '\n- Issue: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY';
        } else if (error.message.includes('Database query failed')) {
          errorMessage += 'The database service is currently unavailable. Please try again later.';
          debugInfo += '\n- Issue: HTTP error from Supabase Edge Function';
        } else if (error.message.includes('Invalid dashboard data structure')) {
          errorMessage += 'The data format from the database is invalid. Please contact support.';
          debugInfo += '\n- Issue: Edge Function returned unexpected data format';
        } else if (error.message.includes('fetch') || error.name === 'TypeError') {
          errorMessage += 'Network connection failed. Please check your internet connection.';
          debugInfo += '\n- Issue: Network/fetch error (possibly CORS or network connectivity)';
        } else {
          errorMessage += `Error: ${error.message}`;
          debugInfo += '\n- Issue: Unknown error type';
        }
      } else {
        debugInfo = `\n\nDebug Info:\n- Error Type: ${typeof error}\n- Error Value: ${JSON.stringify(error)}`;
      }
      
      console.log('🔍 Processed error message:', errorMessage + debugInfo);
      setDataError(errorMessage + debugInfo);
      setHasDataLoaded(false);
    } finally {
      setIsDataFetching(false);
    }
  }, []);

  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedQuarter, setSelectedQuarter] = useState<string>('Q1');
  
  useEffect(() => {
    // Remove automatic data fetching - only manual fetch via button
    // if (!isIntegrationMode) {
    //   handleFetchData(selectedYear, selectedQuarter);
    // }
  }, [isIntegrationMode, selectedYear, selectedQuarter, handleFetchData]);


  const handleAnalyze = useCallback(async (insightId: InsightId) => {
    setIsModalOpen(true);
    setIsAnalysisLoading(true);
    setCurrentAnalysisId(insightId);
    
    const fullDataSet = { ...dashboardData, ...dashboardData.outcomes };
    const dataForAnalysis = fullDataSet[insightId];

    setAnalysisData({ title: `${dataForAnalysis.title} - AI Analysis`, content: '' });

    try {
      const analysis = await fetchInsightAnalysis(dataForAnalysis);
      setAnalysisData(prev => prev ? { ...prev, content: analysis } : null);
    } catch (error) {
      console.error(`Failed to fetch analysis for ${insightId}:`, error);
      let errorMessage = 'Failed to generate the analysis.';
      if (error instanceof Error) {
        // Add more specific error message based on the error type
        if (error.message.includes('API_KEY')) {
          errorMessage += ' Please check that your API key is configured correctly in the .env.local file.';
        } else {
          errorMessage += ` Error: ${error.message}`;
        }
      }
      setAnalysisData(prev => prev ? { ...prev, content: errorMessage } : null);
    } finally {
      setIsAnalysisLoading(false);
      setCurrentAnalysisId(null);
    }
  }, [dashboardData]);

  const closeModal = () => {
    setIsModalOpen(false);
    setAnalysisData(null);
    setCurrentAnalysisId(null);
  };

  console.log('🎯 App rendering with dashboard data:', {
    dimensionsCount: dashboardData.dimensions?.length,
    firstDimensionId: dashboardData.dimensions?.[0]?.id,
    firstDimensionKpi: dashboardData.dimensions?.[0]?.kpi,
    firstDimensionTrend: dashboardData.dimensions?.[0]?.trend,
    isDataFetching,
    hasDataLoaded,
    dataError
  });

  return (
    <div className="flex flex-col min-h-screen">
      <SimpleHeader 
        logoSrc="/images/josoorlogo.png" 
        logoAlt="Josoor" 
      />
      <main className="flex-grow text-[var(--component-text-primary)] font-[var(--component-font-family)] bg-[var(--component-bg-primary)] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[1920px] space-y-8">
            
            {!isIntegrationMode && (
              <div className="flex justify-end my-4">
                <div className="flex items-center gap-4 bg-[var(--component-panel-bg)] border border-[var(--component-panel-border)] p-2 rounded-lg shadow-md">
                  <select
                    id="year-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    disabled={isDataFetching}
                    className="appearance-none bg-transparent text-[var(--component-text-primary)] py-2 pl-3 pr-8 rounded-md focus:outline-none"
                    aria-label="Select year for dashboard data"
                  >
                    {[2025, 2026, 2027, 2028, 2029].map(year => (
                      <option key={year} value={year} style={{ backgroundColor: 'var(--component-panel-bg)' }}>{year}</option>
                    ))}
                  </select>
                  <select
                    id="quarter-select"
                    value={selectedQuarter}
                    onChange={(e) => setSelectedQuarter(e.target.value)}
                    disabled={isDataFetching}
                    className="appearance-none bg-transparent text-[var(--component-text-primary)] py-2 pl-3 pr-8 rounded-md focus:outline-none"
                    aria-label="Select quarter for dashboard data"
                  >
                    {['Q1', 'Q2', 'Q3', 'Q4'].map(quarter => (
                      <option key={quarter} value={quarter} style={{ backgroundColor: 'var(--component-panel-bg)' }}>{quarter}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => handleFetchData(selectedYear, selectedQuarter)} 
                    disabled={isDataFetching} 
                    className="px-4 py-2 bg-[#00122d] text-white rounded-md hover:bg-opacity-80"
                  >
                    {isDataFetching ? 'Loading...' : 'Refresh Data'}
                  </button>
                </div>
              </div>
            )}

          {/* Error Display */}
          {dataError && (
            <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Dashboard Data Error
                  </h3>
                  <p className="mt-1 text-sm text-red-700">
                    {dataError}
                  </p>
                  <div className="mt-4">
                    <button
                      onClick={() => handleFetchData(selectedYear, selectedQuarter)}
                      disabled={isDataFetching}
                      className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                    >
                      {isDataFetching ? 'Retrying...' : 'Retry'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isDataFetching && !dataError && (
            <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Loading dashboard data from database...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard Components - only show if no error */}
          {!dataError && (
            <>
              <TransformationHealth 
                dimensions={dashboardData.dimensions}
                apiKey={import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY}
              />

              <StrategicInsights 
                data={dashboardData} 
                onAnalyze={handleAnalyze} 
                isIntegrationMode={isIntegrationMode}
                isAnalyzing={currentAnalysisId}
              />

              <InternalOutputs 
                dimensions={dashboardData.dimensions}
              />

              <SectorOutcomes 
                outcomes={dashboardData.outcomes}
                isIntegrationMode={isIntegrationMode}
              />
            </>
          )}
        </div>

        <GeminiAnalysisModal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={analysisData?.title ?? 'Analysis'}
          analysis={analysisData?.content ?? ''}
          isLoading={isAnalysisLoading}
        />
      </main>
      <Footer />
    </div>
  );
};

export default App;
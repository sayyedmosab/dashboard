import type { DashboardData } from '../types';

// Database configuration
const getSupabaseConfig = () => ({
  url: import.meta.env.VITE_SUPABASE_URexport async function fetchDashboardData(year: number = 2025, quarter: string = 'Q1'): Promise<DashboardData> {
  console.log('🚀 === STARTING fetchDashboardData ===');
  console.log('📥 Input params:', { year, quarter });
  
  try {
    // Call the edge function using direct fetch - only send year as that's all it expects
    console.log('🌐 Calling edge function getDashboardData...');
    const { data: edgeFunctionData, error } = await callEdgeFunction('getDashboardData', {
      year: year
    });

    console.log('📡 Edge function response received:');
    console.log('- Error:', error);
    console.log('- Data keys:', edgeFunctionData ? Object.keys(edgeFunctionData) : 'null');
    console.log('- Full edge function data:', JSON.stringify(edgeFunctionData, null, 2));ort.meta.env.VITE_SUPABASE_ANON_KEY,
});

// Simulate Supabase edge function call using fetch
const callEdgeFunction = async (functionName: string, body: any) => {
  const config = getSupabaseConfig();
  
  if (!config.url || !config.anonKey) {
    throw new Error('Supabase configuration missing. Please check your .env.local file.');
  }
  
  const url = `${config.url}/functions/v1/${functionName}`;
  
  console.log('🌐 Making fetch request to:', url);
  console.log('📤 Request body:', body);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.anonKey}`,
    },
    body: JSON.stringify(body),
  });
  
  console.log('📡 Response status:', response.status);
  console.log('📡 Response headers:', [...response.headers.entries()]);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Edge function error response:', errorText);
    throw new Error(`Edge function failed: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log('📥 Response data:', data);
  
  return { data, error: null };
};

// Database query parameters interface
export interface DashboardQueryParams {
  orgId?: string;
  timePeriod?: 'monthly' | 'quarterly' | 'yearly';
  quarter?: string;
  startDate?: string;
  endDate?: string;
  refreshCache?: boolean;
}

// Edge function endpoints
const EDGE_FUNCTIONS = {
  transformationHealth: '/edge/dashboard/transformation-health',
  strategicInsights: '/edge/dashboard/strategic-insights',
  internalOutputs: '/edge/dashboard/internal-outputs',
  sectorOutcomes: '/edge/dashboard/sector-outcomes',
  fullDashboard: '/edge/dashboard/full-data',
  // New unified endpoint for dashboard data
  getDashboardData: '/getDashboardData',
};

/**
 * Transform Edge Function response to DashboardData format
 * Edge Function returns: { data: [{ quarter, dimensions: [...] }], insights: {...}, metadata: {...} }
 * Dashboard expects: { dimensions: [...], insight1: {...}, insight2: {...}, insight3: {...}, outcomes: {...} }
 */
function transformEdgeFunctionResponse(edgeFunctionData: any): DashboardData {
  console.log('🔄 Starting data transformation...');
  
  try {
    const quarterData = edgeFunctionData.data[0];
    const dimensions = quarterData.dimensions;
    
    console.log('📊 Raw dimensions data:', {
      dimensionsCount: dimensions?.length,
      firstDimension: dimensions?.[0]
    });
    
    // Use REAL insights from edge function if available, otherwise empty
    const insight1 = edgeFunctionData.insights?.insight1 || {
      title: "No Investment Portfolio Data",
      subtitle: "Data not available from edge function",
      initiatives: []
    };
    
    const insight2 = edgeFunctionData.insights?.insight2 || {
      title: "No Delivery Data",
      subtitle: "Data not available from edge function", 
      labels: [],
      delivery: { actual: [], target: [], baseline: [] },
      adoption: { actual: [], target: [], baseline: [] }
    };
    
    const insight3 = edgeFunctionData.insights?.insight3 || {
      title: "No Impact Data",
      subtitle: "Data not available from edge function",
      labels: [],
      internalEfficiency: { actual: [], target: 0, baseline: 0 },
      externalValue: { actual: [], target: 0, baseline: 0 }
    };
    
    // Use REAL outcomes from edge function if available, otherwise empty
    const outcomes = edgeFunctionData.outcomes || {
      outcome1: { title: "No Economic Data", macro: { labels: [], fdi: { actual: [], target: [], baseline: [] }, trade: { actual: [], target: [], baseline: [] }, jobs: { actual: [], target: [], baseline: [] } } },
      outcome2: { title: "No Partnership Data", partnerships: { actual: 0, target: 0, baseline: 0 } },
      outcome3: { title: "No Quality of Life Data", qol: { labels: [], coverage: { actual: [], target: [], baseline: [] }, quality: { actual: [], target: [], baseline: [] } } },
      outcome4: { title: "No Community Data", community: { actual: 0, target: 0, baseline: 0 } }
    };
  
    // Transform dimensions using the edge function structure
    const transformedDimensions = dimensions.slice(0, 8).map((dim: any) => ({
      ...dim,
      // Edge function maps: kpi_actual -> trend.actual, kpi_planned -> trend.target
      kpi_actual: dim.trend?.actual || 0,
      kpi_planned: dim.trend?.target || 0,
      kpi_base_value: dim.trend?.baseline || 60,
      kpi_next_target: dim.trend?.bands?.[0] || 90,
      kpi_final_target: dim.trend?.bands?.[1] || 95,
      kpi_description: dim.label || 'Performance metric',
      // Health comes directly from edge function as calculated health_score
      health: dim.health || 0,
      health_state: dim.health_state || 'At Risk',
      trend_direction: dim.trend_direction || 'Steady',
      projections: dim.projections || [dim.health + 2, dim.health + 4, dim.health + 6, dim.health + 8]
    }));
  
    return {
      dimensions: transformedDimensions,
      insight1,
      insight2,
      insight3,
      outcomes
    };
  } catch (error) {
    console.error('❌ Error in data transformation:', error);
    console.error('Raw edge function data:', edgeFunctionData);
    throw new Error(`Data transformation failed: ${error.message}`);
  }
}

/**
 * Fetch dashboard data from Supabase edge functions
 */
export async function fetchDashboardData(year: number = 2025, quarter: string = 'Q1'): Promise<DashboardData> {
  console.log('� === STARTING fetchDashboardData ===');
  console.log('� Input params:', { year, quarter });
  
  try {
    // Call the edge function using direct fetch
    console.log('🌐 Calling edge function getDashboardData...');
    console.log('🔗 Request URL:', `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/getDashboardData`);
    console.log('📤 Request payload:', { year, quarter });
    
    const { data: edgeFunctionData, error } = await callEdgeFunction('getDashboardData', {
      year: year,
      quarter: quarter
    });

    console.log('📡 Edge function response received:');
    console.log('- Error:', error);
    console.log('- Data keys:', edgeFunctionData ? Object.keys(edgeFunctionData) : 'null');
    
    // DETAILED DEBUG: Check dimensions structure
    if (edgeFunctionData?.data?.[0]?.dimensions) {
      console.log('📊 === EDGE FUNCTION DIMENSIONS DEBUG ===');
      console.log('- Dimensions count:', edgeFunctionData.data[0].dimensions.length);
      console.log('- First dimension raw:', edgeFunctionData.data[0].dimensions[0]);
      console.log('- All dimension titles with health:', 
        edgeFunctionData.data[0].dimensions.map((d: any) => `${d.title}: health=${d.health}`)
      );
      
      // Check specifically for Strategic Plan
      const strategicPlan = edgeFunctionData.data[0].dimensions.find((d: any) => 
        d.title?.includes('Strategic Plan') || d.id === 'strategicPlan'
      );
      if (strategicPlan) {
        console.log('🎯 FOUND Strategic Plan dimension:', strategicPlan);
      } else {
        console.log('⚠️ NO Strategic Plan dimension found in edge function data');
      }
    } else {
      console.log('❌ No dimensions found in edge function response structure');
    }

    if (error) {
      console.error('❌ Edge function error:', error);
      throw new Error(`Database query failed: ${error.message}`);
    }

    if (!edgeFunctionData) {
      console.error('❌ No data returned from edge function');
      throw new Error('No data returned from database');
    }

    // Transform the data
    console.log('🔄 Starting data transformation...');
    const transformedData = transformEdgeFunctionResponse(edgeFunctionData);
    
    console.log('✅ Transformation complete. Final data structure:');
    console.log('- Dimensions count:', transformedData.dimensions?.length);
    console.log('- First dimension:', transformedData.dimensions?.[0]);
    console.log('🚀 === END fetchDashboardData ===');
    
    return transformedData;
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
    throw new Error(errorMessage + debugInfo);
  }
};

/**
 * Fetch specific dashboard section data
 */
export const fetchDashboardSection = async (
  section: keyof typeof EDGE_FUNCTIONS,
  params: DashboardQueryParams = {}
): Promise<any> => {
  const config = getSupabaseConfig();
  
  if (!config.url || !config.anonKey) {
    throw new Error('Supabase configuration missing');
  }

  const queryParams = {
    orgId: params.orgId || import.meta.env.VITE_DASHBOARD_DEFAULT_ORG_ID || 'default',
    timePeriod: params.timePeriod || import.meta.env.VITE_DASHBOARD_DEFAULT_TIME_PERIOD || 'quarterly',
    ...params,
  };

  try {
    const response = await fetch(`${config.url}/functions/v1${EDGE_FUNCTIONS[section]}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.anonKey}`,
        'Content-Type': 'application/json',
        'apikey': config.anonKey,
      },
      body: JSON.stringify(queryParams),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${section} data: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${section} data:`, error);
    throw error;
  }
};

/**
 * Update dashboard data in database
 */
export const updateDashboardData = async (
  data: Partial<DashboardData>,
  params: DashboardQueryParams = {}
): Promise<void> => {
  const config = getSupabaseConfig();
  
  if (!config.url || !config.anonKey) {
    throw new Error('Supabase configuration missing');
  }

  try {
    const response = await fetch(`${config.url}/functions/v1/edge/dashboard/update`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${config.anonKey}`,
        'Content-Type': 'application/json',
        'apikey': config.anonKey,
      },
      body: JSON.stringify({
        data,
        orgId: params.orgId || import.meta.env.VITE_DASHBOARD_DEFAULT_ORG_ID || 'default',
        timePeriod: params.timePeriod || import.meta.env.VITE_DASHBOARD_DEFAULT_TIME_PERIOD || 'quarterly',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update dashboard data: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to update dashboard data:', error);
    throw error;
  }
};

/**
 * Test database connection
 */
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    const config = getSupabaseConfig();
    
    if (!config.url || !config.anonKey) {
      return false;
    }

    const response = await fetch(`${config.url}/functions/v1/edge/dashboard/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.anonKey}`,
        'apikey': config.anonKey,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
};
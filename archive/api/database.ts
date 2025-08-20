import type { DashboardData } from '../types';
const getSupabaseConfig = () => ({
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
});

// Call edge function using direct fetch
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
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Edge function error response:', errorText);
    throw new Error(`Edge function failed: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log('📥 Response data received');
  
  return { data, error: null };
};

// Transform Edge Function response to DashboardData format
function transformEdgeFunctionResponse(edgeFunctionData: any): DashboardData {
  console.log('🔄 TRANSFORMATION - Raw data structure:', edgeFunctionData);
  
  try {
    // BUG FIX: Don't hardcode [0] - find the correct quarter data
    console.log('Available data entries:', edgeFunctionData.data);
    
    // Just take whatever data is available for now to see what we get
    const quarterData = edgeFunctionData.data[0];
    console.log('Using quarter data:', quarterData);
    
    const dimensions = quarterData.dimensions;
    
    console.log('📊 Raw dimensions data:', {
      quarter: quarterData.quarter,
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
  
    console.log('✅ Transformation complete:', {
      dimensionsCount: transformedDimensions.length,
      firstDimension: transformedDimensions[0]
    });
  
    try {
      // TRACE: Find the correct quarter's data based on requested year/quarter
      // Assume edgeFunctionData.data is an array of { quarter, dimensions }
      const { requestedYear, requestedQuarter } = edgeFunctionData;
      console.log('TRACE: Requested year/quarter:', { requestedYear, requestedQuarter });
      console.log('TRACE: All data entries:', edgeFunctionData.data?.map((d: any) => d.quarter));

      // Find the correct quarter's data
      let quarterData = null;
      if (Array.isArray(edgeFunctionData.data)) {
        quarterData = edgeFunctionData.data.find((d: any) => {
          // Accept both string and number for year
          if (requestedQuarter && d.quarter === requestedQuarter && d.year == requestedYear) return true;
          // Fallback: match just quarter if year not present
          if (!d.year && d.quarter === requestedQuarter) return true;
          return false;
        });
        if (!quarterData) {
          console.warn('WARN: No matching quarter found, using first available.');
          quarterData = edgeFunctionData.data[0];
        }
      }
      if (!quarterData) throw new Error('No valid quarter data found in edge function response');

      console.log('TRACE: Using quarter data:', quarterData);
      const dimensions = quarterData.dimensions;
      console.log('TRACE: Raw dimensions data:', {
        quarter: quarterData.quarter,
        year: quarterData.year,
        dimensionsCount: dimensions?.length,
        firstDimension: dimensions?.[0]
      });
/**
 * Fetch dashboard data from your separate Supabase server
 * ONLY sends year and quarter as you specified
 */
export async function fetchDashboardData(year: number = 2025, quarter: string = 'Q1'): Promise<DashboardData> {
  console.log('STEP 1: fetchDashboardData called with:', { year, quarter });
  
  try {
    const { data: edgeFunctionData, error } = await callEdgeFunction('getDashboardData', {
      year: year,
      quarter: quarter
    });

    console.log('STEP 2: Edge function returned:', edgeFunctionData);
    
    if (error) throw new Error(`Database query failed: ${error.message}`);
    if (!edgeFunctionData) throw new Error('No data returned from database');

    const transformedData = transformEdgeFunctionResponse(edgeFunctionData);
    
    console.log('STEP 3: Final transformed data:', transformedData);
    
    return transformedData;
  } catch (error) {
    console.error('❌ Failed to fetch data:', error);
    throw new Error(`Failed to load dashboard data: ${error.message}`);
  }
}

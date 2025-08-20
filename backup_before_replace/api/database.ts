import type { DashboardData } from '../types';

// Database configuration
const getSupabaseConfig = () => ({
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
});

// Database query parameters interface
export interface DashboardQueryParams {
  orgId?: string;
  timePeriod?: 'monthly' | 'quarterly' | 'yearly';
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
};

/**
 * Fetch dashboard data from Supabase edge functions
 */
export const fetchDashboardData = async (
  params: DashboardQueryParams = {}
): Promise<DashboardData> => {
  const config = getSupabaseConfig();
  
  if (!config.url || !config.anonKey) {
    throw new Error('Supabase configuration missing. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  }

  // Set default parameters from environment or use fallbacks
  const queryParams = {
    orgId: params.orgId || import.meta.env.VITE_DASHBOARD_DEFAULT_ORG_ID || 'default',
    timePeriod: params.timePeriod || import.meta.env.VITE_DASHBOARD_DEFAULT_TIME_PERIOD || 'quarterly',
    startDate: params.startDate,
    endDate: params.endDate,
    refreshCache: params.refreshCache || false,
  };

  try {
    const response = await fetch(`${config.url}/functions/v1${EDGE_FUNCTIONS.fullDashboard}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.anonKey}`,
        'Content-Type': 'application/json',
        'apikey': config.anonKey,
      },
      body: JSON.stringify(queryParams),
    });

    if (!response.ok) {
      throw new Error(`Database query failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Validate that the response matches our DashboardData interface
    if (!data.dimensions || !data.insight1 || !data.insight2 || !data.insight3 || !data.outcomes) {
      throw new Error('Invalid dashboard data structure received from database');
    }

    return data as DashboardData;
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    throw error;
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
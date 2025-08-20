// supabase/functions/getDashboardData/index.ts
// This is a mock implementation for testing purposes

// Import Supabase Edge Function dependencies
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// For local testing, we'll use a basic approach
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Import mock data from files
import MOCK_DATA_2025 from "../../mock_dashboard_data_2025.json" assert { type: "json" };
import MOCK_DATA_2026 from "../../mock_dashboard_data_2026.json" assert { type: "json" };
import MOCK_DATA_2027 from "../../mock_dashboard_data_2027.json" assert { type: "json" };
import MOCK_DATA_2028 from "../../mock_dashboard_data_2028.json" assert { type: "json" };
import MOCK_DATA_2029 from "../../mock_dashboard_data_2029.json" assert { type: "json" };

// Map of available mock data by year
const MOCK_DATA_BY_YEAR = {
  "2025": MOCK_DATA_2025,
  "2026": MOCK_DATA_2026,
  "2027": MOCK_DATA_2027,
  "2028": MOCK_DATA_2028,
  "2029": MOCK_DATA_2029,
};

// Fallback mock data for testing
const MOCK_DASHBOARD_DATA = {
  dimensions: [
    {
      id: "dim1",
      title: "Operational Efficiency",
      health: 85,
      kpi: "93%",
      label: "Utilization",
      trend: {
        baseline: 75,
        actual: 93,
        target: 95,
        bands: [70, 90]
      }
    },
    {
      id: "dim2",
      title: "Financial Health",
      health: 72,
      kpi: "$2.4M",
      label: "Revenue",
      trend: {
        baseline: 1800000,
        actual: 2400000,
        target: 3000000,
        bands: [2000000, 2500000]
      }
    }
  ],
  insight1: {
    title: "Strategic Initiative Portfolio",
    subtitle: "Budget vs. Risk vs. Strategic Alignment",
    initiatives: [
      { name: "Digital Transformation", budget: 1200000, risk: 65, alignment: 85 },
      { name: "Market Expansion", budget: 800000, risk: 45, alignment: 90 },
      { name: "Cost Optimization", budget: 400000, risk: 25, alignment: 60 }
    ]
  },
  insight2: {
    title: "Program Delivery Metrics",
    subtitle: "Delivery vs. Adoption Over Time",
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    delivery: {
      actual: [65, 70, 75, 80, 85, 87],
      target: [70, 75, 80, 85, 90, 95],
      baseline: [60, 60, 60, 60, 60, 60]
    },
    adoption: {
      actual: [40, 45, 55, 65, 75, 80],
      target: [50, 60, 70, 80, 85, 90],
      baseline: [30, 30, 30, 30, 30, 30]
    }
  },
  insight3: {
    title: "Value Realization",
    subtitle: "Internal Efficiency vs. External Value",
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    internalEfficiency: {
      actual: [60, 65, 70, 75, 80, 85],
      target: 90,
      baseline: 50
    },
    externalValue: {
      actual: [40, 50, 60, 70, 80, 85],
      target: 90,
      baseline: 30
    }
  },
  outcomes: {
    outcome1: {
      title: "Economic Impact",
      macro: {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        fdi: {
          actual: [10, 15, 18, 22],
          target: [12, 16, 20, 25],
          baseline: [8, 8, 8, 8]
        },
        trade: {
          actual: [100, 110, 120, 135],
          target: [105, 115, 130, 140],
          baseline: [95, 95, 95, 95]
        },
        jobs: {
          actual: [1000, 1200, 1350, 1500],
          target: [1100, 1300, 1400, 1600],
          baseline: [900, 900, 900, 900]
        }
      }
    },
    outcome2: {
      title: "Partnership Growth",
      partnerships: {
        actual: 28,
        target: 30,
        baseline: 15
      }
    },
    outcome3: {
      title: "Service Quality",
      qol: {
        labels: ["2022", "2023", "2024", "2025"],
        coverage: {
          actual: [65, 75, 82, 88],
          target: [70, 80, 85, 90],
          baseline: [60, 60, 60, 60]
        },
        quality: {
          actual: [3.2, 3.5, 3.8, 4.1],
          target: [3.5, 3.8, 4.0, 4.3],
          baseline: [3.0, 3.0, 3.0, 3.0]
        }
      }
    },
    outcome4: {
      title: "Community Engagement",
      community: {
        actual: 85,
        target: 90,
        baseline: 60
      }
    }
  }
};

// This function will be executed when the edge function is invoked
export default async function handler(req) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request parameters with better error handling
    let params: any = {};
    
    try {
      const body = await req.text();
      console.log('Raw request body:', body);
      
      if (body && body.trim()) {
        params = JSON.parse(body);
      }
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      
      // Return a more specific error
      return new Response(
        JSON.stringify({ 
          error: `Invalid JSON in request body: ${jsonError.message}`,
          details: 'Please check that the request body contains valid JSON'
        }),
        { 
          status: 400,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
    
    console.log('Parsed params:', params);
    
    // Get the requested year (default to 2025 if not specified)
    const year = params.year ? params.year.toString() : "2025";
    
    console.log(`Retrieving dashboard data for year: ${year}`);
    
    // Check if the requested year is available
    if (!["2025", "2026", "2027", "2028", "2029"].includes(year)) {
      throw new Error(`Invalid year parameter: ${year}. Must be between 2025-2029`);
    }
    
    // Add a slight delay to simulate database query time
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Return the mock data for the requested year
    const responseData = MOCK_DATA_BY_YEAR[year] || MOCK_DASHBOARD_DATA;
    
    return new Response(
      JSON.stringify(responseData),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
    
  } catch (error) {
    console.error('Error processing request:', error.message);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
}

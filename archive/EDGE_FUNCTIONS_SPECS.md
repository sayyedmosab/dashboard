# Edge Functions Specifications

## Overview

This document outlines the specifications for Edge Functions required by the dashboard application. Edge Functions are serverless functions that run at the edge of the network, closer to users, providing better performance for data operations.

## Function Definitions

### 1. `getDashboardData`

```typescript
// Function signature
export async function getDashboardData(params: DashboardQueryParams): Promise<DashboardData>

// Input parameters
interface DashboardQueryParams {
  orgId?: string;             // Optional organization ID filter
  teamId?: string;            // Optional team ID filter
  projectId?: string;         // Optional project ID filter
  fromDate?: string;          // Optional start date filter (YYYY-MM-DD)
  toDate?: string;            // Optional end date filter (YYYY-MM-DD)
  customFilters?: Record<string, any>; // Optional custom filters
}

// Response structure matches the DashboardData interface from types.ts
```

**Purpose**: Retrieves all dashboard data in a single request to minimize client-side data fetching.

- Include proper error handling with descriptive error messages

### 2. `getDimensionData`

```typescript
// Function signature
export async function getDimensionData(dimensionId: string, params: DimensionQueryParams): Promise<Dimension>

// Input parameters
interface DimensionQueryParams {
  orgId?: string;
  teamId?: string;
  projectId?: string;
  fromDate?: string;
  toDate?: string;
}

// Response structure matches the Dimension interface from types.ts
```

**Purpose**: Retrieves data for a specific dimension for more detailed analysis.

### 3. `getInsightAnalysis`

```typescript
// Function signature
export async function getInsightAnalysis(insightId: InsightId, data: any): Promise<AnalysisData>

// Input parameters
// insightId: 'insight1' | 'insight2' | 'insight3' | 'outcome1' | 'outcome2' | 'outcome3' | 'outcome4'
// data: The data object for the specific insight

// Response structure
interface AnalysisData {
  title: string;
  content: string; // Markdown formatted analysis
}
```

**Purpose**: Generates AI-powered analysis of a specific insight.

**Implementation Notes**:
- Connect to AI provider (e.g., Gemini API)
- Include rate limiting to prevent abuse
- Cache results when possible

### 4. `saveCustomDashboard`

```typescript
// Function signature
export async function saveCustomDashboard(dashboard: CustomDashboard): Promise<{ id: string }>

// Input parameters
interface CustomDashboard {
  id?: string;            // Optional, for updates
  name: string;
  ownerId: string;
  config: {
    layout: LayoutConfig[];
    filters: FilterConfig[];
    theme?: ThemeConfig;
  }
  isPublic: boolean;
}

interface LayoutConfig {
  id: string;
  component: string;
  position: { x: number, y: number, w: number, h: number };
  config?: Record<string, any>;
}

interface FilterConfig {
  id: string;
  field: string;
  operator: 'eq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'between';
  value: any;
}

interface ThemeConfig {
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}
```

**Purpose**: Saves or updates a custom dashboard configuration.
**Implementation Notes**:
- Implement proper authentication and authorization
- Validate input data
- Return a unique ID for new dashboards

## Database Schema Integration

The Edge Functions should interact with the following database schema:

```sql
-- Core tables
CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE teams (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY,
  team_id UUID REFERENCES teams(id),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dashboard data tables
CREATE TABLE dimensions (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  title TEXT NOT NULL,
  health NUMERIC NOT NULL,
  kpi TEXT NOT NULL,
  label TEXT NOT NULL,
  baseline NUMERIC NOT NULL,
  actual NUMERIC NOT NULL,
  target NUMERIC NOT NULL,
  threshold_satisfactory NUMERIC NOT NULL,
  threshold_good NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE strategic_initiatives (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  name TEXT NOT NULL,
  budget NUMERIC NOT NULL,
  risk NUMERIC NOT NULL,
  alignment NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE outcome_metrics (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  outcome_type TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  actual NUMERIC[] NOT NULL,
  target NUMERIC[] NOT NULL,
  baseline NUMERIC[] NOT NULL,
  labels TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE custom_dashboards (
  id UUID PRIMARY KEY,
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  config JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Deployment Notes

Deploy these Edge Functions using Supabase Edge Functions for optimal integration with the database:

1. Install Supabase CLI: `npm install -g supabase`
2. Initialize Edge Functions: `supabase functions new getDashboardData`
3. Deploy: `supabase functions deploy getDashboardData`
4. Configure CORS: `supabase functions config set --cors="*"`

## Example Implementation

```typescript
// supabase/functions/getDashboardData/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    // Parse request parameters
    const params = await req.json();
    const { orgId, teamId, projectId, fromDate, toDate } = params;
    
    // Build base query
    let projectsQuery = supabaseClient.from('projects').select('id');
    
    // Apply filters
    if (orgId) {
      projectsQuery = projectsQuery.eq('org_id', orgId);
    }
    if (teamId) {
      projectsQuery = projectsQuery.eq('team_id', teamId);
    }
    if (projectId) {
      projectsQuery = projectsQuery.eq('id', projectId);
    }
    
    // Fetch project IDs
    const { data: projectIds, error: projectsError } = await projectsQuery;
    if (projectsError) throw projectsError;
    
    // Fetch all required data in parallel
    const [
      dimensionsResult,
      initiativesResult,
      outcomesResult
    ] = await Promise.all([
      // Fetch dimensions
      supabaseClient.from('dimensions')
        .select('*')
        .in('project_id', projectIds.map(p => p.id)),
        
      // Fetch strategic initiatives
      supabaseClient.from('strategic_initiatives')
        .select('*')
        .in('project_id', projectIds.map(p => p.id)),
        
      // Fetch outcomes
      supabaseClient.from('outcome_metrics')
        .select('*')
        .in('project_id', projectIds.map(p => p.id))
    ]);
    
    // Transform data to match DashboardData interface
    const dashboardData = {
      dimensions: dimensionsResult.data.map(d => ({
        id: d.id,
        title: d.title,
        health: d.health,
        kpi: d.kpi,
        label: d.label,
        trend: {
          baseline: d.baseline,
          actual: d.actual,
          target: d.target,
          bands: [d.threshold_satisfactory, d.threshold_good]
        }
      })),
      // Map other data accordingly...
    };
    
    return new Response(
      JSON.stringify(dashboardData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

## Security Considerations

1. Implement proper authentication using JWT
2. Apply Row Level Security in the database
3. Validate all inputs
4. Set appropriate CORS policies
5. Implement rate limiting
6. Apply least privilege principle for database access

## Performance Optimization

1. Use appropriate indexing on database tables
2. Implement caching strategies
3. Use connection pooling
4. Optimize database queries
5. Consider using materialized views for complex aggregations

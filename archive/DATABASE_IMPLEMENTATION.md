# Database to UI Implementation Guide

This document explains how to properly implement the database connectivity for the dashboard, ensuring that all UI components correctly receive and display data from the database.

## Data Flow Architecture

1. **API Calls** (`api/database.ts`):
   - Makes actual API calls to Supabase Edge Functions
   - Falls back to mock data if API call fails

2. **Mock Data Generation** (`api/supabase.ts`):
   - Generates realistic mock data based on the year parameter
   - Transforms raw data into the format expected by UI components
   - **Critical**: Calculates health scores from raw metrics

3. **Main Dashboard Module** (`DashboardModule.tsx`):
   - Fetches data using `fetchDashboardData` function
   - Passes data to individual zone components
   - Handles loading states and errors

4. **Component Data Consumption**:
   - Each component receives and displays its portion of the dashboard data
   - **Zone 1 and Zone 3** use the exact same dimension data structures
   - **Zone 2** uses a combination of metrics from Zone 3 and Zone 4

## Key Variable Mappings

### Zone 1 (Spider Chart) and Zone 3 (Internal Outputs)
Both use the `dimensions` array containing these properties:

```typescript
interface Dimension {
  id: string;          // Unique identifier
  title: string;       // Display name
  health: number;      // Spider chart value (0-100)
  kpi: string;         // Formatted metric display
  label: string;       // Description of the KPI
  trend: {
    baseline: number;  // Starting reference value
    actual: number;    // Current value
    target: number;    // Goal value
    bands: [number, number]; // Performance thresholds
  }
}
```

### Data Transformation

When raw data comes from the database (or mock data function), it goes through a transformation process:

1. **Health Score Calculation**:
   ```typescript
   // Calculated in transformRawDataToDashboardData function
   health = calculateHealth(actual, target, baseline);
   
   // The calculation normalizes the progress toward the target
   const progress = (actual - baseline) / (target - baseline);
   const healthScore = Math.min(100, Math.max(0, Math.round(progress * 100)));
   ```

2. **KPI Formatting**:
   ```typescript
   // Formats the KPI value based on the unit
   kpi = formatKpi(kpiValue, kpiUnit, baselineForGain);
   ```

## Executive Summary Generation

The executive summary in the Transformation Health component is generated on-demand when the user clicks the "Generate Executive Summary" button:

1. User clicks button in `TransformationHealth.tsx`
2. Component calls `fetchExecutiveSummary(dimensions, apiKey)` 
3. API call is made to Google Gemini AI
4. Loading state is shown while waiting for response
5. Summary is displayed on successful response

## Implementation Checklist

- [x] Ensure TransformationHealth component accepts and uses apiKey
- [x] Update Gemini API functions to accept optional apiKey parameter
- [x] Ensure Spider Chart in Zone 1 uses the same dimensions as Zone 3
- [x] Verify health score calculation is correct for spider chart values
- [ ] Add year selector to test different data scenarios
- [ ] Document fallback strategies when API calls fail

## Testing Database Integration

To test that the database integration is working correctly:

1. Configure a valid API key in `.env.local` file
2. Use the year selector to load different sets of mock data
3. Verify that the spider chart updates with the correct values
4. Click "Generate Executive Summary" to test the AI integration
5. Check that loading states and error handling work correctly

# Data Architecture Implementation Guide

This project requires proper data implementation from database to UI components. Two documents have been created to guide this implementation:

1. **DATABASE_REQUIREMENTS.md** - Documents what data is required for each dashboard section and how it should be structured.

2. **DATABASE_IMPLEMENTATION.md** - Provides technical guidance on how to implement the database connectivity and ensure proper data flow from database to UI components.

## Key Concepts

### Database to UI Data Flow

- Primary data sources are Zone 3 (Internal Outputs) and Zone 4 (Sector Outcomes)
- Zone 1 (Spider Chart) uses the exact same 8 dimensions from Zone 3
- Zone 2 (Strategic Insights) combines data from both Zone 3 and Zone 4

### Data Calculation & Formatting

The dashboard performs calculations on raw data:

- Health scores (0-100) are calculated based on actual progress toward target from baseline
- KPI values are formatted based on their unit type (%, M, /10, etc.)
- Time series data is displayed in various chart types

### Executive Summary Generation

The "Generate Executive Summary" button in the Transformation Health section triggers a secure API call to Gemini AI. This feature:

- Is NOT automatically loaded for security reasons
- Only generates content when the user explicitly requests it
- Requires a valid API key to function properly

## Implementation Status

This dashboard currently uses mock data generated based on the selected year, with proper calculations to simulate a real database connection. In a production environment, the mock data would be replaced with actual database queries using the Supabase client.

## For More Information

Please refer to the detailed documentation in:
- DATABASE_REQUIREMENTS.md
- DATABASE_IMPLEMENTATION.md

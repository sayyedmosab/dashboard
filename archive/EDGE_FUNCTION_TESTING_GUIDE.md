# Edge Function Testing Guide

This guide provides instructions for testing the newly implemented Edge Function for the dashboard application.

## 1. Testing with Mock Data

We've created a comprehensive set of mock data for testing the Edge Function:

- **Years covered**: 2025-2029 (5 years of data)
- **Data structure**: Matches the expected Edge Function output format
- **Realistic progression**: Values show logical growth and relationships over time

### 1.1 Generated Mock Data Files

- `mock_dashboard_data.json` - Combined file with data for all years
- Individual year files:
  - `mock_dashboard_data_2025.json`
  - `mock_dashboard_data_2026.json`
  - `mock_dashboard_data_2027.json`
  - `mock_dashboard_data_2028.json`
  - `mock_dashboard_data_2029.json`

### 1.2 Running Basic Tests

To test the Edge Function with this mock data:

```bash
# Run the mock test
node test_edge_function.js
```

This test verifies that our Edge Function correctly returns year-specific data and that the dashboard application can process it.

## 2. Local Supabase Testing

For more comprehensive testing with a local Supabase instance:

### Prerequisites

- Supabase CLI installed: `npm install -g supabase`
- Docker installed and running (required by Supabase CLI)

### Setup

1. Start the local Supabase server:

```bash
# Initialize local Supabase project (only needed once)
supabase init

# Start local Supabase services
supabase start
```

2. Deploy the Edge Function locally:

```bash
# Serve the Edge Function
supabase functions serve getDashboardData --no-verify-jwt
```

3. Set environment variables for testing:

```bash
# These will be printed when you run 'supabase start'
export SUPABASE_URL=http://localhost:54321
export SUPABASE_ANON_KEY=your-anon-key-from-supabase-start
```

## 3. Mock Data Generation

We've created a generator script that produces realistic mock data with logical progression over time.

### 3.1 Understanding the Mock Data

The mock data is generated with these parameters:
- **Base year**: 2024
- **Growth rates**:
  - 8% overall growth
  - 12% financial growth
  - 15% adoption growth
  - 5% quality improvement
- **Realistic variance**: ±10% random variation to prevent perfectly linear progression
- **Logical relationships**: Linked metrics like FDI, trade, and jobs show correlated growth

### 3.2 Regenerating Mock Data

If you need to regenerate the mock data:

```bash
# Generate mock data for years 2025-2029
node mock_data_generator.cjs
```

This will create both the combined JSON file and individual year files.

### 3.3 Testing with Year Parameter

The updated Edge Function accepts a `year` parameter in the request body:

```bash
# Test with specific year
curl -X POST http://localhost:54321/functions/v1/getDashboardData \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-anon-key" \
  -d '{"year": 2027}'
```

Valid year values are: 2025, 2026, 2027, 2028, and 2029.

### 3.4 Mock Data Structure

Each year's data includes:

- **Dimensions**: 5 key performance dimensions with health scores, KPIs, and trends
- **Strategic Insights**: 3 insights with different visualizations
  - Initiative Portfolio (budget/risk/alignment)
  - Program Delivery Metrics (quarterly progress)
  - Value Realization (internal efficiency vs. external value)
- **Outcomes**: 4 sector outcomes with economic impact metrics
  - Economic Impact (FDI, trade, jobs)
  - Partnership Growth
  - Service Quality (coverage and quality metrics)
  - Community Engagement

### Running the Test

Once your local Supabase server is running and the Edge Function is deployed:

```bash
# Run the test script that makes a real HTTP request
node test_edge_function.js
```

## 3. Production Deployment

To deploy the Edge Function to your production Supabase instance:

1. Link to your Supabase project:

```bash
supabase link --project-ref your-project-ref
```

2. Deploy the Edge Function:

```bash
supabase functions deploy getDashboardData
```

3. Test against the production endpoint:

```bash
# Set production credentials
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_ANON_KEY=your-production-anon-key

# Run the test
node test_edge_function.js
```

## 4. Integration with Dashboard App

The dashboard application has been updated to use the new Edge Function:

- The database.ts file now points to the new endpoint
- All API calls use the standard Supabase authentication

To verify the integration:

1. Start the dashboard application:

```bash
npm run dev
```

2. Open the application in your browser and check the network tab for requests to the Edge Function endpoint.

## 5. Troubleshooting

If you encounter issues:

1. Check the Supabase logs:

```bash
supabase functions logs getDashboardData
```

2. Verify that your CORS settings are correct:

```bash
supabase functions config set --cors="*" getDashboardData
```

3. Ensure your database tables match the schema described in EDGE_FUNCTIONS_SPECS.md

## 6. Next Steps

After successful testing:

1. Set up CI/CD for automatic deployment of Edge Functions
2. Implement monitoring and error logging
3. Add performance metrics collection
4. Consider implementing additional Edge Functions for specific data needs

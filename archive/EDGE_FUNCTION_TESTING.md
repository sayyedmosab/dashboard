# Testing the Edge Function

This document provides instructions for testing the Edge Function implementation for the dashboard application.

## Prerequisites

- Node.js 14+ installed
- npm or yarn package manager
- Supabase CLI installed (`npm install -g supabase`)

## Local Testing

### 1. Start the Local Supabase Server

Run the setup script to initialize and start a local Supabase server:

```bash
./setup_local_supabase.sh
```

This will:
- Initialize a local Supabase project (if needed)
- Start the Supabase services
- Deploy and serve the Edge Function locally
- Set necessary environment variables

### 2. Run the Test Script

In a new terminal window, run the test script:

```bash
node test_edge_function.js
```

This will send a request to your local Edge Function and display the response.

### 3. Integration Testing

You can run the integration test:

```bash
npm test edge_function.test.jsx
```

This will verify that your application can successfully integrate with the Edge Function.

## Testing Against Production

To test against your production Supabase instance:

1. Set your Supabase credentials:

```bash
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_ANON_KEY=your-anon-key
```

2. Run the test script:

```bash
node test_edge_function.js
```

## Deployment to Production

To deploy the Edge Function to your production Supabase instance:

```bash
supabase functions deploy getDashboardData --project-ref your-project-ref
```

## Monitoring

After deployment, you can monitor your Edge Function through the Supabase Dashboard:

1. Go to https://app.supabase.com
2. Select your project
3. Navigate to Edge Functions
4. Click on 'getDashboardData' to view logs and metrics

## Troubleshooting

If you encounter any issues:

1. Check the Edge Function logs:

```bash
supabase functions logs getDashboardData
```

2. Verify your Supabase credentials are correct
3. Ensure your database contains the required tables and data
4. Check for CORS issues if testing from a browser

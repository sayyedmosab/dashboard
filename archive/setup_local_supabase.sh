#!/bin/bash

# Setup and Run Supabase Edge Functions locally
# This script sets up the necessary environment for testing Supabase Edge Functions

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
  echo "Supabase CLI is not installed. Installing..."
  npm install -g supabase
fi

# Create local configuration if it doesn't exist
if [ ! -f "./supabase/config.toml" ]; then
  echo "Initializing Supabase project..."
  supabase init
fi

# Start the local Supabase development environment
echo "Starting Supabase local development server..."
supabase start

# Set environment variables for testing
export SUPABASE_URL=$(supabase status --output json | jq -r '.api.url')
export SUPABASE_ANON_KEY=$(supabase status --output json | jq -r '.api.anonKey')

echo "Supabase URL: $SUPABASE_URL"
echo "Supabase Anon Key: $SUPABASE_ANON_KEY"

# Build and serve the Edge Function locally
echo "Starting Edge Function development server..."
supabase functions serve getDashboardData --no-verify-jwt &
FUNC_PID=$!

# Allow the function server to start
sleep 3

echo "Edge Function is running at: $SUPABASE_URL/functions/v1/getDashboardData"
echo "Ready for testing! Use 'node test_edge_function.js' to test"
echo "Press Ctrl+C to stop the servers"

# Wait for termination signal
wait $FUNC_PID

#!/bin/bash

# Edge Function Test Setup Script
# This script helps set up and test the Supabase Edge Function

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Dashboard Edge Function Test Setup ===${NC}"
echo

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${YELLOW}Supabase CLI not found. Installing...${NC}"
    npm install -g supabase
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}Error: Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Create supabase directory if it doesn't exist
if [ ! -d "./supabase" ]; then
    echo -e "${YELLOW}Initializing Supabase project...${NC}"
    supabase init
fi

# Check if Supabase is already running
if supabase status &> /dev/null; then
    echo -e "${GREEN}Supabase is already running.${NC}"
else
    echo -e "${YELLOW}Starting Supabase local development server...${NC}"
    supabase start
fi

# Get Supabase URL and anon key
SUPABASE_URL=$(supabase status --output json | jq -r '.api.url')
SUPABASE_ANON_KEY=$(supabase status --output json | jq -r '.api.anonKey')

echo -e "${GREEN}Supabase URL: ${YELLOW}$SUPABASE_URL${NC}"
echo -e "${GREEN}Supabase Anon Key: ${YELLOW}$SUPABASE_ANON_KEY${NC}"

# Export the variables for use in other scripts
export SUPABASE_URL
export SUPABASE_ANON_KEY

echo -e "\n${GREEN}=== Starting Edge Function Server ===${NC}"
echo -e "${YELLOW}Starting Edge Function in a new terminal...${NC}"
echo -e "${YELLOW}You can use Ctrl+C to stop it when you're done testing.${NC}"

# Start the Edge Function server
supabase functions serve getDashboardData --no-verify-jwt

# Note: The script will end when the functions serve command is stopped with Ctrl+C

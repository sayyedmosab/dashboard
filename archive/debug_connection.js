// Debug script to test Supabase Edge Function connection step by step

// Read environment variables directly from .env.local
import { readFileSync } from 'fs';

let SUPABASE_URL, SUPABASE_ANON_KEY;

try {
  const envContent = readFileSync('.env.local', 'utf8');
  const envLines = envContent.split('\n');
  
  for (const line of envLines) {
    if (line.startsWith('VITE_SUPABASE_URL=')) {
      SUPABASE_URL = line.split('=')[1];
    }
    if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
      SUPABASE_ANON_KEY = line.split('=')[1];
    }
  }
} catch (error) {
  console.log('Could not read .env.local file:', error.message);
}

// Fallback values
SUPABASE_URL = SUPABASE_URL || 'https://ojlfhkrobyqmifqbgcyw.supabase.co';
SUPABASE_ANON_KEY = SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qbGZoa3JvYnlxbWlmcWJnY3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NTYwNTYsImV4cCI6MjA2NTEzMjA1Nn0.Y6swVK-tGI0lqpFJ4pgUGD6NaEj-sQIizTvYL2Cf4nY';

console.log('🔍 Starting Supabase Edge Function Diagnostic');
console.log('============================================');

// Step 1: Check environment variables
console.log('\n1️⃣ Environment Variables Check:');
console.log(`SUPABASE_URL: ${SUPABASE_URL}`);
console.log(`SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY ? SUPABASE_ANON_KEY.slice(0, 20) + '...' : 'NOT SET'}`);

// Step 2: Test basic Supabase connection
console.log('\n2️⃣ Testing basic Supabase connectivity...');
try {
  const healthResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  
  console.log(`Health check status: ${healthResponse.status}`);
  if (healthResponse.ok) {
    console.log('✅ Basic Supabase connection successful');
  } else {
    console.log('❌ Basic Supabase connection failed');
    const errorText = await healthResponse.text();
    console.log('Error details:', errorText);
  }
} catch (error) {
  console.log('❌ Network error connecting to Supabase:', error.message);
}

// Step 3: Test Edge Functions endpoint using your exact pattern
console.log('\n3️⃣ Testing Edge Functions endpoint...');

// Using your exact fetchDashboardData function
async function fetchDashboardData(quarter, dimension) {
  try {
    // Construct the URL with query parameters
    const url = new URL(`${SUPABASE_URL}/functions/v1/getDashboardData`);
    
    // Add optional query parameters
    if (quarter) url.searchParams.append("quarter", quarter); // e.g., "Q1 2025"
    if (dimension) url.searchParams.append("dimension", dimension); // e.g., "dim4"
    
    console.log(`Making request to: ${url.toString()}`);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`, // or user's JWT token
        "Content-Type": "application/json"
      }
    });
    
    console.log(`Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("✅ Dashboard data received successfully");
    console.log('Response structure:', {
      hasData: !!data.data,
      hasInsights: !!data.insights,
      hasMetadata: !!data.metadata,
      quarterCovered: data.metadata?.quarter_covered,
      dimensionsCount: data.data?.[0]?.dimensions?.length
    });
    
    if (data.data && data.data[0] && data.data[0].dimensions && data.data[0].dimensions[0]) {
      console.log('First dimension example:', data.data[0].dimensions[0]);
    }
    
    return data;
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    throw error;
  }
}

try {
  // Test 1: Get latest quarter data
  console.log('\n--- Test 1: Latest quarter ---');
  await fetchDashboardData();
  
  // Test 2: Get specific quarter data
  console.log('\n--- Test 2: Q3 2025 ---');
  await fetchDashboardData("Q3 2025");
  
  // Test 3: Get specific quarter and dimension data
  console.log('\n--- Test 3: Q3 2025, dim1 ---');
  await fetchDashboardData("Q3 2025", "dim1");
  
} catch (error) {
  console.log('❌ Error in tests:', error.message);
}

// Step 4: List available Edge Functions
console.log('\n4️⃣ Listing available Edge Functions...');
try {
  // This might not work depending on Supabase setup, but worth trying
  const functionsResponse = await fetch(`${SUPABASE_URL}/functions/v1/`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  
  console.log(`Functions list status: ${functionsResponse.status}`);
  if (functionsResponse.ok) {
    const functions = await functionsResponse.text();
    console.log('Available functions:', functions);
  }
} catch (error) {
  console.log('Could not list functions (this is normal):', error.message);
}

console.log('\n🏁 Diagnostic complete!');

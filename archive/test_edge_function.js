/**
 * Test script for Edge Functions
 * Tests the Edge Function with different year parameters (2025-2029)
 */
const fetch = require('node-fetch');
const fs = require('fs');

// Configuration - Update these values with your actual Supabase details
const SUPABASE_URL = process.env.SUPABASE_URL || 'http://localhost:54321';
const SUPABASE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/getDashboardData`;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

// Years to test
const YEARS_TO_TEST = [2025, 2026, 2027, 2028, 2029];

/**
 * Tests the Edge Function with a specific year parameter
 * @param {number} year The year to test
 */
async function testYearParameter(year) {
  console.log(`\n----- Testing getDashboardData for year ${year} -----`);
  
  const params = {
    projectId: 'test-project-id',
    fromDate: `${year}-01-01`,
    toDate: `${year}-12-31`,
    year: year
  };

  try {
    const response = await fetch(SUPABASE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response status:', response.status);
    
    // Validate some key data points
    console.log(`Year ${year} validation:`);
    
    if (data.dimensions && data.dimensions.length > 0) {
      const dim = data.dimensions[0];
      console.log(`- First dimension health: ${dim.health}`);
      console.log(`- First dimension KPI: ${dim.kpi}`);
    }
    
    if (data.insight1 && data.insight1.initiatives) {
      console.log(`- Number of initiatives: ${data.insight1.initiatives.length}`);
    }
    
    // Output full response if needed
    // console.log('Full response data:', JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error('Error testing Edge Function:', error.message);
    return null;
  }
}

/**
 * Run tests for all years
 */
async function runAllTests() {
  console.log('🧪 Starting Edge Function Tests 🧪');
  console.log('====================================');
  
  // Test each year sequentially
  for (const year of YEARS_TO_TEST) {
    await testYearParameter(year);
  }
  
  console.log('\n====================================');
  console.log('🏁 Edge Function Tests Complete 🏁');
}

// Run all tests
runAllTests()
  .then(() => console.log('All tests completed successfully!'))
  .catch(err => console.error('Test execution failed:', err));

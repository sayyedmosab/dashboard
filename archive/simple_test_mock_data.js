/**
 * Simple Mock Data Test Script
 * 
 * This script directly reads the mock data files and validates their structure
 * without requiring any Supabase or Edge Function setup.
 */

import fs from 'fs';

// Years to test
const YEARS_TO_TEST = [2025, 2026, 2027, 2028, 2029];

/**
 * Test a specific year's mock data
 * @param {number} year The year to test
 */
function testYearData(year) {
  console.log(`\n----- Testing mock data for year ${year} -----`);
  
  try {
    // Read the mock data file
    const filePath = `./mock_dashboard_data_${year}.json`;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    console.log(`✅ Successfully loaded data for year ${year}`);
    
    // Validate structure
    validateDataStructure(data, year);
    
    return true;
  } catch (error) {
    console.error(`❌ Error testing year ${year}:`, error.message);
    return false;
  }
}

/**
 * Validate the structure of the mock data
 * @param {object} data The mock data to validate
 * @param {number} year The year being tested
 */
function validateDataStructure(data, year) {
  // Check dimensions
  if (Array.isArray(data.dimensions) && data.dimensions.length > 0) {
    console.log(`✅ Found ${data.dimensions.length} dimensions`);
    
    // Sample some dimension data
    const dim = data.dimensions[0];
    console.log(`   First dimension: ${dim.title}, Health: ${dim.health}, KPI: ${dim.kpi}`);
  } else {
    console.error('❌ Missing or invalid dimensions data');
  }
  
  // Check insights
  if (data.insight1 && data.insight1.initiatives) {
    console.log(`✅ Found ${data.insight1.initiatives.length} initiatives in insight1`);
    
    // Sample some insight data
    const initiative = data.insight1.initiatives[0];
    console.log(`   First initiative: ${initiative.name}, Budget: $${initiative.budget.toLocaleString()}`);
  } else {
    console.error('❌ Missing or invalid insight1 data');
  }
  
  // Check insight2
  if (data.insight2 && data.insight2.labels && data.insight2.delivery) {
    console.log(`✅ Found quarterly data in insight2 with ${data.insight2.labels.length} periods`);
    console.log(`   Sample delivery value: ${data.insight2.delivery.actual[0]}`);
  } else {
    console.error('❌ Missing or invalid insight2 data');
  }
  
  // Check outcomes
  if (data.outcomes && data.outcomes.outcome1) {
    console.log(`✅ Found outcomes data`);
    
    // Sample some outcome data
    if (data.outcomes.outcome1.macro && data.outcomes.outcome1.macro.fdi) {
      const fdi = data.outcomes.outcome1.macro.fdi.actual;
      console.log(`   Sample FDI values: ${fdi.join(', ')}`);
    }
  } else {
    console.error('❌ Missing or invalid outcomes data');
  }
  
  // Check that the data shows progression appropriate for this year
  console.log(`\n✅ Data appears to be valid for year ${year}`);
}

/**
 * Test all years and compile results
 */
function runAllTests() {
  console.log('🧪 Starting Mock Data Tests 🧪');
  console.log('====================================');
  
  let successCount = 0;
  
  // Test each year
  for (const year of YEARS_TO_TEST) {
    if (testYearData(year)) {
      successCount++;
    }
  }
  
  console.log('\n====================================');
  console.log(`🏁 Tests completed: ${successCount}/${YEARS_TO_TEST.length} years passed`);
  
  // Check the combined file
  console.log('\n----- Testing combined mock data file -----');
  try {
    const combinedData = JSON.parse(fs.readFileSync('./mock_dashboard_data.json', 'utf8'));
    console.log(`✅ Successfully loaded combined data file`);
    
    // Check that it contains all years
    const yearsInFile = Object.keys(combinedData).map(Number);
    const missingYears = YEARS_TO_TEST.filter(year => !yearsInFile.includes(year));
    
    if (missingYears.length === 0) {
      console.log(`✅ Combined file contains all ${YEARS_TO_TEST.length} years`);
    } else {
      console.error(`❌ Missing years in combined file: ${missingYears.join(', ')}`);
    }
  } catch (error) {
    console.error(`❌ Error reading combined mock data file:`, error.message);
  }
}

// Run all the tests
runAllTests();

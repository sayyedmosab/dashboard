// Debug script to trace data flow step by step
console.log('🔍 === DEBUGGING DATA FLOW ===');

// Step 1: Check environment variables
console.log('📋 Environment Variables:');
console.log('- VITE_SUPABASE_URL:', import.meta.env?.VITE_SUPABASE_URL || 'undefined');
console.log('- VITE_SUPABASE_ANON_KEY:', import.meta.env?.VITE_SUPABASE_ANON_KEY ? '[PRESENT]' : 'undefined');

// Step 2: Check constants file
import { DASHBOARD_DATA } from './constants.js';
console.log('📊 Constants Data:');
console.log('- First dimension title:', DASHBOARD_DATA.dimensions?.[0]?.title || 'No dimensions');
console.log('- First dimension health:', DASHBOARD_DATA.dimensions?.[0]?.health || 'No health');
console.log('- Dimensions count:', DASHBOARD_DATA.dimensions?.length || 0);

// Step 3: Simulate API call
console.log('🌐 Testing edge function call...');

async function testEdgeFunction() {
  try {
    const config = {
      url: import.meta.env?.VITE_SUPABASE_URL,
      anonKey: import.meta.env?.VITE_SUPABASE_ANON_KEY,
    };
    
    if (!config.url || !config.anonKey) {
      console.log('❌ Environment variables missing');
      return;
    }
    
    const url = `${config.url}/functions/v1/getDashboardData`;
    console.log('🔗 Edge function URL:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.anonKey}`,
      },
      body: JSON.stringify({
        year: 2025,
        quarter: 'Q1',
        transformationType: 'government-digital'
      }),
    });
    
    console.log('📡 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Edge function response:', data);
      console.log('📊 Edge function dimensions:', data?.data?.[0]?.dimensions?.length || 0);
    } else {
      const errorText = await response.text();
      console.log('❌ Edge function error:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

// Run the test
testEdgeFunction();

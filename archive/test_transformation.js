// Test the data transformation to ensure charts get the right format
import { readFileSync } from 'fs';

// Read environment variables directly from .env.local
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

async function testDataTransformation() {
  console.log('🧪 Testing Data Transformation for Charts');
  console.log('=========================================');

  try {
    // Fetch data from Edge Function
    const url = new URL(`${SUPABASE_URL}/functions/v1/getDashboardData`);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const edgeFunctionData = await response.json();
    console.log('✅ Raw Edge Function data received');

    // Apply our transformation
    const quarterData = edgeFunctionData.data[0];
    const dimensions = quarterData.dimensions;
    
    console.log(`📊 Found ${dimensions.length} dimensions to transform`);

    // Test insight1 transformation (Investment Portfolio)
    const insight1 = {
      title: "Investment Portfolio Analysis",
      subtitle: "ROI vs Risk Assessment",
      initiatives: dimensions.slice(0, 3).map((dim, index) => ({
        name: dim.title,
        risk: Math.min(5, Math.max(1, (100 - dim.health) / 20)),
        alignment: Math.min(5, Math.max(1, dim.health / 20)),
        budget: 50 + index * 25
      }))
    };

    console.log('\n📈 Investment Portfolio Data (insight1):');
    insight1.initiatives.forEach((initiative, i) => {
      console.log(`  ${i + 1}. ${initiative.name}`);
      console.log(`     Risk: ${initiative.risk.toFixed(2)} (1-5 scale)`);
      console.log(`     Alignment: ${initiative.alignment.toFixed(2)} (1-5 scale)`);
      console.log(`     Budget: ${initiative.budget}`);
    });

    // Test insight2 transformation (Market Performance) 
    const insight2 = {
      title: "Market Performance",
      subtitle: "Growth Trajectory",
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      delivery: {
        actual: dimensions.slice(0, 6).map((dim) => Math.max(50, dim.health - 10)),
      },
      adoption: {
        actual: dimensions.slice(0, 6).map((dim) => Math.max(40, dim.health - 20)),
      }
    };

    console.log('\n📊 Market Performance Data (insight2):');
    console.log('  Delivery actual:', insight2.delivery.actual);
    console.log('  Adoption actual:', insight2.adoption.actual);

    // Test outcomes transformation (Sector Outcomes)
    const outcomes = {
      outcome1: {
        title: "Economic Impact",
        macro: {
          labels: ["Q1", "Q2", "Q3", "Q4"],
          fdi: { 
            actual: dimensions.slice(0, 4).map((dim) => dim.health),
            target: [85, 85, 85, 85],
          },
          jobs: { 
            actual: dimensions.slice(0, 4).map((dim) => Math.max(40, dim.health - 20)),
          }
        }
      },
      outcome2: {
        title: "Strategic Partnerships",
        partnerships: {
          actual: dimensions.length > 0 ? dimensions[0].health : 75,
          target: 85,
        }
      }
    };

    console.log('\n🏛️ Sector Outcomes Data:');
    console.log('  Outcome1 FDI actual:', outcomes.outcome1.macro.fdi.actual);
    console.log('  Outcome1 Jobs actual:', outcomes.outcome1.macro.jobs.actual);
    console.log('  Outcome2 PPP actual:', outcomes.outcome2.partnerships.actual);

    console.log('\n✅ All data transformations completed successfully!');
    console.log('🎯 Charts should now display data properly.');

  } catch (error) {
    console.error('❌ Error in data transformation test:', error);
  }
}

testDataTransformation();

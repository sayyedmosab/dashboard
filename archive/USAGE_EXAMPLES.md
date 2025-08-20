# Dashboard Module Usage Examples

## Basic Integration

### 1. Install Dependencies
```bash
npm install @google/generative-ai chart.js react-chartjs-2
```

### 2. Import the Module
```tsx
import { DashboardModule, defaultData } from './modules/dashboard';
import './modules/dashboard/styles/dashboard.css'; // Import CSS
```

### 3. Basic Usage (Standalone)
```tsx
import React from 'react';
import { DashboardModule } from './dashboard';

function App() {
  return (
    <div className="app">
      <DashboardModule />
    </div>
  );
}

export default App;
```

## Advanced Integration

### 1. Custom Data with AI Features
```tsx
import React, { useState } from 'react';
import { DashboardModule, type DashboardData } from './dashboard';

function MyApp() {
  const [customData, setCustomData] = useState<DashboardData>({
    dimensions: [
      {
        id: 'custom1',
        title: 'Custom Metric',
        health: 85,
        kpi: '85%',
        label: 'Custom Progress',
        trend: { baseline: 60, actual: 85, target: 90, bands: [70, 80] }
      }
      // ... more dimensions
    ],
    // ... rest of data structure
  });

  return (
    <DashboardModule
      data={customData}
      geminiApiKey={import.meta.env.VITE_DASHBOARD_GEMINI_API_KEY}
      theme={{
        primaryColor: '#ff6b35',
        backgroundColor: '#1a1a2e',
        accentColor: '#16213e'
      }}
      onAnalyze={(id, data) => {
        console.log('Analysis requested for:', id, data);
        // Handle custom analysis
      }}
      onDataChange={(newData) => {
        setCustomData(newData);
      }}
    />
  );
}
```

### 2. Multi-Module Webapp Integration
```tsx
import React from 'react';
import { DashboardModule } from './modules/dashboard';
import { InventoryModule } from './modules/inventory';
import { ReportsModule } from './modules/reports';

function App() {
  return (
    <div className="multi-module-app">
      <nav>
        {/* Navigation */}
      </nav>
      
      <main>
        <section id="dashboard">
          <DashboardModule
            className="dashboard-section"
            style={{ marginBottom: '2rem' }}
            disabledFeatures={['sector-outcomes']} // Disable specific features
            theme={{
              primaryColor: '#your-brand-color'
            }}
          />
        </section>
        
        <section id="inventory">
          <InventoryModule />
        </section>
        
        <section id="reports">
          <ReportsModule />
        </section>
      </main>
    </div>
  );
}
```

### 3. Feature Toggles and Customization
```tsx
function CustomDashboard() {
  return (
    <DashboardModule
      enableAI={true}
      disabledFeatures={[
        'transformation-health', // Hide transformation health zone
        'ai',                   // Disable all AI features
        'insight2'             // Disable specific insight analysis
      ]}
      theme={{
        primaryColor: '#2563eb',
        backgroundColor: '#f8fafc',
        panelBackground: '#ffffff',
        textColor: '#1e293b',
        mutedTextColor: '#64748b',
        accentColor: '#0ea5e9'
      }}
      onAnalyze={(id, data) => {
        // Custom analysis handler - integrate with your own AI service
        fetch('/api/custom-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: id, data })
        });
      }}
    />
  );
}
```

## Environment Configuration

### .env.local
```env
# Primary API key for dashboard module
VITE_DASHBOARD_GEMINI_API_KEY=your_gemini_api_key_here

# Fallback API key (shared across modules)
VITE_GEMINI_API_KEY=your_fallback_api_key_here
```

## TypeScript Support

```tsx
import { 
  DashboardModule, 
  type DashboardModuleProps,
  type DashboardData,
  type InsightId,
  fetchInsightAnalysis,
  fetchExecutiveSummary 
} from './dashboard';

// Custom component with full type support
const TypedDashboard: React.FC<DashboardModuleProps> = (props) => {
  return <DashboardModule {...props} />;
};

// Direct API usage
async function getCustomAnalysis(data: any, apiKey: string) {
  try {
    const analysis = await fetchInsightAnalysis(data, apiKey);
    return analysis;
  } catch (error) {
    console.error('Analysis failed:', error);
  }
}
```

## CSS Theme Customization

```css
/* Override dashboard theme in your main CSS */
:root {
  --dashboard-component-bg-primary: #your-bg-color;
  --dashboard-component-text-primary: #your-text-color;
  --dashboard-component-text-accent: #your-accent-color;
  --dashboard-component-panel-bg: #your-panel-bg;
  /* ... other variables */
}

/* Custom dashboard container styles */
.my-custom-dashboard {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

## Integration with State Management

### With Redux/Zustand
```tsx
import { useSelector, useDispatch } from 'react-redux';
import { DashboardModule } from './dashboard';

function ConnectedDashboard() {
  const dashboardData = useSelector(state => state.dashboard.data);
  const dispatch = useDispatch();
  
  return (
    <DashboardModule
      data={dashboardData}
      onDataChange={(newData) => {
        dispatch({ type: 'DASHBOARD_UPDATE', payload: newData });
      }}
      onAnalyze={(id, data) => {
        dispatch({ type: 'REQUEST_ANALYSIS', payload: { id, data } });
      }}
    />
  );
}
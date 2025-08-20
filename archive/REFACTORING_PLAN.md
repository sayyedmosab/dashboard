# Dashboard Module Refactoring Implementation Plan

## Multi-Module Webapp Compatibility Strategy

### 1. Package Dependencies (Non-Conflicting)
```json
{
  "name": "transformation-dashboard-module",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build --mode lib",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@google/generative-ai": "^0.21.0",
    "chart.js": "^4.4.3",
    "react-chartjs-2": "^5.2.0"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
```

### 2. Module Export Structure (src/index.ts)
```typescript
// Clean module API that won't conflict with other modules
export { default as DashboardModule } from './DashboardModule';
export type { 
  DashboardData, 
  DashboardModuleProps,
  Dimension,
  InsightId,
  AnalysisData 
} from './types';
export { DASHBOARD_DATA as defaultData } from './constants';
```

### 3. Environment Variables (Multi-Module Safe)
```typescript
// api/gemini.ts - Use scoped environment variable
const getApiKey = (providedKey?: string): string => {
  return providedKey || 
         import.meta.env.VITE_DASHBOARD_GEMINI_API_KEY || 
         import.meta.env.VITE_GEMINI_API_KEY || 
         '';
};
```

### 4. CSS Scoping Strategy
- Use CSS modules or scoped variables to prevent style conflicts
- Namespace all CSS variables with `--dashboard-` prefix
- Example: `--dashboard-component-bg-primary` instead of `--component-bg-primary`

### 5. DashboardModule Props API
```typescript
interface DashboardModuleProps {
  // Data
  data?: DashboardData;
  
  // AI Configuration
  geminiApiKey?: string;
  enableAI?: boolean;
  
  // Theming (won't conflict with other modules)
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
  };
  
  // Feature toggles
  disabledFeatures?: string[];
  
  // Event handlers (optional)
  onAnalyze?: (id: InsightId, data: any) => void;
  onDataChange?: (data: DashboardData) => void;
  
  // Layout
  className?: string;
  style?: React.CSSProperties;
}
```

### 6. Key Refactoring Changes

#### Remove AI Studio Patterns:
- ❌ Remove `isIntegrationMode` logic
- ❌ Remove `window.addEventListener('message')`  
- ❌ Remove `window.parent.postMessage()`
- ❌ Remove URL parameter detection

#### Add Multi-Module Features:
- ✅ Scoped CSS variables with `--dashboard-` prefix
- ✅ Optional prop-based configuration
- ✅ Flexible API key handling
- ✅ Clean module export structure
- ✅ Non-conflicting dependencies

### 7. Updated File Structure
```
src/
├── index.ts                    # Module export
├── DashboardModule.tsx         # Main component (refactored App.tsx)
├── types.ts                   # Type definitions
├── constants.ts               # Default data
├── components/                # All existing components
│   ├── TransformationHealth.tsx
│   ├── StrategicInsights.tsx
│   ├── InternalOutputs.tsx
│   ├── SectorOutcomes.tsx
│   └── ...
├── api/
│   └── gemini.ts              # Updated for Vite compatibility
├── utils/
│   └── styleHelper.ts         # CSS variable helpers
└── styles/
    └── dashboard.css          # Scoped styles
```

### 8. Usage Example in Parent Webapp
```typescript
// In parent Vite webapp
import { DashboardModule } from './modules/dashboard';

function App() {
  const [dashboardData, setDashboardData] = useState(customData);
  
  return (
    <div className="app">
      <OtherModule />
      
      <DashboardModule 
        data={dashboardData}
        geminiApiKey={import.meta.env.VITE_DASHBOARD_GEMINI_API_KEY}
        theme={{
          primaryColor: '#custom-blue',
          backgroundColor: '#custom-dark'
        }}
        onAnalyze={(id, data) => console.log('Analysis requested:', id)}
        className="dashboard-container"
      />
      
      <AnotherModule />
    </div>
  );
}
```

## Implementation Priority
1. Update package.json dependencies
2. Fix Gemini API service for Vite compatibility  
3. Refactor App.tsx → DashboardModule.tsx
4. Create module export structure
5. Update CSS variables with dashboard prefix
6. Remove AI Studio widget patterns
7. Test multi-module integration
# Holistic Transformation Dashboard Module

A production-ready Vite module for visualizing transformation metrics and strategic insights. This component provides a comprehensive view across four key zones: Transformation Health, Strategic Insights, Internal Outputs, and Sector-Level Outcomes.

## Key Features

- **Four-Zone Layout:** Comprehensive program health visualization
- **Rich Visualizations:** Spider, Bubble, Bullet, Doughnut, and Combo charts
- **Gemini-Powered Analysis:** Optional AI-powered data analysis
- **Modular Architecture:** Pure Vite package with clean component boundaries
- **Embeddable:** Works as standalone or embedded in host applications
- **Theme-able:** Customizable via CSS variables
- **TypeSafe:** Built with TypeScript for better developer experience

## Installation

```bash
npm install @your-org/holistic-dashboard
# or
yarn add @your-org/holistic-dashboard
```

## Core Architecture

```
dashboard/
├── components/         # Reusable UI components
│   ├── CustomCharts.tsx
│   ├── StrategicInsights.tsx
│   └── ...
├── api/               # Data layer
│   ├── database.ts    # Supabase integration
│   └── gemini.ts      # AI analysis
├── types.ts           # Type definitions
└── DashboardModule.tsx # Main entry component
```

## Integration Options

### 1. Direct Component Usage

```tsx
import { DashboardModule } from '@your-org/holistic-dashboard';

function App() {
  return (
    <DashboardModule 
      apiKey="your-api-key"
      initialData={yourData}
      disabledFeatures={['sector-outcomes']}
    />
  );
}
```

### 2. Iframe Embedding (Legacy Support)

```html
<iframe
  id="dashboard-component"
  src="[URL_TO_DEPLOYMENT]?integration=true"
  width="100%"
  height="1200px"
  frameborder="0"
></iframe>
```

Communicate via `postMessage`:

```javascript
iframe.contentWindow.postMessage({
  type: 'UPDATE_COMPONENT_DATA',
  payload: yourData
}, targetOrigin);
```

### 3. Webapp Integration

Configure in your Vite/Rollup config:

```js
// vite.config.js
export default defineConfig({
  optimizeDeps: {
    include: ['@your-org/holistic-dashboard']
  }
});
```

## Data Structure

The component expects data matching the `DashboardData` interface:

```typescript
interface DashboardData {
  dimensions: Dimension[];
  insight1: Insight1Data;
  insight2: Insight2Data;
  insight3: Insight3Data;
  outcomes: OutcomesData;
}
```

## Configuration

Environment variables (set in `.env`):

```ini
VITE_API_ENDPOINT=https://api.yourdomain.com
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_KEY=your-supabase-key
VITE_GEMINI_API_KEY=your-gemini-key
```

## Styling & Theming

Override CSS variables in your host app:

```css
:root {
  --dashboard-primary: #4285f4;
  --dashboard-text: #202124;
  --component-bg-primary: #ffffff;
  --component-panel-bg: #f9f9f9;
}
```

Complete list of CSS variables available in the original documentation.

## Development

```bash
npm run dev  # Starts development server
npm run build  # Production build
```

## Contribution

1. Fork the repository
2. Create feature branch (`git checkout -b feature/foo`)
3. Commit changes (`git commit -am 'Add some foo'`)
4. Push to branch (`git push origin feature/foo`)
5. Create new Pull Request

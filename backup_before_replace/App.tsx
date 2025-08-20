import React from 'react';
import DashboardModule from './DashboardModule';
import './styles/dashboard.css';

// This is now a simple demonstration of the refactored DashboardModule
// The AI Studio widget patterns have been removed and converted to a native Vite module

const App: React.FC = () => {
  return (
    <DashboardModule
      // All AI Studio patterns removed - now works as native Vite module
      // No more postMessage communication or integration mode detection
      // Fully functional with optional props for customization
      
      // Example customizations (all optional):
      // data={customDashboardData}
      // geminiApiKey={import.meta.env.VITE_DASHBOARD_GEMINI_API_KEY}
      // theme={{ primaryColor: '#custom-blue' }}
      // onAnalyze={(id, data) => console.log('Custom analysis:', id)}
      // disabledFeatures={['transformation-health']}
      // className="custom-dashboard-class"
    />
  );
};

export default App;

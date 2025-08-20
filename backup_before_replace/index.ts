// Main module export for the Dashboard Module
export { default as DashboardModule } from './DashboardModule';

// Export types for consumers
export type {
  DashboardData,
  DashboardModuleProps,
  DashboardQueryParams,
  Dimension,
  InsightId,
  AnalysisData,
  Insight1Data,
  Insight2Data,
  Insight3Data,
  OutcomesData,
  Outcome1Data,
  Outcome2Data,
  Outcome3Data,
  Outcome4Data
} from './types';

// Export default data for consumers who want to use sample data
export { DASHBOARD_DATA as defaultData } from './constants';

// Export Gemini service functions for advanced usage
export { fetchInsightAnalysis, fetchExecutiveSummary } from './api/gemini';

// Export database service functions for dynamic data loading
export {
  fetchDashboardData,
  fetchDashboardSection,
  updateDashboardData,
  testDatabaseConnection
} from './api/database';
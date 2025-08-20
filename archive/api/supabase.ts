import type { RawDashboardData } from './supabase.types';
import type { DashboardData, Dimension } from '../types';

// --- MOCK DATA GENERATOR ---
// In a real app, this function would make a fetch request to a Supabase Edge Function.
// e.g., const { data, error } = await supabase.functions.invoke('get-dashboard-data', { body: { year } });
// For this demo, we generate dynamic mock data based on the year.

const generateMockData = (year: number): RawDashboardData => {
    const seed = year - 2024; // Simple seed for randomization
    return {
        year,
        dimensions: [
            { id: 'strategicPlan', title: 'Strategic Plan Alignment', label: 'Progress vs Target', trend: { baseline: 55, actual: 80 + seed * 2, target: 85, bands: [60, 80] }, kpiValue: 80 + seed * 2, kpiUnit: '%' },
            { id: 'operations', title: 'Operational Efficiency Gains', label: 'Process Automation Rate', trend: { baseline: 40, actual: 65 + seed, target: 70, bands: [50, 60] }, kpiValue: 18 + seed * 2, kpiUnit: 'gain_percent' },
            { id: 'risksControl', title: 'Risk Mitigation Rate', label: 'Critical Risks Mitigated', trend: { baseline: 65, actual: 85 + seed, target: 90, bands: [70, 80] }, kpiValue: 85 + seed, kpiUnit: '%' },
            { id: 'investment', title: 'Investment Portfolio ROI', label: 'Annualized Return', trend: { baseline: 8, actual: 18 + seed, target: 15, bands: [10, 12] }, kpiValue: 18 + seed, kpiUnit: '%' },
            { id: 'adoption', title: 'Quarterly Active User Rate', label: 'Users vs Target', trend: { baseline: 0.5, actual: 1.2 + seed * 0.1, target: 1.5, bands: [0.8, 1.0] }, kpiValue: 1.2 + seed * 0.1, kpiUnit: 'M' },
            { id: 'culture', title: 'Employee Engagement Score', label: 'Annual Survey Score', trend: { baseline: 6.8, actual: Math.min(10, 8.5 + seed * 0.1), target: 8.8, bands: [7, 8] }, kpiValue: Math.min(10, 8.5 + seed * 0.1), kpiUnit: '/10' },
            { id: 'delivery', title: 'Product Delivery Velocity', label: 'Avg Story Points/Sprint', trend: { baseline: 20, actual: 35 + seed * 2, target: 40, bands: [25, 30] }, kpiValue: 35 + seed * 2, kpiUnit: 'pts' },
            { id: 'technology', title: 'Technology & Infrastructure', label: 'Platform Uptime', trend: { baseline: 98.5, actual: Math.min(99.9, 99.8 - seed * 0.05), target: 99.9, bands: [99, 99.5] }, kpiValue: Math.min(99.9, 99.8 - seed * 0.05), kpiUnit: '%' }
        ],
        insight1: { title: 'Investment Portfolio Health', subtitle: 'Analyzes portfolio distribution against strategic alignment and risk, highlighting high-value or high-risk initiatives.', initiatives: [{ name: 'Cloud Migration', budget: 5 + seed, risk: 2, alignment: 4 }, { name: 'AI Platform', budget: 8, risk: 4 + seed * 0.5, alignment: 5 }, { name: 'ERP Upgrade', budget: 6, risk: 3, alignment: 3 }, { name: 'Legacy Decom.', budget: 3, risk: 1, alignment: 2 }, { name: 'Data Lake', budget: 7, risk: 4, alignment: 2 }] },
        insight2: { title: 'Delivery & Adoption Velocity', subtitle: 'Tracks the correlation between product development output and end-user adoption to measure value realization speed.', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], delivery: { actual: [25, 30, 28, 35, 32, 40].map(v => v + seed), target: [28, 28, 30, 32, 35, 38], baseline: [20, 20, 20, 20, 20, 20] }, adoption: { actual: [10, 15, 22, 35, 50, 75].map(v => v + seed), target: [12, 18, 25, 38, 55, 80], baseline: [5, 5, 5, 5, 5, 5] } },
        insight3: { title: 'Internal-to-External Impact', subtitle: 'Connects internal operational efficiency improvements with external citizen quality of life outcomes.', labels: ['Q1', 'Q2', 'Q3', 'Q4'], internalEfficiency: { actual: [12, 18, 25, 30].map(v => v + seed), target: 28, baseline: 10 }, externalValue: { actual: [5, 8, 12, 15].map(v => v + seed), target: 14, baseline: 4 } },
        outcomes: {
            outcome1: { title: 'Macroeconomic Impact', macro: { labels: [`${year-2}`, `${year-1}`, `${year}`], fdi: { actual: [1.2, 1.5, 2.1].map(v => v + seed * 0.1), target: [1.4, 1.8, 2.0], baseline: [1.0, 1.0, 1.0] }, trade: { actual: [-8, -6, -3].map(v => v + seed * 0.2), target: [-7, -5, -4], baseline: [-10, -10, -10] }, jobs: { actual: [5, 8, 14].map(v => v + seed), target: [6, 9, 12], baseline: [3, 3, 3] } } },
            outcome2: { title: 'Private Sector Partnerships', partnerships: { actual: 60 + seed, target: 65, baseline: 45 } },
            outcome3: { title: 'Citizen Quality of Life', qol: { labels: ['Water', 'Energy', 'Transport'], coverage: { actual: [85, 92, 78].map(v => v + seed), target: [88, 90, 80], baseline: [70, 75, 65] }, quality: { actual: [7, 8, 6].map(v => Math.min(10, v + seed * 0.1)), target: [7.5, 8.5, 7], baseline: [6, 6.5, 5.5] } } },
            outcome4: { title: 'Community Engagement', community: { actual: 45 + seed, target: 50, baseline: 30 } }
        }
    };
}


export const fetchDataForYear = async (year: number): Promise<RawDashboardData> => {
    console.log(`Fetching data for year: ${year}...`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this is where you'd call your Supabase function.
    // For now, we return mock data.
    if (year > 2029 || year < 2025) {
        throw new Error("Invalid year selected.");
    }
    
    return generateMockData(year);
};


// --- DATA TRANSFORMATION LOGIC ---

const calculateHealth = (actual: number, target: number, baseline: number): number => {
    // If target is same as baseline, can't divide by zero. Handle edge case.
    if (target === baseline) {
        return actual >= target ? 100 : 0;
    }
    // Calculate progress towards target from baseline
    const progress = (actual - baseline) / (target - baseline);
    // Map progress to a 0-100 score, capping at 100
    const healthScore = Math.min(100, Math.max(0, Math.round(progress * 100)));
    return healthScore;
};

const formatKpi = (value: number, unit: string, baselineForGain?: number): string => {
    switch (unit) {
        case '%': return `${Math.round(value)}%`;
        case 'M': return `${value.toFixed(1)}M`;
        case '/10': return `${value.toFixed(1)}/10`;
        case 'pts': return `${Math.round(value)}pts`;
        case 'gain_percent': 
            const gain = ((value - (baselineForGain ?? 0)) / (baselineForGain ?? 1)) * 100;
            return `+${Math.round(gain)}%`;
        case 'absolute':
        default: return `${value}`;
    }
}


export const transformRawDataToDashboardData = (rawData: RawDashboardData): DashboardData => {
    const transformedDimensions: Dimension[] = rawData.dimensions.map(d => {
        // Find the original baseline to calculate gain percentage accurately
        const originalDimension = DASHBOARD_DATA.dimensions.find(dim => dim.id === d.id);
        
        return {
            ...d,
            health: calculateHealth(d.trend.actual, d.trend.target, d.trend.baseline),
            kpi: formatKpi(d.kpiValue, d.kpiUnit, originalDimension?.trend.baseline),
        };
    });

    return {
        ...rawData,
        dimensions: transformedDimensions
    };
};
// Add the original data for transformation logic. A bit of a hack but needed for the mock.
import { DASHBOARD_DATA } from '../constants';

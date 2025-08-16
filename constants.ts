import type { DashboardData } from './types';

export const DASHBOARD_DATA: DashboardData = {
    dimensions: [
        { id: 'strategicPlan', title: 'Strategic Plan Alignment', health: 82, kpi: '82%', label: 'Progress vs Target', trend: { baseline: 55, actual: 82, target: 85, bands: [60, 80] } },
        { id: 'operations', title: 'Operational Efficiency Gains', health: 76, kpi: '+18%', label: 'Process Automation Rate', trend: { baseline: 40, actual: 65, target: 70, bands: [50, 60] } },
        { id: 'risksControl', title: 'Risk Mitigation Rate', health: 88, kpi: '85%', label: 'Critical Risks Mitigated', trend: { baseline: 65, actual: 85, target: 90, bands: [70, 80] } },
        { id: 'investment', title: 'Investment Portfolio ROI', health: 92, kpi: '18%', label: 'Annualized Return', trend: { baseline: 8, actual: 18, target: 15, bands: [10, 12] } },
        { id: 'adoption', title: 'Quarterly Active User Rate', health: 65, kpi: '1.2M', label: 'Users vs Target', trend: { baseline: 0.5, actual: 1.2, target: 1.5, bands: [0.8, 1.0] } },
        { id: 'culture', title: 'Employee Engagement Score', health: 85, kpi: '8.5/10', label: 'Annual Survey Score', trend: { baseline: 6.8, actual: 8.5, target: 8.8, bands: [7, 8] } },
        { id: 'delivery', title: 'Product Delivery Velocity', health: 78, kpi: '35pts', label: 'Avg Story Points/Sprint', trend: { baseline: 20, actual: 35, target: 40, bands: [25, 30] } },
        { id: 'technology', title: 'Technology & Infrastructure', health: 89, kpi: '99.8%', label: 'Platform Uptime', trend: { baseline: 98.5, actual: 99.8, target: 99.9, bands: [99, 99.5] } }
    ],
    insight1: { 
        title: 'Investment Portfolio Health',
        subtitle: 'Analyzes portfolio distribution against strategic alignment and risk, highlighting high-value or high-risk initiatives.',
        initiatives: [{ name: 'Cloud Migration', budget: 5, risk: 2, alignment: 4 }, { name: 'AI Platform', budget: 8, risk: 4, alignment: 5 }, { name: 'ERP Upgrade', budget: 6, risk: 3, alignment: 3 }, { name: 'Legacy Decom.', budget: 3, risk: 1, alignment: 2 }, { name: 'Data Lake', budget: 7, risk: 4, alignment: 2 }] 
    },
    insight2: { 
        title: 'Delivery & Adoption Velocity',
        subtitle: 'Tracks the correlation between product development output and end-user adoption to measure value realization speed.',
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], 
        delivery: { actual: [25, 30, 28, 35, 32, 40], target: [28, 28, 30, 32, 35, 38], baseline: [20, 20, 20, 20, 20, 20] },
        adoption: { actual: [10, 15, 22, 35, 50, 75], target: [12, 18, 25, 38, 55, 80], baseline: [5, 5, 5, 5, 5, 5] }
    },
    insight3: {
        title: 'Internal-to-External Impact',
        subtitle: 'Connects internal operational efficiency improvements with external citizen quality of life outcomes.',
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        internalEfficiency: { actual: [12, 18, 25, 30], target: 28, baseline: 10 },
        externalValue: { actual: [5, 8, 12, 15], target: 14, baseline: 4 }
    },
    outcomes: {
        outcome1: { 
            title: 'Macroeconomic Impact', 
            macro: { 
                labels: ['2023', '2024', '2025'], 
                fdi: { actual: [1.2, 1.5, 2.1], target: [1.4, 1.8, 2.0], baseline: [1.0, 1.0, 1.0] },
                trade: { actual: [-8, -6, -3], target: [-7, -5, -4], baseline: [-10, -10, -10] }, 
                jobs: { actual: [5, 8, 14], target: [6, 9, 12], baseline: [3, 3, 3] }
            } 
        },
        outcome2: { 
            title: 'Private Sector Partnerships', 
            partnerships: { actual: 60, target: 65, baseline: 45 }
        },
        outcome3: { 
            title: 'Citizen Quality of Life', 
            qol: { 
                labels: ['Water', 'Energy', 'Transport'], 
                coverage: { actual: [85, 92, 78], target: [88, 90, 80], baseline: [70, 75, 65] }, 
                quality: { actual: [7, 8, 6], target: [7.5, 8.5, 7], baseline: [6, 6.5, 5.5] }
            } 
        },
        outcome4: { 
            title: 'Community Engagement', 
            community: { actual: 45, target: 50, baseline: 30 }
        }
    }
};
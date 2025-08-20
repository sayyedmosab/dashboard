import type { DashboardData } from './types';

// Empty dashboard structure - forces real data from edge function
export const DASHBOARD_DATA: DashboardData = {
    dimensions: [],
    insight1: { 
        title: 'No Data Available',
        subtitle: 'Please click "Fetch Data" to load dashboard',
        initiatives: []
    },
    insight2: { 
        title: 'No Data Available',
        subtitle: 'Please click "Fetch Data" to load dashboard',
        labels: [], 
        delivery: { actual: [], target: [], baseline: [] },
        adoption: { actual: [], target: [], baseline: [] }
    },
    insight3: {
        title: 'No Data Available',
        subtitle: 'Please click "Fetch Data" to load dashboard',
        labels: [],
        internalEfficiency: { actual: [], target: 0, baseline: 0 },
        externalValue: { actual: [], target: 0, baseline: 0 }
    },
    outcomes: {
        outcome1: { 
            title: 'No Data Available', 
            macro: { 
                labels: [], 
                fdi: { actual: [], target: [], baseline: [] },
                trade: { actual: [], target: [], baseline: [] }, 
                jobs: { actual: [], target: [], baseline: [] }
            } 
        },
        outcome2: { 
            title: 'No Data Available', 
            partnerships: { actual: 0, target: 0, baseline: 0 }
        },
        outcome3: { 
            title: 'No Data Available', 
            qol: { 
                labels: [], 
                coverage: { actual: [], target: [], baseline: [] },
                quality: { actual: [], target: [], baseline: [] }
            }
        },
        outcome4: { 
            title: 'No Data Available', 
            community: { actual: 0, target: 0, baseline: 0 }
        }
    }
};
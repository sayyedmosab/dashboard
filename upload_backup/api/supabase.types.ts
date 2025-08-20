// This file defines the "raw" data structure expected from the Supabase edge function.
// It omits calculated fields like `health` and formatted strings like `kpi`.

// --- RAW DATA STRUCTURES ---

export interface RawDimension {
    id: string;
    title: string;
    label: string;
    // The raw numbers for the trend chart
    trend: {
        baseline: number;
        actual: number;
        target: number;
        bands: [number, number]; // [poor/satisfactory, satisfactory/good]
    };
    // KPI is a formatted string derived from trend data, so we only need the raw parts.
    // The specific calculation logic will live in the frontend transformer.
    kpiValue: number;
    kpiUnit: '%' | 'M' | '/10' | 'pts' | 'absolute' | 'gain_percent'
}

export interface RawInitiative {
    name: string;
    budget: number; // For bubble radius
    risk: number; // x-axis
    alignment: number; // y-axis
}

export interface RawTimeseries {
    actual: number[];
    target: number[];
    baseline: number[];
}

export interface RawDashboardData {
    year: number;
    dimensions: RawDimension[];
    insight1: {
        title: string;
        subtitle: string;
        initiatives: RawInitiative[];
    };
    insight2: {
        title: string;
        subtitle: string;
        labels: string[];
        delivery: RawTimeseries;
        adoption: RawTimeseries;
    };
    insight3: {
        title: string;
        subtitle: string;
        labels: string[];
        internalEfficiency: { actual: number[], target: number, baseline: number };
        externalValue: { actual: number[], target: number, baseline: number };
    };
    outcomes: {
        outcome1: {
            title: string;
            macro: {
                labels: string[];
                fdi: RawTimeseries;
                trade: RawTimeseries;
                jobs: RawTimeseries;
            };
        };
        outcome2: {
            title: string;
            partnerships: { actual: number, target: number, baseline: number };
        };
        outcome3: {
            title: string;
            qol: {
                labels: string[];
                coverage: RawTimeseries;
                quality: RawTimeseries;
            };
        };
        outcome4: {
            title: string;
            community: { actual: number, target: number, baseline: number };
        };
    }
}

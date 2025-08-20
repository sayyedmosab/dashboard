// --- TOP-LEVEL DATA STRUCTURE ---
export interface DashboardData {
    dimensions: Dimension[];
    insight1: Insight1Data;
    insight2: Insight2Data;
    insight3: Insight3Data;
    outcomes: OutcomesData;
}

// --- ZONE 1 & 3: TRANSFORMATION HEALTH & INTERNAL OUTPUTS ---
export interface Dimension {
    id: string;
    title: string;
    health: number; // Overall score 0-100
    kpi: string; // The big display number/text
    label: string; // The sub-label for the KPI
    trend: {
        baseline: number;
        actual: number;
        target: number;
        bands: [number, number]; // [poor/satisfactory threshold, satisfactory/good threshold]
    };
}

// --- ZONE 2: STRATEGIC INSIGHTS ---
export interface Insight1Data {
    title: string;
    subtitle: string;
    initiatives: {
        name: string;
        budget: number; // Used for bubble radius
        risk: number; // x-axis
        alignment: number; // y-axis
    }[];
}

export interface Insight2Data {
    title: string;
    subtitle: string;
    labels: string[];
    delivery: { actual: number[], target: number[], baseline: number[] };
    adoption: { actual: number[], target: number[], baseline: number[] };
}

export interface Insight3Data {
    title: string;
    subtitle: string;
    labels: string[];
    internalEfficiency: { actual: number[], target: number, baseline: number };
    externalValue: { actual: number[], target: number, baseline: number };
}

// --- ZONE 4: SECTOR-LEVEL OUTCOMES ---
export interface OutcomesData {
    outcome1: Outcome1Data;
    outcome2: Outcome2Data;
    outcome3: Outcome3Data;
    outcome4: Outcome4Data;
}

export interface Outcome1Data {
    title: string;
    macro: {
        labels: string[];
        fdi: { actual: number[], target: number[], baseline: number[] };
        trade: { actual: number[], target: number[], baseline: number[] };
        jobs: { actual: number[], target: number[], baseline: number[] };
    };
}

export interface Outcome2Data {
    title: string;
    partnerships: {
        actual: number;
        target: number;
        baseline: number;
    };
}

export interface Outcome3Data {
    title: string;
    qol: {
        labels: string[];
        coverage: { actual: number[], target: number[], baseline: number[] };
        quality: { actual: number[], target: number[], baseline: number[] };
    };
}

export interface Outcome4Data {
    title: string;
    community: {
        actual: number;
        target: number;
        baseline: number;
    };
}

// --- FOR GEMINI ANALYSIS ---
export type InsightId = 'insight1' | 'insight2' | 'insight3' | 'outcome1' | 'outcome2' | 'outcome3' | 'outcome4';

export interface AnalysisData {
    title: string;
    content: string;
}

// --- DATABASE QUERY PARAMETERS ---
export interface DashboardQueryParams {
    orgId?: string;
    timePeriod?: 'monthly' | 'quarterly' | 'yearly';
    startDate?: string;
    endDate?: string;
    refreshCache?: boolean;
}

// --- MODULE PROPS FOR VITE INTEGRATION ---
export interface DashboardModuleProps {
    // Data (mutually exclusive with database loading)
    data?: DashboardData;
    
    // AI Configuration
    geminiApiKey?: string;
    enableAI?: boolean;
    
    // Database Integration
    enableDatabase?: boolean;
    databaseQueryParams?: DashboardQueryParams;
    
    // Theming (scoped to avoid conflicts with other modules)
    theme?: {
        primaryColor?: string;
        backgroundColor?: string;
        panelBackground?: string;
        textColor?: string;
        mutedTextColor?: string;
        accentColor?: string;
        successColor?: string;
        warningColor?: string;
        dangerColor?: string;
    };
    
    // Feature toggles
    disabledFeatures?: string[];
    
    // Event handlers (optional)
    onAnalyze?: (id: InsightId, data: any) => void;
    onDataChange?: (data: DashboardData) => void;
    onDataLoadError?: (error: any) => void;
    
    // Layout
    className?: string;
    style?: Record<string, string | number>;
}
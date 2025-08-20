# Dashboard Data Requirements

This document outlines the data structures needed for the dashboard application, focusing on user-friendly descriptions rather than technical implementation details.

## Dashboard Data Overview

| Section | Description | Data Required | Displayed As |
|---------|-------------|--------------|--------------|
| **Transformation Health (Zone 1)** | Shows overall health of 8 key dimensions with trends | Aggregated data derived from Zone 3 (Internal Outputs) | Spider chart and individual dimension indicators |
| **Strategic Insights (Zone 2)** | Shows 3 key strategic analyses | Combination of data from Zone 3 and Zone 4 | Bubble chart and line/bar charts |
| **Internal Outputs (Zone 3)** | Shows operational metrics for each dimension | **PRIMARY DATA SOURCE** - Detailed dimension data with actual, target and baseline values | Trend indicators and KPI displays |
| **Sector Outcomes (Zone 4)** | Shows 4 outcome areas measuring external impact | **PRIMARY DATA SOURCE** - Macroeconomic, partnerships, quality of life, and community data | Various charts (bar, line, radial) |

## Detailed Data Requirements by Section

### 1. Dimensions Data (Transformation Health & Internal Outputs)

> **Important**: The 8 dimensions shown in Zone 1 (Spider Chart) are exactly the same 8 dimensions displayed in Zone 3 (Internal Outputs). They share identical data points and metrics.

For each of the 8 dimensions, the dashboard needs:

| Field | Description | Example | Used For |
|-------|-------------|---------|----------|
| ID | Unique identifier for the dimension | 'strategicPlan' | Internal reference |
| Title | Display name | 'Strategic Plan Alignment' | Section headers |
| Health Score | Calculated score (0-100) | 82 | Spider chart values |
| KPI Value | Key performance indicator | 82% | Large number display |
| KPI Label | Context for the KPI | 'Progress vs Target' | Explanatory text |
| Trend Baseline | Starting point for comparison | 55 | Trend calculation |
| Trend Actual | Current value | 82 | Performance indicator |
| Trend Target | Goal value | 85 | Target reference |
| Performance Bands | Thresholds for poor/satisfactory/good | [60, 80] | Color coding |

### 2. Strategic Insights Data

#### Insight 1: Investment Portfolio

| Field | Description | Example | Used For |
|-------|-------------|---------|----------|
| Title | Section title | 'Investment Portfolio Health' | Section header |
| Subtitle | Explanatory text | 'Analyzes portfolio distribution...' | Context description |
| Initiatives | List of projects or initiatives | - | Bubble chart |
| Name | Initiative name | 'Cloud Migration' | Bubble label |
| Budget | Size of investment | 5 (millions) | Bubble size |
| Risk | Risk assessment | 2 (scale 1-5) | X-axis position |
| Alignment | Strategic alignment | 4 (scale 1-5) | Y-axis position |

#### Insight 2: Delivery & Adoption

| Field | Description | Example | Used For |
|-------|-------------|---------|----------|
| Title | Section title | 'Delivery & Adoption Velocity' | Section header |
| Subtitle | Explanatory text | 'Tracks correlation between...' | Context description |
| Labels | Time period labels | ['Jan', 'Feb', 'Mar'...] | Chart X-axis |
| Delivery Values | Development output | [25, 30, 28...] | Line chart |
| Adoption Values | End-user adoption | [10, 15, 22...] | Line chart |
| Target Values | Goal metrics | [28, 28, 30...] | Reference line |
| Baseline Values | Starting metrics | [20, 20, 20...] | Reference line |

#### Insight 3: Impact Analysis

| Field | Description | Example | Used For |
|-------|-------------|---------|----------|
| Title | Section title | 'Internal-to-External Impact' | Section header |
| Subtitle | Explanatory text | 'Connects internal operational...' | Context description |
| Labels | Time period labels | ['Q1', 'Q2', 'Q3', 'Q4'] | Chart X-axis |
| Internal Efficiency | Operational metrics | [12, 18, 25, 30] | Line/bar chart |
| External Value | Impact metrics | [5, 8, 12, 15] | Line/bar chart |
| Target Values | Goal metrics | 28 (single value) | Reference line |
| Baseline Values | Starting metrics | 10 (single value) | Reference line |

### 3. Sector Outcomes Data

#### Outcome 1: Macroeconomic Impact

| Field | Description | Example | Used For |
|-------|-------------|---------|----------|
| Title | Section title | 'Macroeconomic Impact' | Section header |
| Year Labels | Time period | ['2023', '2024', '2025'] | Chart X-axis |
| FDI Values | Foreign direct investment | [1.2, 1.5, 2.1] | Line chart |
| Trade Balance | Import/export balance | [-8, -6, -3] | Line chart |
| Jobs Created | Employment impact | [5, 8, 14] | Line chart |
| Target & Baseline | Reference values | Various | Comparison lines |

#### Outcome 2: Private Sector Partnerships

| Field | Description | Example | Used For |
|-------|-------------|---------|----------|
| Title | Section title | 'Private Sector Partnerships' | Section header |
| Actual Value | Current partnership count | 60 | Main metric |
| Target Value | Goal partnership count | 65 | Comparison |
| Baseline Value | Starting partnership count | 45 | Reference |

#### Outcome 3: Quality of Life

| Field | Description | Example | Used For |
|-------|-------------|---------|----------|
| Title | Section title | 'Citizen Quality of Life' | Section header |
| Category Labels | Service categories | ['Water', 'Energy', 'Transport'] | Chart categories |
| Coverage Values | Service coverage % | [85, 92, 78] | Bar/radar chart |
| Quality Values | Service quality rating | [7, 8, 6] | Bar/radar chart |
| Target & Baseline | Reference values | Various | Comparison values |

#### Outcome 4: Community Engagement

| Field | Description | Example | Used For |
|-------|-------------|---------|----------|
| Title | Section title | 'Community Engagement' | Section header |
| Actual Value | Current engagement level | 45 | Main metric |
| Target Value | Goal engagement level | 50 | Comparison |
| Baseline Value | Starting engagement level | 30 | Reference |

## Query Parameters for Data Fetching

When retrieving dashboard data, the following parameters are needed:

| Parameter | Description | Example | Purpose |
|-----------|-------------|---------|---------|
| Organization ID | Identifier for the organization | 'default' | Filter data for specific org |
| Time Period | Frequency of data points | 'quarterly' | Define data granularity |
| Year | Year to display data for | 2025 | Select time period |
| Start/End Date | Optional date range | '2025-01-01' | For custom date ranges |

## Database Structure Requirements

For a real implementation (beyond the current mock data), the database should focus on Zone 3 and Zone 4 as the primary data sources, with other zones derived from these:

1. **Organizations table** - For storing organization details
2. **Dimensions table (Zone 3)** - For storing dimension definitions and metadata 
3. **Metrics table (Zone 3)** - For storing time-series data for operational metrics
4. **Outcomes table (Zone 4)** - For storing all sector-level outcome metrics
5. **Derived_Insights table** - Optional table for storing pre-calculated insights if performance is a concern

### Data Derivation Flow
- **Zone 1 (Spider Chart)**: Directly uses the same 8 dimensions from Zone 3. The 8 nodes of the spider chart correspond exactly to the 8 dimension entries in Zone 3, using their health scores (0-100).
- **Zone 2 (Strategic Insights)**: Combined visualization of select metrics from Zone 3 and Zone 4, presented in specialized charts

## Data Flow Summary

1. User selects a year (and optionally other filters)
2. Application requests dashboard data using these parameters
3. Backend fetches primary data from Zone 3 (Internal Outputs) and Zone 4 (Sector Outcomes)
4. Zone 1 (Transformation Health) uses the exact same 8 dimension entries as Zone 3, showing them in spider chart format
5. Zone 2 (Strategic Insights) data combines elements from both Zone 3 and Zone 4
6. All data is transformed to calculate derived fields (health scores, formatted KPIs)
7. Transformed data is displayed in the dashboard components

**Executive Summary Flow:**
1. Executive summary remains hidden/blank initially
2. User explicitly clicks the "Generate Executive Summary" button in Transformation Health section
3. Frontend makes secure API call to Gemini AI service
4. Loading state is displayed during generation
5. Generated summary is displayed upon successful completion

## User Interaction and Security Features

### Executive Summary Generation
The dashboard includes a critical security feature in the form of an "Generate Executive Summary" button in the Transformation Health section. This button:

1. Is NOT pre-loaded or automatically generated
2. Only generates content when explicitly requested by the user
3. Triggers a secure API call to generate the summary using Gemini AI
4. Provides loading state feedback during generation
5. Displays the generated summary only after successful completion

This button-triggered approach ensures that sensitive executive summary data is only generated on-demand, reducing security risks and unnecessary API calls.

## Current Implementation Status

Currently, the dashboard is using mock data generated based on the selected year. In a production environment, this data would be fetched from a Supabase database using the edge functions defined in the API folder.

The mock data generator in `/api/supabase.ts` provides a good template for the expected data structure that would come from a real database implementation.

# getDashboardData Edge Function Spec

This document defines the API contract for the main dashboard Edge Function: `getDashboardData`.

---

## Function Purpose
Fetches all dashboard data for a given period, including 8 explicit dimensions, insights, and outcomes.

---

## Dimensions Data Structure

Each dimension object contains the following fields:

| Field      | Type     | Description                                                        |
|------------|----------|--------------------------------------------------------------------|
| id         | string   | Unique identifier for the dimension                                |
| title      | string   | Display name of the dimension                                      |
| health     | number   | Overall score (0-100)                                              |
| kpi        | string   | Key performance indicator (number, percentage, currency, etc.)     |
| label      | string   | Sub-label for the KPI (unit or context)                            |
| trend      | object   | Trend data for the dimension (see below)                           |

**Trend Object Fields:**
| Field      | Type     | Description                                                        |
|------------|----------|--------------------------------------------------------------------|
| baseline   | number   | Baseline value for comparison                                      |
| actual     | number   | Actual value for the current period                                |
| target     | number   | Target value for the period                                        |
| bands      | [number, number] | Thresholds for performance bands (e.g., poor/satisfactory/good) |

---

## List of Dimensions



### 1.0 Strategic Plan Alignment
  - kpi_description: % progress of programs against strategic plans in the quarter
  - kpi_formula: (# of program milestones achieved/# of planned milestones) x 100
  - kpi_base_value: number
  - kpi_actual: number
  - kpi_planned: number
  - kpi_next_target: number
  - kpi_final_target: number
  - health_formula: (actual-planned)/planned x 100
  - health_state: enum [Healthy, At Risk, Distressed]
  - trend: enum [Decline, Rise, Steady]
  - projections: array of numbers (quarterly values for the year)
  - quarter: string (e.g., "Q1 2025", ... "Q4 2029")

### 2.0 Operational Efficiency
  - kpi_description: % of beneficiary support requests closed successfully in a quarter
  - kpi_formula: (# of requests closed/# of requests received) x 100
  - kpi_base_value: number
  - kpi_actual: number
  - kpi_planned: number
  - kpi_next_target: number
  - kpi_final_target: number
  - health_formula: (actual-planned)/planned x 100
  - health_state: enum [Healthy, At Risk, Distressed]
  - trend: enum [Decline, Rise, Steady]
  - projections: array of numbers (quarterly values for the year)
  - quarter: string (e.g., "Q1 2025", ... "Q4 2029")

### 3.0 Risk Mitigation Rate
  - kpi_description: % of identified risks mitigated in the quarter
  - kpi_formula: (# of mitigated risks/# of identified risks) x 100
  - kpi_base_value: number
  - kpi_actual: number
  - kpi_planned: number
  - kpi_next_target: number
  - kpi_final_target: number
  - health_formula: (actual-planned)/planned x 100
  - health_state: enum [Healthy, At Risk, Distressed]
  - trend: enum [Decline, Rise, Steady]
  - projections: array of numbers (quarterly values for the year)
  - quarter: string (e.g., "Q1 2025", ... "Q4 2029")

### 4.0 Investment Portfolio ROI
  - kpi_description: % return on investment portfolio in the quarter
  - kpi_formula: (total returns/total investment) x 100
  - kpi_base_value: number
  - kpi_actual: number
  - kpi_planned: number
  - kpi_next_target: number
  - kpi_final_target: number
  - health_formula: (actual-planned)/planned x 100
  - health_state: enum [Healthy, At Risk, Distressed]
  - trend: enum [Decline, Rise, Steady]
  - projections: array of numbers (quarterly values for the year)
  - quarter: string (e.g., "Q1 2025", ... "Q4 2029")

### 5.0 Active Investor Rate
  - kpi_description: % of active investors in the quarter
  - kpi_formula: (# of active investors/# of total investors) x 100
  - kpi_base_value: number
  - kpi_actual: number
  - kpi_planned: number
  - kpi_next_target: number
  - kpi_final_target: number
  - health_formula: (actual-planned)/planned x 100
  - health_state: enum [Healthy, At Risk, Distressed]
  - trend: enum [Decline, Rise, Steady]
  - projections: array of numbers (quarterly values for the year)
  - quarter: string (e.g., "Q1 2025", ... "Q4 2029")

### 6.0 Employee Engagement Score
  - kpi_description: Average employee engagement score in the quarter
  - kpi_formula: Average of all engagement survey scores in the quarter
  - kpi_base_value: number
  - kpi_actual: number
  - kpi_planned: number
  - kpi_next_target: number
  - kpi_final_target: number
  - health_formula: (actual-planned)/planned x 100
  - health_state: enum [Healthy, At Risk, Distressed]
  - trend: enum [Decline, Rise, Steady]
  - projections: array of numbers (quarterly values for the year)
  - quarter: string (e.g., "Q1 2025", ... "Q4 2029")

### 7.0 Project Delivery Velocity
  - kpi_description: % of planned project deliveries completed in the quarter
  - kpi_formula: (# of completed project deliveries/# of planned project deliveries) x 100
  - kpi_base_value: number
  - kpi_actual: number
  - kpi_planned: number
  - kpi_next_target: number
  - kpi_final_target: number
  - health_formula: (actual-planned)/planned x 100
  - health_state: enum [Healthy, At Risk, Distressed]
  - trend: enum [Decline, Rise, Steady]
  - projections: array of numbers (quarterly values for the year)
  - quarter: string (e.g., "Q1 2025", ... "Q4 2029")

### 8.0 Tech Stack SLA Compliance
  - kpi_description: % of tech stack services meeting SLA compliance in the quarter
  - kpi_formula: (# of SLA-compliant services/# of total tech stack services) x 100
  - kpi_base_value: number
  - kpi_actual: number
  - kpi_planned: number
  - kpi_next_target: number
  - kpi_final_target: number
  - health_formula: (actual-planned)/planned x 100
  - health_state: enum [Healthy, At Risk, Distressed]
  - trend: enum [Decline, Rise, Steady]
  - projections: array of numbers (quarterly values for the year)
  - quarter: string (e.g., "Q1 2025", ... "Q4 2029")

---

## Example Dimensions Data

```json
{
  "dimensions": [
    {
      "id": "dim1",
      "title": "Operational Efficiency",
      "health": 73,
      "kpi": "81%",
      "label": "Utilization",
      "trend": { "baseline": 63, "actual": 81, "target": 88, "bands": [68, 83] }
    },
    {
      "id": "dim2",
      "title": "Financial Health",
      "health": 72,
      "kpi": "$2.7M",
      "label": "Revenue",
      "trend": { "baseline": 1800000, "actual": 2705169, "target": 2800000, "bands": [2000000, 2700000] }
    },
    {
      "id": "dim3",
      "title": "Innovation Capacity",
      "health": 66,
      "kpi": "64%",
      "label": "Adoption Rate",
      "trend": { "baseline": 55, "actual": 64, "target": 70, "bands": [60, 68] }
    },
    {
      "id": "dim4",
      "title": "Talent Capability",
      "health": 80,
      "kpi": "120",
      "label": "Training Hours",
      "trend": { "baseline": 100, "actual": 120, "target": 140, "bands": [110, 130] }
    },
    {
      "id": "dim5",
      "title": "Customer Satisfaction",
      "health": 72,
      "kpi": "4.2/5",
      "label": "CSAT Score",
      "trend": { "baseline": 3.8, "actual": 4.2, "target": 4.5, "bands": [4.0, 4.3] }
    },
    {
      "id": "dim6",
      "title": "Process Quality",
      "health": 90,
      "kpi": "92%",
      "label": "Compliance Rate",
      "trend": { "baseline": 85, "actual": 92, "target": 95, "bands": [88, 93] }
    },
    {
      "id": "dim7",
      "title": "Risk Management",
      "health": 60,
      "kpi": "5",
      "label": "Incidents",
      "trend": { "baseline": 8, "actual": 5, "target": 3, "bands": [7, 4] }
    },
    {
      "id": "dim8",
      "title": "Sustainability",
      "health": 78,
      "kpi": "78%",
      "label": "Green Score",
      "trend": { "baseline": 70, "actual": 78, "target": 85, "bands": [75, 80] }
    }
  ]
}
```

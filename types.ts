// Dashboard data types for the clean dashboard

export interface Dimension {
  id: string;
  title: string;
  health: number;
  kpi: string;
  label: string;
  kpi_description?: string;
  trend: {
    baseline: number;
    actual: number;
    target: number;
    bands: [number, number];
  };
  kpi_actual: number;
  kpi_planned: number;
  kpi_base_value: number;
  kpi_next_target: number;
  kpi_final_target: number;
  health_state: 'Healthy' | 'At Risk' | 'Distressed';
  trend_direction: 'Decline' | 'Rise' | 'Steady';
  projections: number[];
}

export interface DashboardData {
  dimensions: Dimension[];
  insight1: any;
  insight2: any;
  insight3: any;
  outcomes: any;
}

export type DashboardAnalyticsType = {
  users_count: number;
  total_tickets_count: number;
  total_tickets_today: number;
  total_tickets_month: number;
  total_tickets_delayed: number;
  total_assets: number;
};

export interface WidgetMapping {
  icon: string;
  title: string;
  color: string;
}

export type ChartType =
  | "Pie Chart"
  | "Bar Chart"
  | "Line Chart"
  | "Stacked Bar Chart"
  | "Gauge Chart"
  | "Heatmap Chart";

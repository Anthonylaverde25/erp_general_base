export interface DashboardWidget {
  id: number;
  dashboard_id: number;
  widget_type: string;
  title: string | null;
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
  };
  settings: Record<string, any> | null;
}

export interface Dashboard {
  id: number;
  company_id: number;
  user_id: number | null;
  name: string;
  is_default: boolean;
  widgets: DashboardWidget[];
  created_at?: string;
  updated_at?: string;
}

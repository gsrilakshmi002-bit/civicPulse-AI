export type UserRole = "citizen" | "admin" | "analyst";

export interface StatusHistory {
  id?: number;
  complaint_id: string;
  status: string;
  notes: string;
  changed_by: string;
  timestamp: string;
}

export interface DuplicateLink {
  id?: number;
  primary_id: string;
  duplicate_id: string;
  similarity_score: number;
  merged_at: string;
  merged_by: string;
  notes?: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  priority_score: number;
  priority_level: "Critical" | "High" | "Medium" | "Low";
  priority_reason: string;
  safety_score: number;
  affected_score: number;
  recurrence_score: number;
  waiting_score: number;
  status: "Submitted" | "Under Review" | "Assigned" | "In Progress" | "Resolved" | "Rejected";
  citizen_name: string;
  citizen_email?: string;
  locality: string;
  ward: string;
  latitude: number;
  longitude: number;
  image_url?: string;
  department: string;
  ai_summary: string;
  suggested_action: string;
  rejection_reason?: string | null;
  duplicate_of?: string | null;
  is_merged?: number;
  created_at: string;
  updated_at: string;
  history?: StatusHistory[];
  duplicates?: DuplicateLink[];
}

export interface AnalyticsSummary {
  metrics: {
    total_complaints: number;
    pending_complaints: number;
    resolved_complaints: number;
    urgent_pending: number;
    critical_total: number;
    resolution_rate_percent: number;
    average_resolution_hours: number;
    average_resolution_days: number;
  };
  status_breakdown: Record<string, number>;
  category_distribution: Array<{ category: string; count: number; percentage: number }>;
  ward_distribution: Array<{ ward: string; locality: string; count: number }>;
  monthly_trends: Array<{ month: string; total: number; resolved: number; pending: number; formatted_month: string }>;
  recurring_hotspots: Array<{
    locality: string;
    ward: string;
    category: string;
    report_count: number;
    avg_priority: number;
    latest_report: string;
    is_highlight: boolean;
    status: string;
  }>;
}

export interface PredictiveData {
  historical_series: Array<{ period: string; actual: number; predicted: number; type: string }>;
  forecast_series: Array<{ period: string; predicted: number; lower_bound: number; upper_bound: number; type: string; seasonal_factor: string }>;
  combined_chart_data: any[];
  category_risk_projections: Array<{ category: string; risk_level: string; reason: string }>;
  disclaimer: string;
  model_confidence: string;
}

export interface EnvironmentalData {
  environmental_kpis: {
    total_environmental_complaints: number;
    resolved_environmental_complaints: number;
    liters_water_saved_estimate: number;
    plastic_recovered_kg: number;
    carbon_offset_kg: number;
  };
  breakdown: {
    garbage_reports: number;
    garbage_resolved: number;
    water_leaks_reported: number;
    water_leaks_resolved: number;
    drainage_issues: number;
    drainage_resolved: number;
    plastic_dumping_reports: number;
    plastic_dumping_resolved: number;
  };
  waste_hotspots: Array<{ locality: string; ward: string; category: string; count: number }>;
  prevention_recommendations: Array<{ title: string; target: string; impact: string; status: string }>;
}

import { Complaint, AnalyticsSummary, PredictiveData, EnvironmentalData } from "./types";

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: "CIV-2024-00101",
    title: "Severe overflowing garbage and rotting stench at Maple Street 4th Cross",
    description: "Massive mound of uncollected municipal waste spilling onto the main road near Maple Gardens gate. Animals scattering plastic bags, foul odor affecting nearby school children and residents.",
    category: "Overflowing Garbage",
    ward: "Ward 3",
    locality: "Green Valley & Maple Gardens",
    latitude: 12.9848,
    longitude: 77.6205,
    priority_score: 94,
    priority_level: "Critical",
    priority_reason: "CRITICAL RECURRENCE HOTSPOT: Safety (31/35), High Citizen Exposure (24/25), Recurrence Hotspot (24/25), Aging (15/15). Multiple cluster reports detected within 50m radius.",
    safety_score: 31,
    affected_score: 24,
    recurrence_score: 24,
    waiting_score: 15,
    status: "In Progress",
    citizen_name: "Aarav Sharma",
    citizen_email: "aarav.sharma@civicai.demo",
    image_url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
    department: "Solid Waste Management",
    ai_summary: "Urgent municipal garbage overflow causing severe pedestrian obstruction, public health hazard, and recurring waste hotspot in Maple Gardens.",
    suggested_action: "Deploy rapid response compactor truck, inspect neighborhood collection schedule, and install automated smart bin sensor.",
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    history: [
      {
        complaint_id: "CIV-2024-00101",
        status: "Submitted",
        notes: "Complaint registered and categorized by CivicAI engine",
        changed_by: "Aarav Sharma",
        timestamp: new Date(Date.now() - 3 * 86400000).toISOString()
      },
      {
        complaint_id: "CIV-2024-00101",
        status: "Assigned",
        notes: "Routed to Solid Waste Management sanitation supervisor",
        changed_by: "CivicAI Auto-Router",
        timestamp: new Date(Date.now() - 2 * 86400000).toISOString()
      },
      {
        complaint_id: "CIV-2024-00101",
        status: "In Progress",
        notes: "Compactor truck dispatched for on-site waste clearance",
        changed_by: "Ward 3 Supervisor",
        timestamp: new Date(Date.now() - 1 * 86400000).toISOString()
      }
    ]
  },
  {
    id: "CIV-2024-00102",
    title: "Uncollected trash pile blocking pedestrian walkway on Maple Street",
    description: "Garbage bins are overflowing completely at Maple St corner 4th cross. Trash has spread 20 meters down the street. It has been 5 days without waste pickup.",
    category: "Overflowing Garbage",
    ward: "Ward 3",
    locality: "Green Valley & Maple Gardens",
    latitude: 12.9849,
    longitude: 77.6208,
    priority_score: 91,
    priority_level: "Critical",
    priority_reason: "Calculated based on Safety Risk (28/35), Citizen Exposure (23/25), Recurrence Index (25/25), and Aging Factor (15/15).",
    safety_score: 28,
    affected_score: 23,
    recurrence_score: 25,
    waiting_score: 15,
    status: "Under Review",
    citizen_name: "Sneha Iyer",
    citizen_email: "sneha.iyer@civicai.demo",
    image_url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
    department: "Solid Waste Management",
    ai_summary: "High volume trash accumulation encroaching onto public walkway.",
    suggested_action: "Merge with ticket #CIV-2024-00101 and dispatch waste collection team.",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    history: [
      {
        complaint_id: "CIV-2024-00102",
        status: "Submitted",
        notes: "Logged via Citizen Portal",
        changed_by: "Sneha Iyer",
        timestamp: new Date(Date.now() - 2 * 86400000).toISOString()
      }
    ]
  },
  {
    id: "CIV-2024-00103",
    title: "Rotting garbage hotspot and stray animals near Maple Gardens Gate",
    description: "Intense foul smell and disease hazard. Overflowing dumpster right outside apartment complex.",
    category: "Overflowing Garbage",
    ward: "Ward 3",
    locality: "Green Valley & Maple Gardens",
    latitude: 12.9846,
    longitude: 77.6202,
    priority_score: 89,
    priority_level: "Critical",
    priority_reason: "High safety risk from bio-waste decomposition and stray animal feeding.",
    safety_score: 30,
    affected_score: 22,
    recurrence_score: 24,
    waiting_score: 13,
    status: "Submitted",
    citizen_name: "Kavita Deshmukh",
    citizen_email: "kavita.deshmukh@civicai.demo",
    image_url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
    department: "Solid Waste Management",
    ai_summary: "Severe biohazard and waste overflow at residential gateway.",
    suggested_action: "Schedule emergency sanitation and chemical disinfectant spray.",
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: "CIV-2024-00105",
    title: "Deep hazardous pothole near school crossing causing bike skids",
    description: "Deep crater on arterial road, approx 15 inches deep. Multiple two-wheelers had near-miss accidents this morning outside St. Anne's School.",
    category: "Potholes & Damaged Roads",
    ward: "Ward 1",
    locality: "Downtown Central Business District",
    latitude: 12.9716,
    longitude: 77.5946,
    priority_score: 93,
    priority_level: "Critical",
    priority_reason: "Immediate life-safety hazard in designated school pedestrian zone.",
    safety_score: 34,
    affected_score: 25,
    recurrence_score: 19,
    waiting_score: 15,
    status: "In Progress",
    citizen_name: "David Chen",
    image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    department: "Roads & Highway Infrastructure",
    ai_summary: "Severe asphalt crater near school crossing with acute accident probability.",
    suggested_action: "Deploy asphalt repair crew for immediate cold-mix filling.",
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    history: [
      {
        complaint_id: "CIV-2024-00105",
        status: "Submitted",
        notes: "Classified as Critical Safety Hazard",
        changed_by: "David Chen",
        timestamp: new Date(Date.now() - 4 * 86400000).toISOString()
      },
      {
        complaint_id: "CIV-2024-00105",
        status: "In Progress",
        notes: "Barricades erected, bitumen crew assigned",
        changed_by: "Public Works Admin",
        timestamp: new Date(Date.now() - 1 * 86400000).toISOString()
      }
    ]
  },
  {
    id: "CIV-2024-00106",
    title: "Major underground potable water pipe burst flooding roadway",
    description: "Clean drinking water gushing out under pressure for the last 18 hours. Thousands of gallons being wasted while sidewalk pavers are undermined.",
    category: "Water Leakage & Main Burst",
    ward: "Ward 1",
    locality: "Downtown Central Business District",
    latitude: 12.9732,
    longitude: 77.5960,
    priority_score: 90,
    priority_level: "Critical",
    priority_reason: "Potable water resource depletion and sidewalk erosion risk.",
    safety_score: 31,
    affected_score: 24,
    recurrence_score: 20,
    waiting_score: 15,
    status: "Assigned",
    citizen_name: "Vikram Malhotra",
    image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
    department: "Water Supply & Sewerage Board",
    ai_summary: "High volume drinking water line rupture requiring immediate valve shutoff.",
    suggested_action: "Isolate distribution grid and replace ruptured 300mm pipe segment.",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: "CIV-2024-00107",
    title: "All 6 streetlights non-operational on 5th Main connector",
    description: "Complete pitch black stretch of road for 400 meters. Senior citizens and women feel very unsafe walking home after 8 PM.",
    category: "Broken Streetlights",
    ward: "Ward 2",
    locality: "Westside Residential Suburbs",
    latitude: 12.9601,
    longitude: 77.5732,
    priority_score: 74,
    priority_level: "High",
    priority_reason: "Public safety and crime deterrence risk during night hours.",
    safety_score: 26,
    affected_score: 21,
    recurrence_score: 15,
    waiting_score: 12,
    status: "Resolved",
    citizen_name: "Priya Nair",
    department: "Municipal Electrical & Energy Board",
    ai_summary: "Electrical circuit blackout affecting 6 consecutive street luminaires.",
    suggested_action: "Inspect underground junction box and replace tripped circuit breaker.",
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    history: [
      {
        complaint_id: "CIV-2024-00107",
        status: "Submitted",
        notes: "Ticket registered",
        changed_by: "Priya Nair",
        timestamp: new Date(Date.now() - 14 * 86400000).toISOString()
      },
      {
        complaint_id: "CIV-2024-00107",
        status: "Resolved",
        notes: "Junction box rewired, LED fixtures illuminated",
        changed_by: "Electrical Linesman Crew",
        timestamp: new Date(Date.now() - 12 * 86400000).toISOString()
      }
    ]
  },
  {
    id: "CIV-2024-00108",
    title: "Stormwater drain clogged with plastic packaging causing street flood",
    description: "Monsoon drain is fully choked with single-use plastic and thermocol packaging. Even moderate rain causes waterlogging inside houses.",
    category: "Drainage & Sewage Blockage",
    ward: "Ward 4",
    locality: "Industrial Corridor Sector 7",
    latitude: 12.9421,
    longitude: 77.6324,
    priority_score: 82,
    priority_level: "Critical",
    priority_reason: "Flood vulnerability and public property damage hazard.",
    safety_score: 29,
    affected_score: 22,
    recurrence_score: 18,
    waiting_score: 13,
    status: "Resolved",
    citizen_name: "Arjun Patel",
    department: "Stormwater Drainage Department",
    ai_summary: "Severe solid waste blockage in arterial monsoon drainage culvert.",
    suggested_action: "Deploy jetting machine and install solid debris catch-basket.",
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 18 * 86400000).toISOString()
  },
  {
    id: "CIV-2024-00109",
    title: "Wheelchair ramp blocked by unpermitted commercial billboard",
    description: "Municipal footpath ramp to the community health center is completely obstructed by private generator and billboard frame.",
    category: "Accessibility & Footpath Barrier",
    ward: "Ward 6",
    locality: "South Park District & Market",
    latitude: 12.9234,
    longitude: 77.5819,
    priority_score: 78,
    priority_level: "High",
    priority_reason: "Direct ADA non-compliance obstructing healthcare access for disabled citizens.",
    safety_score: 27,
    affected_score: 21,
    recurrence_score: 16,
    waiting_score: 14,
    status: "Resolved",
    citizen_name: "Fatima Al-Mansoor",
    department: "Urban Planning & Public Access",
    ai_summary: "Physical obstruction preventing barrier-free hospital clinic entry.",
    suggested_action: "Issue immediate encroachment removal citation.",
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 23 * 86400000).toISOString()
  }
];

export function computeLocalAnalytics(complaints: Complaint[]): AnalyticsSummary {
  const total = complaints.length;
  const statusMap: Record<string, number> = {};
  complaints.forEach((c) => {
    statusMap[c.status] = (statusMap[c.status] || 0) + 1;
  });

  const resolved = statusMap["Resolved"] || 0;
  const pending = total - resolved;
  const urgent_pending = complaints.filter(
    (c) => (c.priority_level === "Critical" || c.priority_level === "High") && c.status !== "Resolved"
  ).length;

  // Category counts
  const catMap: Record<string, number> = {};
  complaints.forEach((c) => {
    catMap[c.category] = (catMap[c.category] || 0) + 1;
  });
  const category_distribution = Object.entries(catMap)
    .map(([cat, count]) => ({
      category: cat,
      count,
      percentage: Math.round((count / Math.max(1, total)) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  // Ward counts
  const wardMap: Record<string, { count: number; locality: string }> = {};
  complaints.forEach((c) => {
    if (!wardMap[c.ward]) {
      wardMap[c.ward] = { count: 0, locality: c.locality };
    }
    wardMap[c.ward].count += 1;
  });
  const ward_distribution = Object.entries(wardMap)
    .map(([ward, data]) => ({
      ward,
      locality: data.locality,
      count: data.count,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    metrics: {
      total_complaints: total,
      pending_complaints: pending,
      resolved_complaints: resolved,
      urgent_pending: urgent_pending,
      critical_total: complaints.filter((c) => c.priority_level === "Critical").length,
      resolution_rate_percent: Math.round((resolved / Math.max(1, total)) * 1000) / 10,
      average_resolution_hours: 28.4,
      average_resolution_days: 1.2,
    },
    status_breakdown: statusMap,
    category_distribution,
    ward_distribution,
    monthly_trends: [
      { month: "2026-05", total: 11, resolved: 9, pending: 2, formatted_month: "May 2026" },
      { month: "2026-06", total: 22, resolved: 21, pending: 1, formatted_month: "Jun 2026" },
      { month: "2026-07", total: 19, resolved: 18, pending: 1, formatted_month: "Jul 2026" },
      { month: "2026-08", total: 21, resolved: 15, pending: 6, formatted_month: "Aug 2026" },
      { month: "2026-09", total: 22, resolved: 6, pending: 16, formatted_month: "Sep 2026" },
      { month: "2026-10", total: 10, resolved: 2, pending: 8, formatted_month: "Oct 2026" },
    ],
    recurring_hotspots: [
      {
        locality: "Green Valley & Maple Gardens",
        ward: "Ward 3",
        category: "Overflowing Garbage",
        report_count: 4,
        avg_priority: 91.5,
        latest_report: new Date().toISOString(),
        is_highlight: true,
        status: "Action Required",
      },
      {
        locality: "Industrial Corridor Sector 7",
        ward: "Ward 4",
        category: "Potholes & Damaged Roads",
        report_count: 7,
        avg_priority: 68.2,
        latest_report: new Date(Date.now() - 4 * 86400000).toISOString(),
        is_highlight: false,
        status: "Action Required",
      },
      {
        locality: "Downtown Central Business District",
        ward: "Ward 1",
        category: "Water Leakage & Main Burst",
        report_count: 5,
        avg_priority: 72.4,
        latest_report: new Date(Date.now() - 2 * 86400000).toISOString(),
        is_highlight: false,
        status: "Action Required",
      },
    ],
  };
}

export const MOCK_PREDICTIVE: PredictiveData = {
  historical_series: [
    { period: "May 2026", actual: 11, predicted: 12, type: "Historical Actual" },
    { period: "Jun 2026", actual: 22, predicted: 20, type: "Historical Actual" },
    { period: "Jul 2026", actual: 19, predicted: 21, type: "Historical Actual" },
    { period: "Aug 2026", actual: 21, predicted: 23, type: "Historical Actual" },
    { period: "Sep 2026", actual: 22, predicted: 25, type: "Historical Actual" },
    { period: "Oct 2026", actual: 10, predicted: 27, type: "Historical Actual" },
  ],
  forecast_series: [
    { period: "Nov 2026 (Forecast)", predicted: 31.4, lower_bound: 27.6, upper_bound: 36.1, type: "Predictive AI Forecast", seasonal_factor: "+12% precipitation surge factor" },
    { period: "Dec 2026 (Forecast)", predicted: 36.2, lower_bound: 31.8, upper_bound: 41.6, type: "Predictive AI Forecast", seasonal_factor: "+25% road freeze & rain wear" },
    { period: "Jan 2027 (Forecast)", predicted: 29.8, lower_bound: 26.2, upper_bound: 34.3, type: "Predictive AI Forecast", seasonal_factor: "+8% seasonal maintenance factor" },
  ],
  combined_chart_data: [],
  category_risk_projections: [
    { category: "Drainage & Sewage Blockage", risk_level: "Surge Expected (+35%)", reason: "Upcoming seasonal precipitation based on 3-year meteorological correlations." },
    { category: "Potholes & Damaged Roads", risk_level: "High (+28%)", reason: "Water ingress following road weathering across arterial sectors." },
    { category: "Overflowing Garbage", risk_level: "Steady (+5%)", reason: "Consistent demographic density in Wards 3 & 6; mitigation via smart bins recommended." },
  ],
  disclaimer: "SYNTHETIC DEMONSTRATION DATA: Projections are generated via linear regression & seasonal meteorological modeling on demonstration complaint records. Never present as unvalidated municipal forecasts.",
  model_confidence: "87.4% R-squared fit on synthetic distribution",
};

export const MOCK_ENVIRONMENTAL: EnvironmentalData = {
  environmental_kpis: {
    total_environmental_complaints: 42,
    resolved_environmental_complaints: 28,
    liters_water_saved_estimate: 68000,
    plastic_recovered_kg: 3450,
    carbon_offset_kg: 4960,
  },
  breakdown: {
    garbage_reports: 16,
    garbage_resolved: 11,
    water_leaks_reported: 9,
    water_leaks_resolved: 7,
    drainage_issues: 11,
    drainage_resolved: 6,
    plastic_dumping_reports: 6,
    plastic_dumping_resolved: 4,
  },
  waste_hotspots: [
    { locality: "Green Valley & Maple Gardens", ward: "Ward 3", category: "Overflowing Garbage", count: 4 },
    { locality: "Industrial Corridor Sector 7", ward: "Ward 4", category: "Plastic Pollution & Dumping", count: 3 },
    { locality: "Downtown Central Business District", ward: "Ward 1", category: "Water Leakage & Main Burst", count: 3 },
  ],
  prevention_recommendations: [
    {
      title: "Smart Bin IoT Fill-Level Sensor Deployment",
      target: "Maple Street & Green Valley (Ward 3 Hotspot)",
      impact: "Eliminates visual overflow by alerting sanitation trucks at 80% container capacity.",
      status: "High Priority Action",
    },
    {
      title: "Acoustic Pipe Leakage Telemetry",
      target: "Downtown Central Business District (Ward 1)",
      impact: "Identifies sub-surface micro-fissures before high-pressure potable main bursts occur.",
      status: "Recommended Implementation",
    },
    {
      title: "Automated Stormwater Trash Grates & Bio-Filters",
      target: "Industrial Corridor Sector 7 (Ward 4)",
      impact: "Traps 95% of solid plastic packaging before it chokes municipal stormwater channels.",
      status: "Infrastructure Upgrade",
    },
    {
      title: "Community Segregated Cleanliness Incentives",
      target: "South Park District & Market (Ward 6)",
      impact: "Promotes source segregation of wet food waste, lowering landfill transport volume by 40%.",
      status: "Citizen Engagement",
    },
  ],
};

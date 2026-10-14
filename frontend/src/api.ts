import { Complaint, AnalyticsSummary, PredictiveData, EnvironmentalData } from "./types";

const BASE_URL = "http://127.0.0.1:8000/api";

export async function fetchComplaints(params?: {
  category?: string;
  status?: string;
  priority_level?: string;
  ward?: string;
  search?: string;
  sort_by?: string;
  sort_order?: string;
}): Promise<Complaint[]> {
  const query = new URLSearchParams();
  if (params?.category && params.category !== "All") query.append("category", params.category);
  if (params?.status && params.status !== "All") query.append("status", params.status);
  if (params?.priority_level && params.priority_level !== "All") query.append("priority_level", params.priority_level);
  if (params?.ward && params.ward !== "All") query.append("ward", params.ward);
  if (params?.search) query.append("search", params.search);
  if (params?.sort_by) query.append("sort_by", params.sort_by);
  if (params?.sort_order) query.append("sort_order", params.sort_order);

  const res = await fetch(`${BASE_URL}/complaints?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch complaints");
  return res.json();
}

export async function fetchComplaintById(id: string): Promise<Complaint> {
  const res = await fetch(`${BASE_URL}/complaints/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Complaint ${id} not found`);
  return res.json();
}

export async function submitComplaint(data: {
  title: string;
  description: string;
  locality: string;
  ward: string;
  category?: string;
  image_url?: string;
  citizen_name?: string;
  citizen_email?: string;
}): Promise<Complaint> {
  const res = await fetch(`${BASE_URL}/complaints`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to submit complaint");
  return res.json();
}

export async function updateComplaintStatus(
  id: string,
  data: { status: string; notes?: string; changed_by?: string; rejection_reason?: string; department?: string }
): Promise<Complaint> {
  const res = await fetch(`${BASE_URL}/complaints/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}

export async function overrideComplaintPriority(
  id: string,
  data: { priority_level: string; priority_score: number; override_reason: string; changed_by?: string }
): Promise<Complaint> {
  const res = await fetch(`${BASE_URL}/complaints/${encodeURIComponent(id)}/priority`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to override priority");
  return res.json();
}

export async function findDuplicates(payload: {
  complaint_id?: string;
  title: string;
  description: string;
  category?: string;
  ward?: string;
  locality?: string;
}): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/duplicates/find`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to find duplicates");
  return res.json();
}

export async function mergeDuplicateComplaints(payload: {
  primary_id: string;
  duplicate_ids: string[];
  merged_by?: string;
  notes?: string;
}): Promise<any> {
  const res = await fetch(`${BASE_URL}/duplicates/merge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to merge duplicates");
  return res.json();
}

export async function fetchAnalytics(): Promise<AnalyticsSummary> {
  const res = await fetch(`${BASE_URL}/analytics/summary`);
  if (!res.ok) throw new Error("Failed to fetch analytics summary");
  return res.json();
}

export async function fetchPredictive(): Promise<PredictiveData> {
  const res = await fetch(`${BASE_URL}/analytics/predictive`);
  if (!res.ok) throw new Error("Failed to fetch predictive analytics");
  return res.json();
}

export async function fetchEnvironmental(): Promise<EnvironmentalData> {
  const res = await fetch(`${BASE_URL}/environmental`);
  if (!res.ok) throw new Error("Failed to fetch environmental data");
  return res.json();
}

export async function classifyComplaintAI(payload: {
  title: string;
  description: string;
  locality?: string;
  ward?: string;
}): Promise<any> {
  const res = await fetch(`${BASE_URL}/ai/classify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to classify complaint");
  return res.json();
}

export async function askAssistant(question: string): Promise<{ answer: string; grounded_data?: any }> {
  const res = await fetch(`${BASE_URL}/assistant/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error("Failed to query assistant");
  return res.json();
}

export async function resetDatabase(): Promise<any> {
  const res = await fetch(`${BASE_URL}/demo/reset`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to reset database");
  return res.json();
}

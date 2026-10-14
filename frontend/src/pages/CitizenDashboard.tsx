import React, { useState } from "react";
import { Icon } from "../components/Icons";
import { Complaint } from "../types";

interface CitizenDashboardProps {
  onNavigate: (page: string, params?: any) => void;
  complaints: Complaint[];
}

export function CitizenDashboard({ onNavigate, complaints }: CitizenDashboardProps) {
  const [trackInput, setTrackInput] = useState("");

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackInput.trim()) {
      onNavigate("track", { complaintId: trackInput.trim() });
    }
  };

  const myRecent = complaints.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-[var(--border-color)] bg-gradient-to-r from-teal-950/40 to-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">
              Citizen Portal
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Welcome back, Citizen
            </h1>
            <p className="text-xs md:text-sm text-[var(--text-muted)]">
              Report local civic issues, track real-time resolution progress, and explore neighborhood sustainability initiatives.
            </p>
          </div>
          <button
            onClick={() => onNavigate("submit")}
            className="btn-primary self-start md:self-auto text-xs whitespace-nowrap"
          >
            <Icon name="plus" className="w-4 h-4" />
            <span>File New Complaint</span>
          </button>
        </div>
      </div>

      {/* Quick Tracking Search Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-[var(--border-color)]">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <Icon name="search" className="w-4 h-4 text-teal-400" />
          <span>Quick Ticket Tracker</span>
        </h3>
        <form onSubmit={handleTrackSubmit} className="flex gap-2">
          <input
            type="text"
            value={trackInput}
            onChange={(e) => setTrackInput(e.target.value)}
            placeholder="Enter Complaint ID (e.g., CIV-2024-00101)"
            className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
          <button type="submit" className="btn-primary text-xs px-5">
            Track
          </button>
        </form>
      </div>

      {/* Two Column: Recent Neighborhood Reports & Quick Sustainability Tips */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Reports in Community */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Icon name="clock" className="w-4 h-4 text-teal-400" />
              <span>Recent Community Submissions</span>
            </h3>
            <button
              onClick={() => onNavigate("explorer")}
              className="text-xs text-teal-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View All</span>
              <Icon name="chevronRight" className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[var(--border-color)]">
            {myRecent.map((c) => (
              <div
                key={c.id}
                onClick={() => onNavigate("track", { complaintId: c.id })}
                className="py-3.5 flex items-start justify-between gap-4 cursor-pointer group hover:bg-[var(--bg-surface)] px-2.5 rounded-xl transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-teal-400">
                      #{c.id}
                    </span>
                    <span className="text-[11px] text-[var(--text-dim)]">• {c.ward}</span>
                    <span className={`badge-${c.priority_level.toLowerCase()} text-[10px]`}>
                      {c.priority_level} ({c.priority_score})
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-white group-hover:text-teal-300 transition-colors line-clamp-1">
                    {c.title}
                  </h4>
                  <p className="text-[11px] text-[var(--text-muted)] line-clamp-1">
                    {c.locality}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      c.status === "Resolved"
                        ? "status-resolved"
                        : c.status === "In Progress"
                        ? "status-progress"
                        : "status-review"
                    }`}
                  >
                    {c.status}
                  </span>
                  <p className="text-[10px] text-[var(--text-dim)] mt-1">
                    {new Date(c.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Advisories & Eco Actions */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-3 border-l-4 border-l-teal-500">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Icon name="sparkles" className="w-4 h-4 text-teal-400" />
              <span>Smart Citizen Tips</span>
            </h4>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              When reporting potholes or water leaks, including clear street landmarks and approximate dimensions helps our AI calculate precise priority scores and dispatch the right department.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3 border-l-4 border-l-rose-500">
            <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
              <Icon name="alert" className="w-4 h-4" />
              <span>Recurring Hotspot Alert</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Maple Street (Ward 3)</strong> currently has an active recurring garbage overflow alert. Municipal compactor trucks are on dynamic dispatch.
            </p>
            <button
              onClick={() => onNavigate("track", { complaintId: "CIV-2024-00101" })}
              className="text-xs text-rose-400 hover:underline font-bold"
            >
              Track Maple Street Cluster →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

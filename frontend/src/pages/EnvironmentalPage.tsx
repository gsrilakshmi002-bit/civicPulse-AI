import React from "react";
import { Icon } from "../components/Icons";
import { EnvironmentalData } from "../types";

interface EnvironmentalPageProps {
  data: EnvironmentalData | null;
  onNavigate: (page: string, params?: any) => void;
}

export function EnvironmentalPage({ data, onNavigate }: EnvironmentalPageProps) {
  const kpis = data?.environmental_kpis;
  const breakdown = data?.breakdown;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-[var(--border-color)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
              <Icon name="leaf" className="w-3.5 h-3.5 text-emerald-400" />
              <span>Eco-Intelligence & Sustainability Module</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Environmental Sustainability Dashboard
            </h1>
            <p className="text-xs md:text-sm text-[var(--text-muted)]">
              Auditing municipal waste hotspots, potable water conservation, and plastic diversion metrics across urban sectors.
            </p>
          </div>
          <button
            onClick={() => onNavigate("submit")}
            className="btn-primary text-xs self-start md:self-auto bg-gradient-to-r from-emerald-600 to-teal-500"
          >
            <Icon name="leaf" className="w-4 h-4" />
            <span>Report Environmental Issue</span>
          </button>
        </div>
      </div>

      {/* Eco Impact KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-sky-500">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase">
            Drinking Water Saved
          </p>
          <p className="text-2xl lg:text-3xl font-extrabold text-sky-400 mt-1">
            {(kpis?.liters_water_saved_estimate ?? 51000).toLocaleString()} L
          </p>
          <p className="text-[11px] text-sky-300 mt-2">
            Conserved via repaired pipe bursts
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-emerald-500">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase">
            Plastic Diverted & Cleared
          </p>
          <p className="text-2xl lg:text-3xl font-extrabold text-emerald-400 mt-1">
            {(kpis?.plastic_recovered_kg ?? 2880).toLocaleString()} kg
          </p>
          <p className="text-[11px] text-emerald-300 mt-2">
            Removed from stormwater drains
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-teal-500">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase">
            Estimated Carbon Offset
          </p>
          <p className="text-2xl lg:text-3xl font-extrabold text-teal-400 mt-1">
            {(kpis?.carbon_offset_kg ?? 4130).toLocaleString()} kg CO₂e
          </p>
          <p className="text-[11px] text-teal-300 mt-2">
            Avoided landfill emissions & pump load
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-amber-500">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase">
            Total Eco Complaints
          </p>
          <p className="text-2xl lg:text-3xl font-extrabold text-amber-400 mt-1">
            {kpis?.total_environmental_complaints ?? 38}
          </p>
          <p className="text-[11px] text-amber-300 mt-2">
            {kpis?.resolved_environmental_complaints ?? 24} successfully mitigated
          </p>
        </div>
      </div>

      {/* Environmental Audit Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Icon name="chart" className="w-4 h-4 text-emerald-400" />
            <span>Environmental Sub-Sector Audits</span>
          </h3>

          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex justify-between items-center">
              <div>
                <span className="font-bold text-white block">Solid Waste & Overflowing Garbage</span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Resolved: {breakdown?.garbage_resolved} / {breakdown?.garbage_reports}
                </span>
              </div>
              <span className="font-mono text-emerald-400 font-bold">
                {Math.round(((breakdown?.garbage_resolved || 0) / Math.max(1, breakdown?.garbage_reports || 1)) * 100)}% Cleared
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex justify-between items-center">
              <div>
                <span className="font-bold text-white block">Potable Water Main Leakages</span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Resolved: {breakdown?.water_leaks_resolved} / {breakdown?.water_leaks_reported}
                </span>
              </div>
              <span className="font-mono text-sky-400 font-bold">
                {Math.round(((breakdown?.water_leaks_resolved || 0) / Math.max(1, breakdown?.water_leaks_reported || 1)) * 100)}% Cleared
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex justify-between items-center">
              <div>
                <span className="font-bold text-white block">Stormwater Drainage & Silt Blockage</span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Resolved: {breakdown?.drainage_resolved} / {breakdown?.drainage_issues}
                </span>
              </div>
              <span className="font-mono text-teal-400 font-bold">
                {Math.round(((breakdown?.drainage_resolved || 0) / Math.max(1, breakdown?.drainage_issues || 1)) * 100)}% Cleared
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex justify-between items-center">
              <div>
                <span className="font-bold text-white block">Illegal Plastic Dumping & Toxic Burning</span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Resolved: {breakdown?.plastic_dumping_resolved} / {breakdown?.plastic_dumping_reports}
                </span>
              </div>
              <span className="font-mono text-amber-400 font-bold">
                {Math.round(((breakdown?.plastic_dumping_resolved || 0) / Math.max(1, breakdown?.plastic_dumping_reports || 1)) * 100)}% Cleared
              </span>
            </div>
          </div>
        </div>

        {/* Hotspots */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Icon name="mapPin" className="w-4 h-4 text-emerald-400" />
            <span>Recurring Waste Disposal Hotspots</span>
          </h3>

          <div className="space-y-3 pt-2 text-xs">
            {data?.waste_hotspots.map((h, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-white block">{h.locality}</span>
                  <span className="text-[11px] text-teal-400">{h.ward} • {h.category}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-rose-400 block text-xs">
                    {h.count} reports
                  </span>
                  <span className="text-[10px] text-[var(--text-dim)]">Hotspot Alert</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI-Generated Prevention Recommendations */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-emerald-500/30 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Icon name="sparkles" className="w-5 h-5 text-emerald-400" />
          <span>AI-Generated Prevention Recommendations</span>
        </h3>
        <p className="text-xs text-[var(--text-muted)]">
          Predictive infrastructure strategies generated from recurring complaint patterns to eliminate root causes.
        </p>

        <div className="grid md:grid-cols-2 gap-4 pt-2">
          {data?.prevention_recommendations.map((rec, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{rec.title}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/15 text-teal-300">
                  {rec.status}
                </span>
              </div>
              <p className="text-[11px] text-teal-400 font-medium">Target: {rec.target}</p>
              <p className="text-[11px] text-slate-300 leading-relaxed">{rec.impact}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

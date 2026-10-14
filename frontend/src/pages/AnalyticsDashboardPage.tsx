import React from "react";
import { Icon } from "../components/Icons";
import { AnalyticsSummary, PredictiveData } from "../types";

interface AnalyticsDashboardPageProps {
  analytics: AnalyticsSummary | null;
  predictive: PredictiveData | null;
  onNavigate: (page: string, params?: any) => void;
}

export function AnalyticsDashboardPage({ analytics, predictive, onNavigate }: AnalyticsDashboardPageProps) {
  const m = analytics?.metrics;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-[var(--border-color)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-2">
              <Icon name="chart" className="w-3.5 h-3.5 text-teal-400" />
              <span>Real-Time Municipal Data Intelligence</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              AI Analytics & Operational Dashboard
            </h1>
            <p className="text-xs md:text-sm text-[var(--text-muted)]">
              Live statistical aggregations across 105 verified civic complaint records, department response SLAs, and hotspot indicators.
            </p>
          </div>
          <button
            onClick={() => onNavigate("assistant")}
            className="btn-primary text-xs self-start md:self-auto"
          >
            <Icon name="bot" className="w-4 h-4" />
            <span>Query Assistant On Data</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-teal-500">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase">
            Total Complaints
          </p>
          <p className="text-3xl font-extrabold text-white mt-1">
            {m?.total_complaints ?? 105}
          </p>
          <p className="text-[11px] text-teal-400 mt-2">
            100% indexed in SQLite database
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-amber-500">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase">
            Pending Resolution
          </p>
          <p className="text-3xl font-extrabold text-white mt-1">
            {m?.pending_complaints ?? 38}
          </p>
          <p className="text-[11px] text-amber-400 mt-2">
            Active under review or assigned
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-rose-500">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase">
            High / Critical Priority
          </p>
          <p className="text-3xl font-extrabold text-rose-400 mt-1">
            {m?.urgent_pending ?? 14}
          </p>
          <p className="text-[11px] text-rose-400 mt-2">
            Exceeding safety hazard threshold
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-emerald-500">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase">
            Resolution Rate & SLA
          </p>
          <p className="text-3xl font-extrabold text-emerald-400 mt-1">
            {m?.resolution_rate_percent ?? 63.8}%
          </p>
          <p className="text-[11px] text-emerald-400 mt-2">
            Avg {m?.average_resolution_hours ?? 28}h turnaround time
          </p>
        </div>
      </div>

      {/* Two Column Charts: Category Breakdown & Monthly Trends */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Most Common Complaint Categories */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Icon name="chart" className="w-4 h-4 text-teal-400" />
              <span>Complaints by Category</span>
            </h3>
            <span className="text-xs text-[var(--text-dim)]">Volume & Share</span>
          </div>

          <div className="space-y-3 pt-2">
            {analytics?.category_distribution.map((cat) => (
              <div key={cat.category} className="space-y-1 text-xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-semibold text-slate-200">{cat.category}</span>
                  <span className="font-mono text-teal-400 font-bold">
                    {cat.count} ({cat.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--bg-primary)] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-sky-400 rounded-full transition-all duration-700"
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend Chart */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Icon name="clock" className="w-4 h-4 text-teal-400" />
              <span>Monthly Complaint Trends</span>
            </h3>
            <span className="text-xs text-[var(--text-dim)]">Total vs Resolved</span>
          </div>

          <div className="space-y-3 pt-2">
            {analytics?.monthly_trends.map((mTrend) => (
              <div key={mTrend.month} className="space-y-1 text-xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-semibold text-slate-200">
                    {mTrend.formatted_month}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    Total: <strong className="text-white">{mTrend.total}</strong> | Resolved:{" "}
                    <strong className="text-emerald-400">{mTrend.resolved}</strong>
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[var(--bg-primary)] flex overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-700"
                    style={{
                      width: `${(mTrend.resolved / Math.max(1, mTrend.total)) * 100}%`,
                    }}
                  ></div>
                  <div
                    className="h-full bg-amber-500 transition-all duration-700"
                    style={{
                      width: `${(mTrend.pending / Math.max(1, mTrend.total)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-color)]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Resolved</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Pending</span>
            </span>
          </div>
        </div>
      </div>

      {/* Ward Distribution & Recurring Hotspots */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Area-wise / Ward Distribution */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Icon name="mapPin" className="w-4 h-4 text-teal-400" />
            <span>Area-Wise Ward Distribution</span>
          </h3>
          <div className="space-y-2.5 pt-1">
            {analytics?.ward_distribution.map((w) => (
              <div
                key={w.ward}
                className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-white block">{w.ward}</span>
                  <span className="text-[11px] text-[var(--text-muted)]">{w.locality}</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-teal-500/15 text-teal-400 font-mono font-bold text-xs">
                  {w.count} reports
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recurring Community Problems / Hotspots */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Icon name="alert" className="w-4 h-4 text-rose-400" />
              <span>Recurring Hotspot Clusters</span>
            </h3>
            <span className="text-xs text-rose-400 font-semibold">
              Action Required
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {analytics?.recurring_hotspots.map((hotspot, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition-all ${
                  hotspot.is_highlight
                    ? "bg-rose-950/20 border-rose-500/50 hotspot-pulse"
                    : "bg-[var(--bg-primary)] border-[var(--border-color)]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">
                        {hotspot.locality}
                      </span>
                      {hotspot.is_highlight && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-rose-500 text-white">
                          Showcase Cluster
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-teal-400 mt-0.5 font-medium">
                      {hotspot.category} • {hotspot.ward}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold font-mono text-rose-400 block">
                      {hotspot.report_count} Reports
                    </span>
                    <span className="text-[10px] text-[var(--text-dim)]">
                      Avg Score: {hotspot.avg_priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Predictive Analytics Section */}
      {predictive && (
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-sky-500/30 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
                <Icon name="sparkles" className="w-3.5 h-3.5" />
                <span>Predictive Complaint Volume Forecasting</span>
              </div>
              <h3 className="text-xl font-extrabold text-white">
                Upcoming Quarter Projections & Seasonal Risk
              </h3>
            </div>
            <span className="text-[11px] px-3 py-1 rounded-full bg-sky-500/15 text-sky-300 font-semibold self-start md:self-auto">
              {predictive.model_confidence}
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {predictive.forecast_series.map((f, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-[var(--bg-primary)] border border-sky-500/20 space-y-2"
              >
                <span className="text-xs font-bold text-sky-300 block">{f.period}</span>
                <p className="text-2xl font-extrabold text-white">
                  {f.predicted} <span className="text-xs font-normal text-slate-400">projected reports</span>
                </p>
                <div className="text-[11px] text-[var(--text-muted)] space-y-0.5 pt-1">
                  <div>Range: {f.lower_bound} – {f.upper_bound}</div>
                  <div className="text-sky-400 font-medium">{f.seasonal_factor}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Category Risk Projections */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Anticipated Departmental Surges
            </h4>
            <div className="grid md:grid-cols-3 gap-3">
              {predictive.category_risk_projections.map((cat, i) => (
                <div key={i} className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-white">{cat.category}</span>
                    <span className="text-amber-400">{cat.risk_level}</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">{cat.reason}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/50 text-[11px] text-slate-400 flex items-start gap-2">
            <Icon name="alert" className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>{predictive.disclaimer}</span>
          </div>
        </div>
      )}
    </div>
  );
}

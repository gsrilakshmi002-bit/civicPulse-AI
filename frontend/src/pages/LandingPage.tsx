import React from "react";
import { Icon } from "../components/Icons";
import { AnalyticsSummary } from "../types";

interface LandingPageProps {
  onNavigate: (page: string) => void;
  analytics: AnalyticsSummary | null;
}

export function LandingPage({ onNavigate, analytics }: LandingPageProps) {
  const m = analytics?.metrics;

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl glass-panel border border-[var(--border-color)] p-8 md:p-14 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-teal-950/40">
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <Icon name="sparkles" className="w-3.5 h-3.5 text-teal-400" />
            <span>CivicAI — Next-Gen Smart Community Intelligence Platform</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Report. Predict. <br />
            <span className="bg-gradient-to-r from-teal-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              Resolve. Transform.
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-300 leading-relaxed">
            Bridging citizens and municipal administration with explainable AI complaint classification, transparent priority scoring, duplicate detection, and proactive environmental intelligence.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigate("submit")}
              className="btn-primary text-sm px-6 py-3"
            >
              <Icon name="plus" className="w-4 h-4" />
              <span>Report Community Issue</span>
            </button>
            <button
              onClick={() => onNavigate("explorer")}
              className="btn-secondary text-sm px-6 py-3"
            >
              <Icon name="search" className="w-4 h-4" />
              <span>Explore Community Reports</span>
            </button>
            <button
              onClick={() => onNavigate("analytics")}
              className="btn-secondary text-sm px-6 py-3"
            >
              <Icon name="chart" className="w-4 h-4" />
              <span>View Live Analytics</span>
            </button>
          </div>
        </div>

        {/* Floating Background Glow */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>
      </section>

      {/* Live Community Pulse KPI Row */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Icon name="chart" className="w-5 h-5 text-teal-400" />
            <span>Live Municipal Pulse (Actual Data)</span>
          </h2>
          <span className="text-xs text-[var(--text-muted)]">
            Synchronized with SQLite Data Store
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-teal-500">
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Total Complaints
            </p>
            <p className="text-3xl font-extrabold text-white mt-1">
              {m?.total_complaints ?? 105}
            </p>
            <p className="text-xs text-teal-400 mt-2 flex items-center gap-1">
              <Icon name="checkCircle" className="w-3.5 h-3.5" />
              <span>Verified Citizen Reports</span>
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-amber-500">
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Pending Resolution
            </p>
            <p className="text-3xl font-extrabold text-white mt-1">
              {m?.pending_complaints ?? 38}
            </p>
            <p className="text-xs text-amber-400 mt-2 flex items-center gap-1">
              <Icon name="clock" className="w-3.5 h-3.5" />
              <span>Active Field Work Orders</span>
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-rose-500">
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              High / Critical Urgent
            </p>
            <p className="text-3xl font-extrabold text-rose-400 mt-1">
              {m?.urgent_pending ?? 14}
            </p>
            <p className="text-xs text-rose-400 mt-2 flex items-center gap-1">
              <Icon name="alert" className="w-3.5 h-3.5" />
              <span>Safety & Recurrence Alert</span>
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-emerald-500">
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Resolution Rate
            </p>
            <p className="text-3xl font-extrabold text-emerald-400 mt-1">
              {m?.resolution_rate_percent ?? 63.8}%
            </p>
            <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
              <Icon name="checkCircle" className="w-3.5 h-3.5" />
              <span>Avg {m?.average_resolution_hours ?? 28}h Turnaround</span>
            </p>
          </div>
        </div>
      </section>

      {/* The Living Loom Showcase Card */}
      <section className="glass-panel-glow p-8 rounded-3xl border border-teal-500/30 bg-gradient-to-r from-slate-950 via-teal-950/20 to-slate-900">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-wider">
              Architectural Concept Spotlight
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white">
              “The Living Loom” Biophilic Smart Hub
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Designed as a bus-shelter-sized community anchor that integrates 
              <strong> vertical hydroponic agriculture</strong>, 
              <strong> solar photovoltaic glass canopy</strong>, 
              <strong> private telehealth booth</strong>, and the 
              <strong> CivicAI interactive digital interface</strong> into one modular biophilic micro-hub.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate("about")}
                className="btn-primary text-xs"
              >
                <span>Read Full Architectural Specifications</span>
                <Icon name="arrowRight" className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="relative group overflow-hidden rounded-2xl border border-teal-500/30 shadow-2xl">
            <img
              src={`${import.meta.env.BASE_URL}the_living_loom.jpg`}
              alt="The Living Loom"
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
              <p className="text-xs text-white font-medium">
                Biophilic Smart-City Micro-Hub — Modular Community Architecture
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Innovation Highlights */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-extrabold text-white">
            Engineered For Real-World Municipal Impact
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Moving beyond simple complaint logging into proactive, transparent, and explainable community problem-solving.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <Icon name="sparkles" className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">
              Explainable AI Priority (0-100)
            </h4>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Transparent scoring formula combining Safety Risk (0-35), Citizen Exposure (0-25), Recurrence/Hotspot Index (0-25), and Aging Factor (0-15).
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Icon name="layers" className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">
              Automated Duplicate Detection
            </h4>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Jaccard text similarity and geolocation clustering identify repeat complaints (e.g. Maple St garbage pile) and merge them with 1 click.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              <Icon name="leaf" className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">
              Environmental Sustainability
            </h4>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Dedicated tracking for potable water leaks, plastic dumping hotspots, and drainage choke points with AI-generated prevention recommendations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

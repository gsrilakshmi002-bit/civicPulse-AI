import React from "react";
import { Icon } from "../components/Icons";

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Header */}
      <div className="glass-panel p-6 md:p-10 rounded-3xl border border-[var(--border-color)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-3">
          <Icon name="sparkles" className="w-3.5 h-3.5 text-teal-400" />
          <span>Hackathon Innovation Showcase & Methodology</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">
          About CivicAI & The Living Loom
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
          <strong>Tagline:</strong> Report. Predict. Resolve. Transform. <br />
          CivicAI is an AI-powered municipal intelligence ecosystem designed to tackle urban decay, broken infrastructure, and civic disengagement through explainable intelligence, transparent priority formulas, duplicate detection, and biophilic public architecture.
        </p>
      </div>

      {/* The Living Loom Visual & Specs */}
      <div className="glass-panel-glow p-8 rounded-3xl border border-teal-500/30 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Icon name="leaf" className="w-5 h-5 text-teal-400" />
            <span>The Living Loom — Biophilic Smart Hub</span>
          </h2>
          <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 font-bold">
            Architectural Concept
          </span>
        </div>

        <div className="rounded-2xl overflow-hidden border border-teal-500/20 shadow-2xl">
          <img
            src={`${import.meta.env.BASE_URL}the_living_loom.jpg`}
            alt="The Living Loom Visualization"
            className="w-full h-80 object-cover"
          />
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>The Living Loom</strong> combines biophilic architecture with CivicAI's digital intelligence. Sized like a modern bus shelter, it incorporates:
        </p>

        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-1">
            <span className="font-bold text-teal-400">1. Vertical Hydroponic Agriculture</span>
            <p className="text-[11px] text-[var(--text-muted)]">
              Integrated living green walls with cascading vines and herbs filtering particulate matter (PM2.5).
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-1">
            <span className="font-bold text-sky-400">2. Solar Glass Canopy & Kinetic Flooring</span>
            <p className="text-[11px] text-[var(--text-muted)]">
              Semi-transparent BIPV solar glass roof and pedestrian kinetic tiles generating clean local micro-power.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-1">
            <span className="font-bold text-amber-400">3. Interactive Digital Civic Screen</span>
            <p className="text-[11px] text-[var(--text-muted)]">
              Outdoor touch display connected to CivicAI for neighborhood reporting, live status tracking, and transit maps.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-1">
            <span className="font-bold text-emerald-400">4. Private Telehealth Booth</span>
            <p className="text-[11px] text-[var(--text-muted)]">
              Acoustic glass-enclosed pod for remote medical consultations and non-invasive community health screenings.
            </p>
          </div>
        </div>
      </div>

      {/* System Architecture Diagram */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-[var(--border-color)] space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Icon name="layers" className="w-5 h-5 text-teal-400" />
          <span>System Architecture</span>
        </h2>

        <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-mono space-y-2 text-slate-300">
          <div className="text-teal-400 font-bold">[Citizen / Admin / Analyst Web Interface (React 19 + TypeScript + Vite + Tailwind)]</div>
          <div className="pl-4">│  ├── 11 Modern Responsive Pages & Interactive Real-Time SVG Charts</div>
          <div className="pl-4">│  ├── Client-Side State Synchronization & Offline Resilient Storage</div>
          <div className="text-sky-400 font-bold pl-4">▼  REST API via HTTP (CORS Enabled)</div>
          <div className="text-indigo-400 font-bold">[Python FastAPI Backend Server (Uvicorn @ 127.0.0.1:8000)]</div>
          <div className="pl-4">│  ├── AI Classification Engine: Gemini API + Rule-Based Heuristic NLP Fallback</div>
          <div className="pl-4">│  ├── Priority Formula Engine: Safety (35) + Exposure (25) + Recurrence (25) + Aging (15)</div>
          <div className="pl-4">│  ├── Duplicate Detection: Jaccard Text Distance + Geospatial Proximity + Ward Clustering</div>
          <div className="pl-4">│  ├── Predictive Analytics: Linear Regression + Seasonal Weather Surge Indices</div>
          <div className="pl-4">│  └── RAG Community Assistant: Grounded strictly in live SQLite data metrics</div>
          <div className="text-emerald-400 font-bold pl-4">▼  SQLite Database Engine</div>
          <div className="text-emerald-300 font-bold">[civicai.db (Complaints, Status History Timelines, Duplicate Linkages)]</div>
        </div>
      </div>

      {/* Demonstration Script for Hackathon Judges */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-amber-500/30 space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <Icon name="sparkles" className="w-4 h-4" />
          <span>3-Step Demonstration Walkthrough for Judges</span>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-1">
            <span className="font-bold text-white">Step 1: The Citizen Experience & Instant AI Priority Preview</span>
            <p className="text-[11px] text-[var(--text-muted)]">
              Go to <strong>Submit Complaint</strong>. Enter an issue like <em>"Dangerous deep pothole near school gate"</em>. Click <strong>Preview AI Classification</strong>. Watch the system compute a high safety score (32/35), calculate an overall 85+ Critical score, and assign it to Roads Infrastructure.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-1">
            <span className="font-bold text-white">Step 2: The Maple Street Duplicate Cluster Demonstration</span>
            <p className="text-[11px] text-[var(--text-muted)]">
              Go to <strong>Admin Console</strong>. Notice ticket <strong>#CIV-2024-00101</strong> (Maple Street garbage overflow). Click <strong>Duplicates</strong>. CivicAI instantly identifies 3 other citizen reports for the same trash pile with 85-95% similarity. Click <strong>Merge Selected into Master Ticket</strong> to resolve duplicates into 1 master dispatch!
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-1">
            <span className="font-bold text-white">Step 3: Grounded AI Assistant & Proactive Predictive Trends</span>
            <p className="text-[11px] text-[var(--text-muted)]">
              Open <strong>AI Community Bot</strong> and ask <em>"What is the most reported problem?"</em> or <em>"How many complaints are pending?"</em>. The bot answers with real SQLite counts, demonstrating zero hallucination on statistical facts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

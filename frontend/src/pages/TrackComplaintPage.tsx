import React, { useState, useEffect } from "react";
import { Icon } from "../components/Icons";
import { fetchComplaintById } from "../api";
import { Complaint } from "../types";

interface TrackComplaintPageProps {
  initialComplaintId?: string;
  isNew?: boolean;
}

export function TrackComplaintPage({ initialComplaintId = "CIV-2024-00101", isNew }: TrackComplaintPageProps) {
  const [complaintId, setComplaintId] = useState(initialComplaintId);
  const [currentId, setCurrentId] = useState(initialComplaintId);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loadComplaint = async (id: string) => {
    if (!id.trim()) return;
    setIsLoading(true);
    setErrorMsg("");
    try {
      const data = await fetchComplaintById(id.trim());
      setComplaint(data);
      setCurrentId(id.trim());
    } catch (err: any) {
      setErrorMsg(`Complaint "${id}" could not be found. Please verify the ticket format (e.g. CIV-2024-00101).`);
      setComplaint(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComplaint(initialComplaintId);
  }, [initialComplaintId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadComplaint(complaintId);
  };

  const steps = ["Submitted", "Under Review", "Assigned", "In Progress", "Resolved"];
  const currentStepIdx = complaint ? steps.indexOf(complaint.status) : 0;
  const isRejected = complaint?.status === "Rejected";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Search Header */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-[var(--border-color)] space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <Icon name="clock" className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">
              Complaint Status Tracker
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              Follow real-time municipal triage, department dispatch, and resolution audit trails.
            </p>
          </div>
        </div>

        {isNew && (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <Icon name="checkCircle" className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              Your complaint has been successfully registered! Below is your live tracking timeline.
            </span>
          </div>
        )}

        <form onSubmit={handleSearch} className="flex gap-2 pt-2">
          <input
            type="text"
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
            placeholder="Enter Complaint ID (e.g., CIV-2024-00101)"
            className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
          />
          <button type="submit" disabled={isLoading} className="btn-primary text-xs px-6">
            <Icon name="search" className="w-4 h-4" />
            <span>{isLoading ? "Searching..." : "Track Ticket"}</span>
          </button>
        </form>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <Icon name="alert" className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {complaint && (
        <div className="space-y-6">
          {/* Status Progress Bar */}
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-teal-400">
                  Ticket #{complaint.id}
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  {complaint.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge-${complaint.priority_level.toLowerCase()}`}>
                  {complaint.priority_level} ({complaint.priority_score})
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isRejected
                      ? "status-rejected"
                      : complaint.status === "Resolved"
                      ? "status-resolved"
                      : "status-progress"
                  }`}
                >
                  {complaint.status}
                </span>
              </div>
            </div>

            {/* Stepper Timeline */}
            {!isRejected ? (
              <div className="py-2">
                <div className="flex items-center justify-between relative">
                  {/* Connecting track line */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[var(--bg-surface)] -z-0"></div>
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-teal-500 to-sky-400 transition-all duration-500 -z-0"
                    style={{
                      width: `${Math.max(0, (currentStepIdx / (steps.length - 1)) * 100)}%`,
                    }}
                  ></div>

                  {steps.map((st, i) => {
                    const isDone = i <= currentStepIdx;
                    const isCurrent = i === currentStepIdx;
                    return (
                      <div key={st} className="flex flex-col items-center relative z-10">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isDone
                              ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30 scale-105"
                              : "bg-[var(--bg-surface)] text-[var(--text-dim)] border border-[var(--border-color)]"
                          }`}
                        >
                          {isDone ? "✓" : i + 1}
                        </div>
                        <span
                          className={`text-[10px] sm:text-xs font-semibold mt-2 whitespace-nowrap ${
                            isCurrent
                              ? "text-teal-400 font-bold"
                              : isDone
                              ? "text-white"
                              : "text-[var(--text-dim)]"
                          }`}
                        >
                          {st}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Icon name="close" className="w-4 h-4 text-rose-400" />
                  <span>Complaint Rejected</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  <strong>Reason:</strong> {complaint.rejection_reason || "Jurisdiction non-compliance or invalid municipal scope."}
                </p>
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Complaint Information
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {complaint.description}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[var(--border-color)] text-xs">
                <div>
                  <span className="text-[var(--text-dim)] block text-[10px] uppercase">
                    Assigned Department
                  </span>
                  <span className="font-semibold text-white">
                    {complaint.department}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--text-dim)] block text-[10px] uppercase">
                    Locality & Jurisdiction
                  </span>
                  <span className="font-semibold text-white">
                    {complaint.locality} ({complaint.ward})
                  </span>
                </div>
              </div>

              {/* AI Summary & Suggested Action */}
              <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-teal-500/20 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-teal-400 font-bold text-[11px]">
                  <Icon name="sparkles" className="w-3.5 h-3.5" />
                  <span>CivicAI Summary & Action Plan</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {complaint.ai_summary}
                </p>
                <p className="text-slate-400 text-[10px] italic">
                  Next Step: {complaint.suggested_action}
                </p>
              </div>

              {/* Status History Timeline */}
              {complaint.history && complaint.history.length > 0 && (
                <div className="pt-4 border-t border-[var(--border-color)] space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Official Audit Trail ({complaint.history.length} updates)
                  </h4>
                  <div className="space-y-2.5">
                    {complaint.history.map((h, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs">
                        <div className="w-2 h-2 rounded-full bg-teal-400 mt-1.5 flex-shrink-0"></div>
                        <div className="flex-1 bg-[var(--bg-surface)] p-2.5 rounded-lg border border-[var(--border-color)]">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-white">{h.status}</span>
                            <span className="text-[var(--text-dim)] text-[10px]">
                              {new Date(h.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-slate-300 text-[11px] mt-1">{h.notes}</p>
                          <span className="text-[10px] text-teal-400 block mt-1">
                            Updated by: {h.changed_by}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Photo & Priority Breakdown Column */}
            <div className="space-y-6">
              {complaint.image_url && (
                <div className="glass-panel overflow-hidden rounded-2xl border border-[var(--border-color)]">
                  <img
                    src={complaint.image_url}
                    alt="Complaint evidence"
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-3 bg-[var(--bg-primary)] text-[10px] text-[var(--text-muted)]">
                    Citizen Photo Attachment
                  </div>
                </div>
              )}

              <div className="glass-panel p-5 rounded-2xl space-y-3 border-l-4 border-l-teal-500">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Priority Scoring Rationale
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {complaint.priority_reason}
                </p>
                <div className="space-y-1 text-[11px] pt-1">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-dim)]">Safety Factor:</span>
                    <span className="font-mono text-white">{complaint.safety_score}/35</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-dim)]">Exposure Factor:</span>
                    <span className="font-mono text-white">{complaint.affected_score}/25</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-dim)]">Recurrence Index:</span>
                    <span className="font-mono text-white">{complaint.recurrence_score}/25</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-dim)]">Aging Factor:</span>
                    <span className="font-mono text-white">{complaint.waiting_score}/15</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

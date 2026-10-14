import React, { useState } from "react";
import { Icon } from "../components/Icons";
import { Complaint } from "../types";
import {
  updateComplaintStatus,
  overrideComplaintPriority,
  findDuplicates,
  mergeDuplicateComplaints,
  resetDatabase,
} from "../api";

interface AdminDashboardPageProps {
  complaints: Complaint[];
  onRefresh: () => void;
  onNavigate: (page: string, params?: any) => void;
}

export function AdminDashboardPage({ complaints, onRefresh, onNavigate }: AdminDashboardPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Priority Override Modal State
  const [overrideTarget, setOverrideTarget] = useState<Complaint | null>(null);
  const [overrideScore, setOverrideScore] = useState(85);
  const [overrideLevel, setOverrideLevel] = useState<"Critical" | "High" | "Medium" | "Low">("High");
  const [overrideReason, setOverrideReason] = useState("Verified by ward supervisor: immediate structural risk");

  // Status Change Modal State
  const [statusTarget, setStatusTarget] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState("In Progress");
  const [statusNotes, setStatusNotes] = useState("Crew dispatched with heavy equipment");
  const [assignedDept, setAssignedDept] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  // Duplicate Inspection Modal State
  const [duplicateTarget, setDuplicateTarget] = useState<Complaint | null>(null);
  const [duplicateCandidates, setDuplicateCandidates] = useState<any[]>([]);
  const [selectedDuplicates, setSelectedDuplicates] = useState<string[]>([]);
  const [isLoadingDuplicates, setIsLoadingDuplicates] = useState(false);

  // Reset Demo Data State
  const [isResetting, setIsResetting] = useState(false);
  const [notification, setNotification] = useState("");

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 4500);
  };

  const handleOpenDuplicateModal = async (c: Complaint) => {
    setDuplicateTarget(c);
    setIsLoadingDuplicates(true);
    setSelectedDuplicates([]);
    try {
      const candidates = await findDuplicates({
        complaint_id: c.id,
        title: c.title,
        description: c.description,
        category: c.category,
        ward: c.ward,
        locality: c.locality,
      });
      setDuplicateCandidates(candidates);
      // Auto select if high match
      const highMatches = candidates.filter((item) => item.similarity_score >= 0.65).map((item) => item.complaint.id);
      setSelectedDuplicates(highMatches);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingDuplicates(false);
    }
  };

  const handleMergeDuplicates = async () => {
    if (!duplicateTarget || selectedDuplicates.length === 0) return;
    try {
      await mergeDuplicateComplaints({
        primary_id: duplicateTarget.id,
        duplicate_ids: selectedDuplicates,
        merged_by: "Administrator",
        notes: `Merged ${selectedDuplicates.length} duplicate citizen reports into primary #${duplicateTarget.id}`,
      });
      setDuplicateTarget(null);
      showNotification(`Successfully merged ${selectedDuplicates.length} duplicates into #${duplicateTarget.id}!`);
      onRefresh();
    } catch (err) {
      alert("Error merging complaints");
    }
  };

  const handleSavePriorityOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideTarget) return;
    try {
      await overrideComplaintPriority(overrideTarget.id, {
        priority_level: overrideLevel,
        priority_score: overrideScore,
        override_reason: overrideReason,
        changed_by: "Senior Municipal Admin",
      });
      setOverrideTarget(null);
      showNotification(`Priority updated for #${overrideTarget.id}`);
      onRefresh();
    } catch (err) {
      alert("Error overriding priority");
    }
  };

  const handleSaveStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusTarget) return;
    try {
      await updateComplaintStatus(statusTarget.id, {
        status: newStatus,
        notes: statusNotes,
        department: assignedDept || undefined,
        rejection_reason: newStatus === "Rejected" ? rejectionReason : undefined,
        changed_by: "Administrator",
      });
      setStatusTarget(null);
      showNotification(`Status for #${statusTarget.id} updated to ${newStatus}`);
      onRefresh();
    } catch (err) {
      alert("Error updating status");
    }
  };

  const handleResetData = async () => {
    if (!window.confirm("Reset all demonstration complaint records back to the clean 105 synthetic dataset?")) return;
    setIsResetting(true);
    try {
      await resetDatabase();
      showNotification("Database successfully reset and re-seeded with 105 realistic records!");
      onRefresh();
    } catch (err) {
      alert("Failed to reset database");
    } finally {
      setIsResetting(false);
    }
  };

  const filtered = complaints.filter((c) => {
    const matchCat = filterCategory === "All" || c.category === filterCategory;
    const matchPri = filterPriority === "All" || c.priority_level === filterPriority;
    const matchStat = filterStatus === "All" || c.status === filterStatus;
    const matchSearch =
      !searchTerm ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.locality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchPri && matchStat && matchSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 glass-panel-glow bg-slate-900 border border-teal-500/50 p-4 rounded-xl text-xs text-teal-300 flex items-center gap-2 shadow-2xl">
          <Icon name="checkCircle" className="w-4 h-4 text-teal-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin Header */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-[var(--border-color)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <Icon name="wrench" className="w-3.5 h-3.5 text-amber-400" />
              <span>Municipal Operations Console</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Administrator Complaint Triage
            </h1>
            <p className="text-xs md:text-sm text-[var(--text-muted)]">
              Review AI recommendations, override priority scoring, re-route departments, and merge duplicate citizen tickets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetData}
              disabled={isResetting}
              className="btn-secondary text-xs text-rose-300 border-rose-500/30 hover:bg-rose-500/10"
            >
              <Icon name="refresh" className="w-4 h-4 text-rose-400" />
              <span>{isResetting ? "Resetting..." : "Reset Demo Data"}</span>
            </button>
            <button
              onClick={() => onNavigate("submit")}
              className="btn-primary text-xs"
            >
              <Icon name="plus" className="w-4 h-4" />
              <span>Log Direct Complaint</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-6 mt-4 border-t border-[var(--border-color)]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter ID / title / locality / dept..."
            className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
          >
            <option value="All">All Categories</option>
            <option value="Overflowing Garbage">Overflowing Garbage</option>
            <option value="Potholes & Damaged Roads">Potholes & Damaged Roads</option>
            <option value="Broken Streetlights">Broken Streetlights</option>
            <option value="Water Leakage & Main Burst">Water Leakage</option>
            <option value="Drainage & Sewage Blockage">Drainage & Sewage</option>
            <option value="Plastic Pollution & Dumping">Plastic Pollution</option>
            <option value="Accessibility & Footpath Barrier">Accessibility</option>
            <option value="Noise & Industrial Pollution">Noise Pollution</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Main Admin Data Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-[var(--border-color)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[var(--bg-surface)] text-[var(--text-dim)] uppercase text-[10px] tracking-wider border-b border-[var(--border-color)]">
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-4">Issue & Locality</th>
                <th className="py-3 px-4">AI Priority</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] text-slate-200">
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-[var(--bg-surface)]/60 transition-colors"
                >
                  {/* ID */}
                  <td className="py-3 px-4 font-mono font-bold text-teal-400 whitespace-nowrap">
                    #{c.id}
                    {c.is_merged === 1 && (
                      <span className="block text-[9px] text-amber-400 font-sans font-bold">
                        (Merged)
                      </span>
                    )}
                  </td>

                  {/* Title & Locality */}
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-semibold text-white line-clamp-1">{c.title}</div>
                    <div className="text-[11px] text-[var(--text-muted)] line-clamp-1">
                      {c.locality} • {c.ward}
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setOverrideTarget(c);
                        setOverrideScore(c.priority_score);
                        setOverrideLevel(c.priority_level);
                      }}
                      title="Click to override priority"
                      className={`badge-${c.priority_level.toLowerCase()} inline-flex items-center gap-1 hover:opacity-80 transition-opacity`}
                    >
                      <span>{c.priority_level} ({c.priority_score})</span>
                      <span className="text-[9px]">✎</span>
                    </button>
                  </td>

                  {/* Department */}
                  <td className="py-3 px-4 whitespace-nowrap text-slate-300">
                    {c.department}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setStatusTarget(c);
                        setNewStatus(c.status);
                        setAssignedDept(c.department);
                      }}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        c.status === "Resolved"
                          ? "status-resolved"
                          : c.status === "In Progress"
                          ? "status-progress"
                          : c.status === "Rejected"
                          ? "status-rejected"
                          : "status-review"
                      }`}
                    >
                      {c.status} ✎
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleOpenDuplicateModal(c)}
                      title="Scan for duplicate reports"
                      className="px-2.5 py-1 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[11px] font-semibold"
                    >
                      Duplicates
                    </button>
                    <button
                      onClick={() => onNavigate("track", { complaintId: c.id })}
                      className="px-2.5 py-1 rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--bg-surface)] text-slate-300 border border-[var(--border-color)] text-[11px]"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Priority Override Modal */}
      {overrideTarget && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full space-y-4 border border-[var(--border-color)]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                Override Priority for #{overrideTarget.id}
              </h3>
              <button
                onClick={() => setOverrideTarget(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePriorityOverride} className="space-y-4 text-xs">
              <div>
                <label className="block text-[var(--text-muted)] font-bold mb-1">
                  Priority Level
                </label>
                <select
                  value={overrideLevel}
                  onChange={(e: any) => setOverrideLevel(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-white"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-[var(--text-muted)] font-bold mb-1">
                  Adjusted Score (0 - 100): {overrideScore}
                </label>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={overrideScore}
                  onChange={(e) => setOverrideScore(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-[var(--text-muted)] font-bold mb-1">
                  Administrative Override Reason *
                </label>
                <textarea
                  required
                  rows={3}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOverrideTarget(null)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Save Priority Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {statusTarget && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full space-y-4 border border-[var(--border-color)]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                Update Status for #{statusTarget.id}
              </h3>
              <button
                onClick={() => setStatusTarget(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStatusChange} className="space-y-4 text-xs">
              <div>
                <label className="block text-[var(--text-muted)] font-bold mb-1">
                  Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-white"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-[var(--text-muted)] font-bold mb-1">
                  Department Assignment
                </label>
                <input
                  type="text"
                  value={assignedDept}
                  onChange={(e) => setAssignedDept(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-white"
                />
              </div>

              {newStatus === "Rejected" && (
                <div>
                  <label className="block text-rose-400 font-bold mb-1">
                    Rejection Reason *
                  </label>
                  <input
                    type="text"
                    required
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Private residential society property; not municipal scope."
                    className="w-full bg-[var(--bg-primary)] border border-rose-500/40 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-[var(--text-muted)] font-bold mb-1">
                  Progress Notes / Audit Trail
                </label>
                <textarea
                  rows={3}
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStatusTarget(null)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Apply Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Duplicate Detection & Merger Modal */}
      {duplicateTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-2xl w-full space-y-4 border border-teal-500/40 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                  AI Duplicate Detection & Grouping Engine
                </span>
                <h3 className="text-base font-bold text-white">
                  Cluster Review for #{duplicateTarget.id}
                </h3>
              </div>
              <button
                onClick={() => setDuplicateTarget(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs space-y-1">
              <span className="font-bold text-teal-300 block">
                Primary Master Ticket: {duplicateTarget.title}
              </span>
              <p className="text-[11px] text-[var(--text-muted)]">
                {duplicateTarget.locality} • {duplicateTarget.ward} • {duplicateTarget.category}
              </p>
            </div>

            {isLoadingDuplicates ? (
              <div className="py-8 text-center text-xs text-teal-400 space-y-2">
                <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p>Analyzing text similarity, geo-coordinates, and ward timestamps...</p>
              </div>
            ) : duplicateCandidates.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">
                  Select candidate reports to merge into this master ticket. Merging closes duplicate reports and links them directly to the master issue.
                </p>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {duplicateCandidates.map((cand) => {
                    const isSelected = selectedDuplicates.includes(cand.complaint.id);
                    return (
                      <div
                        key={cand.complaint.id}
                        onClick={() => {
                          setSelectedDuplicates((prev) =>
                            isSelected
                              ? prev.filter((id) => id !== cand.complaint.id)
                              : [...prev, cand.complaint.id]
                          );
                        }}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-teal-950/30 border-teal-400"
                            : "bg-[var(--bg-surface)] border-[var(--border-color)]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 text-xs">
                          <div className="flex items-start gap-2.5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}} // handled by parent onClick
                              className="mt-1"
                            />
                            <div>
                              <span className="font-mono font-bold text-teal-400 block">
                                #{cand.complaint.id}: {cand.complaint.title}
                              </span>
                              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                                {cand.complaint.description}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {cand.match_reasons.map((r: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-300 text-[10px]"
                                  >
                                    {r}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="font-mono font-extrabold text-teal-300 text-xs whitespace-nowrap">
                            {Math.round(cand.similarity_score * 100)}% Match
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-[var(--text-muted)]">
                No potential duplicates detected within current proximity or text similarity bounds.
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-[var(--border-color)]">
              <span className="text-xs text-[var(--text-dim)]">
                {selectedDuplicates.length} duplicate(s) selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setDuplicateTarget(null)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMergeDuplicates}
                  disabled={selectedDuplicates.length === 0}
                  className="btn-primary text-xs"
                >
                  Merge Selected into Master Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

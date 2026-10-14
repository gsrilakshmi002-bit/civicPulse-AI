import React, { useState, useMemo } from "react";
import { Icon } from "../components/Icons";
import { Complaint } from "../types";

interface CommunityExplorerPageProps {
  complaints: Complaint[];
  onNavigate: (page: string, params?: any) => void;
}

export function CommunityExplorerPage({ complaints, onNavigate }: CommunityExplorerPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedWard, setSelectedWard] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [sortBy, setSortBy] = useState("date_desc");
  const [upvotes, setUpvotes] = useState<Record<string, number>>({});

  const handleUpvote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setUpvotes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const categories = useMemo(() => {
    const set = new Set(complaints.map((c) => c.category));
    return ["All", ...Array.from(set)];
  }, [complaints]);

  const wards = useMemo(() => {
    const set = new Set(complaints.map((c) => c.ward));
    return ["All", ...Array.from(set)];
  }, [complaints]);

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchCat = selectedCategory === "All" || c.category === selectedCategory;
      const matchWard = selectedWard === "All" || c.ward === selectedWard;
      const matchStatus = selectedStatus === "All" || c.status === selectedStatus;
      const matchPri = selectedPriority === "All" || c.priority_level === selectedPriority;
      const matchSearch =
        !searchTerm ||
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.locality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase());

      return matchCat && matchWard && matchStatus && matchPri && matchSearch;
    }).sort((a, b) => {
      if (sortBy === "priority_desc") return b.priority_score - a.priority_score;
      if (sortBy === "priority_asc") return a.priority_score - b.priority_score;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [complaints, selectedCategory, selectedWard, selectedStatus, selectedPriority, searchTerm, sortBy]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-[var(--border-color)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                Community Transparency
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold">
                {filtered.length} Reports
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              Community Issues Explorer
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              Browse citizen submissions across all municipal wards, endorse recurring issues, and check real-time resolution statuses.
            </p>
          </div>
          <button
            onClick={() => onNavigate("submit")}
            className="btn-primary text-xs self-start md:self-auto"
          >
            <Icon name="plus" className="w-4 h-4" />
            <span>Submit New Issue</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-6 mt-4 border-t border-[var(--border-color)]">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search keyword / street..."
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "All" ? "All Categories" : cat}
              </option>
            ))}
          </select>

          {/* Ward */}
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
          >
            {wards.map((w) => (
              <option key={w} value={w}>
                {w === "All" ? "All Wards" : w}
              </option>
            ))}
          </select>

          {/* Priority */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Grid of Complaints */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((c) => {
          const endorsementCount = (upvotes[c.id] || 0) + (c.recurrence_score > 15 ? 4 : 1);
          return (
            <div
              key={c.id}
              onClick={() => onNavigate("track", { complaintId: c.id })}
              className="glass-panel p-5 rounded-2xl flex flex-col justify-between cursor-pointer group hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/10 transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-teal-400">
                    #{c.id}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`badge-${c.priority_level.toLowerCase()} text-[10px]`}>
                      {c.priority_level} ({c.priority_score})
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === "Resolved"
                          ? "status-resolved"
                          : c.status === "In Progress"
                          ? "status-progress"
                          : "status-review"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-2">
                  {c.title}
                </h3>

                <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                  {c.description}
                </p>

                <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-dim)]">
                  <Icon name="mapPin" className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span className="truncate">{c.locality} • {c.ward}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[var(--text-dim)]">
                  {new Date(c.created_at).toLocaleDateString()}
                </span>

                <button
                  onClick={(e) => handleUpvote(e, c.id)}
                  title="Endorse this civic issue"
                  className="px-2.5 py-1 rounded-lg bg-[var(--bg-primary)] hover:bg-teal-500/20 text-slate-300 hover:text-teal-300 border border-[var(--border-color)] flex items-center gap-1.5 text-[11px] transition-colors"
                >
                  <span>👍</span>
                  <span>{endorsementCount}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="glass-panel p-12 text-center rounded-2xl text-[var(--text-muted)] space-y-2">
          <Icon name="search" className="w-8 h-8 mx-auto text-slate-600" />
          <p className="text-sm font-semibold text-white">No complaints found</p>
          <p className="text-xs">Try adjusting your filters or search keywords.</p>
        </div>
      )}
    </div>
  );
}

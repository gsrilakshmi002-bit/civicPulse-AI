import React, { useState } from "react";
import { Icon } from "../components/Icons";
import { submitComplaint, classifyComplaintAI } from "../api";

interface SubmitComplaintPageProps {
  onNavigate: (page: string, params?: any) => void;
  onComplaintCreated?: () => void;
}

export function SubmitComplaintPage({ onNavigate, onComplaintCreated }: SubmitComplaintPageProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locality, setLocality] = useState("Green Valley & Maple Gardens");
  const [ward, setWard] = useState("Ward 3");
  const [citizenName, setCitizenName] = useState("Priya Nair");
  const [citizenEmail, setCitizenEmail] = useState("priya.nair@civicai.demo");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [aiPreview, setAiPreview] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAIAnalyze = async () => {
    if (!title.trim() || !description.trim()) {
      setErrorMsg("Please provide both a title and description before requesting AI classification.");
      return;
    }
    setErrorMsg("");
    setIsClassifying(true);
    try {
      const result = await classifyComplaintAI({
        title,
        description,
        locality,
        ward,
      });
      setAiPreview(result);
    } catch (err: any) {
      setErrorMsg("AI preview service encountered an error. You can still submit directly.");
    } finally {
      setIsClassifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const created = await submitComplaint({
        title,
        description,
        locality,
        ward,
        citizen_name: citizenName,
        citizen_email: citizenEmail,
        image_url: imageUrl,
      });
      if (onComplaintCreated) onComplaintCreated();
      // Redirect to tracking page
      onNavigate("track", { complaintId: created.id, newlyCreated: true });
    } catch (err: any) {
      setErrorMsg("Failed to register complaint. Please verify backend connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-[var(--border-color)]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <Icon name="plus" className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            Submit a Community Complaint
          </h1>
        </div>
        <p className="text-xs md:text-sm text-[var(--text-muted)]">
          CivicAI automatically detects categories, computes a transparent 0-100 priority score, and routes your report directly to the responsible municipal department.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <Icon name="alert" className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="md:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1.5">
              Complaint Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hazardous pothole near school gate / Overflowing garbage"
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1.5">
              Detailed Description *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue, exact street details, safety hazards, or if it is a recurring problem..."
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1.5">
                Ward Jurisdiction *
              </label>
              <select
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value="Ward 1">Ward 1 (Downtown CBD)</option>
                <option value="Ward 2">Ward 2 (Westside Suburbs)</option>
                <option value="Ward 3">Ward 3 (Green Valley & Maple)</option>
                <option value="Ward 4">Ward 4 (Industrial Corridor)</option>
                <option value="Ward 5">Ward 5 (North End Harbor)</option>
                <option value="Ward 6">Ward 6 (South Park District)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1.5">
                Locality / Street *
              </label>
              <input
                type="text"
                required
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1.5">
                Citizen Name
              </label>
              <input
                type="text"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                value={citizenEmail}
                onChange={(e) => setCitizenEmail(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1.5">
              Photo Evidence URL (Optional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={handleAIAnalyze}
              disabled={isClassifying}
              className="btn-secondary text-xs"
            >
              <Icon name="sparkles" className="w-4 h-4 text-teal-400" />
              <span>{isClassifying ? "Evaluating with AI..." : "Preview AI Classification"}</span>
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary text-xs flex-1 justify-center"
            >
              <Icon name="send" className="w-4 h-4" />
              <span>{isSubmitting ? "Registering Complaint..." : "Submit Complaint"}</span>
            </button>
          </div>
        </form>

        {/* AI Live Evaluation Sidebar */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-teal-500/30 space-y-3">
            <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <Icon name="sparkles" className="w-4 h-4" />
              <span>AI Evaluation Preview</span>
            </h3>

            {aiPreview ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[var(--text-dim)] block text-[10px] uppercase">
                    Detected Category
                  </span>
                  <span className="font-bold text-white text-sm">
                    {aiPreview.category}
                  </span>
                </div>

                <div>
                  <span className="text-[var(--text-dim)] block text-[10px] uppercase">
                    Assigned Department
                  </span>
                  <span className="font-semibold text-slate-300">
                    {aiPreview.department}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white">
                      Priority Score:
                    </span>
                    <span className={`badge-${aiPreview.priority_level.toLowerCase()}`}>
                      {aiPreview.priority_score} / 100 ({aiPreview.priority_level})
                    </span>
                  </div>

                  {/* Factor Breakdown */}
                  <div className="space-y-1 pt-1 text-[10px] text-[var(--text-muted)]">
                    <div className="flex justify-between">
                      <span>Safety Risk Factor:</span>
                      <span className="font-mono text-white">{aiPreview.safety_score}/35</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Citizen Exposure:</span>
                      <span className="font-mono text-white">{aiPreview.affected_score}/25</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recurrence Index:</span>
                      <span className="font-mono text-white">{aiPreview.recurrence_score}/25</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Aging Factor:</span>
                      <span className="font-mono text-white">{aiPreview.waiting_score}/15</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[var(--text-dim)] block text-[10px] uppercase">
                    Suggested Next Action
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {aiPreview.suggested_action}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-[var(--text-dim)] space-y-2">
                <Icon name="bot" className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">
                  Fill in your title and description, then click <strong>Preview AI Classification</strong> to inspect real-time priority scoring.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Icon } from "./Icons";
import { UserRole } from "../types";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  role: UserRole;
}

export function Sidebar({ currentPage, onNavigate, role }: SidebarProps) {
  const citizenNav = [
    { id: "landing", label: "Overview", icon: "shield" },
    { id: "citizen", label: "Citizen Dashboard", icon: "user" },
    { id: "submit", label: "Submit Complaint", icon: "plus", badge: "AI" },
    { id: "track", label: "Track Complaint", icon: "clock" },
    { id: "explorer", label: "Community Explorer", icon: "mapPin" },
  ];

  const adminNav = [
    { id: "admin", label: "Admin Console", icon: "wrench", badge: "Triaging" },
    { id: "analytics", label: "AI Analytics", icon: "chart" },
  ];

  const insightNav = [
    { id: "assistant", label: "AI Community Bot", icon: "bot", badge: "RAG" },
    { id: "environmental", label: "Sustainability & Eco", icon: "leaf", badge: "Hotspots" },
    { id: "about", label: "About & Innovation", icon: "sparkles" },
  ];

  const renderNavGroup = (title: string, items: typeof citizenNav) => (
    <div className="mb-5">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-dim)] px-3 mb-1.5">
        {title}
      </p>
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-teal-500/15 text-teal-400 border border-teal-500/30 shadow-sm shadow-teal-500/10"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-main)]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  name={item.icon}
                  className={`w-4 h-4 ${isActive ? "text-teal-400" : "text-[var(--text-dim)]"}`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block glass-panel border-r border-[var(--border-color)] p-4 min-h-[calc(100vh-65px)]">
      {renderNavGroup("Citizen Services", citizenNav)}
      {renderNavGroup("Municipal Ops", adminNav)}
      {renderNavGroup("Intelligence & Eco", insightNav)}

      {/* Quick Info Box */}
      <div className="mt-8 p-3.5 rounded-xl bg-gradient-to-br from-teal-950/40 to-sky-950/40 border border-teal-500/20 text-xs text-[var(--text-muted)]">
        <div className="flex items-center gap-2 text-teal-400 font-bold mb-1">
          <Icon name="sparkles" className="w-3.5 h-3.5" />
          <span>Active Role: {role.toUpperCase()}</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Switch role from the top bar to inspect Administrator or Analyst tools anytime.
        </p>
      </div>
    </aside>
  );
}

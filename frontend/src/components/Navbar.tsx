import React from "react";
import { Icon } from "./Icons";
import { UserRole } from "../types";

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Navbar({
  currentRole,
  onRoleChange,
  isDark,
  onToggleTheme,
  onNavigate,
  currentPage,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-[var(--border-color)] px-4 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Brand */}
      <div 
        onClick={() => onNavigate("landing")} 
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-400 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-105 transition-transform">
          <Icon name="shield" className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-teal-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              CivicAI
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-400 border border-teal-500/30">
              v1.0 Live
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] font-medium">
            Report. Predict. Resolve. Transform.
          </p>
        </div>
      </div>

      {/* Center Role Switcher Bar */}
      <div className="hidden md:flex items-center p-1 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
        <span className="text-xs font-semibold px-2.5 text-[var(--text-dim)] uppercase tracking-wider">
          Role:
        </span>
        <button
          onClick={() => onRoleChange("citizen")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            currentRole === "citizen"
              ? "bg-teal-500 text-white shadow-md shadow-teal-500/30"
              : "text-[var(--text-muted)] hover:text-white"
          }`}
        >
          Citizen
        </button>
        <button
          onClick={() => onRoleChange("admin")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            currentRole === "admin"
              ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
              : "text-[var(--text-muted)] hover:text-white"
          }`}
        >
          Administrator
        </button>
        <button
          onClick={() => onRoleChange("analyst")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            currentRole === "analyst"
              ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
              : "text-[var(--text-muted)] hover:text-white"
          }`}
        >
          Community Analyst
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Backend status indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>API: 127.0.0.1:8000</span>
        </div>

        {/* Quick Report CTA */}
        <button
          onClick={() => onNavigate("submit")}
          className="btn-primary text-xs"
        >
          <Icon name="plus" className="w-4 h-4" />
          <span>Report Issue</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          title="Toggle Theme"
          className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
        >
          <Icon name={isDark ? "sun" : "moon"} className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { LandingPage } from "./pages/LandingPage";
import { CitizenDashboard } from "./pages/CitizenDashboard";
import { SubmitComplaintPage } from "./pages/SubmitComplaintPage";
import { TrackComplaintPage } from "./pages/TrackComplaintPage";
import { CommunityExplorerPage } from "./pages/CommunityExplorerPage";
import { AnalyticsDashboardPage } from "./pages/AnalyticsDashboardPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AssistantPage } from "./pages/AssistantPage";
import { EnvironmentalPage } from "./pages/EnvironmentalPage";
import { AboutPage } from "./pages/AboutPage";
import { Complaint, AnalyticsSummary, PredictiveData, EnvironmentalData, UserRole } from "./types";
import { fetchComplaints, fetchAnalytics, fetchPredictive, fetchEnvironmental } from "./api";

export function App() {
  const [currentPage, setCurrentPage] = useState<string>("landing");
  const [currentRole, setCurrentRole] = useState<UserRole>("citizen");
  const [isDark, setIsDark] = useState<boolean>(true);
  const [navParams, setNavParams] = useState<any>({});

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [predictive, setPredictive] = useState<PredictiveData | null>(null);
  const [environmental, setEnvironmental] = useState<EnvironmentalData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadAllData = async () => {
    try {
      const [comps, anal, pred, env] = await Promise.all([
        fetchComplaints(),
        fetchAnalytics().catch(() => null),
        fetchPredictive().catch(() => null),
        fetchEnvironmental().catch(() => null),
      ]);
      setComplaints(comps);
      setAnalytics(anal);
      setPredictive(pred);
      setEnvironmental(env);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleNavigate = (page: string, params?: any) => {
    setCurrentPage(page);
    if (params) setNavParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === "admin") {
      setCurrentPage("admin");
    } else if (role === "analyst") {
      setCurrentPage("analytics");
    } else {
      setCurrentPage("citizen");
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? "" : "light"}`}>
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          role={currentRole}
        />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {currentPage === "landing" && (
            <LandingPage
              onNavigate={handleNavigate}
              analytics={analytics}
            />
          )}

          {currentPage === "citizen" && (
            <CitizenDashboard
              onNavigate={handleNavigate}
              complaints={complaints}
            />
          )}

          {currentPage === "submit" && (
            <SubmitComplaintPage
              onNavigate={handleNavigate}
              onComplaintCreated={loadAllData}
            />
          )}

          {currentPage === "track" && (
            <TrackComplaintPage
              initialComplaintId={navParams.complaintId || "CIV-2024-00101"}
              isNew={navParams.newlyCreated}
            />
          )}

          {currentPage === "explorer" && (
            <CommunityExplorerPage
              complaints={complaints}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === "analytics" && (
            <AnalyticsDashboardPage
              analytics={analytics}
              predictive={predictive}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === "admin" && (
            <AdminDashboardPage
              complaints={complaints}
              onRefresh={loadAllData}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === "assistant" && <AssistantPage />}

          {currentPage === "environmental" && (
            <EnvironmentalPage
              data={environmental}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === "about" && <AboutPage />}
        </main>
      </div>
    </div>
  );
}

export default App;

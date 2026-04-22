import { Wrench, LayoutDashboard, AlertTriangle, Settings, CheckCircle, Clock } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Routes, Route } from "react-router-dom";
import TechnicianOverview from "./technician/TechnicianOverview";
import TechnicianIssues from "./technician/TechnicianIssues";
import TechnicianSettings from "./technician/TechnicianSettings";

const navItems = [
  { label: "Overview", href: "/technician", icon: LayoutDashboard },
  { label: "Platform Issues", href: "/technician/issues", icon: AlertTriangle },
  { label: "Resolved", href: "/technician/resolved", icon: CheckCircle },
  { label: "Settings", href: "/technician/settings", icon: Settings },
];

export default function TechnicianDashboard() {
  return (
    <DashboardLayout title="Technician Dashboard" subtitle="Monitor and resolve platform technical issues" navItems={navItems}>
      <Routes>
        <Route index element={<TechnicianOverview />} />
        <Route path="issues" element={<TechnicianIssues />} />
        <Route path="resolved" element={<TechnicianIssues resolved />} />
        <Route path="settings" element={<TechnicianSettings />} />
      </Routes>
    </DashboardLayout>
  );
}

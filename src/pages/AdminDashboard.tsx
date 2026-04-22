import { LayoutDashboard, Users, BookOpen, Grid3X3, Settings, Shield, DollarSign, Wallet } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Routes, Route } from "react-router-dom";
import AdminOverview from "./admin/AdminOverview";
import AdminUsers from "./admin/AdminUsers";
import AdminBookings from "./admin/AdminBookings";
import AdminVerification from "./admin/AdminVerification";
import AdminFinance from "./admin/AdminFinance";
import AdminCategories from "./admin/AdminCategories";
import AdminSettings from "./admin/AdminSettings";
import AdminWithdrawals from "./admin/AdminWithdrawals";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Bookings", href: "/admin/bookings", icon: BookOpen },
  { label: "Verification", href: "/admin/verification", icon: Shield },
  { label: "Transactions", href: "/admin/finance", icon: DollarSign },
  { label: "Withdrawals", href: "/admin/withdrawals", icon: Wallet },
  { label: "Categories", href: "/admin/categories", icon: Grid3X3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Platform overview and management" navItems={navItems}>
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="verification" element={<AdminVerification />} />
        <Route path="finance" element={<AdminFinance />} />
        <Route path="withdrawals" element={<AdminWithdrawals />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="settings" element={<AdminSettings />} />
      </Routes>
    </DashboardLayout>
  );
}

import { LayoutDashboard, BookOpen, User, CreditCard, Heart } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Routes, Route } from "react-router-dom";
import StudentOverview from "./student/StudentOverview";
import StudentSessions from "./student/StudentSessions";
import StudentPayments from "./student/StudentPayments";
import StudentSavedTutors from "./student/StudentSavedTutors";
import StudentProfile from "./student/StudentProfile";
import StudentSessionDetails from "./student/StudentSessionDetails";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Sessions", href: "/dashboard/sessions", icon: BookOpen },
  { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { label: "Saved Tutors", href: "/dashboard/saved", icon: Heart },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

export default function StudentDashboard() {
  return (
    <DashboardLayout title="Student Dashboard" subtitle="Welcome back! Here's your learning overview" navItems={navItems}>
      <Routes>
        <Route index element={<StudentOverview />} />
        <Route path="sessions" element={<StudentSessions />} />
        <Route path="sessions/:id" element={<StudentSessionDetails />} />
        <Route path="payments" element={<StudentPayments />} />
        <Route path="saved" element={<StudentSavedTutors />} />
        <Route path="profile" element={<StudentProfile />} />
      </Routes>
    </DashboardLayout>
  );
}

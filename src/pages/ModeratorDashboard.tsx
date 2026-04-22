import { Shield, Users, FileText, Eye, Ticket, LayoutDashboard, BookOpen, Inbox } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Routes, Route } from "react-router-dom";
import ModeratorOverview from "./moderator/ModeratorOverview";
import ModeratorUsers from "./moderator/ModeratorUsers";
import ModeratorContent from "./moderator/ModeratorContent";
import ModeratorSessions from "./moderator/ModeratorSessions";
import ModeratorVerification from "./moderator/ModeratorVerification";
import ModeratorTickets from "./moderator/ModeratorTickets";
import ModeratorBlogManagement from "./moderator/ModeratorBlogManagement";
import ModeratorContactMessages from "./moderator/ModeratorContactMessages";

const navItems = [
  { label: "Overview", href: "/moderator", icon: LayoutDashboard },
  { label: "User Moderation", href: "/moderator/users", icon: Users },
  { label: "Content", href: "/moderator/content", icon: FileText },
  { label: "Blog Management", href: "/moderator/blog", icon: BookOpen },
  { label: "Contact Inbox", href: "/moderator/contact", icon: Inbox },
  { label: "Sessions", href: "/moderator/sessions", icon: Eye },
  { label: "Verification", href: "/moderator/verification", icon: Shield },
  { label: "Support Tickets", href: "/moderator/tickets", icon: Ticket },
];

export default function ModeratorDashboard() {
  return (
    <DashboardLayout title="Moderator Dashboard" subtitle="Platform moderation & support" navItems={navItems}>
      <Routes>
        <Route index element={<ModeratorOverview />} />
        <Route path="users" element={<ModeratorUsers />} />
        <Route path="content" element={<ModeratorContent />} />
        <Route path="blog" element={<ModeratorBlogManagement />} />
        <Route path="contact" element={<ModeratorContactMessages />} />
        <Route path="sessions" element={<ModeratorSessions />} />
        <Route path="verification" element={<ModeratorVerification />} />
        <Route path="tickets" element={<ModeratorTickets />} />
      </Routes>
    </DashboardLayout>
  );
}

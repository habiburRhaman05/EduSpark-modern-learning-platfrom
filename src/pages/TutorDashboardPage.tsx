import { LayoutDashboard, BookOpen, User, Calendar, DollarSign, Star, Settings, Shield, Wallet } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Routes, Route } from "react-router-dom";
import TutorOverview from "./tutor/TutorOverview";
import TutorSessions from "./tutor/TutorSessions";
import TutorEarnings from "./tutor/TutorEarnings";
import TutorReviews from "./tutor/TutorReviews";
import TutorAccount from "./tutor/TutorAccount";
import TutorWithdraw from "./tutor/TutorWithdraw";
import TutorSettings from "./tutor/TutorSettings";
import TutorVerification from "./tutor/TutorVerification";
import TutorAvailability from "./tutor/TutorAvailability";
import { TutorOnboardingProvider } from "@/components/tutor/TutorOnboardingProvider";
import { OnboardingAlertBanner } from "@/components/tutor/OnboardingAlertBanner";

const navItems = [
  { label: "Overview", href: "/tutor", icon: LayoutDashboard },
  { label: "Sessions", href: "/tutor/sessions", icon: BookOpen },
  { label: "Availability", href: "/tutor/availability", icon: Calendar },
  { label: "Earnings", href: "/tutor/earnings", icon: DollarSign },
  { label: "Reviews", href: "/tutor/reviews", icon: Star },
  { label: "Withdraw", href: "/tutor/withdraw", icon: Wallet },
  { label: "Verification", href: "/tutor/verification", icon: Shield },
  { label: "Profile", href: "/tutor/profile", icon: User },
  { label: "Settings", href: "/tutor/settings", icon: Settings },
];

export default function TutorDashboard() {
  return (
    <DashboardLayout title="Tutor Dashboard" subtitle="Welcome back! Here's your teaching overview" navItems={navItems}>
      <TutorOnboardingProvider>
        <OnboardingAlertBanner />
        <Routes>
          <Route index element={<TutorOverview />} />
          <Route path="sessions" element={<TutorSessions />} />
          <Route path="availability" element={<TutorAvailability />} />
          <Route path="earnings" element={<TutorEarnings />} />
          <Route path="reviews" element={<TutorReviews />} />
          <Route path="withdraw/*" element={<TutorWithdraw />} />
          <Route path="verification" element={<TutorVerification />} />
          <Route path="profile" element={<TutorAccount />} />
          <Route path="settings" element={<TutorSettings />} />
        </Routes>
      </TutorOnboardingProvider>
    </DashboardLayout>
  );
}

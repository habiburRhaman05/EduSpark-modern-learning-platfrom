import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RoleSelectionGate } from "@/components/RoleSelectionGate";
import { Loader2 } from "lucide-react";

// Eagerly loaded — public/landing & auth (small, fast first paint)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import TutorListing from "./pages/TutorListing";
import TutorDetails from "./pages/TutorDetails";

// Lazy-loaded — heavy dashboards & secondary pages
const StudentPreferences = lazy(() => import("./pages/StudentPreferences"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const TutorDashboardPage = lazy(() => import("./pages/TutorDashboardPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ModeratorDashboard = lazy(() => import("./pages/ModeratorDashboard"));
const TechnicianDashboard = lazy(() => import("./pages/TechnicianDashboard"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetails = lazy(() => import("./pages/BlogDetails"));
const Terms = lazy(() => import("./pages/Terms"));
const CategoryExplore = lazy(() => import("./pages/CategoryExplore"));
const TutorOnboarding = lazy(() => import("./pages/TutorOnboarding"));
const Notifications = lazy(() => import("./pages/Notifications"));
const SessionCall = lazy(() => import("./pages/SessionCall"));

const queryClient = new QueryClient();

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-7 h-7 animate-spin text-primary" />
    </div>
  );
}

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <RoleSelectionGate />
            <Suspense fallback={<PageFallback />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/tutors" element={<TutorListing />} />
                <Route path="/tutors/:id" element={<TutorDetails />} />
                <Route path="/categories" element={<CategoryExplore />} />
                <Route path="/tutor-onboarding" element={<TutorOnboarding />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetails />} />
                <Route path="/terms" element={<Terms />} />

                {/* Student preferences */}
                <Route
                  path="/student-preferences"
                  element={
                    <ProtectedRoute allowedRoles={["student"]}>
                      <StudentPreferences />
                    </ProtectedRoute>
                  }
                />

                {/* Student dashboard */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["student"]}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/*"
                  element={
                    <ProtectedRoute allowedRoles={["student"]}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Tutor dashboard */}
                <Route
                  path="/tutor"
                  element={
                    <ProtectedRoute allowedRoles={["tutor"]}>
                      <TutorDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tutor/*"
                  element={
                    <ProtectedRoute allowedRoles={["tutor"]}>
                      <TutorDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin dashboard */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Moderator dashboard */}
                <Route
                  path="/moderator"
                  element={
                    <ProtectedRoute allowedRoles={["moderator"]}>
                      <ModeratorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/moderator/*"
                  element={
                    <ProtectedRoute allowedRoles={["moderator"]}>
                      <ModeratorDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Technician dashboard */}
                <Route
                  path="/technician"
                  element={
                    <ProtectedRoute allowedRoles={["technician"]}>
                      <TechnicianDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/technician/*"
                  element={
                    <ProtectedRoute allowedRoles={["technician"]}>
                      <TechnicianDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Live session call */}
                <Route
                  path="/session/:id/call"
                  element={
                    <ProtectedRoute allowedRoles={["student", "tutor"]}>
                      <SessionCall />
                    </ProtectedRoute>
                  }
                />

                {/* Notifications */}
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

type AppRole = "student" | "tutor" | "admin" | "moderator" | "technician";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: AppRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, loading, hasPreferences } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Student without preferences → redirect to preferences page
  if (role === "student" && !hasPreferences && location.pathname !== "/student-preferences") {
    return <Navigate to="/student-preferences" replace />;
  }

  // Role-based access control
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirect to appropriate dashboard
    const dashboardMap: Record<AppRole, string> = {
      student: "/dashboard",
      tutor: "/tutor",
      admin: "/admin",
      moderator: "/moderator",
      technician: "/technician",
    };
    return <Navigate to={dashboardMap[role] || "/"} replace />;
  }

  return <>{children}</>;
}

import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: route not found:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mb-2">
          <span className="text-4xl font-black text-gradient">404</span>
        </div>
        <h1 className="text-3xl font-black text-foreground">Page not found</h1>
        <p className="text-muted-foreground">
          The page <code className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">{location.pathname}</code> doesn't exist or has moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="rounded-xl">
            <Link to="/"><Home className="w-4 h-4 mr-1.5" /> Go home</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/tutors"><Search className="w-4 h-4 mr-1.5" /> Browse tutors</Link>
          </Button>
          <Button variant="ghost" onClick={() => history.back()} className="rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Go back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

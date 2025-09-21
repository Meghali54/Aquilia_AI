import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import Login from "@/pages/auth/login";
import Dashboard from "@/pages/dashboard";
import Upload from "@/pages/upload";
import Explorer from "@/pages/explorer";
import Visualize from "@/pages/visualize";
import AITools from "@/pages/ai-tools";
import Taxonomy from "@/pages/taxonomy";
import Reports from "@/pages/reports";
import Admin from "@/pages/admin";
import Profile from "@/pages/profile";
import AccessDenied from "@/pages/403";

function ProtectedRoute({ 
  children, 
  requiredRoles 
}: { 
  children: React.ReactNode; 
  requiredRoles?: string[] 
}) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Redirect to="/auth/login" />;
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Redirect to="/403" />;
  }

  return <>{children}</>;
}

function Router() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Switch>
      {/* Auth routes */}
      <Route path="/auth/login" component={Login} />
      
      {/* Default redirect */}
      <Route path="/">
        {isAuthenticated && user ? (
          <Redirect 
            to={
              user.role === 'admin' ? '/admin' :
              user.role === 'researcher' ? '/dashboard' :
              user.role === 'policy_user' ? '/visualize' :
              '/explorer'
            } 
          />
        ) : (
          <Redirect to="/auth/login" />
        )}
      </Route>

      {/* Protected routes */}
      <Route path="/dashboard">
        <ProtectedRoute requiredRoles={['admin', 'researcher']}>
          <Dashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/upload">
        <ProtectedRoute requiredRoles={['admin', 'researcher']}>
          <Upload />
        </ProtectedRoute>
      </Route>

      <Route path="/explorer">
        <ProtectedRoute>
          <Explorer />
        </ProtectedRoute>
      </Route>

      <Route path="/visualize">
        <ProtectedRoute requiredRoles={['admin', 'researcher', 'policy_user']}>
          <Visualize />
        </ProtectedRoute>
      </Route>

      <Route path="/ai-tools">
        <ProtectedRoute requiredRoles={['admin', 'researcher']}>
          <AITools />
        </ProtectedRoute>
      </Route>

      <Route path="/taxonomy">
        <ProtectedRoute requiredRoles={['admin', 'researcher', 'policy_user']}>
          <Taxonomy />
        </ProtectedRoute>
      </Route>

      <Route path="/reports">
        <ProtectedRoute requiredRoles={['admin', 'researcher', 'policy_user']}>
          <Reports />
        </ProtectedRoute>
      </Route>

      <Route path="/admin">
        <ProtectedRoute requiredRoles={['admin']}>
          <Admin />
        </ProtectedRoute>
      </Route>

      <Route path="/profile">
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </Route>

      {/* Error pages */}
      <Route path="/403" component={AccessDenied} />
      
      {/* 404 fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

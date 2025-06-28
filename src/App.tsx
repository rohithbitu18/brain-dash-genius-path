
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import SnapSolve from "./pages/SnapSolve";
import SmartNotes from "./pages/SmartNotes";
import WritingLab from "./pages/WritingLab";
import ProgressAnalytics from "./pages/ProgressAnalytics";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* If user is authenticated, redirect to dashboard */}
      <Route 
        path="/" 
        element={user ? <Navigate to="/dashboard" replace /> : <Index />} 
      />
      
      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/snap-solve"
        element={
          <ProtectedRoute>
            <SnapSolve />
          </ProtectedRoute>
        }
      />
      <Route
        path="/smart-notes"
        element={
          <ProtectedRoute>
            <SmartNotes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/writing-lab"
        element={
          <ProtectedRoute>
            <WritingLab />
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress-analytics"
        element={
          <ProtectedRoute>
            <ProgressAnalytics />
          </ProtectedRoute>
        }
      />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

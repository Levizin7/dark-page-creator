import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { TransactionProvider } from "@/contexts/TransactionContext";
import Index from "./pages/Index.tsx";
import Extrato from "./pages/Extrato.tsx";
import Cofrinhos from "./pages/Cofrinhos.tsx";
import Transferir from "./pages/Transferir.tsx";
import Cartoes from "./pages/Cartoes.tsx";
import Receber from "./pages/Receber.tsx";
import Pagar from "./pages/Pagar.tsx";
import Escanear from "./pages/Escanear.tsx";
import Perfil from "./pages/Perfil.tsx";
import Auth from "./pages/Auth.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
    <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
    <Route path="/extrato" element={<ProtectedRoute><Extrato /></ProtectedRoute>} />
    <Route path="/cofrinhos" element={<ProtectedRoute><Cofrinhos /></ProtectedRoute>} />
    <Route path="/transferir" element={<ProtectedRoute><Transferir /></ProtectedRoute>} />
    <Route path="/cartoes" element={<ProtectedRoute><Cartoes /></ProtectedRoute>} />
    <Route path="/receber" element={<ProtectedRoute><Receber /></ProtectedRoute>} />
    <Route path="/pagar" element={<ProtectedRoute><Pagar /></ProtectedRoute>} />
    <Route path="/escanear" element={<ProtectedRoute><Escanear /></ProtectedRoute>} />
    <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TransactionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </TransactionProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

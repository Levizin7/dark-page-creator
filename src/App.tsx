import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TransactionProvider } from "@/contexts/TransactionContext";
import Index from "./pages/Index.tsx";
import Extrato from "./pages/Extrato.tsx";
import Cofrinhos from "./pages/Cofrinhos.tsx";
import Transferir from "./pages/Transferir.tsx";
import Cartoes from "./pages/Cartoes.tsx";
import Notificacoes from "./pages/Notificacoes.tsx";
import Perfil from "./pages/Perfil.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TransactionProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/extrato" element={<Extrato />} />
            <Route path="/cofrinhos" element={<Cofrinhos />} />
            <Route path="/transferir" element={<Transferir />} />
            <Route path="/cartoes" element={<Cartoes />} />
            <Route path="/notificacoes" element={<Notificacoes />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </TransactionProvider>
  </QueryClientProvider>
);

export default App;

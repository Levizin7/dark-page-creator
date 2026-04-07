import { useState, useEffect } from "react";
import { ArrowLeft, Copy, LogOut, ChevronRight, Shield, HelpCircle, FileText, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";

interface Profile {
  full_name: string;
  cpf: string | null;
  phone: string | null;
  agency: string;
  account_number: string;
}

const menuItems = [
  { icon: Shield, label: "Segurança", description: "Senha, biometria e 2FA" },
  { icon: Settings, label: "Configurações", description: "Preferências da conta" },
  { icon: FileText, label: "Documentos", description: "Termos e comprovantes" },
  { icon: HelpCircle, label: "Ajuda", description: "Central de atendimento" },
];

const Perfil = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
      if (data) setProfile(data);
    };
    fetchProfile();
  }, [user]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative pb-24">
      <div className="bg-primary px-5 pt-12 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/10 backdrop-blur-md">
            <ArrowLeft size={20} className="text-foreground" />
          </motion.button>
          <h1 className="font-heading font-bold text-xl text-foreground">Meu Perfil</h1>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 ring-2 ring-accent/30">
            <AvatarFallback className="bg-accent/20 text-accent font-heading font-bold text-xl">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-heading font-bold text-lg text-foreground">{profile?.full_name || "Carregando..."}</h2>
            <p className="text-sm text-foreground/50 font-body">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
          <h3 className="font-heading font-semibold text-sm text-foreground mb-2">Dados da conta</h3>
          <InfoRow label="CPF" value={profile?.cpf || "Não informado"} onCopy={profile?.cpf ? () => copyToClipboard(profile.cpf!, "CPF") : undefined} />
          <InfoRow label="Agência" value={profile?.agency || "0001"} onCopy={() => copyToClipboard(profile?.agency || "0001", "Agência")} />
          <InfoRow label="Conta" value={profile?.account_number || "---"} onCopy={() => copyToClipboard(profile?.account_number || "", "Conta")} />
          <InfoRow label="Banco" value="VaultBank" />
          <InfoRow label="Telefone" value={profile?.phone || "Não informado"} onCopy={profile?.phone ? () => copyToClipboard(profile.phone!, "Telefone") : undefined} />
        </div>
      </div>

      <div className="px-4 mt-4 space-y-2">
        {menuItems.map((item, index) => (
          <motion.button key={item.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:bg-muted/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center"><item.icon size={18} className="text-accent" /></div>
            <div className="flex-1 text-left">
              <p className="font-heading font-semibold text-sm text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground font-body">{item.description}</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground/40" />
          </motion.button>
        ))}
      </div>

      <div className="px-4 mt-6">
        <motion.button whileTap={{ scale: 0.97 }} onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 transition-colors">
          <LogOut size={18} className="text-destructive" />
          <span className="font-heading font-semibold text-sm text-destructive">Sair da conta</span>
        </motion.button>
      </div>
      <BottomNav />
    </div>
  );
};

const InfoRow = ({ label, value, onCopy }: { label: string; value: string; onCopy?: () => void }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-[10px] text-muted-foreground font-body">{label}</p>
      <p className="text-sm font-body text-foreground">{value}</p>
    </div>
    {onCopy && (
      <motion.button whileTap={{ scale: 0.9 }} onClick={onCopy} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
        <Copy size={14} className="text-muted-foreground" />
      </motion.button>
    )}
  </div>
);

export default Perfil;

import { ArrowLeft, Copy, LogOut, ChevronRight, Shield, HelpCircle, FileText, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";

const accountData = {
  name: "Carlos Oliveira",
  cpf: "•••.456.789-••",
  email: "carlos@email.com",
  phone: "(11) 9 8765-4321",
  agency: "0001",
  account: "12345-6",
  bank: "NovaBank",
};

const menuItems = [
  { icon: Shield, label: "Segurança", description: "Senha, biometria e 2FA" },
  { icon: Settings, label: "Configurações", description: "Preferências da conta" },
  { icon: FileText, label: "Documentos", description: "Termos e comprovantes" },
  { icon: HelpCircle, label: "Ajuda", description: "Central de atendimento" },
];

const Perfil = () => {
  const navigate = useNavigate();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative pb-24">
      {/* Header */}
      <div className="bg-primary px-5 pt-12 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white/10 backdrop-blur-md"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </motion.button>
          <h1 className="font-heading font-bold text-xl text-foreground">Meu Perfil</h1>
        </div>

        {/* Avatar and name */}
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 ring-2 ring-accent/30">
            <AvatarFallback className="bg-accent/20 text-accent font-heading font-bold text-xl">
              CO
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-heading font-bold text-lg text-foreground">{accountData.name}</h2>
            <p className="text-sm text-foreground/50 font-body">{accountData.email}</p>
          </div>
        </div>
      </div>

      {/* Account info */}
      <div className="px-4 mt-4">
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
          <h3 className="font-heading font-semibold text-sm text-foreground mb-2">Dados da conta</h3>

          <InfoRow label="CPF" value={accountData.cpf} onCopy={() => copyToClipboard("12345678900", "CPF")} />
          <InfoRow label="Agência" value={accountData.agency} onCopy={() => copyToClipboard(accountData.agency, "Agência")} />
          <InfoRow label="Conta" value={accountData.account} onCopy={() => copyToClipboard(accountData.account, "Conta")} />
          <InfoRow label="Banco" value={accountData.bank} />
          <InfoRow label="Telefone" value={accountData.phone} onCopy={() => copyToClipboard(accountData.phone, "Telefone")} />
        </div>
      </div>

      {/* Menu items */}
      <div className="px-4 mt-4 space-y-2">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:bg-muted/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <item.icon size={18} className="text-accent" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-heading font-semibold text-sm text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground font-body">{item.description}</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground/40" />
          </motion.button>
        ))}
      </div>

      {/* Logout */}
      <div className="px-4 mt-6">
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 transition-colors"
        >
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

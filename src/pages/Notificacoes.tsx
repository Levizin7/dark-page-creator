import { ArrowLeft, Gift, Percent, CreditCard, Star, Megaphone, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const notifications = [
  {
    id: 1,
    icon: Gift,
    color: "text-accent",
    bg: "bg-accent/15",
    title: "Cashback de 5% no débito!",
    description: "Use seu cartão de débito e ganhe cashback direto na conta. Válido até 30/04.",
    time: "Agora",
    unread: true,
  },
  {
    id: 2,
    icon: Percent,
    color: "text-success",
    bg: "bg-success/15",
    title: "Empréstimo pré-aprovado",
    description: "Você tem R$ 15.000 disponíveis com taxa a partir de 1,49% a.m.",
    time: "2h atrás",
    unread: true,
  },
  {
    id: 3,
    icon: CreditCard,
    color: "text-primary",
    bg: "bg-primary/15",
    title: "Cartão sem anuidade",
    description: "Peça já seu VaultBank Platinum sem anuidade no primeiro ano!",
    time: "5h atrás",
    unread: false,
  },
  {
    id: 4,
    icon: Star,
    color: "text-yellow-400",
    bg: "bg-yellow-400/15",
    title: "Programa de pontos",
    description: "Acumule pontos a cada compra e troque por produtos e viagens.",
    time: "1 dia",
    unread: false,
  },
  {
    id: 5,
    icon: Megaphone,
    color: "text-destructive",
    bg: "bg-destructive/15",
    title: "Black Friday antecipada",
    description: "Ofertas exclusivas para clientes VaultBank. Confira agora!",
    time: "2 dias",
    unread: false,
  },
  {
    id: 6,
    icon: Gift,
    color: "text-accent",
    bg: "bg-accent/15",
    title: "Indique e ganhe R$ 50",
    description: "Convide amigos para o VaultBank e ganhe R$ 50 por cada indicação.",
    time: "3 dias",
    unread: false,
  },
];

const Notificacoes = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative pb-24">
      {/* Header */}
      <div className="bg-primary px-5 pt-12 pb-6">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white/10 backdrop-blur-md"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </motion.button>
          <h1 className="font-heading font-bold text-xl text-foreground">Notificações</h1>
        </div>
      </div>

      {/* Notifications list */}
      <div className="px-4 mt-4 space-y-3">
        {notifications.map((notif, index) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-start gap-3 p-4 rounded-2xl border transition-colors cursor-pointer ${
              notif.unread
                ? "bg-accent/5 border-accent/20"
                : "bg-card border-border hover:bg-muted/50"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl ${notif.bg} flex items-center justify-center shrink-0`}>
              <notif.icon size={18} className={notif.color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-heading font-semibold text-sm text-foreground truncate">
                  {notif.title}
                </h3>
                {notif.unread && (
                  <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground font-body mt-0.5 line-clamp-2">
                {notif.description}
              </p>
              <span className="text-[10px] text-muted-foreground/60 font-body mt-1 block">
                {notif.time}
              </span>
            </div>
            <ChevronRight size={16} className="text-muted-foreground/40 shrink-0 mt-1" />
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default Notificacoes;

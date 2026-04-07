import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Lock, Unlock, Snowflake, CreditCard, Wifi, Copy, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTransactions } from "@/contexts/TransactionContext";
import BottomNav from "@/components/BottomNav";

const Cartoes = () => {
  const navigate = useNavigate();
  const { transactions } = useTransactions();
  const [showNumber, setShowNumber] = useState(false);
  const [activeCard, setActiveCard] = useState<"virtual" | "fisico">("virtual");
  const [cardLocked, setCardLocked] = useState(false);
  const [cardFrozen, setCardFrozen] = useState(false);

  const cards = {
    virtual: { name: "Cartão Virtual", number: "5432 •••• •••• 8721", fullNumber: "5432 1234 5678 8721", expiry: "12/28", cvv: "•••", fullCvv: "742", flag: "Mastercard", limit: 8000, used: 2350.47, color: "from-accent via-secondary to-accent" },
    fisico: { name: "Cartão Físico", number: "4916 •••• •••• 3054", fullNumber: "4916 7823 4512 3054", expiry: "09/29", cvv: "•••", fullCvv: "198", flag: "Visa", limit: 12000, used: 4780.99, color: "from-primary via-muted to-primary" },
  };

  const card = cards[activeCard];
  const usedPct = (card.used / card.limit) * 100;
  const available = card.limit - card.used;
  const formatCurrency = (val: number) => val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const cardTransactions = transactions.filter((tx) => tx.method.toLowerCase().includes("cartão") || tx.method.toLowerCase().includes("virtual") || tx.method.toLowerCase().includes("físico")).slice(0, 5);

  const copyNumber = () => { navigator.clipboard.writeText(card.fullNumber.replace(/\s/g, "")); toast.success("Número copiado!"); };

  const actions = [
    { icon: cardLocked ? Unlock : Lock, label: cardLocked ? "Desbloquear" : "Bloquear", onClick: () => { setCardLocked(!cardLocked); toast(cardLocked ? "Cartão desbloqueado" : "Cartão bloqueado"); }, color: cardLocked ? "text-success" : "text-destructive", bg: cardLocked ? "bg-success/15" : "bg-destructive/15" },
    { icon: Snowflake, label: cardFrozen ? "Descongelar" : "Congelar", onClick: () => { setCardFrozen(!cardFrozen); toast(cardFrozen ? "Cartão descongelado" : "Cartão congelado"); }, color: cardFrozen ? "text-accent" : "text-muted-foreground", bg: cardFrozen ? "bg-accent/15" : "bg-muted" },
    { icon: Settings, label: "Configurar", onClick: () => toast("Configurações"), color: "text-muted-foreground", bg: "bg-muted" },
  ];

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative pb-24">
      <div className="bg-primary px-5 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-6">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate("/")} className="p-2 rounded-full bg-white/10 backdrop-blur-md"><ArrowLeft size={20} className="text-foreground" /></motion.button>
          <h1 className="font-heading font-bold text-xl text-foreground">Meus Cartões</h1>
        </div>
        <div className="flex gap-2 mb-5">
          {(["virtual", "fisico"] as const).map((type) => (
            <motion.button key={type} whileTap={{ scale: 0.95 }} onClick={() => { setActiveCard(type); setShowNumber(false); }} className={`flex-1 py-2.5 rounded-xl text-xs font-body font-semibold border transition-all ${activeCard === type ? "bg-accent/15 border-accent/30 text-accent" : "bg-white/5 border-white/10 text-foreground/50"}`}>
              {type === "virtual" ? "💳 Virtual" : "🏦 Físico"}
            </motion.button>
          ))}
        </div>
        <motion.div key={activeCard} initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ duration: 0.4 }} className={`relative bg-gradient-to-br ${card.color} rounded-2xl p-5 h-[200px] flex flex-col justify-between shadow-2xl border border-white/10 overflow-hidden`}>
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />
          <div className="flex justify-between items-start relative z-10">
            <div><p className="text-[10px] text-foreground/50 font-body uppercase tracking-widest">NovaBank</p><p className="text-xs text-foreground/70 font-body mt-0.5">{card.name}</p></div>
            <div className="flex items-center gap-2">
              <Wifi size={18} className="text-foreground/40 rotate-90" />
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowNumber(!showNumber)}>{showNumber ? <EyeOff size={16} className="text-foreground/50" /> : <Eye size={16} className="text-foreground/50" />}</motion.button>
            </div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <p className="font-body text-lg text-foreground tracking-[0.2em]">{showNumber ? card.fullNumber : card.number}</p>
              {showNumber && <motion.button whileTap={{ scale: 0.9 }} onClick={copyNumber}><Copy size={12} className="text-foreground/40" /></motion.button>}
            </div>
            <div className="flex justify-between items-end">
              <div className="flex gap-6">
                <div><p className="text-[8px] text-foreground/40 font-body uppercase">Validade</p><p className="text-xs text-foreground/80 font-body">{card.expiry}</p></div>
                <div><p className="text-[8px] text-foreground/40 font-body uppercase">CVV</p><p className="text-xs text-foreground/80 font-body">{showNumber ? card.fullCvv : card.cvv}</p></div>
              </div>
              <p className="text-xs text-foreground/50 font-heading font-bold">{card.flag}</p>
            </div>
          </div>
          {cardLocked && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20 rounded-2xl"><div className="text-center"><Lock size={28} className="text-destructive mx-auto mb-1" /><p className="text-xs text-foreground font-body">Cartão bloqueado</p></div></motion.div>}
        </motion.div>
      </div>

      <div className="px-5 mt-5">
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2"><span className="text-xs text-muted-foreground font-body">Limite utilizado</span><span className="text-xs font-body font-semibold text-foreground">{usedPct.toFixed(0)}%</span></div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3"><motion.div initial={{ width: 0 }} animate={{ width: `${usedPct}%` }} transition={{ duration: 0.8 }} className={`h-full rounded-full ${usedPct > 80 ? "bg-destructive" : "bg-accent"}`} /></div>
          <div className="flex justify-between">
            <div><p className="text-[9px] text-muted-foreground/60 font-body">Usado</p><p className="text-sm font-body font-semibold text-foreground">{formatCurrency(card.used)}</p></div>
            <div className="text-right"><p className="text-[9px] text-muted-foreground/60 font-body">Disponível</p><p className="text-sm font-body font-semibold text-success">{formatCurrency(available)}</p></div>
          </div>
        </div>
      </div>

      <div className="px-5 mt-4 flex gap-2">
        {actions.map((action) => (
          <motion.button key={action.label} whileTap={{ scale: 0.93 }} onClick={action.onClick} className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl ${action.bg} border border-border`}>
            <action.icon size={18} className={action.color} /><span className="text-[10px] font-body font-medium text-muted-foreground">{action.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="px-5 mt-5">
        <h3 className="text-sm font-heading font-semibold text-muted-foreground mb-3">Últimas compras no cartão</h3>
        {cardTransactions.length === 0 ? (
          <div className="text-center py-8"><CreditCard size={28} className="text-muted-foreground/30 mx-auto mb-2" /><p className="text-xs text-muted-foreground/50 font-body">Nenhuma compra no cartão ainda</p></div>
        ) : (
          <div className="space-y-2">
            {cardTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${tx.type === "income" ? "bg-success/15" : "bg-destructive/15"}`}><CreditCard size={14} className={tx.type === "income" ? "text-success" : "text-destructive"} /></div>
                <div className="flex-1 min-w-0"><p className="text-xs font-body font-medium text-foreground truncate">{tx.title}</p><p className="text-[9px] text-muted-foreground/50 font-body">{tx.code}</p></div>
                <span className={`text-xs font-body font-semibold ${tx.type === "income" ? "text-success" : "text-destructive"}`}>{formatCurrency(tx.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Cartoes;

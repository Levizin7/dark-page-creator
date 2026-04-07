import { useState } from "react";
import { ArrowLeft, Search, ArrowUpRight, QrCode, Zap, Building2, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTransactions } from "@/contexts/TransactionContext";
import BottomNav from "@/components/BottomNav";

const transferTypes = [
  { icon: Zap, label: "PIX", description: "Transferência instantânea", color: "text-accent", bg: "bg-accent/15" },
  { icon: Building2, label: "TED", description: "Até 1 dia útil", color: "text-secondary", bg: "bg-secondary/15" },
  { icon: QrCode, label: "QR Code", description: "Escaneie para pagar", color: "text-success", bg: "bg-success/15" },
];

const recentContacts = [
  { name: "Maria Silva", initials: "MS", key: "•••.456.789-00", lastTransfer: "Ontem" },
  { name: "João Pedro", initials: "JP", key: "joao@email.com", lastTransfer: "3 dias atrás" },
  { name: "Ana Costa", initials: "AC", key: "(11) 98765-4321", lastTransfer: "1 semana" },
  { name: "Pedro Santos", initials: "PS", key: "•••.123.456-78", lastTransfer: "2 semanas" },
];

const Transferir = () => {
  const navigate = useNavigate();
  const { addTransaction, balanceCents } = useTransactions();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [recipient, setRecipient] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"select" | "form">("select");

  const formatInputCurrency = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    const cents = Number(digits) || 0;
    if (cents === 0) return "";
    return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setAmount(raw);
  };

  const handleSelectType = (label: string) => {
    setSelectedType(label);
    setStep("form");
  };

  const handleTransfer = () => {
    if (!recipient.trim() || !amount || Number(amount) === 0) {
      toast.error("Preencha todos os campos");
      return;
    }
    const amountValue = Number(amount) / 100;
    if (amountValue * 100 > balanceCents) {
      toast.error("Saldo insuficiente");
      return;
    }

    const name = recipientName || recipient.trim();

    addTransaction({
      title: `Transferência para ${name}`,
      description: `${selectedType} enviado para ${recipient}`,
      amount: -amountValue,
      type: "expense",
      category: "Transferência",
      method: selectedType || "PIX",
      recipient: name,
    });

    toast.success(`${selectedType} de ${formatInputCurrency(amount)} enviado para ${name}!`);
    setRecipient("");
    setRecipientName("");
    setAmount("");
    setStep("select");
    setSelectedType(null);
  };

  const handleSelectContact = (contact: typeof recentContacts[0]) => {
    setRecipient(contact.key);
    setRecipientName(contact.name);
    toast(`Destinatário: ${contact.name}`);
  };

  const balanceFormatted = (balanceCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative pb-24">
      <div className="bg-primary px-5 pt-12 pb-6">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => step === "form" ? (setStep("select"), setSelectedType(null)) : navigate(-1)}
            className="p-2 rounded-full bg-white/10 backdrop-blur-md"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </motion.button>
          <div>
            <h1 className="font-heading font-bold text-xl text-foreground">Transferir</h1>
            {selectedType && (
              <p className="text-xs text-foreground/50 font-body">via {selectedType}</p>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === "select" ? (
          <motion.div
            key="select"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="px-4 mt-5">
              <h3 className="text-sm font-heading font-semibold text-muted-foreground mb-3 px-1">Tipo de transferência</h3>
              <div className="space-y-2.5">
                {transferTypes.map((type, i) => (
                  <motion.button
                    key={type.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectType(type.label)}
                    className="w-full flex items-center gap-3.5 p-4 rounded-2xl bg-card border border-border hover:border-accent/30 transition-all"
                  >
                    <div className={`w-12 h-12 rounded-2xl ${type.bg} flex items-center justify-center`}>
                      <type.icon size={22} className={type.color} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-heading font-bold text-sm text-foreground">{type.label}</p>
                      <p className="text-xs text-muted-foreground font-body">{type.description}</p>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground/40" />
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="px-4 mt-6">
              <h3 className="text-sm font-heading font-semibold text-muted-foreground mb-3 px-1">Contatos recentes</h3>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                {recentContacts.map((contact, i) => (
                  <motion.button
                    key={contact.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => {
                      handleSelectContact(contact);
                      setSelectedType("PIX");
                      setStep("form");
                    }}
                    className="flex flex-col items-center gap-2 min-w-[72px]"
                  >
                    <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                      <span className="font-heading font-bold text-sm text-accent">{contact.initials}</span>
                    </div>
                    <span className="text-[10px] font-body text-muted-foreground text-center leading-tight w-16 truncate">
                      {contact.name.split(" ")[0]}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="px-4 mt-5"
          >
            <div className="mb-4">
              <label className="text-xs text-muted-foreground font-body mb-2 block px-1">Destinatário</label>
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                <input
                  value={recipient}
                  onChange={(e) => { setRecipient(e.target.value); setRecipientName(""); }}
                  placeholder="CPF, e-mail, telefone ou chave PIX"
                  className="w-full bg-card border border-border rounded-2xl pl-11 pr-4 py-4 text-sm text-foreground font-body outline-none focus:border-accent/50 transition-colors placeholder:text-muted-foreground/50"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="text-xs text-muted-foreground font-body mb-2 block px-1">Valor</label>
              <div className="bg-card border border-border rounded-2xl p-5 text-center">
                <input
                  value={formatInputCurrency(amount)}
                  onChange={handleAmountChange}
                  placeholder="R$ 0,00"
                  inputMode="numeric"
                  className="bg-transparent text-center font-heading font-bold text-3xl text-foreground outline-none w-full placeholder:text-muted-foreground/30"
                />
                <p className="text-[10px] text-muted-foreground/50 font-body mt-2">
                  Saldo disponível: {balanceFormatted}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              {[50, 100, 200, 500].map((val) => (
                <motion.button
                  key={val}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAmount(String(val * 100))}
                  className="flex-1 py-2.5 rounded-xl bg-muted border border-border text-xs font-body font-medium text-muted-foreground hover:border-accent/30 hover:text-accent transition-all"
                >
                  R$ {val}
                </motion.button>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.01 }}
              onClick={handleTransfer}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-accent text-accent-foreground font-heading font-bold text-sm shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all"
            >
              <ArrowUpRight size={18} />
              Transferir agora
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default Transferir;

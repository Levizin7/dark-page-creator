import { useState } from "react";
import { ArrowLeft, Barcode, QrCode, Zap, ChevronRight, Receipt } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTransactions } from "@/contexts/TransactionContext";
import BottomNav from "@/components/BottomNav";

const paymentTypes = [
  { icon: Barcode, label: "Boleto", description: "Cole ou digite o código de barras", color: "text-secondary", bg: "bg-secondary/15" },
  { icon: Zap, label: "PIX Copia e Cola", description: "Cole o código PIX", color: "text-accent", bg: "bg-accent/15" },
  { icon: Receipt, label: "Conta de consumo", description: "Água, luz, gás, internet", color: "text-success", bg: "bg-success/15" },
];

const Pagar = () => {
  const navigate = useNavigate();
  const { addTransaction, balance } = useTransactions();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"select" | "form">("select");
  const [loading, setLoading] = useState(false);

  const formatInputCurrency = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    const cents = Number(digits) || 0;
    if (cents === 0) return "";
    return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value.replace(/\D/g, ""));
  };

  const handlePay = async () => {
    if (!code.trim()) {
      toast.error("Cole o código do pagamento");
      return;
    }
    if (!amount || Number(amount) === 0) {
      toast.error("Informe o valor");
      return;
    }
    const amountValue = Number(amount) / 100;
    if (amountValue > balance) {
      toast.error("Saldo insuficiente");
      return;
    }

    setLoading(true);

    let title = "Pagamento";
    let category = "Pagamento";
    if (selectedType === "Boleto") {
      title = "Pagamento de Boleto";
      category = "Boleto";
    } else if (selectedType === "PIX Copia e Cola") {
      title = "Pagamento via PIX";
      category = "PIX";
    } else if (selectedType === "Conta de consumo") {
      title = "Pagamento de Conta";
      category = "Conta";
    }

    await addTransaction({
      title,
      description: `${selectedType} - código: ${code.slice(0, 20)}...`,
      amount: -amountValue,
      type: "expense",
      category,
      method: selectedType || "Boleto",
      recipient: selectedType || "",
    });

    toast.success(`Pagamento de ${formatInputCurrency(amount)} realizado!`);
    setCode("");
    setAmount("");
    setStep("select");
    setSelectedType(null);
    setLoading(false);
  };

  const balanceFormatted = balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative pb-24">
      <div className="bg-primary px-5 pt-12 pb-6">
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => step === "form" ? (setStep("select"), setSelectedType(null)) : navigate(-1)} className="p-2 rounded-full bg-white/10 backdrop-blur-md">
            <ArrowLeft size={20} className="text-foreground" />
          </motion.button>
          <div>
            <h1 className="font-heading font-bold text-xl text-foreground">Pagar</h1>
            {selectedType && <p className="text-xs text-foreground/50 font-body">via {selectedType}</p>}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === "select" ? (
          <motion.div key="select" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="px-4 mt-5">
              <h3 className="text-sm font-heading font-semibold text-muted-foreground mb-3 px-1">Tipo de pagamento</h3>
              <div className="space-y-2.5">
                {paymentTypes.map((type, i) => (
                  <motion.button key={type.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileTap={{ scale: 0.98 }} onClick={() => { setSelectedType(type.label); setStep("form"); }} className="w-full flex items-center gap-3.5 p-4 rounded-2xl bg-card border border-border hover:border-accent/30 transition-all">
                    <div className={`w-12 h-12 rounded-2xl ${type.bg} flex items-center justify-center`}><type.icon size={22} className={type.color} /></div>
                    <div className="flex-1 text-left">
                      <p className="font-heading font-bold text-sm text-foreground">{type.label}</p>
                      <p className="text-xs text-muted-foreground font-body">{type.description}</p>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground/40" />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="px-4 mt-5">
            <div className="mb-4">
              <label className="text-xs text-muted-foreground font-body mb-2 block px-1">
                {selectedType === "PIX Copia e Cola" ? "Código PIX" : selectedType === "Boleto" ? "Código de barras" : "Código da conta"}
              </label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={selectedType === "PIX Copia e Cola" ? "Cole o código PIX aqui" : "Cole o código de barras aqui"}
                rows={3}
                className="w-full bg-card border border-border rounded-2xl px-4 py-4 text-sm text-foreground font-body outline-none focus:border-accent/50 transition-colors placeholder:text-muted-foreground/50 resize-none"
              />
            </div>

            <div className="mb-6">
              <label className="text-xs text-muted-foreground font-body mb-2 block px-1">Valor</label>
              <div className="bg-card border border-border rounded-2xl p-5 text-center">
                <input value={formatInputCurrency(amount)} onChange={handleAmountChange} placeholder="R$ 0,00" inputMode="numeric" className="bg-transparent text-center font-heading font-bold text-3xl text-foreground outline-none w-full placeholder:text-muted-foreground/30" />
                <p className="text-[10px] text-muted-foreground/50 font-body mt-2">Saldo disponível: {balanceFormatted}</p>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              {[30, 80, 150, 300].map((val) => (
                <motion.button key={val} whileTap={{ scale: 0.95 }} onClick={() => setAmount(String(val * 100))} className="flex-1 py-2.5 rounded-xl bg-muted border border-border text-xs font-body font-medium text-muted-foreground hover:border-accent/30 hover:text-accent transition-all">
                  R$ {val}
                </motion.button>
              ))}
            </div>

            <motion.button whileTap={{ scale: 0.97 }} onClick={handlePay} disabled={loading} className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-secondary text-secondary-foreground font-heading font-bold text-sm shadow-lg shadow-secondary/20 disabled:opacity-50 transition-all">
              <Receipt size={18} />
              {loading ? "Pagando..." : "Pagar agora"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      <BottomNav />
    </div>
  );
};

export default Pagar;

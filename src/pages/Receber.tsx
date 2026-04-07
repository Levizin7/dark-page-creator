import { useState, useEffect } from "react";
import { ArrowLeft, Copy, QrCode, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "@/contexts/TransactionContext";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";

const Receber = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addTransaction } = useTransactions();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase.from("profiles").select("account_number").eq("user_id", user.id).single();
      if (data) {
        setAccountNumber(data.account_number);
        setPixKey(user.email || data.account_number);
      }
    };
    fetchProfile();
  }, [user]);

  const formatInputCurrency = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    const cents = Number(digits) || 0;
    if (cents === 0) return "";
    return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value.replace(/\D/g, ""));
  };

  const handleGenerateQR = () => {
    if (!amount || Number(amount) === 0) {
      toast.error("Informe o valor a receber");
      return;
    }
    setShowQR(true);
  };

  const handleSimulateReceive = async () => {
    if (!amount || Number(amount) === 0) return;
    setLoading(true);
    const amountValue = Number(amount) / 100;

    await addTransaction({
      title: "PIX Recebido",
      description: description || "Pagamento recebido via PIX",
      amount: amountValue,
      type: "income",
      category: "Recebimento",
      method: "PIX",
      recipient: "Pagador externo",
    });

    toast.success(`Recebimento de ${formatInputCurrency(amount)} simulado com sucesso!`);
    setAmount("");
    setDescription("");
    setShowQR(false);
    setLoading(false);
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
    toast.success("Chave PIX copiada!");
  };

  const qrData = JSON.stringify({
    bank: "VaultBank",
    key: pixKey,
    amount: Number(amount) / 100,
    desc: description,
  });

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative pb-24">
      <div className="bg-primary px-5 pt-12 pb-6">
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/10 backdrop-blur-md">
            <ArrowLeft size={20} className="text-foreground" />
          </motion.button>
          <h1 className="font-heading font-bold text-xl text-foreground">Receber</h1>
        </div>
      </div>

      <div className="px-4 mt-5 space-y-4">
        {/* Chave PIX */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs text-muted-foreground font-body mb-2">Sua chave PIX</p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-body text-foreground truncate flex-1 mr-2">{pixKey}</p>
            <motion.button whileTap={{ scale: 0.9 }} onClick={copyPixKey} className="p-2 rounded-xl bg-accent/10 hover:bg-accent/20 transition-colors">
              <Copy size={16} className="text-accent" />
            </motion.button>
          </div>
        </div>

        {/* Valor */}
        <div>
          <label className="text-xs text-muted-foreground font-body mb-2 block px-1">Valor a receber</label>
          <div className="bg-card border border-border rounded-2xl p-5 text-center">
            <input
              value={formatInputCurrency(amount)}
              onChange={handleAmountChange}
              placeholder="R$ 0,00"
              inputMode="numeric"
              className="bg-transparent text-center font-heading font-bold text-3xl text-foreground outline-none w-full placeholder:text-muted-foreground/30"
            />
          </div>
        </div>

        {/* Quick amounts */}
        <div className="flex gap-2">
          {[25, 50, 100, 250].map((val) => (
            <motion.button key={val} whileTap={{ scale: 0.95 }} onClick={() => setAmount(String(val * 100))} className="flex-1 py-2.5 rounded-xl bg-muted border border-border text-xs font-body font-medium text-muted-foreground hover:border-accent/30 hover:text-accent transition-all">
              R$ {val}
            </motion.button>
          ))}
        </div>

        {/* Descrição */}
        <div>
          <label className="text-xs text-muted-foreground font-body mb-2 block px-1">Descrição (opcional)</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Almoço, presente..."
            className="w-full bg-card border border-border rounded-2xl px-4 py-4 text-sm text-foreground font-body outline-none focus:border-accent/50 transition-colors placeholder:text-muted-foreground/50"
          />
        </div>

        {!showQR ? (
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleGenerateQR} className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-success text-white font-heading font-bold text-sm shadow-lg shadow-success/20">
            <QrCode size={18} />
            Gerar QR Code
          </motion.button>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            {/* Simulated QR Code */}
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center gap-4">
              <div className="w-48 h-48 bg-white rounded-2xl p-3 flex items-center justify-center">
                <div className="w-full h-full border-2 border-foreground/80 rounded-lg grid grid-cols-5 grid-rows-5 gap-0.5 p-2">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? "bg-foreground/80" : "bg-transparent"}`} />
                  ))}
                </div>
              </div>
              <div className="text-center">
                <p className="font-heading font-bold text-lg text-foreground">{formatInputCurrency(amount)}</p>
                {description && <p className="text-xs text-muted-foreground font-body mt-1">{description}</p>}
              </div>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => { navigator.clipboard.writeText(qrData); toast.success("Código copiado!"); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted border border-border text-xs font-body text-muted-foreground hover:text-accent transition-colors">
                <Share2 size={14} />
                Copiar código
              </motion.button>
            </div>

            <motion.button whileTap={{ scale: 0.97 }} onClick={handleSimulateReceive} disabled={loading} className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-accent text-accent-foreground font-heading font-bold text-sm shadow-lg shadow-accent/20 disabled:opacity-50">
              {loading ? "Processando..." : "Simular recebimento"}
            </motion.button>
          </motion.div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Receber;

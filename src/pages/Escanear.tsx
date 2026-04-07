import { useState } from "react";
import { ArrowLeft, Camera, ClipboardPaste, QrCode, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTransactions } from "@/contexts/TransactionContext";
import BottomNav from "@/components/BottomNav";

const Escanear = () => {
  const navigate = useNavigate();
  const { addTransaction, balance } = useTransactions();
  const [code, setCode] = useState("");
  const [parsed, setParsed] = useState<{ amount: number; desc: string; key: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCode(text);
      tryParse(text);
      toast.success("Código colado!");
    } catch {
      toast.error("Não foi possível acessar a área de transferência");
    }
  };

  const tryParse = (text: string) => {
    try {
      const data = JSON.parse(text);
      if (data.bank === "VaultBank" && data.amount) {
        setParsed({ amount: data.amount, desc: data.desc || "", key: data.key || "" });
        return;
      }
    } catch {
      // not JSON, treat as generic code
    }
    // Generic QR/barcode - ask for amount
    setParsed(null);
  };

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      toast("Câmera não disponível no navegador. Use 'Colar código' para prosseguir.", { icon: "📷" });
    }, 2000);
  };

  const handlePay = async () => {
    if (!parsed) {
      toast.error("Cole um código VaultBank válido");
      return;
    }
    if (parsed.amount > balance) {
      toast.error("Saldo insuficiente");
      return;
    }

    setLoading(true);

    await addTransaction({
      title: `Pagamento QR Code`,
      description: parsed.desc || `Pagamento para ${parsed.key}`,
      amount: -parsed.amount,
      type: "expense",
      category: "QR Code",
      method: "PIX",
      recipient: parsed.key,
    });

    toast.success(`Pagamento de R$ ${parsed.amount.toFixed(2).replace(".", ",")} realizado!`);
    setCode("");
    setParsed(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative pb-24">
      <div className="bg-primary px-5 pt-12 pb-6">
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/10 backdrop-blur-md">
            <ArrowLeft size={20} className="text-foreground" />
          </motion.button>
          <h1 className="font-heading font-bold text-xl text-foreground">Escanear</h1>
        </div>
      </div>

      <div className="px-4 mt-5 space-y-4">
        {/* Scanner area */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center gap-4">
          <div className="w-48 h-48 rounded-2xl border-2 border-dashed border-accent/30 flex items-center justify-center relative overflow-hidden">
            {scanning ? (
              <motion.div animate={{ y: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="absolute w-full h-0.5 bg-accent shadow-lg shadow-accent/50" />
            ) : (
              <QrCode size={64} className="text-muted-foreground/30" />
            )}
          </div>
          <p className="text-xs text-muted-foreground font-body text-center">Aponte a câmera para um QR Code ou cole o código abaixo</p>
        </motion.div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button whileTap={{ scale: 0.95 }} onClick={handleSimulateScan} className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-accent/10 border border-accent/20 text-accent font-heading font-semibold text-sm hover:bg-accent/20 transition-colors">
            <Camera size={18} />
            Escanear
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={handlePaste} className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-secondary/10 border border-secondary/20 text-secondary font-heading font-semibold text-sm hover:bg-secondary/20 transition-colors">
            <ClipboardPaste size={18} />
            Colar código
          </motion.button>
        </div>

        {/* Code input */}
        <div>
          <label className="text-xs text-muted-foreground font-body mb-2 block px-1">Ou digite o código manualmente</label>
          <textarea
            value={code}
            onChange={(e) => { setCode(e.target.value); tryParse(e.target.value); }}
            placeholder="Cole ou digite o código QR aqui..."
            rows={3}
            className="w-full bg-card border border-border rounded-2xl px-4 py-4 text-sm text-foreground font-body outline-none focus:border-accent/50 transition-colors placeholder:text-muted-foreground/50 resize-none"
          />
        </div>

        {/* Parsed result */}
        {parsed && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-success/10 border border-success/20 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-success" />
              <span className="font-heading font-semibold text-sm text-success">Código reconhecido!</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-body">Destinatário: <span className="text-foreground">{parsed.key}</span></p>
              <p className="text-xs text-muted-foreground font-body">Valor: <span className="text-foreground font-bold">R$ {parsed.amount.toFixed(2).replace(".", ",")}</span></p>
              {parsed.desc && <p className="text-xs text-muted-foreground font-body">Descrição: <span className="text-foreground">{parsed.desc}</span></p>}
            </div>
          </motion.div>
        )}

        {/* Pay button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handlePay}
          disabled={!parsed || loading}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-accent text-accent-foreground font-heading font-bold text-sm shadow-lg shadow-accent/20 disabled:opacity-50 transition-all"
        >
          {loading ? "Processando..." : "Pagar"}
        </motion.button>
      </div>
      <BottomNav />
    </div>
  );
};

export default Escanear;

import { useState } from "react";
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Copy, X, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTransactions, Transaction } from "@/contexts/TransactionContext";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const Extrato = () => {
  const navigate = useNavigate();
  const { transactions, formatDate } = useTransactions();
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  const formatCurrency = (val: number) =>
    (val > 0 ? "+" : "") +
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const filtered = transactions.filter((tx) => {
    if (filter === "income") return tx.type === "income";
    if (filter === "expense") return tx.type === "expense";
    return true;
  });

  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Código copiado!");
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative pb-24">
      {/* Header */}
      <div className="bg-primary px-5 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-5">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate("/")} className="p-2 rounded-full bg-white/10 backdrop-blur-md">
            <ArrowLeft size={20} className="text-foreground" />
          </motion.button>
          <h1 className="font-heading font-bold text-xl text-foreground">Extrato Completo</h1>
        </div>

        {/* Summary */}
        <div className="flex gap-3">
          <div className="flex-1 glass rounded-xl p-3">
            <p className="text-[10px] text-foreground/50 font-body">Receitas</p>
            <p className="text-base font-semibold text-success font-body">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="flex-1 glass rounded-xl p-3">
            <p className="text-[10px] text-foreground/50 font-body">Despesas</p>
            <p className="text-base font-semibold text-destructive font-body">{formatCurrency(-totalExpense)}</p>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-5 mt-4 mb-3 flex gap-2">
        {(["all", "income", "expense"] as const).map((f) => (
          <motion.button
            key={f}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-body font-medium border transition-all ${
              filter === f
                ? "bg-accent/15 border-accent/30 text-accent"
                : "bg-card border-border text-muted-foreground"
            }`}
          >
            {f === "all" ? "Todos" : f === "income" ? "Receitas" : "Despesas"}
          </motion.button>
        ))}
      </div>

      {/* Transaction list */}
      <div className="px-5 space-y-2.5">
        {filtered.map((tx, i) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.03 + i * 0.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedTx(tx)}
            className="flex items-center gap-3 bg-card rounded-2xl p-4 border border-border cursor-pointer hover:border-accent/20 transition-all"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === "income" ? "bg-success/15" : "bg-destructive/15"}`}>
              {tx.type === "income" ? (
                <ArrowDownLeft size={18} className="text-success" />
              ) : (
                <ArrowUpRight size={18} className="text-destructive" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-body font-medium text-foreground truncate">{tx.title}</p>
              <p className="text-[10px] text-muted-foreground font-body">{formatDate(tx.timestamp)}</p>
            </div>
            <div className="text-right shrink-0">
              <span className={`text-sm font-body font-semibold ${tx.type === "income" ? "text-success" : "text-destructive"}`}>
                {formatCurrency(tx.amount)}
              </span>
              <p className="text-[8px] text-muted-foreground/50 font-body mt-0.5">{tx.method}</p>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Filter size={32} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-body text-sm">Nenhuma transação encontrada</p>
          </div>
        )}
      </div>

      {/* Transaction detail modal */}
      <AnimatePresence>
        {selectedTx && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTx(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto"
            >
              <div className="bg-card rounded-t-3xl border-t border-border p-5">
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
                </div>

                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-heading font-bold text-lg text-foreground">Detalhes</h2>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSelectedTx(null)}>
                    <X size={20} className="text-muted-foreground" />
                  </motion.button>
                </div>

                {/* Amount */}
                <div className="text-center mb-6">
                  <div className={`w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center ${selectedTx.type === "income" ? "bg-success/15" : "bg-destructive/15"}`}>
                    {selectedTx.type === "income" ? (
                      <ArrowDownLeft size={24} className="text-success" />
                    ) : (
                      <ArrowUpRight size={24} className="text-destructive" />
                    )}
                  </div>
                  <h3 className={`font-heading font-bold text-2xl ${selectedTx.type === "income" ? "text-success" : "text-destructive"}`}>
                    {formatCurrency(selectedTx.amount)}
                  </h3>
                  <p className="text-sm text-foreground font-body mt-1">{selectedTx.title}</p>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">{selectedTx.description}</p>
                </div>

                {/* Details grid */}
                <div className="space-y-3 bg-muted/50 rounded-2xl p-4">
                  <DetailRow label="Data e hora" value={formatDate(selectedTx.timestamp)} />
                  <DetailRow label="Categoria" value={selectedTx.category} />
                  <DetailRow label="Método" value={selectedTx.method} />
                  {selectedTx.recipient && <DetailRow label="Destinatário" value={selectedTx.recipient} />}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <p className="text-[10px] text-muted-foreground/60 font-body">Código da transação</p>
                      <p className="text-xs font-body font-mono text-accent tracking-wider">{selectedTx.code}</p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => copyCode(selectedTx.code)}
                      className="p-2 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors"
                    >
                      <Copy size={14} className="text-accent" />
                    </motion.button>
                  </div>
                </div>

                <p className="text-[9px] text-muted-foreground/40 font-body text-center mt-4">
                  ID: {selectedTx.id}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center">
    <p className="text-[10px] text-muted-foreground/60 font-body">{label}</p>
    <p className="text-xs font-body text-foreground">{value}</p>
  </div>
);

export default Extrato;

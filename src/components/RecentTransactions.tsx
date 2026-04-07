import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "@/contexts/TransactionContext";

const RecentTransactions = () => {
  const navigate = useNavigate();
  const { transactions, formatDate } = useTransactions();
  const recent = transactions.slice(0, 6);

  const formatCurrency = (val: number) =>
    (val > 0 ? "+" : "") +
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="px-6 pb-24"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-heading font-semibold text-muted-foreground">Transações Recentes</h3>
        <button onClick={() => navigate("/extrato")} className="text-xs text-accent font-body font-medium">Ver tudo</button>
      </div>
      <div className="space-y-3">
        {recent.map((tx, i) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + i * 0.05 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/extrato")}
            className="flex items-center gap-3.5 glass rounded-2xl p-4 cursor-pointer hover:bg-white/[0.07] transition-all"
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                tx.type === "income" ? "bg-success/15" : "bg-destructive/15"
              }`}
            >
              {tx.type === "income" ? (
                <ArrowDownLeft size={18} className="text-success" />
              ) : (
                <ArrowUpRight size={18} className="text-destructive" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-body font-medium text-foreground truncate">{tx.title}</p>
              <p className="text-[11px] text-muted-foreground font-body">{formatDate(tx.timestamp)}</p>
            </div>
            <span
              className={`text-sm font-body font-semibold ${
                tx.type === "income" ? "text-success" : "text-destructive"
              }`}
            >
              {formatCurrency(tx.amount)}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentTransactions;

import { ArrowLeft, ArrowUpRight, ArrowDownLeft, ArrowLeftRight as TransferIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { transactions } from "@/components/RecentTransactions";
import BottomNav from "@/components/BottomNav";

const extraTransactions = [
  { icon: TransferIcon, title: "Transferência para Maria", date: "31 Mar 2026 • 10:20", amount: -350.0, type: "expense" as const, category: "Transferência" },
  { icon: ArrowDownLeft, title: "PIX Recebido - João", date: "30 Mar 2026 • 14:00", amount: 150.0, type: "income" as const, category: "Transferência" },
  { icon: ArrowUpRight, title: "Transferência para Pedro", date: "29 Mar 2026 • 09:30", amount: -200.0, type: "expense" as const, category: "Transferência" },
];

const allTransactions = [...transactions, ...extraTransactions];

const Extrato = () => {
  const navigate = useNavigate();

  const formatCurrency = (val: number) =>
    (val > 0 ? "+" : "") +
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const totalIncome = allTransactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = allTransactions.filter(t => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      <div className="flex items-center gap-3 px-5 pt-12 pb-4">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate("/")} className="p-2 rounded-full bg-card">
          <ArrowLeft size={20} className="text-foreground" />
        </motion.button>
        <h1 className="font-heading font-bold text-lg text-foreground">Extrato Completo</h1>
      </div>

      <div className="flex gap-3 px-5 mb-4">
        <div className="flex-1 bg-success/10 rounded-xl p-3">
          <p className="text-[10px] text-muted-foreground font-body">Total Receitas</p>
          <p className="text-base font-semibold text-success font-body">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="flex-1 bg-destructive/10 rounded-xl p-3">
          <p className="text-[10px] text-muted-foreground font-body">Total Despesas</p>
          <p className="text-base font-semibold text-destructive font-body">{formatCurrency(-totalExpense)}</p>
        </div>
      </div>

      <div className="px-5 pb-24">
        <h3 className="text-sm font-heading font-semibold text-muted-foreground mb-3">Todas as Transações</h3>
        <div className="space-y-2.5">
          {allTransactions.map((tx, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.03 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 bg-card rounded-xl p-3.5 shadow-sm"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === "income" ? "bg-success/15" : "bg-destructive/15"}`}>
                <tx.icon size={18} className={tx.type === "income" ? "text-success" : "text-destructive"} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body font-medium text-foreground truncate">{tx.title}</p>
                <p className="text-[11px] text-muted-foreground font-body">{tx.date} • {tx.category}</p>
              </div>
              <span className={`text-sm font-body font-semibold ${tx.type === "income" ? "text-success" : "text-destructive"}`}>
                {formatCurrency(tx.amount)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Extrato;

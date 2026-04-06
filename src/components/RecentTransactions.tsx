import { ShoppingCart, Coffee, Briefcase, Wifi, Music, Gift } from "lucide-react";
import { motion } from "framer-motion";

const transactions = [
  { icon: Briefcase, title: "Salary Deposit", date: "Apr 5, 2026 • 09:00", amount: 4200.0, type: "income" as const },
  { icon: ShoppingCart, title: "Amazon Purchase", date: "Apr 4, 2026 • 14:32", amount: -89.99, type: "expense" as const },
  { icon: Coffee, title: "Starbucks", date: "Apr 4, 2026 • 08:15", amount: -6.5, type: "expense" as const },
  { icon: Wifi, title: "Netflix Subscription", date: "Apr 3, 2026 • 00:00", amount: -15.99, type: "expense" as const },
  { icon: Gift, title: "Cashback Reward", date: "Apr 2, 2026 • 16:45", amount: 12.5, type: "income" as const },
  { icon: Music, title: "Spotify Premium", date: "Apr 1, 2026 • 00:00", amount: -9.99, type: "expense" as const },
];

const RecentTransactions = () => {
  const formatCurrency = (val: number) =>
    (val > 0 ? "+" : "") +
    val.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="px-5 pb-24"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-heading font-semibold text-muted-foreground">Recent Transactions</h3>
        <button className="text-xs text-accent font-body font-medium">See all</button>
      </div>
      <div className="space-y-2.5">
        {transactions.map((tx, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + i * 0.05 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 bg-card rounded-xl p-3.5 shadow-sm cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                tx.type === "income" ? "bg-success/15" : "bg-destructive/15"
              }`}
            >
              <tx.icon
                size={18}
                className={tx.type === "income" ? "text-success" : "text-destructive"}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-body font-medium text-foreground truncate">{tx.title}</p>
              <p className="text-[11px] text-muted-foreground font-body">{tx.date}</p>
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

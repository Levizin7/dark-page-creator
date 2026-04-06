import { ArrowUpRight, ArrowDownLeft, CreditCard, ScanLine } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const actions = [
  { icon: ArrowUpRight, label: "Transferir", color: "bg-accent/15 text-accent" },
  { icon: ArrowDownLeft, label: "Receber", color: "bg-success/15 text-success" },
  { icon: CreditCard, label: "Pagar", color: "bg-secondary/15 text-secondary" },
  { icon: ScanLine, label: "Escanear", color: "bg-muted-foreground/15 text-muted-foreground" },
];

const QuickActions = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="px-5 py-4"
    >
      <h3 className="text-sm font-heading font-semibold text-muted-foreground mb-3">Ações Rápidas</h3>
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action) => (
          <motion.button
            key={action.label}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => toast(`${action.label} pressionado`)}
            className="flex flex-col items-center gap-2"
          >
            <div className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center shadow-md transition-shadow hover:shadow-lg`}>
              <action.icon size={22} />
            </div>
            <span className="text-xs font-body text-muted-foreground font-medium">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActions;

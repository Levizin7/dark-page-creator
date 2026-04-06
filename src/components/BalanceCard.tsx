import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const BalanceCard = () => {
  const [balance, setBalance] = useState(12450.75);
  const [editing, setEditing] = useState(false);
  const [visible, setVisible] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const income = 4200.0;
  const expenses = 2780.5;
  const budgetUsed = (expenses / income) * 100;

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const formatCurrency = (val: number) =>
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="mx-5 rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-5 shadow-lg shadow-primary/20"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-primary-foreground/70 font-body">Saldo Total</span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setVisible(!visible)}
          className="p-1"
        >
          {visible ? (
            <Eye size={18} className="text-primary-foreground/70" />
          ) : (
            <EyeOff size={18} className="text-primary-foreground/70" />
          )}
        </motion.button>
      </div>

      {editing ? (
        <input
          ref={inputRef}
          type="number"
          value={balance}
          onChange={(e) => setBalance(Number(e.target.value))}
          onBlur={() => setEditing(false)}
          onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
          className="bg-transparent text-primary-foreground font-heading font-bold text-3xl outline-none border-b border-accent w-full mb-2"
        />
      ) : (
        <h2
          onClick={() => setEditing(true)}
          className="font-heading font-bold text-3xl text-primary-foreground cursor-pointer mb-2 hover:opacity-80 transition-opacity"
        >
          {visible ? formatCurrency(balance) : "••••••"}
        </h2>
      )}

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/extrato")}
        className="text-xs font-body font-medium text-accent underline underline-offset-2 mb-4 block"
      >
        Ver mais
      </motion.button>

      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-success/20 flex items-center justify-center">
            <TrendingUp size={14} className="text-success" />
          </div>
          <div>
            <p className="text-[10px] text-primary-foreground/60 font-body">Receitas</p>
            <p className="text-sm font-semibold text-success font-body">{formatCurrency(income)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-destructive/20 flex items-center justify-center">
            <TrendingDown size={14} className="text-destructive" />
          </div>
          <div>
            <p className="text-[10px] text-primary-foreground/60 font-body">Despesas</p>
            <p className="text-sm font-semibold text-destructive font-body">{formatCurrency(expenses)}</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-[10px] text-primary-foreground/60 mb-1 font-body">
          <span>Orçamento usado</span>
          <span>{budgetUsed.toFixed(0)}%</span>
        </div>
        <div className="w-full h-1.5 bg-primary-foreground/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${budgetUsed}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-accent rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default BalanceCard;

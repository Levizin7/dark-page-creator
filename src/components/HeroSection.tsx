import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, TrendingUp, TrendingDown, ArrowRight, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import novaLogo from "@/assets/novabank-logo.png";

const HeroSection = () => {
  const [name, setName] = useState("Carlos");
  const [editingName, setEditingName] = useState(false);
  const [balance, setBalance] = useState(12450.75);
  const [editingBalance, setEditingBalance] = useState(false);
  const [visible, setVisible] = useState(true);
  const nameRef = useRef<HTMLInputElement>(null);
  const balanceRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const income = 4200.0;
  const expenses = 2780.5;
  const budgetUsed = (expenses / income) * 100;

  useEffect(() => {
    if (editingName && nameRef.current) { nameRef.current.focus(); nameRef.current.select(); }
  }, [editingName]);
  useEffect(() => {
    if (editingBalance && balanceRef.current) { balanceRef.current.focus(); balanceRef.current.select(); }
  }, [editingBalance]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const formatCurrency = (val: number) =>
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="relative">
      {/* Gradient background — softer */}
      <div className="bg-gradient-to-b from-primary/80 via-primary/60 to-primary/30 pt-12 pb-14 px-6">
        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center ring-1 ring-white/15 shadow-lg">
              <img src={novaLogo} alt="NovaBank" width={28} height={28} className="rounded-md" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-body tracking-wide">{getGreeting()},</p>
              {editingName ? (
                <input
                  ref={nameRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setEditingName(false)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingName(false)}
                  className="bg-transparent text-foreground font-heading font-bold text-lg border-b border-accent outline-none w-32"
                />
              ) : (
                <h1
                  onClick={() => setEditingName(true)}
                  className="font-heading font-bold text-lg text-foreground cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {name}
                </h1>
              )}
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="relative p-2.5 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/15 transition-all ring-1 ring-white/10"
          >
            <Bell size={20} className="text-foreground/80" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full ring-2 ring-primary/80" />
          </motion.button>
        </div>

        {/* Balance */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-foreground/50 font-body">Meu saldo</span>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setVisible(!visible)} className="p-0.5">
              {visible ? <Eye size={16} className="text-foreground/40" /> : <EyeOff size={16} className="text-foreground/40" />}
            </motion.button>
          </div>
          <div className="flex items-end justify-between">
            <div>
              {editingBalance ? (
                <input
                  ref={balanceRef}
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(Number(e.target.value))}
                  onBlur={() => setEditingBalance(false)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingBalance(false)}
                  className="bg-transparent text-foreground font-heading font-bold text-[34px] leading-tight outline-none border-b border-accent w-full"
                />
              ) : (
                <h2
                  onClick={() => setEditingBalance(true)}
                  className="font-heading font-bold text-[34px] leading-tight text-foreground cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {visible ? formatCurrency(balance) : "R$ ••••••"}
                </h2>
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate("/extrato")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent/20 border border-accent/30 text-accent font-body font-semibold text-xs hover:bg-accent/30 transition-all shrink-0 ml-4"
            >
              Ver extrato
              <ArrowRight size={14} />
            </motion.button>
          </div>
        </div>

        {/* Income / Expenses pills */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1 flex items-center gap-2.5 glass rounded-xl px-3 py-2.5">
            <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
              <TrendingUp size={14} className="text-success" />
            </div>
            <div>
              <p className="text-[10px] text-foreground/50 font-body">Receitas</p>
              <p className="text-sm font-semibold text-success font-body">{formatCurrency(income)}</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-2.5 glass rounded-xl px-3 py-2.5">
            <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center">
              <TrendingDown size={14} className="text-destructive" />
            </div>
            <div>
              <p className="text-[10px] text-foreground/50 font-body">Despesas</p>
              <p className="text-sm font-semibold text-destructive font-body">{formatCurrency(expenses)}</p>
            </div>
          </div>
        </div>

        {/* Budget bar */}
        <div>
          <div className="flex justify-between text-[10px] text-foreground/50 mb-1.5 font-body">
            <span>Orçamento usado</span>
            <span>{budgetUsed.toFixed(0)}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${budgetUsed}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, hsl(217 91% 60%), hsl(200 80% 55%))" }}
            />
          </div>
        </div>
      </div>

      {/* Subtle decorative wave */}
      <div className="absolute -bottom-px left-0 right-0 overflow-hidden leading-[0]">
        <svg
          className="relative block w-full"
          style={{ height: 32 }}
          viewBox="0 0 1440 32"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity="0.08" />
              <stop offset="50%" stopColor="hsl(217 91% 60%)" stopOpacity="0.04" />
              <stop offset="100%" stopColor="hsl(217 91% 60%)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            animate={{
              d: [
                "M0,20 C360,32 720,8 1080,20 C1260,26 1380,14 1440,20 L1440,32 L0,32 Z",
                "M0,18 C360,6 720,28 1080,18 C1260,12 1380,24 1440,18 L1440,32 L0,32 Z",
                "M0,20 C360,32 720,8 1080,20 C1260,26 1380,14 1440,20 L1440,32 L0,32 Z",
              ],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            fill="url(#waveGrad)"
          />
          <path
            d="M0,24 C480,32 960,16 1440,24 L1440,32 L0,32 Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;

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
      {/* Gradient background */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-accent/40 pt-12 pb-20 px-5">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src={novaLogo} alt="NovaBank" width={36} height={36} className="rounded-lg" />
            <div>
              <p className="text-xs text-primary-foreground/60 font-body">{getGreeting()},</p>
              {editingName ? (
                <input
                  ref={nameRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setEditingName(false)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingName(false)}
                  className="bg-transparent text-primary-foreground font-heading font-bold text-lg border-b border-accent outline-none w-32"
                />
              ) : (
                <h1
                  onClick={() => setEditingName(true)}
                  className="font-heading font-bold text-lg text-primary-foreground cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {name}
                </h1>
              )}
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="relative p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
          >
            <Bell size={20} className="text-primary-foreground/80" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
          </motion.button>
        </div>

        {/* Balance + Ver extrato */}
        <div className="mb-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-primary-foreground/60 font-body">Meu saldo</span>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setVisible(!visible)} className="p-0.5">
              {visible ? <Eye size={16} className="text-primary-foreground/50" /> : <EyeOff size={16} className="text-primary-foreground/50" />}
            </motion.button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              {editingBalance ? (
                <input
                  ref={balanceRef}
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(Number(e.target.value))}
                  onBlur={() => setEditingBalance(false)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingBalance(false)}
                  className="bg-transparent text-primary-foreground font-heading font-bold text-3xl outline-none border-b border-accent w-full"
                />
              ) : (
                <h2
                  onClick={() => setEditingBalance(true)}
                  className="font-heading font-bold text-3xl text-primary-foreground cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {visible ? formatCurrency(balance) : "R$ ••••••"}
                </h2>
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate("/extrato")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent/20 border border-accent/30 text-accent font-body font-semibold text-xs hover:bg-accent/30 transition-colors"
            >
              Ver extrato
              <ArrowRight size={14} />
            </motion.button>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="flex gap-4 mt-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-success/25 flex items-center justify-center">
              <TrendingUp size={12} className="text-success" />
            </div>
            <div>
              <p className="text-[10px] text-primary-foreground/50 font-body">Receitas</p>
              <p className="text-xs font-semibold text-success font-body">{formatCurrency(income)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-destructive/25 flex items-center justify-center">
              <TrendingDown size={12} className="text-destructive" />
            </div>
            <div>
              <p className="text-[10px] text-primary-foreground/50 font-body">Despesas</p>
              <p className="text-xs font-semibold text-destructive font-body">{formatCurrency(expenses)}</p>
            </div>
          </div>
        </div>

        {/* Budget bar */}
        <div className="mt-2">
          <div className="flex justify-between text-[10px] text-primary-foreground/50 mb-1 font-body">
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
      </div>

      {/* Animated wave separator - tokyonight style */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0] translate-y-[1px]">
        <svg
          className="relative block w-full"
          style={{ height: 70 }}
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Back wave - lighter accent */}
          <motion.path
            animate={{
              d: [
                "M0,60 C240,110 480,20 720,60 C960,100 1200,30 1440,60 L1440,120 L0,120 Z",
                "M0,50 C240,20 480,100 720,50 C960,20 1200,100 1440,50 L1440,120 L0,120 Z",
                "M0,60 C240,110 480,20 720,60 C960,100 1200,30 1440,60 L1440,120 L0,120 Z",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            fill="hsl(var(--accent) / 0.15)"
          />
          {/* Front wave - background color */}
          <motion.path
            animate={{
              d: [
                "M0,80 C200,100 400,50 600,70 C800,90 1000,40 1200,70 C1300,85 1400,60 1440,80 L1440,120 L0,120 Z",
                "M0,70 C200,50 400,95 600,75 C800,55 1000,90 1200,65 C1300,55 1400,80 1440,70 L1440,120 L0,120 Z",
                "M0,80 C200,100 400,50 600,70 C800,90 1000,40 1200,70 C1300,85 1400,60 1440,80 L1440,120 L0,120 Z",
              ],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;

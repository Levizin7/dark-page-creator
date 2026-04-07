import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, TrendingUp, TrendingDown, ArrowRight, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import novaLogo from "@/assets/novabank-logo.png";

const formatCurrencyFromCents = (cents: number) => {
  const amount = cents / 100;
  return amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const HeroSection = () => {
  const [name, setName] = useState("Carlos");
  const [editingName, setEditingName] = useState(false);
  const [balanceCents, setBalanceCents] = useState(1245075); // R$ 12.450,75
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
    if (editingBalance && balanceRef.current) {
      balanceRef.current.focus();
      // place cursor at end
      const val = balanceRef.current.value;
      balanceRef.current.setSelectionRange(val.length, val.length);
    }
  }, [editingBalance]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const formatCurrency = (val: number) =>
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setBalanceCents(Number(raw) || 0);
  };

  return (
    <div className="relative">
      <div className="bg-primary pt-12 pb-1 px-6">
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
                  type="text"
                  inputMode="numeric"
                  value={formatCurrencyFromCents(balanceCents)}
                  onChange={handleBalanceChange}
                  onBlur={() => setEditingBalance(false)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingBalance(false)}
                  placeholder="R$ 0,00"
                  className="bg-transparent text-foreground font-heading font-bold text-[34px] leading-tight outline-none border-b border-accent w-full appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              ) : (
                <h2
                  onClick={() => setEditingBalance(true)}
                  className="font-heading font-bold text-[34px] leading-tight text-foreground cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {visible ? formatCurrencyFromCents(balanceCents) : "R$ ••••••"}
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

      {/* Waves integrated as bottom of the hero - same bg-primary, flowing down */}
      <div className="bg-primary overflow-hidden pointer-events-none">
        <svg className="w-full h-[80px] block" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="1440" height="120" fill="hsl(217 60% 28%)" />
          <defs>
            <linearGradient id="wave1Grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(222 47% 11%)" stopOpacity="0.3" />
              <stop offset="50%" stopColor="hsl(222 47% 11%)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(222 47% 11%)" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="wave2Grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(222 47% 11%)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(222 47% 11%)" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          <motion.path
            animate={{
              d: [
                "M0,40L48,45C96,50,192,60,288,58C384,56,480,42,576,38C672,34,768,42,864,46C960,50,1056,50,1152,46C1248,42,1344,34,1392,30L1440,26L1440,120L0,120Z",
                "M0,30L48,35C96,40,192,50,288,54C384,58,480,58,576,50C672,42,768,30,864,26C960,22,1056,30,1152,38C1248,46,1344,50,1392,52L1440,54L1440,120L0,120Z",
                "M0,40L48,45C96,50,192,60,288,58C384,56,480,42,576,38C672,34,768,42,864,46C960,50,1056,50,1152,46C1248,42,1344,34,1392,30L1440,26L1440,120L0,120Z",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            fill="url(#wave1Grad)"
          />
          <motion.path
            animate={{
              d: [
                "M0,60L48,56C96,52,192,44,288,44C384,44,480,52,576,56C672,60,768,60,864,54C960,48,1056,38,1152,38C1248,38,1344,48,1392,54L1440,60L1440,120L0,120Z",
                "M0,50L48,54C96,58,192,66,288,64C384,62,480,50,576,46C672,42,768,46,864,52C960,58,1056,66,1152,64C1248,62,1344,50,1392,44L1440,38L1440,120L0,120Z",
                "M0,60L48,56C96,52,192,44,288,44C384,44,480,52,576,56C672,60,768,60,864,54C960,48,1056,38,1152,38C1248,38,1344,48,1392,54L1440,60L1440,120L0,120Z",
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            fill="url(#wave2Grad)"
          />
          <motion.path
            animate={{
              d: [
                "M0,80L60,76C120,72,240,64,360,62C480,60,600,66,720,72C840,78,960,82,1080,78C1200,74,1320,64,1380,60L1440,56L1440,120L0,120Z",
                "M0,70L60,74C120,78,240,86,360,86C480,86,600,78,720,72C840,66,960,62,1080,62C1200,62,1320,66,1380,68L1440,70L1440,120L0,120Z",
                "M0,80L60,76C120,72,240,64,360,62C480,60,600,66,720,72C840,78,960,82,1080,78C1200,74,1320,64,1380,60L1440,56L1440,120L0,120Z",
              ],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            fill="hsl(222 47% 11%)"
          />
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;

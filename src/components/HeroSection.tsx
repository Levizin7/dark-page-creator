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

      {/* Decorative animated waves - inverted, falling from card */}
      <div className="absolute -bottom-[80px] left-0 right-0 h-[100px] pointer-events-none" style={{ zIndex: 1, transform: "scaleY(-1)" }}>
        <svg className="w-full h-full" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="wave1Grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity="0.08" />
              <stop offset="50%" stopColor="hsl(200 80% 55%)" stopOpacity="0.06" />
              <stop offset="100%" stopColor="hsl(217 91% 60%)" stopOpacity="0.03" />
            </linearGradient>
            <linearGradient id="wave2Grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity="0.05" />
              <stop offset="100%" stopColor="hsl(200 80% 55%)" stopOpacity="0.03" />
            </linearGradient>
          </defs>
          <motion.path
            animate={{
              d: [
                "M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L0,120Z",
                "M0,48L48,53.3C96,59,192,69,288,74.7C384,80,480,80,576,69.3C672,59,768,37,864,32C960,27,1056,37,1152,48C1248,59,1344,69,1392,74.7L1440,80L1440,120L0,120Z",
                "M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L0,120Z",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            fill="url(#wave1Grad)"
          />
          <motion.path
            animate={{
              d: [
                "M0,96L48,90.7C96,85,192,75,288,74.7C384,75,480,85,576,85.3C672,85,768,75,864,64C960,53,1056,43,1152,48C1248,53,1344,75,1392,85.3L1440,96L1440,120L0,120Z",
                "M0,80L48,85.3C96,91,192,101,288,96C384,91,480,69,576,64C672,59,768,69,864,80C960,91,1056,101,1152,96C1248,91,1344,69,1392,58.7L1440,53L1440,120L0,120Z",
                "M0,96L48,90.7C96,85,192,75,288,74.7C384,75,480,85,576,85.3C672,85,768,75,864,64C960,53,1056,43,1152,48C1248,53,1344,75,1392,85.3L1440,96L1440,120L0,120Z",
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            fill="url(#wave2Grad)"
          />
          <motion.path
            animate={{
              d: [
                "M0,80L60,74.7C120,69,240,59,360,58.7C480,59,600,69,720,74.7C840,80,960,80,1080,74.7C1200,69,1320,59,1380,53.3L1440,48L1440,120L0,120Z",
                "M0,69L60,74.7C120,80,240,91,360,90.7C480,91,600,80,720,69.3C840,59,960,48,1080,48C1200,48,1320,59,1380,64L1440,69L1440,120L0,120Z",
                "M0,80L60,74.7C120,69,240,59,360,58.7C480,59,600,69,720,74.7C840,80,960,80,1080,74.7C1200,69,1320,59,1380,53.3L1440,48L1440,120L0,120Z",
              ],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            fill="rgba(30, 58, 138, 0.04)"
          />
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;

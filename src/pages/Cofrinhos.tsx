import { useState } from "react";
import { ArrowLeft, Plus, PiggyBank, Minus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

interface Cofrinho {
  id: string;
  name: string;
  goal: number;
  saved: number;
}

const initialCofrinhos: Cofrinho[] = [
  { id: "1", name: "Viagem", goal: 5000, saved: 2300 },
  { id: "2", name: "Emergência", goal: 10000, saved: 7500 },
  { id: "3", name: "Notebook Novo", goal: 3500, saved: 800 },
];

const Cofrinhos = () => {
  const navigate = useNavigate();
  const [cofrinhos, setCofrinhos] = useState<Cofrinho[]>(initialCofrinhos);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [amountInputs, setAmountInputs] = useState<Record<string, string>>({});

  const formatCurrency = (val: number) =>
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleCreate = () => {
    if (!newName.trim() || !newGoal || Number(newGoal) <= 0) {
      toast.error("Preencha o nome e a meta corretamente.");
      return;
    }
    const c: Cofrinho = {
      id: Date.now().toString(),
      name: newName.trim(),
      goal: Number(newGoal),
      saved: 0,
    };
    setCofrinhos([...cofrinhos, c]);
    setNewName("");
    setNewGoal("");
    setShowCreate(false);
    toast.success(`Cofrinho "${c.name}" criado!`);
  };

  const handleAdd = (id: string) => {
    const val = Number(amountInputs[id]);
    if (!val || val <= 0) return;
    setCofrinhos(prev =>
      prev.map(c => c.id === id ? { ...c, saved: Math.min(c.saved + val, c.goal) } : c)
    );
    setAmountInputs(prev => ({ ...prev, [id]: "" }));
    toast.success("Valor adicionado!");
  };

  const handleRemove = (id: string) => {
    const val = Number(amountInputs[id]);
    if (!val || val <= 0) return;
    setCofrinhos(prev =>
      prev.map(c => c.id === id ? { ...c, saved: Math.max(c.saved - val, 0) } : c)
    );
    setAmountInputs(prev => ({ ...prev, [id]: "" }));
    toast.success("Valor retirado!");
  };

  const handleDelete = (id: string) => {
    setCofrinhos(prev => prev.filter(c => c.id !== id));
    toast("Cofrinho removido.");
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate("/")} className="p-2 rounded-full bg-card">
            <ArrowLeft size={20} className="text-foreground" />
          </motion.button>
          <h1 className="font-heading font-bold text-lg text-foreground">Cofrinhos</h1>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowCreate(true)}
          className="p-2 rounded-full bg-accent/20"
        >
          <Plus size={20} className="text-accent" />
        </motion.button>
      </div>

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-5"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl p-5 w-full max-w-sm shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-heading font-bold text-foreground">Novo Cofrinho</h2>
                <button onClick={() => setShowCreate(false)}><X size={20} className="text-muted-foreground" /></button>
              </div>
              <input
                placeholder="Nome do cofrinho"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground font-body outline-none mb-3 placeholder:text-muted-foreground"
              />
              <input
                placeholder="Meta (R$)"
                type="number"
                value={newGoal}
                onChange={e => setNewGoal(e.target.value)}
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground font-body outline-none mb-4 placeholder:text-muted-foreground"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCreate}
                className="w-full bg-accent text-accent-foreground font-body font-semibold py-3 rounded-xl"
              >
                Criar Cofrinho
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cofrinhos list */}
      <div className="px-5 pb-24 space-y-4">
        {cofrinhos.length === 0 && (
          <div className="text-center py-16">
            <PiggyBank size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-body text-sm">Nenhum cofrinho criado ainda.</p>
          </div>
        )}
        {cofrinhos.map((c) => {
          const pct = Math.min((c.saved / c.goal) * 100, 100);
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-heading font-bold text-foreground text-base">{c.name}</h3>
                  <p className="text-[11px] text-muted-foreground font-body">
                    Meta: {formatCurrency(c.goal)}
                  </p>
                </div>
                <button onClick={() => handleDelete(c.id)}>
                  <X size={16} className="text-muted-foreground hover:text-destructive transition-colors" />
                </button>
              </div>

              {/* Circular progress */}
              <div className="flex items-center gap-4 mb-3">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
                    <circle
                      cx="32" cy="32" r="28"
                      fill="none"
                      stroke="hsl(var(--accent))"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={`${pct * 1.759} ${175.9 - pct * 1.759}`}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-body font-semibold text-foreground">
                    {pct.toFixed(0)}%
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-body font-semibold text-accent">{formatCurrency(c.saved)}</p>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-accent rounded-full"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground font-body mt-1">
                    Faltam {formatCurrency(Math.max(c.goal - c.saved, 0))}
                  </p>
                </div>
              </div>

              {/* Add/Remove controls */}
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Valor (R$)"
                  value={amountInputs[c.id] || ""}
                  onChange={e => setAmountInputs(prev => ({ ...prev, [c.id]: e.target.value }))}
                  className="flex-1 bg-muted rounded-xl px-3 py-2 text-sm text-foreground font-body outline-none placeholder:text-muted-foreground"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleAdd(c.id)}
                  className="p-2 rounded-xl bg-success/20"
                >
                  <Plus size={18} className="text-success" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRemove(c.id)}
                  className="p-2 rounded-xl bg-destructive/20"
                >
                  <Minus size={18} className="text-destructive" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
      <BottomNav />
    </div>
  );
};

export default Cofrinhos;

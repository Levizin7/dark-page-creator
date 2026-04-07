import { useState, useEffect } from "react";
import { ArrowLeft, Plus, PiggyBank, Minus, X, Sparkles, Target, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";

interface Cofrinho {
  id: string;
  name: string;
  goal: number;
  saved: number;
  icon: string;
}

const iconOptions = ["✈️", "🛡️", "💻", "🎓", "🏠", "🚗"];
const gradients = ["from-accent/20 to-accent/5", "from-success/20 to-success/5", "from-secondary/20 to-secondary/5", "from-destructive/20 to-destructive/5"];

const Cofrinhos = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cofrinhos, setCofrinhos] = useState<Cofrinho[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("✈️");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [amountInputs, setAmountInputs] = useState<Record<string, string>>({});

  const fetchCofrinhos = async () => {
    if (!user) return;
    const { data } = await supabase.from("cofrinhos").select("*").eq("user_id", user.id).order("created_at", { ascending: true });
    if (data) setCofrinhos(data);
    setLoading(false);
  };

  useEffect(() => { fetchCofrinhos(); }, [user]);

  const formatCurrency = (val: number) => val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const totalSaved = cofrinhos.reduce((s, c) => s + c.saved, 0);
  const totalGoal = cofrinhos.reduce((s, c) => s + c.goal, 0);

  const handleCreate = async () => {
    if (!user || !newName.trim() || !newGoal || Number(newGoal) <= 0) {
      toast.error("Preencha o nome e a meta corretamente.");
      return;
    }
    const { error } = await supabase.from("cofrinhos").insert({
      user_id: user.id, name: newName.trim(), goal: Number(newGoal), icon: selectedIcon,
    });
    if (error) { toast.error("Erro ao criar cofrinho"); return; }
    setNewName(""); setNewGoal(""); setSelectedIcon("✈️"); setShowCreate(false);
    toast.success(`Cofrinho "${newName}" criado!`);
    fetchCofrinhos();
  };

  const handleAdd = async (id: string) => {
    const val = Number(amountInputs[id]);
    if (!val || val <= 0) return;
    const c = cofrinhos.find(c => c.id === id);
    if (!c) return;
    await supabase.from("cofrinhos").update({ saved: Math.min(c.saved + val, c.goal) }).eq("id", id);
    setAmountInputs(prev => ({ ...prev, [id]: "" }));
    toast.success("Valor adicionado!");
    fetchCofrinhos();
  };

  const handleRemove = async (id: string) => {
    const val = Number(amountInputs[id]);
    if (!val || val <= 0) return;
    const c = cofrinhos.find(c => c.id === id);
    if (!c) return;
    await supabase.from("cofrinhos").update({ saved: Math.max(c.saved - val, 0) }).eq("id", id);
    setAmountInputs(prev => ({ ...prev, [id]: "" }));
    toast.success("Valor retirado!");
    fetchCofrinhos();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("cofrinhos").delete().eq("id", id);
    toast("Cofrinho removido.");
    fetchCofrinhos();
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative pb-24">
      <div className="bg-primary px-5 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate("/")} className="p-2 rounded-full bg-white/10 backdrop-blur-md">
              <ArrowLeft size={20} className="text-foreground" />
            </motion.button>
            <h1 className="font-heading font-bold text-xl text-foreground">Cofrinhos</h1>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent/20 border border-accent/30 text-accent font-body font-semibold text-xs">
            <Plus size={14} /> Novo
          </motion.button>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-accent" />
            <span className="text-[10px] text-foreground/50 font-body tracking-wide uppercase">Total guardado</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-heading font-bold text-2xl text-foreground">{formatCurrency(totalSaved)}</h2>
              <p className="text-[10px] text-muted-foreground font-body mt-0.5">de {formatCurrency(totalGoal)} em metas</p>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-success/15">
              <TrendingUp size={12} className="text-success" />
              <span className="text-[10px] font-body font-semibold text-success">{totalGoal > 0 ? ((totalSaved / totalGoal) * 100).toFixed(0) : 0}%</span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-3">
            <motion.div initial={{ width: 0 }} animate={{ width: `${totalGoal > 0 ? (totalSaved / totalGoal) * 100 : 0}%` }} transition={{ duration: 1 }} className="h-full rounded-full bg-accent" />
          </div>
        </div>
      </div>

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="bg-card rounded-t-3xl p-5 w-full max-w-md border-t border-border">
              <div className="flex justify-center mb-3"><div className="w-10 h-1 rounded-full bg-muted-foreground/30" /></div>
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-heading font-bold text-lg text-foreground">Novo Cofrinho</h2>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowCreate(false)}><X size={20} className="text-muted-foreground" /></motion.button>
              </div>
              <p className="text-xs text-muted-foreground font-body mb-2 px-1">Ícone</p>
              <div className="flex gap-2 mb-4">
                {iconOptions.map((icon) => (
                  <motion.button key={icon} whileTap={{ scale: 0.9 }} onClick={() => setSelectedIcon(icon)} className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg border transition-all ${selectedIcon === icon ? "bg-accent/20 border-accent/50" : "bg-muted border-border"}`}>{icon}</motion.button>
                ))}
              </div>
              <input placeholder="Nome do cofrinho" value={newName} onChange={e => setNewName(e.target.value)} className="w-full bg-muted border border-border rounded-2xl px-4 py-3.5 text-sm text-foreground font-body outline-none mb-3 placeholder:text-muted-foreground/50 focus:border-accent/50 transition-colors" />
              <input placeholder="Meta (R$)" type="number" value={newGoal} onChange={e => setNewGoal(e.target.value)} className="w-full bg-muted border border-border rounded-2xl px-4 py-3.5 text-sm text-foreground font-body outline-none mb-5 placeholder:text-muted-foreground/50 focus:border-accent/50 transition-colors" />
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleCreate} className="w-full bg-accent text-accent-foreground font-heading font-bold py-4 rounded-2xl shadow-lg shadow-accent/20">Criar Cofrinho</motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="px-4 mt-5 space-y-3">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="h-24 bg-card rounded-2xl animate-pulse" />)
        ) : cofrinhos.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-4"><PiggyBank size={36} className="text-muted-foreground" /></div>
            <p className="text-muted-foreground font-body text-sm">Nenhum cofrinho criado ainda.</p>
          </div>
        ) : (
          cofrinhos.map((c, i) => {
            const pct = Math.min((c.saved / c.goal) * 100, 100);
            const isExpanded = expandedId === c.id;
            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} layout className="rounded-2xl border border-border overflow-hidden">
                <motion.button onClick={() => setExpandedId(isExpanded ? null : c.id)} className={`w-full p-4 bg-gradient-to-br ${gradients[i % gradients.length]} text-left`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-card/50 backdrop-blur-sm flex items-center justify-center text-xl border border-border/50">{c.icon}</div>
                      <div>
                        <h3 className="font-heading font-bold text-foreground text-sm">{c.name}</h3>
                        <p className="text-[10px] text-muted-foreground font-body mt-0.5">{formatCurrency(c.saved)} de {formatCurrency(c.goal)}</p>
                      </div>
                    </div>
                    <div className="relative w-12 h-12">
                      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                        <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                        <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${pct * 1.257} ${125.7 - pct * 1.257}`} />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-heading font-bold text-foreground">{pct.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-3">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} className="h-full bg-accent rounded-full" />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[9px] text-muted-foreground/60 font-body">Faltam {formatCurrency(Math.max(c.goal - c.saved, 0))}</span>
                    <span className="text-[9px] text-muted-foreground/60 font-body flex items-center gap-0.5"><Target size={8} /> Meta</span>
                  </div>
                </motion.button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="p-4 bg-card border-t border-border space-y-3">
                        <input type="number" placeholder="Valor (R$)" value={amountInputs[c.id] || ""} onChange={e => setAmountInputs(prev => ({ ...prev, [c.id]: e.target.value }))} className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground font-body outline-none placeholder:text-muted-foreground/50 focus:border-accent/50 transition-colors" />
                        <div className="flex gap-2">
                          <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleAdd(c.id)} className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-success/15 border border-success/20 text-success font-body font-semibold text-xs"><Plus size={14} /> Depositar</motion.button>
                          <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleRemove(c.id)} className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-destructive/15 border border-destructive/20 text-destructive font-body font-semibold text-xs"><Minus size={14} /> Retirar</motion.button>
                        </div>
                        <motion.button whileTap={{ scale: 0.97 }} onClick={() => handleDelete(c.id)} className="w-full py-2.5 rounded-xl text-xs font-body text-muted-foreground hover:text-destructive transition-colors">Excluir cofrinho</motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Cofrinhos;

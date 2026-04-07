import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Transaction {
  id: string;
  code: string;
  title: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  method: string;
  recipient?: string;
  created_at: string;
}

const generateCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "NB";
  code += String(Math.floor(Math.random() * 99) + 1).padStart(2, "0") + "-";
  for (let i = 0; i < 3; i++) {
    if (i > 0) code += "-";
    for (let j = 0; j < 4; j++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  return code;
};

export const formatTxDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  const secs = String(d.getSeconds()).padStart(2, "0");
  return `${day} ${month} ${year} • ${hours}:${mins}:${secs}`;
};

interface TransactionContextType {
  transactions: Transaction[];
  balance: number;
  loading: boolean;
  addTransaction: (tx: { title: string; description: string; amount: number; type: "income" | "expense"; category: string; method: string; recipient?: string }) => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    if (!user) { setTransactions([]); setLoading(false); return; }
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!error && data) {
      setTransactions(data.map(t => ({
        ...t,
        type: t.type as "income" | "expense",
        description: t.description || "",
        recipient: t.recipient || undefined,
      })));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const balance = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  const addTransaction = async (tx: { title: string; description: string; amount: number; type: "income" | "expense"; category: string; method: string; recipient?: string }) => {
    if (!user) return;
    const code = generateCode();
    const { error } = await supabase.from("transactions").insert({
      user_id: user.id,
      code,
      title: tx.title,
      description: tx.description,
      amount: tx.amount,
      type: tx.type,
      category: tx.category,
      method: tx.method,
      recipient: tx.recipient || "",
    });
    if (!error) {
      await fetchTransactions();
    }
  };

  return (
    <TransactionContext.Provider value={{ transactions, balance, loading, addTransaction, refreshTransactions: fetchTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error("useTransactions must be used within TransactionProvider");
  return ctx;
};

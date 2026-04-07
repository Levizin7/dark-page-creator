import { createContext, useContext, useState, ReactNode } from "react";

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
  timestamp: Date;
}

const generateCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 3; i++) {
    if (i > 0) code += "-";
    for (let j = 0; j < 4; j++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  return code;
};

const generateId = () => crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2);

const formatDate = (d: Date) => {
  const day = String(d.getDate()).padStart(2, "0");
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  const secs = String(d.getSeconds()).padStart(2, "0");
  return `${day} ${month} ${year} • ${hours}:${mins}:${secs}`;
};

const initialTransactions: Transaction[] = [
  {
    id: generateId(),
    code: "NB01-X8K2-9P3L",
    title: "Depósito de Salário",
    description: "Pagamento mensal - Empresa XYZ LTDA",
    amount: 4200.0,
    type: "income",
    category: "Salário",
    method: "TED",
    timestamp: new Date(2026, 3, 5, 9, 0, 0),
  },
  {
    id: generateId(),
    code: "NB01-R4M7-2T6W",
    title: "Compra Amazon",
    description: "Pedido #304-2948271 - Amazon.com.br",
    amount: -89.99,
    type: "expense",
    category: "Compras",
    method: "Cartão Virtual",
    timestamp: new Date(2026, 3, 4, 14, 32, 15),
  },
  {
    id: generateId(),
    code: "NB01-J5N1-8H4Q",
    title: "Starbucks",
    description: "Starbucks - Shopping Morumbi",
    amount: -6.5,
    type: "expense",
    category: "Alimentação",
    method: "Cartão Físico",
    timestamp: new Date(2026, 3, 4, 8, 15, 42),
  },
  {
    id: generateId(),
    code: "NB01-L2P9-5F7V",
    title: "Assinatura Netflix",
    description: "Netflix - Plano Premium Mensal",
    amount: -15.99,
    type: "expense",
    category: "Assinaturas",
    method: "Cartão Virtual",
    timestamp: new Date(2026, 3, 3, 0, 0, 0),
  },
  {
    id: generateId(),
    code: "NB01-W8C3-6K1B",
    title: "Cashback Recebido",
    description: "Cashback compra débito - Programa NovaBank",
    amount: 12.5,
    type: "income",
    category: "Cashback",
    method: "Sistema",
    timestamp: new Date(2026, 3, 2, 16, 45, 30),
  },
  {
    id: generateId(),
    code: "NB01-D6Y4-3M9X",
    title: "Spotify Premium",
    description: "Spotify AB - Assinatura Premium Individual",
    amount: -9.99,
    type: "expense",
    category: "Assinaturas",
    method: "Cartão Virtual",
    timestamp: new Date(2026, 3, 1, 0, 0, 0),
  },
];

interface TransactionContextType {
  transactions: Transaction[];
  balanceCents: number;
  addTransaction: (tx: Omit<Transaction, "id" | "code" | "timestamp">) => void;
  formatDate: (d: Date) => string;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [balanceCents, setBalanceCents] = useState(1245075);

  const addTransaction = (tx: Omit<Transaction, "id" | "code" | "timestamp">) => {
    const newTx: Transaction = {
      ...tx,
      id: generateId(),
      code: `NB${String(Math.floor(Math.random() * 99) + 1).padStart(2, "0")}-${generateCode()}`,
      timestamp: new Date(),
    };
    setTransactions((prev) => [newTx, ...prev]);
    setBalanceCents((prev) => prev + Math.round(tx.amount * 100));
  };

  return (
    <TransactionContext.Provider value={{ transactions, balanceCents, addTransaction, formatDate }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error("useTransactions must be used within TransactionProvider");
  return ctx;
};

import { Home, ArrowLeftRight, PiggyBank, CreditCard, User } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const tabs = [
  { icon: Home, label: "Início", path: "/" },
  { icon: ArrowLeftRight, label: "Transferir", path: "/transferir" },
  { icon: PiggyBank, label: "Cofrinhos", path: "/cofrinhos" },
  { icon: CreditCard, label: "Cartões", path: "/cartoes" },
  { icon: User, label: "Perfil", path: "/perfil" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveIndex = () => {
    const map: Record<string, number> = {
      "/": 0,
      "/transferir": 1,
      "/cofrinhos": 2,
      "/cartoes": 3,
      "/perfil": 4,
    };
    return map[location.pathname] ?? 0;
  };

  const active = getActiveIndex();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.3)] z-50">
      <div className="flex justify-around items-center py-2 pb-3 max-w-md mx-auto">
        {tabs.map((tab, i) => (
          <motion.button
            key={tab.label}
            whileTap={{ scale: 0.85 }}
            onClick={() => navigate(tab.path)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 relative"
          >
            {active === i && (
              <motion.div
                layoutId="navIndicator"
                className="absolute -top-2 w-8 h-1 rounded-full bg-accent"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <tab.icon
              size={20}
              className={`transition-colors ${
                active === i ? "text-accent" : "text-muted-foreground"
              }`}
            />
            <span
              className={`text-[10px] font-body font-medium transition-colors ${
                active === i ? "text-accent" : "text-muted-foreground"
              }`}
            >
              {tab.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;

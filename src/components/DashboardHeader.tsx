import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import novaLogo from "@/assets/novabank-logo.png";

const DashboardHeader = () => {
  const [name, setName] = useState("Carlos");
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-5 pt-12 pb-4"
    >
      <div className="flex items-center gap-3">
        <img src={novaLogo} alt="NovaBank" width={36} height={36} className="rounded-lg" />
        <div>
          <p className="text-sm text-muted-foreground font-body">{getGreeting()},</p>
          {editing ? (
            <input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setEditing(false)}
              onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
              className="bg-transparent text-foreground font-heading font-bold text-lg border-b border-accent outline-none w-32"
            />
          ) : (
            <h1
              onClick={() => setEditing(true)}
              className="font-heading font-bold text-lg text-foreground cursor-pointer hover:text-accent transition-colors"
            >
              {name}
            </h1>
          )}
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="relative p-2 rounded-full bg-card hover:bg-muted transition-colors"
      >
        <Bell size={20} className="text-muted-foreground" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
      </motion.button>
    </motion.div>
  );
};

export default DashboardHeader;

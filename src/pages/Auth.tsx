import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, User, Shield, ArrowRight } from "lucide-react";
import vaultLogo from "@/assets/vaultbank-logo.png";

const Auth = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message === "Invalid login credentials" ? "E-mail ou senha incorretos" : error.message);
      } else {
        toast.success("Bem-vindo de volta!");
        navigate("/");
      }
    } else {
      if (!fullName.trim()) {
        toast.error("Informe seu nome completo");
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, fullName.trim());
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Conta criada com sucesso!");
        navigate("/");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-accent/5 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-secondary/5 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Logo section */}
        <div className="pt-20 pb-8 px-8 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-accent/20 to-primary/30 backdrop-blur-xl flex items-center justify-center mx-auto mb-5 ring-1 ring-white/10 shadow-2xl shadow-accent/10"
          >
            <img src={vaultLogo} alt="VaultBank" width={56} height={56} className="rounded-xl" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-heading font-bold text-3xl text-foreground tracking-tight"
          >
            VaultBank
          </motion.h1>
          <motion.p
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-muted-foreground font-body mt-2"
          >
            Seu dinheiro, protegido e acessível
          </motion.p>
        </div>

        {/* Tab switcher */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mx-8 mb-6"
        >
          <div className="flex bg-card/50 backdrop-blur-md rounded-2xl p-1 border border-border/50">
            {(["login", "signup"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setIsLogin(tab === "login"); setFullName(""); }}
                className={`flex-1 py-3 rounded-xl text-sm font-body font-semibold transition-all relative ${
                  (tab === "login" && isLogin) || (tab === "signup" && !isLogin)
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {((tab === "login" && isLogin) || (tab === "signup" && !isLogin)) && (
                  <motion.div
                    layoutId="authTab"
                    className="absolute inset-0 bg-accent/15 border border-accent/30 rounded-xl"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab === "login" ? "Entrar" : "Criar conta"}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex-1 px-8"
        >
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? "login" : "signup"}
              initial={{ x: isLogin ? -20 : 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isLogin ? 20 : -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="relative"
                >
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <User size={14} className="text-accent" />
                  </div>
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl pl-14 pr-4 py-4 text-sm text-foreground font-body outline-none focus:border-accent/50 focus:bg-card/80 transition-all placeholder:text-muted-foreground/40"
                  />
                </motion.div>
              )}

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Mail size={14} className="text-accent" />
                </div>
                <input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl pl-14 pr-4 py-4 text-sm text-foreground font-body outline-none focus:border-accent/50 focus:bg-card/80 transition-all placeholder:text-muted-foreground/40"
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Lock size={14} className="text-accent" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl pl-14 pr-14 py-4 text-sm text-foreground font-body outline-none focus:border-accent/50 focus:bg-card/80 transition-all placeholder:text-muted-foreground/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1"
                >
                  {showPassword ? (
                    <EyeOff size={16} className="text-muted-foreground/40" />
                  ) : (
                    <Eye size={16} className="text-muted-foreground/40" />
                  )}
                </button>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.01 }}
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-accent to-secondary text-accent-foreground font-heading font-bold text-sm shadow-lg shadow-accent/20 disabled:opacity-50 transition-all mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? "Entrar na conta" : "Criar minha conta"}
                    <ArrowRight size={16} />
                  </>
                )}
              </motion.button>
            </motion.form>
          </AnimatePresence>

          {/* Security badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-2 mt-8 mb-6"
          >
            <Shield size={14} className="text-success/60" />
            <span className="text-[11px] text-muted-foreground/50 font-body">
              Dados protegidos com criptografia de ponta
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;

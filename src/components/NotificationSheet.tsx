import { Gift, Percent, CreditCard, Star, Megaphone, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const notifications = [
  {
    id: 1,
    icon: Gift,
    color: "text-accent",
    bg: "bg-accent/15",
    title: "Cashback de 5% no débito!",
    description: "Use seu cartão de débito e ganhe cashback direto na conta. Válido até 30/04.",
    time: "Agora",
    unread: true,
  },
  {
    id: 2,
    icon: Percent,
    color: "text-success",
    bg: "bg-success/15",
    title: "Empréstimo pré-aprovado",
    description: "Você tem R$ 15.000 disponíveis com taxa a partir de 1,49% a.m.",
    time: "2h atrás",
    unread: true,
  },
  {
    id: 3,
    icon: CreditCard,
    color: "text-primary",
    bg: "bg-primary/15",
    title: "Cartão sem anuidade",
    description: "Peça já seu NovaBank Platinum sem anuidade no primeiro ano!",
    time: "5h atrás",
    unread: false,
  },
  {
    id: 4,
    icon: Star,
    color: "text-yellow-400",
    bg: "bg-yellow-400/15",
    title: "Programa de pontos",
    description: "Acumule pontos a cada compra e troque por produtos e viagens.",
    time: "1 dia",
    unread: false,
  },
  {
    id: 5,
    icon: Megaphone,
    color: "text-destructive",
    bg: "bg-destructive/15",
    title: "Indique e ganhe R$ 50",
    description: "Convide amigos para o NovaBank e ganhe R$ 50 por cada indicação.",
    time: "3 dias",
    unread: false,
  },
];

interface NotificationSheetProps {
  open: boolean;
  onClose: () => void;
}

const NotificationSheet = ({ open, onClose }: NotificationSheetProps) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto"
          >
            <div className="bg-card rounded-t-3xl border-t border-border shadow-2xl max-h-[80vh] flex flex-col">
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-3">
                <h2 className="font-heading font-bold text-lg text-foreground">Notificações</h2>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                >
                  <X size={16} className="text-muted-foreground" />
                </motion.button>
              </div>

              {/* List */}
              <div className="overflow-y-auto px-4 pb-8 space-y-2.5">
                {notifications.map((notif, index) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-colors cursor-pointer ${
                      notif.unread
                        ? "bg-accent/5 border-accent/20"
                        : "bg-card border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl ${notif.bg} flex items-center justify-center shrink-0`}>
                      <notif.icon size={16} className={notif.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-heading font-semibold text-xs text-foreground truncate">
                          {notif.title}
                        </h3>
                        {notif.unread && (
                          <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground font-body mt-0.5 line-clamp-2">
                        {notif.description}
                      </p>
                      <span className="text-[10px] text-muted-foreground/50 font-body mt-0.5 block">
                        {notif.time}
                      </span>
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground/30 shrink-0 mt-1" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationSheet;

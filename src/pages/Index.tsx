import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Droplets, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-primary-glow/10 blur-3xl animate-pulse-water" />
      <div className="absolute bottom-20 -right-20 w-80 h-80 rounded-full bg-primary-lighter/10 blur-3xl animate-pulse-water" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center z-10 max-w-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 rounded-3xl bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 shadow-glow"
        >
          <Droplets className="w-10 h-10 text-primary-foreground" />
        </motion.div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary-foreground mb-3 leading-tight">
          Portal de Cobranza Ciudadana
        </h1>
        <p className="text-primary-foreground/70 text-lg mb-8">
          Servicios de Agua · Gobierno Municipal de Hermosillo
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/portal")}
            size="lg"
            className="h-14 px-8 rounded-2xl bg-primary-foreground text-primary font-bold text-base gap-2 shadow-elevated hover:shadow-glow transition-all hover:scale-105"
          >
            <User className="w-5 h-5" />
            Portal Ciudadano
          </Button>
          <Button
            onClick={() => navigate("/admin")}
            size="lg"
            variant="outline"
            className="h-14 px-8 rounded-2xl border-2 border-primary-foreground/30 text-primary-foreground font-bold text-base gap-2 hover:bg-primary-foreground/10 transition-all hover:scale-105 bg-transparent"
          >
            <Shield className="w-5 h-5" />
            Panel Administrativo
          </Button>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 text-primary-foreground/40 text-xs z-10"
      >
        Demo MVP · Marzo 2025
      </motion.p>
    </div>
  );
};

export default Index;

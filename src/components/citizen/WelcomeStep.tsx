import { motion } from "framer-motion";
import { Droplets, Bot, MapPin, CreditCard, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ciudadano } from "@/data/seedData";

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-6 px-4"
    >
      {/* AI Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium"
      >
        <Bot className="w-4 h-4" />
        Información identificada por IA
      </motion.div>

      {/* Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center shadow-glow"
      >
        <span className="text-3xl font-bold text-primary-foreground">
          {ciudadano.nombre.split(" ").map(n => n[0]).slice(0, 2).join("")}
        </span>
      </motion.div>

      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
          ¡Hola, {ciudadano.nombre.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground text-base">
          Bienvenida al portal de servicios de agua
        </p>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-sm bg-card rounded-xl shadow-card border border-border p-5 space-y-3"
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <Droplets className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Nombre completo</p>
            <p className="font-semibold text-sm text-foreground">{ciudadano.nombre}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Dirección del predio</p>
            <p className="font-semibold text-sm text-foreground">{ciudadano.direccion}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Número de cuenta</p>
            <p className="font-semibold text-sm text-foreground">{ciudadano.numeroCuenta}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <Phone className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Teléfono</p>
            <p className="font-semibold text-sm text-foreground">{ciudadano.telefono}</p>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-sm"
      >
        <Button
          onClick={onNext}
          className="w-full h-12 text-base font-semibold gradient-primary text-primary-foreground rounded-xl shadow-elevated hover:shadow-glow transition-all"
        >
          Ver mis adeudos
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeStep;

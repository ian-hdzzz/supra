import { useState } from "react";
import { motion } from "framer-motion";
import { Droplets, Bot, MapPin, CreditCard, Phone, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  const { ciudadanoActual, buscando, errorBusqueda, buscarContrato } = useApp();
  const [contrato, setContrato] = useState("");

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contrato.trim()) return;
    await buscarContrato(contrato.trim().toUpperCase());
  };

  // Citizen found — show info card
  if (ciudadanoActual) {
    const iniciales = ciudadanoActual.nombre.split(" ").map(n => n[0]).slice(0, 2).join("");
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6 px-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium"
        >
          <Bot className="w-4 h-4" />
          Información identificada
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center shadow-glow"
        >
          <span className="text-3xl font-bold text-primary-foreground">{iniciales}</span>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
            ¡Hola, {ciudadanoActual.nombre.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground text-base">Bienvenido al portal de servicios de agua</p>
        </motion.div>

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
              <p className="font-semibold text-sm text-foreground">{ciudadanoActual.nombre}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Dirección del predio</p>
              <p className="font-semibold text-sm text-foreground">{ciudadanoActual.direccion}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Número de contrato</p>
              <p className="font-semibold text-sm text-foreground">{ciudadanoActual.numeroCuenta}</p>
            </div>
          </div>
          {ciudadanoActual.telefono && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Teléfono</p>
                <p className="font-semibold text-sm text-foreground">{ciudadanoActual.telefono}</p>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="w-full max-w-sm">
          <Button
            onClick={onNext}
            className="w-full h-12 text-base font-semibold gradient-primary text-primary-foreground rounded-xl shadow-elevated hover:shadow-glow transition-all"
          >
            Ver mis adeudos
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  // Search form
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-6 px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center shadow-glow"
      >
        <Droplets className="w-10 h-10 text-primary-foreground" />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Portal de Pagos</h1>
        <p className="text-muted-foreground text-base">Ingresa tu número de contrato para continuar</p>
      </motion.div>

      <motion.form
        onSubmit={handleBuscar}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-sm space-y-3"
      >
        <div className="relative">
          <Input
            value={contrato}
            onChange={e => setContrato(e.target.value)}
            placeholder="Ej. SUP-001"
            className="h-12 text-base pr-12 uppercase"
            disabled={buscando}
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>

        {errorBusqueda && (
          <p className="text-sm text-destructive text-center">{errorBusqueda}</p>
        )}

        <Button
          type="submit"
          disabled={buscando || !contrato.trim()}
          className="w-full h-12 text-base font-semibold gradient-primary text-primary-foreground rounded-xl shadow-elevated hover:shadow-glow transition-all"
        >
          {buscando ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Buscando...
            </span>
          ) : (
            "Buscar contrato"
          )}
        </Button>
      </motion.form>
    </motion.div>
  );
};

export default WelcomeStep;

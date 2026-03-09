import { motion } from "framer-motion";
import { Droplets } from "lucide-react";
import { useEffect } from "react";

interface ProcessingStepProps {
  onComplete: () => void;
}

const ProcessingStep = ({ onComplete }: ProcessingStepProps) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-6 px-4 py-16"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center shadow-glow"
      >
        <Droplets className="w-10 h-10 text-primary-foreground" />
      </motion.div>

      <div className="text-center">
        <h2 className="text-xl font-bold text-foreground mb-2">Estamos procesando tu pago...</h2>
        <p className="text-muted-foreground">Por favor no cierres esta ventana</p>
      </div>

      <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.8, ease: "easeInOut" }}
          className="h-full gradient-primary rounded-full"
        />
      </div>
    </motion.div>
  );
};

export default ProcessingStep;

import { Droplets } from "lucide-react";

const CitizenHeader = () => {
  return (
    <header className="w-full gradient-hero py-4 px-4">
      <div className="max-w-md mx-auto flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-foreground/10 backdrop-blur flex items-center justify-center">
          <Droplets className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-primary-foreground font-bold text-base leading-tight">
            Servicios de Agua
          </h1>
          <p className="text-primary-foreground/70 text-xs">
            Portal de Cobranza Ciudadana
          </p>
        </div>
      </div>
    </header>
  );
};

export default CitizenHeader;

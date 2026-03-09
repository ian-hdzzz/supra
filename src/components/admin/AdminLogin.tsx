import { useState } from "react";
import { motion } from "framer-motion";
import { Droplets, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === "admin" && pass === "admin123") {
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-card rounded-2xl shadow-elevated p-8"
      >
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
            <Droplets className="w-7 h-7 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">Panel Administrativo</h1>
            <p className="text-sm text-muted-foreground">Servicios de Agua · SAPA</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground">Usuario</Label>
            <Input
              value={user}
              onChange={e => { setUser(e.target.value); setError(false); }}
              placeholder="admin"
              className="h-12 rounded-xl"
            />
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Contraseña</Label>
            <Input
              type="password"
              value={pass}
              onChange={e => { setPass(e.target.value); setError(false); }}
              placeholder="••••••••"
              className="h-12 rounded-xl"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive text-center">Credenciales incorrectas</p>
          )}
          <Button
            type="submit"
            className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-semibold gap-2"
          >
            <Lock className="w-4 h-4" />
            Iniciar sesión
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Demo: admin / admin123
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;

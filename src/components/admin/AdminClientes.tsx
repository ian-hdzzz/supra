import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ciudadanosAdmin } from "@/data/seedData";

const AdminClientes = () => {
  const [search, setSearch] = useState("");
  const filtered = ciudadanosAdmin.filter(
    c =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.numeroCuenta.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-foreground">Clientes</h2>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o cuenta..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-card rounded-xl border border-border shadow-card overflow-x-auto"
      >
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border">
              <th className="p-4">Nombre</th>
              <th className="p-4">Dirección</th>
              <th className="p-4">Cuenta</th>
              <th className="p-4">Saldo pendiente</th>
              <th className="p-4">Último pago</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.numeroCuenta} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="p-4 text-sm font-medium text-foreground">{c.nombre}</td>
                <td className="p-4 text-sm text-muted-foreground max-w-[200px] truncate">{c.direccion}</td>
                <td className="p-4 text-sm font-mono text-foreground">{c.numeroCuenta}</td>
                <td className="p-4 text-sm font-semibold">
                  {c.saldoPendiente > 0 ? (
                    <span className="text-destructive">${c.saldoPendiente.toFixed(2)}</span>
                  ) : (
                    <span className="text-success">Al corriente</span>
                  )}
                </td>
                <td className="p-4 text-sm text-muted-foreground">{c.ultimoPago}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No se encontraron clientes</p>
        )}
      </motion.div>
    </div>
  );
};

export default AdminClientes;

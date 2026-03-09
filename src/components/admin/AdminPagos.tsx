import { motion } from "framer-motion";
import { pagosHistorial } from "@/data/seedData";

const AdminPagos = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Historial de Pagos</h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-card rounded-xl border border-border shadow-card overflow-x-auto"
      >
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border">
              <th className="p-4">Folio</th>
              <th className="p-4">Ciudadano</th>
              <th className="p-4">Cuenta</th>
              <th className="p-4">Monto</th>
              <th className="p-4">Método</th>
              <th className="p-4">Períodos</th>
              <th className="p-4">Fecha / Hora</th>
            </tr>
          </thead>
          <tbody>
            {pagosHistorial.map(p => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="p-4 font-mono text-sm font-medium text-foreground">{p.folio}</td>
                <td className="p-4 text-sm text-foreground">{p.ciudadanoNombre}</td>
                <td className="p-4 text-sm font-mono text-muted-foreground">{p.numeroCuenta}</td>
                <td className="p-4 text-sm font-semibold text-foreground">${p.monto.toFixed(2)}</td>
                <td className="p-4">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent text-accent-foreground uppercase">
                    {p.metodo}
                  </span>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{p.periodos.join(", ")}</td>
                <td className="p-4 text-sm text-muted-foreground">{p.fecha} · {p.hora}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default AdminPagos;

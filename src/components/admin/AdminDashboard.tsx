import { motion } from "framer-motion";
import { DollarSign, Users, CreditCard, TrendingUp } from "lucide-react";
import { pagosHistorial, ciudadanosAdmin } from "@/data/seedData";

const AdminDashboard = () => {
  const totalRecaudado = pagosHistorial.reduce((s, p) => s + p.monto, 0);
  const pagosHoy = 1;
  const cuentasActivas = ciudadanosAdmin.length;

  const stats = [
    { label: "Total recaudado", value: `$${totalRecaudado.toLocaleString("es-MX")}.00`, icon: DollarSign, color: "text-success" },
    { label: "Pagos del día", value: pagosHoy, icon: CreditCard, color: "text-primary" },
    { label: "Cuentas activas", value: cuentasActivas, icon: Users, color: "text-primary-light" },
    { label: "Tasa de cobro", value: "62%", icon: TrendingUp, color: "text-warning" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-xl border border-border p-5 shadow-card"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent payments */}
      <div className="bg-card rounded-xl border border-border shadow-card">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">Pagos recientes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="p-4">Folio</th>
                <th className="p-4">Ciudadano</th>
                <th className="p-4">Monto</th>
                <th className="p-4">Método</th>
                <th className="p-4">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {pagosHistorial.map(p => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4 font-mono text-sm font-medium text-foreground">{p.folio}</td>
                  <td className="p-4 text-sm text-foreground">{p.ciudadanoNombre}</td>
                  <td className="p-4 text-sm font-semibold text-foreground">${p.monto.toFixed(2)}</td>
                  <td className="p-4">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent text-accent-foreground uppercase">
                      {p.metodo}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{p.fecha} · {p.hora}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

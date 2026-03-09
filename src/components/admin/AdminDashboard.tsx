import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, CreditCard, AlertTriangle, BarChart2, Printer, Calendar, Banknote, ArrowLeftRight } from "lucide-react";

const weeklyData = [
  { day: "LUN", value: 8200 },
  { day: "MAR", value: 6800 },
  { day: "MIE", value: 9400 },
  { day: "JUE", value: 7200 },
  { day: "VIE", value: 11800 },
  { day: "SAB", value: 5600 },
  { day: "DOM", value: 12450, current: true },
];

const recentPayments = [
  { folio: "#SAPA-88210", initials: "MT", nombre: "Maria Guadalupe Torres", monto: 596.0, metodo: "Tarjeta", fecha: "24 Mayo, 14:30" },
  { folio: "#SAPA-88209", initials: "RH", nombre: "Roberto Hernández P.", monto: 842.0, metodo: "Efectivo", fecha: "24 Mayo, 13:15" },
  { folio: "#SAPA-88208", initials: "AG", nombre: "Alicia García Mendoza", monto: 1205.0, metodo: "Tarjeta", fecha: "24 Mayo, 12:45" },
  { folio: "#SAPA-88207", initials: "JS", nombre: "Juan Sanchez Ruiz", monto: 430.0, metodo: "Transf.", fecha: "24 Mayo, 11:20" },
];

const metodoBadge: Record<string, string> = {
  Tarjeta: "bg-blue-50 text-blue-700",
  Efectivo: "bg-green-50 text-green-700",
  "Transf.": "bg-purple-50 text-purple-700",
};

interface AdminDashboardProps {
  onVerHistorial: () => void;
}

const AdminDashboard = ({ onVerHistorial }: AdminDashboardProps) => {
  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Resumen operativo del Sistema de Agua Potable y Alcantarillado
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              <CreditCard className="w-5 h-5 text-gray-500" />
            </div>
            <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +15%
            </span>
          </div>
          <p className="text-sm text-gray-500">Total Recaudado Hoy</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            $12,450.00{" "}
            <span className="text-sm font-normal text-gray-400">MXN</span>
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              <BarChart2 className="w-5 h-5 text-gray-500" />
            </div>
            <span className="text-xs text-gray-400">Hoy</span>
          </div>
          <p className="text-sm text-gray-500">Pagos Realizados</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            42{" "}
            <span className="text-sm font-normal text-gray-400">transacciones</span>
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Cuentas con Adeudo</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">1,204</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              <BarChart2 className="w-5 h-5 text-gray-500" />
            </div>
            <span className="text-xs text-gray-400">Mensual</span>
          </div>
          <p className="text-sm text-gray-500">Eficiencia de Cobro</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">68%</p>
          <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: "68%" }} />
          </div>
        </div>
      </div>

      {/* Chart + methods */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Recaudación Semanal</h3>
              <p className="text-xs text-gray-500">Últimos 7 días de operación</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5">
              <Calendar className="w-3.5 h-3.5" />
              MAYO 18 - 24
            </span>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={weeklyData} barSize={30}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
              />
              <YAxis hide />
              <Tooltip
                formatter={(v: number) => [`$${v.toLocaleString("es-MX")}`, "Recaudado"]}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {weeklyData.map((entry, i) => (
                  <Cell key={i} fill={entry.current ? "#2563eb" : "#dbeafe"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1a3353] rounded-xl p-5 text-white flex flex-col">
          <h3 className="font-semibold text-base mb-1">Resumen de Métodos</h3>
          <p className="text-xs text-blue-300 mb-5">
            Preferencias de pago de los ciudadanos este mes.
          </p>
          <div className="space-y-4 flex-1">
            {[
              { label: "Tarjeta (TPV/Online)", pct: 72, Icon: CreditCard },
              { label: "Efectivo (Caja)", pct: 22, Icon: Banknote },
              { label: "Transferencia", pct: 6, Icon: ArrowLeftRight },
            ].map(m => (
              <div key={m.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <m.Icon className="w-4 h-4 text-blue-300 shrink-0" />
                  {m.label}
                </div>
                <span className="text-sm font-bold">{m.pct}%</span>
              </div>
            ))}
          </div>
          <button
            onClick={onVerHistorial}
            className="mt-5 w-full py-2.5 rounded-lg border border-white/30 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            Generar Reporte Detallado
          </button>
        </div>
      </div>

      {/* Recent payments */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Últimos Pagos Registrados</h3>
          <button
            onClick={onVerHistorial}
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            Ver todo el historial
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <th className="px-5 py-3">Folio</th>
                <th className="px-5 py-3">Ciudadano</th>
                <th className="px-5 py-3">Monto</th>
                <th className="px-5 py-3">Método</th>
                <th className="px-5 py-3">Fecha/Hora</th>
                <th className="px-5 py-3">Acción</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.map(p => (
                <tr
                  key={p.folio}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-3.5 text-sm font-mono font-medium text-gray-800">
                    {p.folio}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5 text-sm text-gray-700">
                      <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {p.initials}
                      </span>
                      {p.nombre}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">
                    ${p.monto.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        metodoBadge[p.metodo] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {p.metodo}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{p.fecha}</td>
                  <td className="px-5 py-3.5">
                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded">
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
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

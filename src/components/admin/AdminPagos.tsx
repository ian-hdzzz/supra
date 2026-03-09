import { useState } from "react";
import { Search, Printer } from "lucide-react";
import { Input } from "@/components/ui/input";

const pagosData = [
  { folio: "#SAPA-88210", initials: "MT", nombre: "Maria Guadalupe Torres", cuenta: "SON-2024-00847", monto: 596.0, metodo: "Tarjeta", periodos: "Mar-Abr 2025", fecha: "24 Mayo 2024", hora: "14:30" },
  { folio: "#SAPA-88209", initials: "RH", nombre: "Roberto Hernández P.", cuenta: "SON-2024-01210", monto: 842.0, metodo: "Efectivo", periodos: "Ene-Feb 2025", fecha: "24 Mayo 2024", hora: "13:15" },
  { folio: "#SAPA-88208", initials: "AG", nombre: "Alicia García Mendoza", cuenta: "SON-2024-00654", monto: 1205.0, metodo: "Tarjeta", periodos: "Nov-Dic 2024", fecha: "24 Mayo 2024", hora: "12:45" },
  { folio: "#SAPA-88207", initials: "JS", nombre: "Juan Sanchez Ruiz", cuenta: "SON-2024-00389", monto: 430.0, metodo: "Transf.", periodos: "Ene-Feb 2025", fecha: "24 Mayo 2024", hora: "11:20" },
  { folio: "#SAPA-88206", initials: "LF", nombre: "Lucía Fernández", cuenta: "SON-2024-01284", monto: 315.0, metodo: "Tarjeta", periodos: "Mar-Abr 2025", fecha: "23 Mayo 2024", hora: "16:05" },
  { folio: "#SAPA-88205", initials: "JP", nombre: "Juan Carlos Pérez", cuenta: "SON-2024-00912", monto: 450.0, metodo: "Efectivo", periodos: "Nov-Dic 2024", fecha: "23 Mayo 2024", hora: "10:50" },
];

const metodoBadge: Record<string, string> = {
  Tarjeta: "bg-blue-50 text-blue-700",
  Efectivo: "bg-green-50 text-green-700",
  "Transf.": "bg-purple-50 text-purple-700",
};

const AdminPagos = () => {
  const [search, setSearch] = useState("");

  const filtered = pagosData.filter(
    p =>
      p.folio.toLowerCase().includes(search.toLowerCase()) ||
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.cuenta.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Historial de Pagos</h1>
        <p className="text-sm text-gray-500 mt-0.5">Registro completo de transacciones del sistema.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-3 border-b border-gray-100">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar folio, nombre o cuenta..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <th className="px-5 py-3.5">Folio</th>
                <th className="px-5 py-3.5">Ciudadano</th>
                <th className="px-5 py-3.5">Cuenta</th>
                <th className="px-5 py-3.5">Monto</th>
                <th className="px-5 py-3.5">Método</th>
                <th className="px-5 py-3.5">Períodos</th>
                <th className="px-5 py-3.5">Fecha / Hora</th>
                <th className="px-5 py-3.5">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr
                  key={p.folio}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-3.5 text-sm font-mono font-medium text-gray-800">{p.folio}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5 text-sm text-gray-700">
                      <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {p.initials}
                      </span>
                      {p.nombre}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-mono text-blue-600">{p.cuenta}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">${p.monto.toFixed(2)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${metodoBadge[p.metodo] ?? "bg-gray-100 text-gray-600"}`}>
                      {p.metodo}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{p.periodos}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">
                    <div>{p.fecha}</div>
                    <div className="text-xs text-gray-400">{p.hora}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 flex items-center justify-between border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Mostrando <span className="font-semibold text-gray-700">{filtered.length}</span> registros
          </p>
          <div className="flex items-center gap-1">
            {["‹", "1", "2", "›"].map((p, i) => (
              <button
                key={i}
                className={`w-7 h-7 rounded text-xs flex items-center justify-center ${
                  p === "1" ? "bg-blue-600 text-white font-bold" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPagos;

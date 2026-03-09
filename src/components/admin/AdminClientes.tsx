import { useState } from "react";
import { Search, Eye, Pencil, Users, CheckCircle2, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";

const clientesData = [
  {
    initials: "MT",
    nombre: "María Guadalupe Torres",
    cuenta: "SON-2024-00847",
    direccion: "Av. Libertad 123, Centro",
    saldo: 0,
    ultimoPago: "15 Oct 2023",
    estatus: "corriente",
  },
  {
    initials: "JP",
    nombre: "Juan Carlos Pérez",
    cuenta: "SON-2024-00912",
    direccion: "Calle Morelos 45, Col. Juárez",
    saldo: 450,
    ultimoPago: "02 Sep 2023",
    estatus: "adeudo",
  },
  {
    initials: "AM",
    nombre: "Ana Rosa Méndez",
    cuenta: "SON-2024-01055",
    direccion: "Blvd. Kino 892, Miramar",
    saldo: 0,
    ultimoPago: "20 Oct 2023",
    estatus: "corriente",
  },
  {
    initials: "RE",
    nombre: "Roberto Esquivel",
    cuenta: "SON-2024-01120",
    direccion: "Privada Sauce 12, Las Lomas",
    saldo: 1200,
    ultimoPago: "15 Ago 2023",
    estatus: "adeudo",
  },
  {
    initials: "LF",
    nombre: "Lucía Fernández",
    cuenta: "SON-2024-01284",
    direccion: "Calle Juárez 33, Centro",
    saldo: 0,
    ultimoPago: "25 Oct 2023",
    estatus: "corriente",
  },
];

interface AdminClientesProps {
  onVerCliente: (numeroCuenta: string) => void;
}

const AdminClientes = ({ onVerCliente }: AdminClientesProps) => {
  const [search, setSearch] = useState("");

  const filtered = clientesData.filter(
    c =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.cuenta.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Listado de Ciudadanos</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Administración y seguimiento de cuentas de servicio hidráulico.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total de Usuarios</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">8,420</p>
            <span className="text-xs text-green-600 font-semibold">↑2%</span>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl">
            <Users className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Cuentas al Corriente</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">65%</p>
            <p className="text-xs text-gray-400">5,473 usuarios</p>
          </div>
          <div className="p-3 bg-green-50 rounded-xl">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Cuentas con Adeudo</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">35%</p>
            <p className="text-xs text-gray-400">2,947 usuarios</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-3 border-b border-gray-100">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre o cuenta..."
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
                <th className="px-5 py-3.5">Ciudadano</th>
                <th className="px-5 py-3.5">Cuenta</th>
                <th className="px-5 py-3.5">Dirección</th>
                <th className="px-5 py-3.5">Saldo Pendiente</th>
                <th className="px-5 py-3.5">Último Pago</th>
                <th className="px-5 py-3.5">Estatus</th>
                <th className="px-5 py-3.5">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr
                  key={c.cuenta}
                  onClick={() => onVerCliente(c.cuenta)}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-gray-200 text-gray-600 text-xs font-bold flex items-center justify-center shrink-0">
                        {c.initials}
                      </span>
                      <span className="text-sm font-medium text-gray-800">{c.nombre}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => onVerCliente(c.cuenta)}
                      className="text-sm font-medium text-blue-600 hover:underline font-mono"
                    >
                      {c.cuenta}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{c.direccion}</td>
                  <td className="px-5 py-4 text-sm font-semibold">
                    {c.saldo > 0 ? (
                      <span className="text-red-500">${c.saldo.toLocaleString("es-MX")}.00</span>
                    ) : (
                      <span className="text-gray-700">$0.00</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{c.ultimoPago}</td>
                  <td className="px-5 py-4">
                    {c.estatus === "corriente" ? (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                        AL CORRIENTE
                      </span>
                    ) : (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-600">
                        CON ADEUDO
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onVerCliente(c.cuenta)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 flex items-center justify-between border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Mostrando 1 a 5 de{" "}
            <span className="font-semibold text-gray-700">8,420</span> ciudadanos
          </p>
          <div className="flex items-center gap-1">
            {["‹", "1", "2", "3", "...", "1,684", "›"].map((p, i) => (
              <button
                key={i}
                className={`w-7 h-7 rounded text-xs flex items-center justify-center ${
                  p === "1"
                    ? "bg-blue-600 text-white font-bold"
                    : "text-gray-500 hover:bg-gray-100"
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

export default AdminClientes;

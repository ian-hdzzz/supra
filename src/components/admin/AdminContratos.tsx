import { useState } from "react";
import { Search, Plus, FileText, CheckCircle2, Clock, XCircle, Filter, Download, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type EstadoContrato = "vigente" | "vencido" | "sin-termino" | "cancelado";

const contratosData = [
  {
    folio: "CONT-2024-0001",
    initials: "MT",
    cliente: "María Guadalupe Torres",
    cuenta: "SON-2024-00847",
    tipo: "Doméstico",
    fechaInicio: "01 Ene 2023",
    fechaTermino: "31 Dic 2025",
    montoMensual: 280.0,
    estado: "vigente" as EstadoContrato,
  },
  {
    folio: "CONT-2024-0002",
    initials: "JP",
    cliente: "Juan Carlos Pérez",
    cuenta: "SON-2024-00912",
    tipo: "Comercial",
    fechaInicio: "15 Mar 2022",
    fechaTermino: "14 Mar 2024",
    montoMensual: 620.0,
    estado: "vencido" as EstadoContrato,
  },
  {
    folio: "CONT-2024-0003",
    initials: "AM",
    cliente: "Ana Rosa Méndez",
    cuenta: "SON-2024-01055",
    tipo: "Doméstico",
    fechaInicio: "01 Jun 2021",
    fechaTermino: "—",
    montoMensual: 180.0,
    estado: "sin-termino" as EstadoContrato,
  },
  {
    folio: "CONT-2024-0004",
    initials: "RE",
    cliente: "Roberto Esquivel",
    cuenta: "SON-2024-01120",
    tipo: "Industrial",
    fechaInicio: "01 Feb 2023",
    fechaTermino: "31 Ene 2026",
    montoMensual: 1450.0,
    estado: "vigente" as EstadoContrato,
  },
  {
    folio: "CONT-2024-0005",
    initials: "LF",
    cliente: "Lucía Fernández",
    cuenta: "SON-2024-01284",
    tipo: "Doméstico",
    fechaInicio: "10 Abr 2020",
    fechaTermino: "09 Abr 2023",
    montoMensual: 220.0,
    estado: "cancelado" as EstadoContrato,
  },
  {
    folio: "CONT-2024-0006",
    initials: "GR",
    cliente: "Gerardo Ruiz Salinas",
    cuenta: "SON-2024-01399",
    tipo: "Mixto",
    fechaInicio: "01 Sep 2024",
    fechaTermino: "—",
    montoMensual: 540.0,
    estado: "sin-termino" as EstadoContrato,
  },
];

const estadoConfig: Record<EstadoContrato, { label: string; className: string; Icon: React.ElementType }> = {
  vigente:     { label: "Vigente",       className: "bg-green-50 text-green-700",  Icon: CheckCircle2 },
  vencido:     { label: "Vencido",       className: "bg-red-50 text-red-600",      Icon: XCircle },
  "sin-termino": { label: "Sin Término", className: "bg-blue-50 text-blue-700",   Icon: Clock },
  cancelado:   { label: "Cancelado",     className: "bg-gray-100 text-gray-500",   Icon: XCircle },
};

type FiltroEstado = EstadoContrato | "todos";

const AdminContratos = () => {
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("todos");
  const [showFiltros, setShowFiltros] = useState(false);

  const filtered = contratosData.filter(c => {
    const matchSearch =
      c.cliente.toLowerCase().includes(search.toLowerCase()) ||
      c.folio.toLowerCase().includes(search.toLowerCase()) ||
      c.cuenta.toLowerCase().includes(search.toLowerCase());
    const matchEstado = filtroEstado === "todos" || c.estado === filtroEstado;
    return matchSearch && matchEstado;
  });

  const counts = {
    total: contratosData.length,
    vigentes: contratosData.filter(c => c.estado === "vigente").length,
    vencidos: contratosData.filter(c => c.estado === "vencido").length,
    sinTermino: contratosData.filter(c => c.estado === "sin-termino").length,
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contratos</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gestión de contratos de servicio hidráulico por cuenta.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0">
          <Plus className="w-4 h-4" />
          Nuevo Contrato
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total de Contratos"
          value={counts.total}
          icon={<FileText className="w-5 h-5 text-gray-500" />}
          iconBg="bg-gray-50"
        />
        <StatCard
          label="Vigentes"
          value={counts.vigentes}
          icon={<CheckCircle2 className="w-5 h-5 text-green-500" />}
          iconBg="bg-green-50"
          valueClass="text-green-700"
        />
        <StatCard
          label="Vencidos"
          value={counts.vencidos}
          icon={<XCircle className="w-5 h-5 text-red-400" />}
          iconBg="bg-red-50"
          valueClass="text-red-600"
        />
        <StatCard
          label="Sin Fecha de Término"
          value={counts.sinTermino}
          icon={<Clock className="w-5 h-5 text-blue-500" />}
          iconBg="bg-blue-50"
          valueClass="text-blue-700"
        />
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52 max-w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por cliente, folio o cuenta..."
            className="pl-9 h-9 text-sm bg-white border-gray-200 rounded-lg"
          />
        </div>

        {/* Estado dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFiltros(f => !f)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 bg-white px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4 text-gray-400" />
            {filtroEstado === "todos" ? "Estado" : estadoConfig[filtroEstado as EstadoContrato].label}
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
          {showFiltros && (
            <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-40 py-1">
              {(["todos", "vigente", "vencido", "sin-termino", "cancelado"] as const).map(op => (
                <button
                  key={op}
                  onClick={() => { setFiltroEstado(op); setShowFiltros(false); }}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors",
                    filtroEstado === op ? "font-semibold text-blue-600" : "text-gray-700"
                  )}
                >
                  {op === "todos" ? "Todos" : estadoConfig[op].label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="ml-auto flex items-center gap-2 text-sm font-medium text-gray-600 border border-gray-200 bg-white px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" />
          Exportar
        </button>
      </div>

      {/* Active filter chips */}
      {filtroEstado !== "todos" && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">Filtros aplicados:</span>
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 font-medium px-3 py-1 rounded-full">
            Estado: {estadoConfig[filtroEstado as EstadoContrato].label}
            <button onClick={() => setFiltroEstado("todos")} className="ml-1 hover:text-blue-900 font-bold">×</button>
          </span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide border-b border-gray-100">
                  <th className="px-5 py-3">Folio</th>
                  <th className="px-5 py-3">Cliente / Cuenta</th>
                  <th className="px-5 py-3">Tipo</th>
                  <th className="px-5 py-3">Vigencia</th>
                  <th className="px-5 py-3">Monto Mensual</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  const estado = estadoConfig[c.estado];
                  return (
                    <tr
                      key={c.folio}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-sm font-mono font-medium text-gray-800">
                        {c.folio}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                            {c.initials}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{c.cliente}</p>
                            <p className="text-xs text-gray-400 font-mono">{c.cuenta}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">{c.tipo}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">
                        <span>{c.fechaInicio}</span>
                        <span className="mx-1 text-gray-300">→</span>
                        <span className={c.fechaTermino === "—" ? "text-gray-400 italic" : ""}>{c.fechaTermino}</span>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">
                        ${c.montoMensual.toFixed(2)}
                        <span className="text-xs font-normal text-gray-400 ml-1">MXN</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full", estado.className)}>
                          <estado.Icon className="w-3 h-3" />
                          {estado.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button className="text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors">
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({
  label, value, icon, iconBg, valueClass = "text-gray-900",
}: {
  label: string; value: number; icon: React.ReactNode; iconBg: string; valueClass?: string;
}) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5">
    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center mb-3", iconBg)}>
      {icon}
    </div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className={cn("text-3xl font-bold mt-1", valueClass)}>{value}</p>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
      <Search className="w-7 h-7 text-gray-300" />
    </div>
    <p className="text-base font-semibold text-gray-700">No se encontraron contratos</p>
    <p className="text-sm text-gray-400 mt-1">Intenta modificar los filtros o el término de búsqueda</p>
  </div>
);

export default AdminContratos;

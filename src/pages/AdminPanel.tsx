import { useState } from "react";
import { Droplets, LayoutDashboard, Users, History, Settings, Bell, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminClientes from "@/components/admin/AdminClientes";
import AdminPagos from "@/components/admin/AdminPagos";
import AdminClienteDetalle from "@/components/admin/AdminClienteDetalle";
import { Input } from "@/components/ui/input";

type AdminView = "dashboard" | "clientes" | "historial" | "configuracion" | "clienteDetalle";

const AdminPanel = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState<AdminView>("dashboard");
  const [selectedCuenta, setSelectedCuenta] = useState<string | null>(null);

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  const nav = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "clientes" as const, label: "Clientes/Cuentas", icon: Users },
    { id: "historial" as const, label: "Historial de Pagos", icon: History },
    { id: "configuracion" as const, label: "Configuración", icon: Settings },
  ];

  const handleVerCliente = (numeroCuenta: string) => {
    setSelectedCuenta(numeroCuenta);
    setView("clienteDetalle");
  };

  const isClientesActive = view === "clientes" || view === "clienteDetalle";

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-20">
        {/* Logo */}
        <div className="px-5 pt-6 pb-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-base leading-tight">SAPA</p>
            <p className="text-xs text-gray-400">Agua Potable</p>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          {nav.map(n => {
            const active = view === n.id || (n.id === "clientes" && isClientesActive);
            return (
              <button
                key={n.id}
                onClick={() => setView(n.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left",
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <n.icon className={cn("w-4 h-4 shrink-0", active ? "text-white" : "text-gray-500")} />
                {n.label}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
              A
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">Admin User</p>
            </div>
          </div>
          <button
            onClick={() => setLoggedIn(false)}
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 md:ml-56 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 sticky top-0 z-10">
          <span className="font-semibold text-gray-800 text-base whitespace-nowrap">
            Vista Administrativa
          </span>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar folio o cuenta..."
              className="pl-9 h-9 text-sm bg-gray-50 border-gray-200 rounded-lg"
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              SISTEMA ACTIVO
            </span>
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {view === "dashboard" && (
            <AdminDashboard onVerHistorial={() => setView("historial")} />
          )}
          {view === "clientes" && <AdminClientes onVerCliente={handleVerCliente} />}
          {view === "historial" && <AdminPagos />}
          {view === "clienteDetalle" && selectedCuenta && (
            <AdminClienteDetalle
              numeroCuenta={selectedCuenta}
              onBack={() => setView("clientes")}
            />
          )}
          {view === "configuracion" && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900">Configuración</h2>
              <p className="text-gray-500 mt-1">Próximamente</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;

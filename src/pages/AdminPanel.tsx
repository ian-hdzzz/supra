import { useState } from "react";
import { Droplets, LayoutDashboard, Users, Receipt, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminClientes from "@/components/admin/AdminClientes";
import AdminPagos from "@/components/admin/AdminPagos";

type AdminView = "dashboard" | "clientes" | "pagos";

const AdminPanel = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState<AdminView>("dashboard");

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  const nav = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "clientes" as const, label: "Clientes", icon: Users },
    { id: "pagos" as const, label: "Pagos", icon: Receipt },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground hidden md:flex flex-col">
        <div className="p-5 flex items-center gap-3 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-lg bg-sidebar-primary/20 flex items-center justify-center">
            <Droplets className="w-5 h-5 text-sidebar-primary" />
          </div>
          <div>
            <p className="font-bold text-sm text-sidebar-foreground">SAPA Admin</p>
            <p className="text-xs text-sidebar-foreground/60">Hermosillo</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {nav.map(n => (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                view === n.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
              )}
            >
              <n.icon className="w-4 h-4" />
              {n.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={() => setLoggedIn(false)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-sidebar text-sidebar-foreground px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-sidebar-primary" />
          <span className="font-bold text-sm">SAPA Admin</span>
        </div>
        <div className="flex gap-1">
          {nav.map(n => (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                view === n.id ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/50"
              )}
            >
              <n.icon className="w-4 h-4" />
            </button>
          ))}
          <button onClick={() => setLoggedIn(false)} className="p-2 rounded-lg hover:bg-sidebar-accent/50">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 bg-background p-6 md:p-8 mt-14 md:mt-0 overflow-auto">
        {view === "dashboard" && <AdminDashboard />}
        {view === "clientes" && <AdminClientes />}
        {view === "pagos" && <AdminPagos />}
      </main>
    </div>
  );
};

export default AdminPanel;

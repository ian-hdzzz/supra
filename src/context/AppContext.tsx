import React, { createContext, useContext, useState, ReactNode } from "react";
import { api, FacturaAPI } from "@/lib/api";

export interface Adeudo {
  id: string;
  periodo: string;
  fechaLimite: string;
  monto: number;
  estatus: "vencido" | "proximo" | "pagado";
}

export interface SavedCard {
  id: string;
  label: string;
  brand: "visa" | "mastercard" | "amex" | "unknown";
  last4: string;
}

export interface SavedWallet {
  id: string;
  type: "apple" | "google";
  email: string;
}

export interface Ciudadano {
  numeroCuenta: string;
  nombre: string;
  direccion: string;
  telefono: string;
  adeudos: Adeudo[];
  reminderSent: boolean;
}

function facturaToAdeudo(f: FacturaAPI): Adeudo {
  return {
    id: f.numFactura,
    periodo: f.ciclo,
    fechaLimite: new Date(f.fechaVencimiento).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    monto: f.importeTotal,
    estatus: f.estadoTexto === "pendiente" ? "proximo" : f.estadoTexto,
  };
}

interface AppContextType {
  ciudadanos: Ciudadano[];
  ciudadanoActual: Ciudadano | null;
  savedCards: SavedCard[];
  savedWallets: SavedWallet[];
  buscando: boolean;
  errorBusqueda: string | null;
  buscarContrato: (numero: string) => Promise<void>;
  limpiarContrato: () => void;
  payAdeudo: (numeroCuenta: string, adeudoId: string) => void;
  sendReminder: (numeroCuenta: string) => void;
  saveCard: (card: SavedCard) => void;
  saveWallet: (wallet: SavedWallet) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialSavedCards: SavedCard[] = [];
const initialSavedWallets: SavedWallet[] = [];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [ciudadanos, setCiudadanos] = useState<Ciudadano[]>([]);
  const [ciudadanoActual, setCiudadanoActual] = useState<Ciudadano | null>(null);
  const [savedCards, setSavedCards] = useState<SavedCard[]>(initialSavedCards);
  const [savedWallets, setSavedWallets] = useState<SavedWallet[]>(initialSavedWallets);
  const [buscando, setBuscando] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState<string | null>(null);

  const buscarContrato = async (numero: string) => {
    setBuscando(true);
    setErrorBusqueda(null);
    try {
      const [contrato, deuda, cliente] = await Promise.allSettled([
        api.getContrato(numero),
        api.getDeuda(numero),
        api.getCliente(numero),
      ]);

      if (contrato.status === "rejected") {
        throw new Error("Contrato no encontrado");
      }

      const c = (contrato as PromiseFulfilledResult<typeof contrato extends PromiseFulfilledResult<infer T> ? T : never>).value;
      const d = deuda.status === "fulfilled" ? deuda.value : null;
      const cl = cliente.status === "fulfilled" ? cliente.value : null;

      const adeudos: Adeudo[] = d ? d.facturas.map(facturaToAdeudo) : [];

      const ciudadano: Ciudadano = {
        numeroCuenta: (c as any).contrato,
        nombre: (c as any).nombreTitular,
        direccion: (c as any).direccion,
        telefono: cl ? (cl as any).telefono || "" : "",
        adeudos,
        reminderSent: false,
      };

      setCiudadanoActual(ciudadano);
      setCiudadanos(prev => {
        const exists = prev.find(x => x.numeroCuenta === ciudadano.numeroCuenta);
        return exists ? prev.map(x => x.numeroCuenta === ciudadano.numeroCuenta ? ciudadano : x) : [...prev, ciudadano];
      });
    } catch (err: any) {
      setErrorBusqueda(err.message || "No se encontró el contrato");
    } finally {
      setBuscando(false);
    }
  };

  const limpiarContrato = () => {
    setCiudadanoActual(null);
    setErrorBusqueda(null);
  };

  const payAdeudo = (numeroCuenta: string, adeudoId: string) => {
    const update = (prev: Ciudadano[]) =>
      prev.map(c =>
        c.numeroCuenta === numeroCuenta
          ? { ...c, adeudos: c.adeudos.map(a => a.id === adeudoId ? { ...a, estatus: "pagado" as const } : a) }
          : c
      );
    setCiudadanos(update);
    setCiudadanoActual(prev =>
      prev?.numeroCuenta === numeroCuenta
        ? { ...prev, adeudos: prev.adeudos.map(a => a.id === adeudoId ? { ...a, estatus: "pagado" as const } : a) }
        : prev
    );
  };

  const sendReminder = (numeroCuenta: string) => {
    setCiudadanos(prev => prev.map(c => c.numeroCuenta === numeroCuenta ? { ...c, reminderSent: true } : c));
  };

  const saveCard = (card: SavedCard) => {
    setSavedCards(prev => prev.find(c => c.id === card.id) ? prev : [...prev, card]);
  };

  const saveWallet = (wallet: SavedWallet) => {
    setSavedWallets(prev => prev.find(w => w.id === wallet.id) ? prev : [...prev, wallet]);
  };

  return (
    <AppContext.Provider value={{
      ciudadanos,
      ciudadanoActual,
      savedCards,
      savedWallets,
      buscando,
      errorBusqueda,
      buscarContrato,
      limpiarContrato,
      payAdeudo,
      sendReminder,
      saveCard,
      saveWallet,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

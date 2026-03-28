const BASE_URL = import.meta.env.VITE_API_URL || "https://agora-supra-backend.kyp1xh.easypanel.host";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Error del servidor");
  return json.data as T;
}

// ─── Tipos de respuesta del backend ───────────────────────────────────────────

export interface ContratoDetalle {
  contrato: string;
  nombreTitular: string;
  direccion: string;
  colonia: string;
  municipio: string;
  tarifa: string;
  estado: string;
  numeroMedidor: string;
}

export interface FacturaAPI {
  numFactura: string;
  ciclo: string;
  fechaVencimiento: string;
  importeTotal: number;
  estadoTexto: "vencido" | "pendiente" | "pagado";
}

export interface DeudaAPI {
  contrato: string;
  nombreCliente: string;
  direccion: string;
  totalDeuda: number;
  vencido: number;
  porVencer: number;
  cantidadFacturas: number;
  facturas: FacturaAPI[];
}

export interface ConsumoAPI {
  periodo: string;
  consumoM3: number;
  tipoLectura: "real" | "estimada";
  fechaLectura: string;
}

export interface ConsumosAPI {
  contrato: string;
  promedioMensual: number;
  tendencia: "aumentando" | "disminuyendo" | "estable";
  consumos: ConsumoAPI[];
}

export interface ClienteAPI {
  id: number;
  nombre: string;
  contrato: string;
  email: string | null;
  telefono: string | null;
  whatsapp: string | null;
  reciboDigital: boolean;
}

// ─── Funciones del API ────────────────────────────────────────────────────────

export const api = {
  getContrato: (id: string) =>
    get<ContratoDetalle>(`/api/contrato/${id}`),

  getDeuda: (id: string) =>
    get<DeudaAPI>(`/api/contrato/${id}/deuda`),

  getConsumos: (id: string) =>
    get<ConsumosAPI>(`/api/contrato/${id}/consumos`),

  getCliente: (contrato: string) =>
    get<ClienteAPI>(`/api/cliente?contrato=${contrato}`),
};

export interface Ciudadano {
  nombre: string;
  direccion: string;
  numeroCuenta: string;
  telefono: string;
  avatarUrl?: string;
}

export interface Adeudo {
  id: string;
  periodo: string;
  fechaLimite: string;
  monto: number;
  estatus: "vencido" | "proximo" | "pagado";
}

export interface Pago {
  id: string;
  folio: string;
  ciudadanoNombre: string;
  numeroCuenta: string;
  monto: number;
  metodo: "tarjeta" | "spei";
  fecha: string;
  hora: string;
  periodos: string[];
}

export const ciudadano: Ciudadano = {
  nombre: "María Guadalupe Torres Hernández",
  direccion: "Calle Reforma #142, Col. Centro, Hermosillo, Sonora",
  numeroCuenta: "SON-2024-00847",
  telefono: "662-123-4567",
};

export const adeudos: Adeudo[] = [
  {
    id: "ad-001",
    periodo: "Nov – Dic 2024",
    fechaLimite: "15 Ene 2025",
    monto: 284.0,
    estatus: "vencido",
  },
  {
    id: "ad-002",
    periodo: "Ene – Feb 2025",
    fechaLimite: "15 Mar 2025",
    monto: 312.0,
    estatus: "vencido",
  },
  {
    id: "ad-003",
    periodo: "Mar – Abr 2025",
    fechaLimite: "15 May 2025",
    monto: 298.0,
    estatus: "proximo",
  },
];

export const ciudadanosAdmin: (Ciudadano & { saldoPendiente: number; ultimoPago: string })[] = [
  { ...ciudadano, saldoPendiente: 894, ultimoPago: "12 Oct 2024" },
  {
    nombre: "José Luis Ramírez García",
    direccion: "Av. Juárez #89, Col. Centenario, Hermosillo, Sonora",
    numeroCuenta: "SON-2024-00213",
    telefono: "662-987-6543",
    saldoPendiente: 596,
    ultimoPago: "20 Dic 2024",
  },
  {
    nombre: "Ana Patricia Vega Mendoza",
    direccion: "Blvd. Morelos #305, Col. Villa de Seris, Hermosillo, Sonora",
    numeroCuenta: "SON-2024-01102",
    telefono: "662-456-7890",
    saldoPendiente: 312,
    ultimoPago: "15 Feb 2025",
  },
  {
    nombre: "Roberto Carlos Díaz López",
    direccion: "Calle Nayarit #56, Col. Pimentel, Hermosillo, Sonora",
    numeroCuenta: "SON-2024-00589",
    telefono: "662-321-0987",
    saldoPendiente: 1206,
    ultimoPago: "05 Sep 2024",
  },
  {
    nombre: "Fernanda Sofía Castillo Ruiz",
    direccion: "Calle Yáñez #210, Col. Centro, Hermosillo, Sonora",
    numeroCuenta: "SON-2024-00734",
    telefono: "662-654-3210",
    saldoPendiente: 0,
    ultimoPago: "01 Mar 2025",
  },
];

export const pagosHistorial: Pago[] = [
  {
    id: "p-001",
    folio: "PAG-2025-00142",
    ciudadanoNombre: "Fernanda Sofía Castillo Ruiz",
    numeroCuenta: "SON-2024-00734",
    monto: 298,
    metodo: "tarjeta",
    fecha: "01 Mar 2025",
    hora: "14:32",
    periodos: ["Ene – Feb 2025"],
  },
  {
    id: "p-002",
    folio: "PAG-2025-00139",
    ciudadanoNombre: "Ana Patricia Vega Mendoza",
    numeroCuenta: "SON-2024-01102",
    monto: 284,
    metodo: "spei",
    fecha: "15 Feb 2025",
    hora: "09:15",
    periodos: ["Nov – Dic 2024"],
  },
  {
    id: "p-003",
    folio: "PAG-2024-00987",
    ciudadanoNombre: "José Luis Ramírez García",
    numeroCuenta: "SON-2024-00213",
    monto: 596,
    metodo: "tarjeta",
    fecha: "20 Dic 2024",
    hora: "11:48",
    periodos: ["Sep – Oct 2024", "Nov – Dic 2024"],
  },
];

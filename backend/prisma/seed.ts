import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MESES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

function pastDate(months: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return d;
}

function dueDate(months: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d;
}

/** Genera N facturas vencidas consecutivas terminando hoy */
function facturaVencidas(contratoId: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const date = pastDate(count - i);
    return {
      contratoId,
      numFactura: `F-${contratoId}-${String(i + 1).padStart(3, "0")}`,
      ciclo: `${MESES[date.getMonth()]} ${date.getFullYear()}`,
      fechaVencimiento: pastDate(count - i - 1),
      importeTotal: (280 + Math.random() * 80).toFixed(2),
      estado: "vencido",
      periodo: date.getMonth() + 1,
      anio: date.getFullYear(),
    };
  });
}

/** Genera 12 meses de consumos reales */
function consumosNormales(contratoId: number, baseM3 = 16, estimado = false) {
  return Array.from({ length: 12 }, (_, i) => {
    const date = pastDate(11 - i);
    const variacion = baseM3 * 0.1 * (Math.random() - 0.5);
    const metros = parseFloat((baseM3 + variacion).toFixed(2));
    const anterior = parseFloat((300 + i * metros).toFixed(2));
    return {
      contratoId,
      anio: date.getFullYear(),
      periodo: MESES[date.getMonth()],
      fechaLectura: date,
      metrosCubicos: metros,
      lecturaActual: anterior + metros,
      lecturaAnterior: anterior,
      estimado,
    };
  });
}

/** Genera consumos en tendencia creciente */
function consumosTendenciaAlza(contratoId: number) {
  const base = 10;
  return Array.from({ length: 12 }, (_, i) => {
    const date = pastDate(11 - i);
    const metros = parseFloat((base + i * 1.5).toFixed(2));
    const anterior = parseFloat((300 + i * base).toFixed(2));
    return {
      contratoId,
      anio: date.getFullYear(),
      periodo: MESES[date.getMonth()],
      fechaLectura: date,
      metrosCubicos: metros,
      lecturaActual: anterior + metros,
      lecturaAnterior: anterior,
      estimado: false,
    };
  });
}

async function main() {
  console.log("🌱 Limpiando base de datos...");
  await prisma.ticket.deleteMany();
  await prisma.ticketSubcategoria.deleteMany();
  await prisma.ticketCategoria.deleteMany();
  await prisma.consumo.deleteMany();
  await prisma.factura.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.ubicacion.deleteMany();
  await prisma.contrato.deleteMany();

  // ─────────────────────────────────────────────
  // CONTRATOS
  // ─────────────────────────────────────────────

  console.log("📄 Creando contratos...");

  // SUP-001: Al corriente – sin deuda
  const c1 = await prisma.contrato.create({
    data: {
      numeroContrato: "SUP-001",
      nombreTitular: "María Guadalupe Torres Hernández",
      calle: "Calle Reforma",
      numero: "142",
      colonia: "Centro",
      municipio: "Querétaro",
      cp: "76000",
      tarifa: "Doméstico",
      estado: "activo",
      fechaAlta: new Date("2019-03-15"),
      numeroMedidor: "MED-001-A",
      ultimaLectura: "347.50",
    },
  });

  // SUP-002: 1 mes de adeudo
  const c2 = await prisma.contrato.create({
    data: {
      numeroContrato: "SUP-002",
      nombreTitular: "José Luis Ramírez García",
      calle: "Av. Juárez",
      numero: "89",
      colonia: "Centenario",
      municipio: "Querétaro",
      cp: "76010",
      tarifa: "Doméstico",
      estado: "activo",
      fechaAlta: new Date("2020-07-01"),
      numeroMedidor: "MED-002-B",
      ultimaLectura: "112.00",
    },
  });

  // SUP-003: 3 meses de adeudo
  const c3 = await prisma.contrato.create({
    data: {
      numeroContrato: "SUP-003",
      nombreTitular: "Ana Patricia Vega Mendoza",
      calle: "Blvd. Morelos",
      numero: "305",
      colonia: "Villa de Seris",
      municipio: "Querétaro",
      cp: "76030",
      tarifa: "Doméstico",
      estado: "activo",
      fechaAlta: new Date("2018-11-20"),
      numeroMedidor: "MED-003-C",
      ultimaLectura: "589.20",
    },
  });

  // SUP-004: 6 meses de adeudo
  const c4 = await prisma.contrato.create({
    data: {
      numeroContrato: "SUP-004",
      nombreTitular: "Roberto Carlos Díaz López",
      calle: "Calle Nayarit",
      numero: "56",
      colonia: "Pimentel",
      municipio: "Querétaro",
      cp: "76040",
      tarifa: "Doméstico",
      estado: "activo",
      fechaAlta: new Date("2017-06-10"),
      numeroMedidor: "MED-004-D",
      ultimaLectura: "891.75",
    },
  });

  // SUP-005: 1 año+ de adeudo (12 meses)
  const c5 = await prisma.contrato.create({
    data: {
      numeroContrato: "SUP-005",
      nombreTitular: "Fernanda Sofía Castillo Ruiz",
      calle: "Calle Yáñez",
      numero: "210",
      colonia: "Centro",
      municipio: "Querétaro",
      cp: "76000",
      tarifa: "Doméstico",
      estado: "activo",
      fechaAlta: new Date("2016-01-05"),
      numeroMedidor: "MED-005-E",
      ultimaLectura: "1240.30",
    },
  });

  // SUP-006: Servicio cortado (con deuda)
  const c6 = await prisma.contrato.create({
    data: {
      numeroContrato: "SUP-006",
      nombreTitular: "Carlos Eduardo Morales Sánchez",
      calle: "Calle Hidalgo",
      numero: "77",
      colonia: "La Pastora",
      municipio: "Querétaro",
      cp: "76060",
      tarifa: "Doméstico",
      estado: "cortado",
      fechaAlta: new Date("2015-09-12"),
      numeroMedidor: "MED-006-F",
      ultimaLectura: "445.00",
    },
  });

  // SUP-007: Próximo a vencer (sin vencidos, 1 pendiente)
  const c7 = await prisma.contrato.create({
    data: {
      numeroContrato: "SUP-007",
      nombreTitular: "Lucía Esperanza Flores Ríos",
      calle: "Paseo del Roble",
      numero: "15",
      colonia: "Jurica",
      municipio: "Querétaro",
      cp: "76100",
      tarifa: "Doméstico",
      estado: "activo",
      fechaAlta: new Date("2021-04-20"),
      numeroMedidor: "MED-007-G",
      ultimaLectura: "198.80",
    },
  });

  // SUP-008: Lecturas estimadas
  const c8 = await prisma.contrato.create({
    data: {
      numeroContrato: "SUP-008",
      nombreTitular: "Miguel Ángel Ortega Pérez",
      calle: "Calle Madero",
      numero: "34",
      colonia: "Bolaños",
      municipio: "Querétaro",
      cp: "76080",
      tarifa: "Doméstico",
      estado: "activo",
      fechaAlta: new Date("2022-02-14"),
      numeroMedidor: "MED-008-H",
      ultimaLectura: "76.40",
    },
  });

  // SUP-009: Consumo en tendencia aumentando
  const c9 = await prisma.contrato.create({
    data: {
      numeroContrato: "SUP-009",
      nombreTitular: "Sofía Valentina Cruz Navarro",
      calle: "Av. 5 de Febrero",
      numero: "120",
      colonia: "El Pedregal",
      municipio: "Querétaro",
      cp: "76090",
      tarifa: "Doméstico",
      estado: "activo",
      fechaAlta: new Date("2020-10-30"),
      numeroMedidor: "MED-009-I",
      ultimaLectura: "320.15",
    },
  });

  // SUP-010: Uso comercial con 2 facturas vencidas
  const c10 = await prisma.contrato.create({
    data: {
      numeroContrato: "SUP-010",
      nombreTitular: "Distribuidora El Sol S.A. de C.V.",
      calle: "Blvd. Bernardo Quintana",
      numero: "2000",
      colonia: "Santa Fe",
      municipio: "Querétaro",
      cp: "76050",
      tarifa: "Comercial",
      estado: "activo",
      fechaAlta: new Date("2014-05-01"),
      numeroMedidor: "MED-010-J",
      ultimaLectura: "3840.00",
    },
  });

  // ─────────────────────────────────────────────
  // FACTURAS
  // ─────────────────────────────────────────────

  console.log("🧾 Creando facturas...");

  // SUP-001: Al corriente — solo facturas pagadas
  await prisma.factura.createMany({
    data: Array.from({ length: 6 }, (_, i) => {
      const date = pastDate(6 - i);
      return {
        contratoId: c1.id,
        numFactura: `F-001-${String(i + 1).padStart(3, "0")}`,
        ciclo: `${MESES[date.getMonth()]} ${date.getFullYear()}`,
        fechaVencimiento: pastDate(5 - i),
        importeTotal: (260 + Math.random() * 60).toFixed(2),
        estado: "pagado",
        periodo: date.getMonth() + 1,
        anio: date.getFullYear(),
      };
    }),
  });

  // SUP-002: 1 mes vencido
  await prisma.factura.createMany({ data: facturaVencidas(c2.id, 1) });

  // SUP-003: 3 meses vencidos
  await prisma.factura.createMany({ data: facturaVencidas(c3.id, 3) });

  // SUP-004: 6 meses vencidos
  await prisma.factura.createMany({ data: facturaVencidas(c4.id, 6) });

  // SUP-005: 12 meses vencidos (1 año+)
  await prisma.factura.createMany({ data: facturaVencidas(c5.id, 12) });

  // SUP-006: Cortado — 4 vencidas
  await prisma.factura.createMany({ data: facturaVencidas(c6.id, 4) });

  // SUP-007: Próximo a vencer — 1 factura pendiente (sin vencer)
  await prisma.factura.create({
    data: {
      contratoId: c7.id,
      numFactura: "F-007-001",
      ciclo: `${MESES[new Date().getMonth()]} ${new Date().getFullYear()}`,
      fechaVencimiento: dueDate(1),
      importeTotal: "298.00",
      estado: "pendiente",
      periodo: new Date().getMonth() + 1,
      anio: new Date().getFullYear(),
    },
  });

  // SUP-008: Al corriente — solo pagadas
  await prisma.factura.createMany({
    data: Array.from({ length: 3 }, (_, i) => {
      const date = pastDate(3 - i);
      return {
        contratoId: c8.id,
        numFactura: `F-008-${String(i + 1).padStart(3, "0")}`,
        ciclo: `${MESES[date.getMonth()]} ${date.getFullYear()}`,
        fechaVencimiento: pastDate(2 - i),
        importeTotal: "245.00",
        estado: "pagado",
        periodo: date.getMonth() + 1,
        anio: date.getFullYear(),
      };
    }),
  });

  // SUP-009: Al corriente — solo pagadas
  await prisma.factura.createMany({
    data: Array.from({ length: 3 }, (_, i) => {
      const date = pastDate(3 - i);
      return {
        contratoId: c9.id,
        numFactura: `F-009-${String(i + 1).padStart(3, "0")}`,
        ciclo: `${MESES[date.getMonth()]} ${date.getFullYear()}`,
        fechaVencimiento: pastDate(2 - i),
        importeTotal: "320.00",
        estado: "pagado",
        periodo: date.getMonth() + 1,
        anio: date.getFullYear(),
      };
    }),
  });

  // SUP-010: Comercial — 2 vencidas
  await prisma.factura.createMany({ data: facturaVencidas(c10.id, 2).map(f => ({ ...f, importeTotal: (parseFloat(String(f.importeTotal)) * 4).toFixed(2) })) });

  // ─────────────────────────────────────────────
  // CONSUMOS
  // ─────────────────────────────────────────────

  console.log("💧 Creando consumos...");

  await prisma.consumo.createMany({ data: consumosNormales(c1.id, 18) });
  await prisma.consumo.createMany({ data: consumosNormales(c2.id, 14) });
  await prisma.consumo.createMany({ data: consumosNormales(c3.id, 20) });
  await prisma.consumo.createMany({ data: consumosNormales(c4.id, 22) });
  await prisma.consumo.createMany({ data: consumosNormales(c5.id, 25) });
  await prisma.consumo.createMany({ data: consumosNormales(c6.id, 16) });
  await prisma.consumo.createMany({ data: consumosNormales(c7.id, 15) });
  await prisma.consumo.createMany({ data: consumosNormales(c8.id, 12, true) }); // estimadas
  await prisma.consumo.createMany({ data: consumosTendenciaAlza(c9.id) });
  await prisma.consumo.createMany({ data: consumosNormales(c10.id, 85) }); // comercial — más m³

  // ─────────────────────────────────────────────
  // CLIENTES
  // ─────────────────────────────────────────────

  console.log("👤 Creando clientes...");

  const clientesData = [
    { contratoNumero: "SUP-001", nombre: "María Guadalupe Torres Hernández", email: "maria.torres@email.com", telefono: "442-123-4567", whatsapp: "5214421234567", reciboDigital: true },
    { contratoNumero: "SUP-002", nombre: "José Luis Ramírez García", email: "jose.ramirez@email.com", telefono: "442-987-6543", whatsapp: "5214429876543", reciboDigital: false },
    { contratoNumero: "SUP-003", nombre: "Ana Patricia Vega Mendoza", email: "ana.vega@email.com", telefono: "442-456-7890", whatsapp: "5214424567890", reciboDigital: true },
    { contratoNumero: "SUP-004", nombre: "Roberto Carlos Díaz López", email: "roberto.diaz@email.com", telefono: "442-321-0987", whatsapp: null, reciboDigital: false },
    { contratoNumero: "SUP-005", nombre: "Fernanda Sofía Castillo Ruiz", email: null, telefono: "442-654-3210", whatsapp: "5214426543210", reciboDigital: false },
    { contratoNumero: "SUP-006", nombre: "Carlos Eduardo Morales Sánchez", email: "carlos.morales@email.com", telefono: "442-111-2233", whatsapp: null, reciboDigital: false },
    { contratoNumero: "SUP-007", nombre: "Lucía Esperanza Flores Ríos", email: "lucia.flores@email.com", telefono: "442-222-3344", whatsapp: "5214422223344", reciboDigital: true },
    { contratoNumero: "SUP-008", nombre: "Miguel Ángel Ortega Pérez", email: "miguel.ortega@email.com", telefono: "442-333-4455", whatsapp: null, reciboDigital: false },
    { contratoNumero: "SUP-009", nombre: "Sofía Valentina Cruz Navarro", email: "sofia.cruz@email.com", telefono: "442-444-5566", whatsapp: "5214424445566", reciboDigital: true },
    { contratoNumero: "SUP-010", nombre: "Distribuidora El Sol S.A. de C.V.", email: "admin@elsol.com", telefono: "442-555-6677", whatsapp: null, reciboDigital: true },
  ];

  await prisma.cliente.createMany({ data: clientesData });

  // ─────────────────────────────────────────────
  // TICKET CATÁLOGOS
  // ─────────────────────────────────────────────

  console.log("🎫 Creando categorías de tickets...");

  const catFuga = await prisma.ticketCategoria.create({ data: { codigo: "FUGA", nombre: "Fuga de agua" } });
  const catPresion = await prisma.ticketCategoria.create({ data: { codigo: "PRESION", nombre: "Baja presión" } });
  const catCobranza = await prisma.ticketCategoria.create({ data: { codigo: "COBRANZA", nombre: "Cobranza y pagos" } });
  const catSolicitud = await prisma.ticketCategoria.create({ data: { codigo: "SOLICITUD", nombre: "Solicitudes de servicio" } });

  await prisma.ticketSubcategoria.createMany({
    data: [
      { categoriaId: catFuga.id, codigo: "FUGA_CALLE", nombre: "Fuga en calle" },
      { categoriaId: catFuga.id, codigo: "FUGA_DOMICILIO", nombre: "Fuga en domicilio" },
      { categoriaId: catPresion.id, codigo: "PRESION_BAJA", nombre: "Presión insuficiente" },
      { categoriaId: catPresion.id, codigo: "SIN_AGUA", nombre: "Sin servicio de agua" },
      { categoriaId: catCobranza.id, codigo: "ACLARACION", nombre: "Aclaración de cobro" },
      { categoriaId: catCobranza.id, codigo: "PAGO_NO_APLICADO", nombre: "Pago no aplicado" },
      { categoriaId: catSolicitud.id, codigo: "RECONEXION", nombre: "Solicitud de reconexión" },
      { categoriaId: catSolicitud.id, codigo: "CAMBIO_MEDIDOR", nombre: "Cambio de medidor" },
    ],
  });

  // ─────────────────────────────────────────────
  // TICKETS DE EJEMPLO
  // ─────────────────────────────────────────────

  console.log("📋 Creando tickets de ejemplo...");

  const subFugaCalle = await prisma.ticketSubcategoria.findUnique({ where: { codigo: "FUGA_CALLE" } });
  const subReconexion = await prisma.ticketSubcategoria.findUnique({ where: { codigo: "RECONEXION" } });
  const subAclaracion = await prisma.ticketSubcategoria.findUnique({ where: { codigo: "ACLARACION" } });

  await prisma.ticket.createMany({
    data: [
      {
        folio: "CEA-000001",
        contratoNumero: "SUP-001",
        categoriaId: catFuga.id,
        subcategoriaId: subFugaCalle!.id,
        titulo: "Fuga de agua en banqueta",
        descripcion: "Se observa fuga de agua constante en la banqueta frente al domicilio, calle Reforma 142.",
        estado: "cerrado",
        prioridad: "alta",
        tipoServicio: "FUGA",
        createdAt: pastDate(3),
      },
      {
        folio: "CEA-000002",
        contratoNumero: "SUP-006",
        categoriaId: catSolicitud.id,
        subcategoriaId: subReconexion!.id,
        titulo: "Solicitud de reconexión de servicio",
        descripcion: "El cliente solicita reconexión del servicio después de regularizar su situación de adeudo.",
        estado: "en_proceso",
        prioridad: "alta",
        tipoServicio: "SOLICITUD",
        createdAt: pastDate(1),
      },
      {
        folio: "CEA-000003",
        contratoNumero: "SUP-005",
        categoriaId: catCobranza.id,
        subcategoriaId: subAclaracion!.id,
        titulo: "Aclaración de adeudo excesivo",
        descripcion: "Cliente indica que no ha recibido notificaciones de cobro y solicita revisión del historial.",
        estado: "abierto",
        prioridad: "media",
        tipoServicio: "COBRANZA",
        createdAt: pastDate(0.5),
      },
    ],
  });

  // ─────────────────────────────────────────────
  // UBICACIONES (oficinas y cajeros en Querétaro)
  // ─────────────────────────────────────────────

  console.log("📍 Creando ubicaciones...");

  await prisma.ubicacion.createMany({
    data: [
      {
        nombre: "Oficina Central SUPRA",
        tipo: "oficina",
        direccionCalle: "Av. 5 de Febrero 4002",
        colonia: "Jardines de la Corregidora",
        municipio: "Querétaro",
        latitud: "20.5888",
        longitud: "-100.3899",
        horario: { lun_vie: "8:00 - 17:00", sab: "8:00 - 13:00", dom: "Cerrado" },
        telefono: "442-441-0000",
        servicios: "Pagos, trámites, aclaraciones",
        notas: "Estacionamiento disponible",
      },
      {
        nombre: "Oficina Norte",
        tipo: "oficina",
        direccionCalle: "Blvd. Bernardo Quintana 19001",
        colonia: "Arboledas",
        municipio: "Querétaro",
        latitud: "20.6452",
        longitud: "-100.4112",
        horario: { lun_vie: "8:00 - 16:00", sab: "8:00 - 12:00", dom: "Cerrado" },
        telefono: "442-441-1111",
        servicios: "Pagos, trámites",
        notas: null,
      },
      {
        nombre: "CEAmático Centro Comercial Antea",
        tipo: "cajero",
        direccionCalle: "Blvd. Bernardo Quintana 2001",
        colonia: "Antea",
        municipio: "Querétaro",
        latitud: "20.6621",
        longitud: "-100.4389",
        horario: { lun_vie: "9:00 - 21:00", sab: "9:00 - 21:00", dom: "11:00 - 20:00" },
        telefono: null,
        servicios: "Pagos automáticos",
        notas: "Dentro del CC Antea, nivel PB",
      },
      {
        nombre: "CEAmático Plaza del Parque",
        tipo: "cajero",
        direccionCalle: "Av. Constituyentes 80",
        colonia: "Milenio III",
        municipio: "Querétaro",
        latitud: "20.5731",
        longitud: "-100.4205",
        horario: { lun_vie: "9:00 - 20:00", sab: "9:00 - 20:00", dom: "10:00 - 18:00" },
        telefono: null,
        servicios: "Pagos automáticos",
        notas: null,
      },
      {
        nombre: "Autopago OXXO Jurica",
        tipo: "autopago",
        direccionCalle: "Paseo del Roble 100",
        colonia: "Jurica",
        municipio: "Querétaro",
        latitud: "20.7012",
        longitud: "-100.4488",
        horario: { lun_vie: "24 hrs", sab: "24 hrs", dom: "24 hrs" },
        telefono: null,
        servicios: "Pago con referencia",
        notas: "OXXO acepta pagos con número de contrato",
      },
    ],
  });

  console.log("✅ Seed completado exitosamente.");
  console.log("\n📊 Resumen:");
  console.log("  Contratos:  10 (SUP-001 al SUP-010)");
  console.log("  Facturas:   generadas por contrato");
  console.log("  Consumos:   12 meses por contrato");
  console.log("  Clientes:   10");
  console.log("  Tickets:    3 de ejemplo");
  console.log("  Ubicaciones: 5 (2 oficinas, 2 cajeros, 1 autopago)");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

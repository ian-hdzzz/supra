import { Router, Request, Response } from "express";
import prisma from "../db/client";
import { calcularTendencia } from "../utils/tendencia";
import { matchName } from "../utils/nameMatch";
import { signReciboToken } from "../utils/jwt";

const router = Router();

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

// GET /api/contrato/:id — Detalle del contrato (get_contract_details)
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const contrato = await prisma.contrato.findUnique({
      where: { numeroContrato: id },
    });

    if (!contrato) {
      return res.status(404).json({ success: false, error: "Contrato no encontrado", codigoError: -501 });
    }

    return res.json({
      success: true,
      data: {
        contrato: contrato.numeroContrato,
        nombreTitular: contrato.nombreTitular,
        direccion: `${contrato.calle} ${contrato.numero}`,
        calle: contrato.calle,
        numero: contrato.numero,
        colonia: contrato.colonia,
        municipio: contrato.municipio,
        cp: contrato.cp,
        tarifa: contrato.tarifa,
        estado: contrato.estado,
        fechaAlta: contrato.fechaAlta,
        numeroMedidor: contrato.numeroMedidor,
        ultimaLectura: contrato.ultimaLectura,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Error interno" });
  }
});

// GET /api/contrato/:id/deuda — Deuda y facturas (get_deuda)
router.get("/:id/deuda", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const contrato = await prisma.contrato.findUnique({
      where: { numeroContrato: id },
      include: {
        facturas: {
          where: { estado: { in: ["vencido", "pendiente"] } },
          orderBy: { fechaVencimiento: "asc" },
        },
      },
    });

    if (!contrato) {
      return res.status(404).json({ success: false, error: "Contrato no encontrado", codigoError: -501 });
    }

    const facturas = contrato.facturas;
    const totalDeuda = facturas.reduce((acc, f) => acc + parseFloat(f.importeTotal.toString()), 0);
    const vencido = facturas.filter(f => f.estado === "vencido").reduce((acc, f) => acc + parseFloat(f.importeTotal.toString()), 0);
    const porVencer = facturas.filter(f => f.estado === "pendiente").reduce((acc, f) => acc + parseFloat(f.importeTotal.toString()), 0);

    return res.json({
      success: true,
      data: {
        contrato: contrato.numeroContrato,
        nombreCliente: contrato.nombreTitular,
        direccion: `${contrato.calle} ${contrato.numero}`,
        totalDeuda: parseFloat(totalDeuda.toFixed(2)),
        vencido: parseFloat(vencido.toFixed(2)),
        porVencer: parseFloat(porVencer.toFixed(2)),
        cantidadFacturas: facturas.length,
        facturas: facturas.map(f => ({
          numFactura: f.numFactura,
          ciclo: f.ciclo,
          fechaVencimiento: f.fechaVencimiento,
          importeTotal: parseFloat(f.importeTotal.toString()),
          estadoTexto: f.estado,
        })),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Error interno" });
  }
});

// GET /api/contrato/:id/consumos — Historial de consumo (get_consumo)
router.get("/:id/consumos", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const contrato = await prisma.contrato.findUnique({
      where: { numeroContrato: id },
      include: {
        consumos: { orderBy: [{ anio: "desc" }, { periodo: "desc" }] },
      },
    });

    if (!contrato) {
      return res.status(404).json({ success: false, error: "Contrato no encontrado", codigoError: -501 });
    }

    const consumos = contrato.consumos;
    const m3Vals = consumos.map(c => parseFloat(c.metrosCubicos.toString()));
    const promedioMensual = m3Vals.length
      ? parseFloat((m3Vals.reduce((a, b) => a + b, 0) / m3Vals.length).toFixed(2))
      : 0;
    const tendencia = calcularTendencia(m3Vals);

    return res.json({
      success: true,
      data: {
        contrato: contrato.numeroContrato,
        promedioMensual,
        tendencia,
        consumos: consumos.map(c => ({
          periodo: `${c.periodo} ${c.anio}`,
          consumoM3: parseFloat(c.metrosCubicos.toString()),
          tipoLectura: c.estimado ? "estimada" : "real",
          fechaLectura: c.fechaLectura,
          lecturaActual: parseFloat(c.lecturaActual.toString()),
          lecturaAnterior: parseFloat(c.lecturaAnterior.toString()),
        })),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Error interno" });
  }
});

// GET /api/contrato/:id/recibos — Lista de recibos con download_url (get_recibo_link)
router.get("/:id/recibos", async (req: Request, res: Response) => {
  const { id } = req.params;
  const serverBase = process.env.SERVER_BASE_URL || "http://localhost:3001";

  try {
    const contrato = await prisma.contrato.findUnique({
      where: { numeroContrato: id },
      include: {
        facturas: { orderBy: [{ anio: "desc" }, { periodo: "desc" }] },
      },
    });

    if (!contrato) {
      return res.status(404).json({ success: false, error: "Contrato no encontrado", codigoError: -501 });
    }

    const recibos = contrato.facturas.map(f => {
      const token = signReciboToken(contrato.numeroContrato, f.numFactura);
      const estadoTexto = f.estado === "vencido" ? "vencido" : f.estado === "pendiente" ? "pendiente" : "pagado";
      return {
        numFactura: f.numFactura,
        periodo: `${MESES[f.periodo - 1]} ${f.anio}`,
        importeTotal: parseFloat(f.importeTotal.toString()),
        estadoTexto,
        fechaVencimiento: f.fechaVencimiento,
        downloadUrl: `${serverBase}/recibo/${contrato.numeroContrato}?token=${token}&factura=${f.numFactura}`,
      };
    });

    return res.json({
      success: true,
      data: {
        contrato: contrato.numeroContrato,
        recibos,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Error interno" });
  }
});

// POST /api/contrato/validar — Validar contrato + nombre (validate_contract)
router.post("/validar", async (req: Request, res: Response) => {
  const { contrato, nombre } = req.body;

  if (!contrato || !nombre) {
    return res.status(400).json({ success: false, error: "Se requiere contrato y nombre" });
  }

  try {
    const c = await prisma.contrato.findUnique({ where: { numeroContrato: contrato } });

    if (!c) {
      return res.status(404).json({ success: false, error: "Contrato no encontrado", codigoError: -501 });
    }

    const result = matchName(nombre, c.nombreTitular);

    return res.json({
      success: true,
      data: {
        contrato: c.numeroContrato,
        validated: result.validated,
        confidence: result.confidence,
        method: result.method,
        titularEncontrado: c.nombreTitular,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Error interno" });
  }
});

export default router;

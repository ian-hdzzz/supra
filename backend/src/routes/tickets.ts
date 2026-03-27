import { Router, Request, Response } from "express";
import prisma from "../db/client";

const router = Router();

function generarFolio(): string {
  const num = Math.floor(Math.random() * 900000) + 100000;
  return `CEA-${num}`;
}

// POST /api/tickets — Crear ticket (create_ticket)
router.post("/", async (req: Request, res: Response) => {
  const { contratoNumero, conversationId, categoryCodigo, subcategoryCodigo, titulo, descripcion, prioridad, tipoServicio } = req.body;

  if (!titulo) {
    return res.status(400).json({ success: false, error: "El campo 'titulo' es requerido" });
  }

  try {
    let categoriaId: number | undefined;
    let subcategoriaId: number | undefined;

    if (categoryCodigo) {
      const cat = await prisma.ticketCategoria.findUnique({ where: { codigo: categoryCodigo } });
      if (cat) categoriaId = cat.id;
    }

    if (subcategoryCodigo) {
      const sub = await prisma.ticketSubcategoria.findUnique({ where: { codigo: subcategoryCodigo } });
      if (sub) subcategoriaId = sub.id;
    }

    const ticket = await prisma.ticket.create({
      data: {
        folio: generarFolio(),
        contratoNumero: contratoNumero || null,
        conversationId: conversationId || null,
        categoriaId: categoriaId || null,
        subcategoriaId: subcategoriaId || null,
        titulo,
        descripcion: descripcion || null,
        estado: "abierto",
        prioridad: prioridad || "media",
        tipoServicio: tipoServicio || null,
      },
    });

    return res.status(201).json({
      success: true,
      data: {
        folio: ticket.folio,
        ticketId: ticket.id,
        status: ticket.estado,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Error interno" });
  }
});

// GET /api/tickets?contrato=SUP-001 o ?conversation_id=... (get_client_tickets)
router.get("/", async (req: Request, res: Response) => {
  const { contrato, conversation_id } = req.query as { contrato?: string; conversation_id?: string };

  try {
    const where = contrato
      ? { contratoNumero: contrato }
      : conversation_id
      ? { conversationId: conversation_id }
      : {};

    const tickets = await prisma.ticket.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { categoria: true, subcategoria: true },
    });

    return res.json({
      success: true,
      data: tickets.map(t => ({
        folio: t.folio,
        status: t.estado,
        titulo: t.titulo,
        tipoServicio: t.tipoServicio,
        createdAt: t.createdAt,
        descripcion: t.descripcion ? t.descripcion.slice(0, 100) : null,
        categoria: t.categoria?.nombre || null,
        subcategoria: t.subcategoria?.nombre || null,
      })),
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Error interno" });
  }
});

// GET /api/tickets/folio/:folio — Buscar por folio (lookup_ticket_by_folio)
router.get("/folio/:folio", async (req: Request, res: Response) => {
  const { folio } = req.params;

  try {
    let ticket = await prisma.ticket.findUnique({ where: { folio } });

    // Fallback: input numérico → buscar "CEA-{folio}"
    if (!ticket && /^\d+$/.test(folio)) {
      ticket = await prisma.ticket.findUnique({ where: { folio: `CEA-${folio}` } });
    }

    if (!ticket) {
      return res.status(404).json({ success: false, error: "Ticket no encontrado" });
    }

    return res.json({
      success: true,
      data: {
        folio: ticket.folio,
        status: ticket.estado,
        titulo: ticket.titulo,
        descripcion: ticket.descripcion ? ticket.descripcion.slice(0, 200) : null,
        createdAt: ticket.createdAt,
        prioridad: ticket.prioridad,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Error interno" });
  }
});

// PUT /api/tickets/:id — Actualizar ticket (update_ticket)
router.put("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { estado, prioridad, descripcion, titulo } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ success: false, error: "ID inválido" });
  }

  try {
    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        ...(estado && { estado }),
        ...(prioridad && { prioridad }),
        ...(descripcion && { descripcion }),
        ...(titulo && { titulo }),
      },
    });

    return res.json({
      success: true,
      data: {
        folio: ticket.folio,
        message: "Ticket actualizado exitosamente",
      },
    });
  } catch (err: any) {
    if (err?.code === "P2025") {
      return res.status(404).json({ success: false, error: "Ticket no encontrado" });
    }
    return res.status(500).json({ success: false, error: "Error interno" });
  }
});

export default router;

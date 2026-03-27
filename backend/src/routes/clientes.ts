import { Router, Request, Response } from "express";
import prisma from "../db/client";

const router = Router();

// GET /api/cliente?contrato=SUP-001 — Buscar cliente por contrato (search_customer_by_contract)
router.get("/", async (req: Request, res: Response) => {
  const { contrato } = req.query as { contrato?: string };

  if (!contrato) {
    return res.status(400).json({ success: false, error: "Parámetro 'contrato' requerido" });
  }

  try {
    const cliente = await prisma.cliente.findFirst({
      where: { contratoNumero: contrato },
    });

    if (!cliente) {
      return res.status(404).json({ success: false, error: "Cliente no encontrado" });
    }

    return res.json({
      success: true,
      data: {
        id: cliente.id,
        nombre: cliente.nombre,
        contrato: cliente.contratoNumero,
        email: cliente.email,
        telefono: cliente.telefono,
        whatsapp: cliente.whatsapp,
        reciboDigital: cliente.reciboDigital,
        identifier: cliente.identifier,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Error interno" });
  }
});

export default router;

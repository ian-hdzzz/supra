import { Router, Request, Response } from "express";
import prisma from "../db/client";
import { verifyReciboToken } from "../utils/jwt";

const router = Router();

// GET /recibo/:contrato?token=...&factura=... — PDF placeholder
router.get("/:contrato", async (req: Request, res: Response) => {
  const { contrato } = req.params;
  const { token, factura } = req.query as { token?: string; factura?: string };

  if (!token || !factura) {
    return res.status(400).send("Token y factura requeridos");
  }

  try {
    const payload = verifyReciboToken(token);

    if (payload.contrato !== contrato || payload.factura !== factura) {
      return res.status(403).send("Token inválido para este recibo");
    }

    const facturaRecord = await prisma.factura.findFirst({
      where: {
        numFactura: factura,
        contrato: { numeroContrato: contrato },
      },
      include: { contrato: true },
    });

    if (!facturaRecord) {
      return res.status(404).send("Recibo no encontrado");
    }

    // Si hay PDF real en base64, devolverlo
    if (facturaRecord.pdfData) {
      const buf = Buffer.from(facturaRecord.pdfData, "base64");
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${factura}.pdf"`);
      return res.send(buf);
    }

    // Placeholder HTML como PDF stub
    res.setHeader("Content-Type", "text/html");
    return res.send(`
      <html><body style="font-family:sans-serif;padding:2rem;">
        <h1>SUPRA — Recibo de Agua</h1>
        <p><b>Contrato:</b> ${facturaRecord.contrato.numeroContrato}</p>
        <p><b>Titular:</b> ${facturaRecord.contrato.nombreTitular}</p>
        <p><b>Factura:</b> ${facturaRecord.numFactura}</p>
        <p><b>Ciclo:</b> ${facturaRecord.ciclo}</p>
        <p><b>Importe:</b> $${facturaRecord.importeTotal}</p>
        <p><b>Estado:</b> ${facturaRecord.estado}</p>
        <p style="color:#888;font-size:0.8rem;margin-top:2rem;">PDF stub — conecta tu sistema de generación de PDF aquí.</p>
      </body></html>
    `);
  } catch (err) {
    return res.status(403).send("Token inválido o expirado");
  }
});

export default router;

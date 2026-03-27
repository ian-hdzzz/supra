import { Request, Response, NextFunction } from "express";

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  console.error("[ERROR]", err.message);
  res.status(500).json({ success: false, error: "Error interno del servidor" });
}

export function notFound(req: Request, res: Response) {
  res.status(404).json({ success: false, error: `Ruta no encontrada: ${req.method} ${req.path}` });
}

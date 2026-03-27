import "dotenv/config";
import express from "express";
import cors from "cors";

import contratosRouter from "./routes/contratos";
import recibosRouter from "./routes/recibos";
import clientesRouter from "./routes/clientes";
import ticketsRouter from "./routes/tickets";
import ubicacionesRouter from "./routes/ubicaciones";
import { errorHandler, notFound } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3001;

// ─────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
  .split(",")
  .map(o => o.trim());

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origen no permitido: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "10mb" })); // 10mb para cuando se envíen imágenes de recibos

// ─────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────

app.get("/health", (_req, res) => {
  res.json({ status: "ok", version: "1.0.0", timestamp: new Date().toISOString() });
});

// ─────────────────────────────────────────────
// Rutas
// ─────────────────────────────────────────────

app.use("/api/contrato", contratosRouter);
app.use("/api/cliente", clientesRouter);
app.use("/api/tickets", ticketsRouter);
app.use("/api/ubicaciones", ubicacionesRouter);
app.use("/api/geocode", ubicacionesRouter); // mismo router tiene /reverso
app.use("/recibo", recibosRouter);

// ─────────────────────────────────────────────
// 404 + Error handler
// ─────────────────────────────────────────────

app.use(notFound);
app.use(errorHandler);

// ─────────────────────────────────────────────
// Start
// ─────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🚀 SUPRA API corriendo en http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Contrato: http://localhost:${PORT}/api/contrato/SUP-001`);
  console.log(`   Deuda:    http://localhost:${PORT}/api/contrato/SUP-003/deuda`);
  console.log(`   Tickets:  http://localhost:${PORT}/api/tickets`);
  console.log(`   Docs:     http://localhost:${PORT}/health\n`);
});

export default app;

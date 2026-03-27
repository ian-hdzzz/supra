import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supra_dev_secret";

export function signReciboToken(contrato: string, factura: string): string {
  return jwt.sign({ contrato, factura }, JWT_SECRET, { expiresIn: "48h" });
}

export function verifyReciboToken(token: string): { contrato: string; factura: string } {
  return jwt.verify(token, JWT_SECRET) as { contrato: string; factura: string };
}

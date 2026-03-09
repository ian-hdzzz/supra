import { motion } from "framer-motion";
import { useState } from "react";
import { CreditCard, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Adeudo } from "@/data/seedData";

interface PaymentDetailStepProps {
  method: "tarjeta" | "spei";
  selectedAdeudos: Adeudo[];
  total: number;
  onConfirm: () => void;
  onBack: () => void;
}

const PaymentDetailStep = ({ method, selectedAdeudos, total, onConfirm, onBack }: PaymentDetailStepProps) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [copied, setCopied] = useState(false);

  const clabeRef = "014180655032875695";
  const referencia = "SON-2024-00847-MAR25";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCardValid = cardNumber.length >= 16 && cardExpiry.length >= 4 && cardCvv.length >= 3 && cardName.length > 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-5 px-4 w-full max-w-md mx-auto"
    >
      {/* Summary */}
      <div className="bg-accent rounded-xl p-4">
        <h3 className="font-semibold text-accent-foreground mb-2">Resumen de tu pago</h3>
        {selectedAdeudos.map(a => (
          <div key={a.id} className="flex justify-between text-sm py-1">
            <span className="text-muted-foreground">{a.periodo}</span>
            <span className="font-medium text-foreground">${a.monto.toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t border-border mt-2 pt-2 flex justify-between">
          <span className="font-bold text-foreground">Total</span>
          <span className="font-bold text-xl text-primary">${total.toFixed(2)}</span>
        </div>
      </div>

      {method === "tarjeta" ? (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Datos de tu tarjeta
          </h2>
          <div className="space-y-3">
            <div>
              <Label className="text-sm text-muted-foreground">Nombre del titular</Label>
              <Input
                placeholder="Como aparece en la tarjeta"
                value={cardName}
                onChange={e => setCardName(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Número de tarjeta</Label>
              <Input
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                className="h-12 rounded-xl"
                maxLength={16}
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <Label className="text-sm text-muted-foreground">Vencimiento</Label>
                <Input
                  placeholder="MM/AA"
                  value={cardExpiry}
                  onChange={e => setCardExpiry(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="h-12 rounded-xl"
                  maxLength={5}
                />
              </div>
              <div className="flex-1">
                <Label className="text-sm text-muted-foreground">CVV</Label>
                <Input
                  type="password"
                  placeholder="•••"
                  value={cardCvv}
                  onChange={e => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="h-12 rounded-xl"
                  maxLength={4}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Datos para transferencia SPEI</h2>
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">CLABE interbancaria</p>
              <div className="flex items-center gap-2">
                <p className="font-mono font-bold text-foreground text-lg tracking-wider">{clabeRef}</p>
                <button onClick={() => handleCopy(clabeRef)} className="text-primary hover:text-primary-light">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Referencia de pago</p>
              <div className="flex items-center gap-2">
                <p className="font-mono font-semibold text-foreground">{referencia}</p>
                <button onClick={() => handleCopy(referencia)} className="text-primary hover:text-primary-light">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Beneficiario</p>
              <p className="font-semibold text-foreground">SAPA Hermosillo — Gobierno Municipal</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Monto exacto</p>
              <p className="font-bold text-primary text-lg">${total.toFixed(2)} MXN</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Realiza la transferencia desde tu banca en línea y haz clic en "Confirmar pago" cuando la hayas completado.
          </p>
        </div>
      )}

      <div className="flex gap-3 mt-2">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12 rounded-xl">
          Regresar
        </Button>
        <Button
          onClick={onConfirm}
          disabled={method === "tarjeta" && !isCardValid}
          className="flex-1 h-12 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-elevated hover:shadow-glow transition-all disabled:opacity-50"
        >
          Confirmar y pagar
        </Button>
      </div>
    </motion.div>
  );
};

export default PaymentDetailStep;

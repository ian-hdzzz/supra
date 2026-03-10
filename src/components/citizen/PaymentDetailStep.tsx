import { motion } from "framer-motion";
import { useState } from "react";
import { CreditCard, Copy, Check, Plus, Smartphone, ChevronRight, Loader2, AlertCircle, Store } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Adeudo, SavedCard, SavedWallet, useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

interface PaymentDetailStepProps {
  method: "tarjeta" | "spei" | "wallet" | "oxxo";
  selectedAdeudos: Adeudo[];
  total: number;
  onConfirm: (label?: string) => void;
  onBack: () => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatCardNumber = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

const formatExpiry = (v: string) => {
  const digits = v.replace(/\D/g, "").slice(0, 4);
  return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

const detectCardBrand = (v: string): "visa" | "mastercard" | "amex" | "unknown" => {
  const n = v.replace(/\D/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  return "unknown";
};

const brandLabel: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "Amex",
  unknown: "",
};

const brandColors: Record<string, string> = {
  visa: "text-blue-600 bg-blue-50 border-blue-200",
  mastercard: "text-orange-600 bg-orange-50 border-orange-200",
  amex: "text-green-600 bg-green-50 border-green-200",
  unknown: "hidden",
};

// ── Sub-componentes ───────────────────────────────────────────────────────────

interface CardFormProps {
  onSave: (card: SavedCard, label: string) => void;
  onCancel?: () => void;
  showCancel: boolean;
}

const CardForm = ({ onSave, onCancel, showCancel }: CardFormProps) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const digits = cardNumber.replace(/\D/g, "");
  const brand = detectCardBrand(digits);
  const isValid = digits.length >= 13 && cardExpiry.length >= 4 && cardCvv.length >= 3 && cardName.length > 2;

  const handleSave = () => {
    if (!isValid) return;
    const last4 = digits.slice(-4);
    const label = `${brandLabel[brand] || "Tarjeta"} •••• ${last4}`;
    const card: SavedCard = {
      id: `card-${digits.slice(0, 6)}-${last4}`,
      label,
      brand,
      last4,
    };
    onSave(card, label);
  };

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-sm text-muted-foreground">Nombre del titular</Label>
        <Input
          placeholder="Como aparece en la tarjeta"
          value={cardName}
          onChange={(e) => setCardName(e.target.value.toUpperCase())}
          className="h-12 rounded-xl"
        />
      </div>
      <div>
        <Label className="text-sm text-muted-foreground">Número de tarjeta</Label>
        <div className="relative">
          <Input
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            className="h-12 rounded-xl pr-20"
            maxLength={19}
          />
          {brand !== "unknown" && (
            <span
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold px-2 py-0.5 rounded-full border",
                brandColors[brand]
              )}
            >
              {brandLabel[brand]}
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <Label className="text-sm text-muted-foreground">Vencimiento</Label>
          <Input
            placeholder="MM/AA"
            value={cardExpiry}
            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
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
            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
            className="h-12 rounded-xl"
            maxLength={4}
          />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        {showCancel && (
          <Button variant="outline" onClick={onCancel} className="flex-1 h-11 rounded-xl text-sm">
            Cancelar
          </Button>
        )}
        <Button
          onClick={handleSave}
          disabled={!isValid}
          className={cn(
            "h-11 rounded-xl gradient-primary text-primary-foreground font-semibold disabled:opacity-50",
            showCancel ? "flex-1" : "w-full"
          )}
        >
          Tokenizar y usar tarjeta
        </Button>
      </div>
    </div>
  );
};

// ── OXXO QR Code (SVG decorativo con patrones reales de QR) ──────────────────

const OxxoQRCode = ({ seed }: { seed: string }) => {
  const N = 25;
  const hash = seed.split("").reduce((h, ch) => (Math.imul(h, 31) + ch.charCodeAt(0)) | 0, 5381);
  const rand = (idx: number) => (((Math.imul(hash ^ (idx * 2654435761 | 0), 1540483477)) >>> 17) & 1) === 1;

  const finderCell = (r: number, c: number, or_: number, oc: number): boolean | null => {
    const dr = r - or_, dc = c - oc;
    if (dr < 0 || dr > 6 || dc < 0 || dc > 6) return null;
    if (dr === 0 || dr === 6 || dc === 0 || dc === 6) return true;
    if (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4) return true;
    return false;
  };

  const cells = Array.from({ length: N }, (_, r) =>
    Array.from({ length: N }, (_, c): boolean => {
      const tl = finderCell(r, c, 0, 0);
      if (tl !== null) return tl;
      const tr = finderCell(r, c, 0, N - 7);
      if (tr !== null) return tr;
      const bl = finderCell(r, c, N - 7, 0);
      if (bl !== null) return bl;

      // Separators
      if ((r === 7 && c <= 7) || (c === 7 && r <= 7)) return false;
      if ((r === 7 && c >= N - 8) || (c === N - 8 && r <= 7)) return false;
      if ((r === N - 8 && c <= 7) || (c === 7 && r >= N - 8)) return false;

      // Timing patterns
      if (r === 6 && c >= 8 && c <= N - 9) return c % 2 === 0;
      if (c === 6 && r >= 8 && r <= N - 9) return r % 2 === 0;

      // Alignment pattern at (18, 18)
      const ar = Math.abs(r - 18), ac = Math.abs(c - 18);
      if (ar <= 2 && ac <= 2) {
        if (ar === 0 && ac === 0) return true;
        if (ar === 2 || ac === 2) return true;
        return false;
      }

      return rand(r * N + c);
    })
  );

  return (
    <svg viewBox={`0 0 ${N + 4} ${N + 4}`} className="w-full h-full" role="img" aria-label="Código QR OXXO PAY">
      <rect width={N + 4} height={N + 4} fill="white" />
      {cells.map((row, r) =>
        row.map((dark, c) =>
          dark ? <rect key={`${r}-${c}`} x={c + 2} y={r + 2} width={1} height={1} fill="#1a1a1a" /> : null
        )
      )}
    </svg>
  );
};

// ── Componente principal ──────────────────────────────────────────────────────

const PaymentDetailStep = ({
  method,
  selectedAdeudos,
  total,
  onConfirm,
  onBack,
}: PaymentDetailStepProps) => {
  const { savedCards, savedWallets, saveCard, saveWallet } = useApp();
  const [copied, setCopied] = useState(false);
  const [speiAttempts, setSpeiAttempts] = useState(0);
  const [speiVerifying, setSpeiVerifying] = useState(false);
  const [oxxoAttempts, setOxxoAttempts] = useState(0);
  const [oxxoVerifying, setOxxoVerifying] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(
    savedCards.length > 0 ? savedCards[0].id : null
  );
  const [showNewCardForm, setShowNewCardForm] = useState(savedCards.length === 0);

  // wallet state
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(
    savedWallets.length > 0 ? savedWallets[0].id : null
  );
  const [showNewWalletForm, setShowNewWalletForm] = useState(savedWallets.length === 0);
  const [walletType, setWalletType] = useState<"apple" | "google">("apple");
  const [walletEmail, setWalletEmail] = useState("");

  const clabeRef = "014180655032875695";
  const referencia = `${selectedAdeudos[0]?.id ?? "SON"}-MAR25`.toUpperCase();

  // Referencia OXXO PAY: 18 dígitos determinísticos basados en el adeudo y monto
  const oxxoRefBase = selectedAdeudos.reduce((s, a) => s + a.id.charCodeAt(0) * 31, 0) % 100000000;
  const oxxoRef = `9300${String(oxxoRefBase).padStart(8, "0")}${String(Math.round(total * 100)).padStart(6, "0")}`.slice(0, 18);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeiVerify = () => {
    if (speiVerifying) return;
    setSpeiVerifying(true);
    setTimeout(() => {
      setSpeiVerifying(false);
      if (speiAttempts === 0) {
        setSpeiAttempts(1);
        toast.error("No se encontró el pago", {
          description: "La transferencia SPEI aún no se refleja en el sistema. Verifica que hayas enviado el monto exacto con la referencia correcta e intenta de nuevo.",
          icon: <AlertCircle className="w-4 h-4" />,
          duration: 5000,
        });
      } else {
        onConfirm("SPEI");
      }
    }, 2200);
  };

  const handleOxxoVerify = () => {
    if (oxxoVerifying) return;
    setOxxoVerifying(true);
    setTimeout(() => {
      setOxxoVerifying(false);
      if (oxxoAttempts === 0) {
        setOxxoAttempts(1);
        toast.error("Pago no encontrado en OXXO", {
          description: "El pago en tienda OXXO aún no se ha reflejado. Asegúrate de haber completado el pago y espera unos minutos antes de reintentar.",
          icon: <AlertCircle className="w-4 h-4" />,
          duration: 5000,
        });
      } else {
        onConfirm("OXXO PAY");
      }
    }, 2200);
  };

  // ── Tarjeta ──
  const handleCardSaved = (card: SavedCard, label: string) => {
    saveCard(card);
    setSelectedCardId(card.id);
    setShowNewCardForm(false);
    onConfirm(label);
  };

  const handleUseExistingCard = () => {
    if (!selectedCardId) return;
    const card = savedCards.find((c) => c.id === selectedCardId);
    onConfirm(card?.label);
  };

  // ── Wallet ──
  const handleWalletConfirm = () => {
    if (!showNewWalletForm && selectedWalletId) {
      const w = savedWallets.find((w) => w.id === selectedWalletId);
      onConfirm(w ? `${w.type === "apple" ? "Apple Pay" : "Google Pay"} (${w.email})` : "Pago Digital");
      return;
    }
    if (!walletEmail) return;
    const wallet: SavedWallet = {
      id: `wallet-${walletType}-${walletEmail}`,
      type: walletType,
      email: walletEmail,
    };
    saveWallet(wallet);
    setSelectedWalletId(wallet.id);
    setShowNewWalletForm(false);
    onConfirm(`${walletType === "apple" ? "Apple Pay" : "Google Pay"} (${walletEmail})`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-5 px-4 w-full max-w-md mx-auto"
    >
      {/* Resumen */}
      <div className="bg-accent rounded-xl p-4">
        <h3 className="font-semibold text-accent-foreground mb-2">Resumen de tu pago</h3>
        {selectedAdeudos.map((a) => (
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

      {/* ── TARJETA ── */}
      {method === "tarjeta" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Datos de tu tarjeta
          </h2>

          {/* Tarjetas guardadas */}
          {savedCards.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Tarjetas guardadas</p>
              {savedCards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => {
                    setSelectedCardId(card.id);
                    setShowNewCardForm(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all",
                    selectedCardId === card.id && !showNewCardForm
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary-lighter"
                  )}
                >
                  <CreditCard className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-medium text-foreground">{card.label}</span>
                  {selectedCardId === card.id && !showNewCardForm && (
                    <Check className="w-4 h-4 text-primary ml-auto" />
                  )}
                </button>
              ))}

              {!showNewCardForm && (
                <button
                  onClick={() => { setShowNewCardForm(true); setSelectedCardId(null); }}
                  className="w-full flex items-center gap-2 p-3 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-all text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Agregar nueva tarjeta
                </button>
              )}
            </div>
          )}

          {/* Formulario nueva tarjeta */}
          {showNewCardForm && (
            <CardForm
              onSave={handleCardSaved}
              onCancel={savedCards.length > 0 ? () => { setShowNewCardForm(false); setSelectedCardId(savedCards[0].id); } : undefined}
              showCancel={savedCards.length > 0}
            />
          )}
        </div>
      )}

      {/* ── SPEI ── */}
      {method === "spei" && (
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
              <p className="font-semibold text-foreground">SUPRA Hermosillo — Gobierno Municipal</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Monto exacto</p>
              <p className="font-bold text-primary text-lg">${total.toFixed(2)} MXN</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Realiza la transferencia desde tu banca en línea y haz clic en "Verificar pago" cuando la hayas completado.
          </p>
        </div>
      )}

      {/* ── WALLET ── */}
      {method === "wallet" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-primary" />
            Pago Digital
          </h2>

          {savedWallets.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Wallets vinculadas</p>
              {savedWallets.map((w) => (
                <button
                  key={w.id}
                  onClick={() => { setSelectedWalletId(w.id); setShowNewWalletForm(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all",
                    selectedWalletId === w.id && !showNewWalletForm
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary-lighter"
                  )}
                >
                  <Smartphone className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">
                      {w.type === "apple" ? "Apple Pay" : "Google Pay"}
                    </p>
                    <p className="text-xs text-muted-foreground">{w.email}</p>
                  </div>
                  {selectedWalletId === w.id && !showNewWalletForm && (
                    <Check className="w-4 h-4 text-primary ml-auto" />
                  )}
                </button>
              ))}

              {!showNewWalletForm && (
                <button
                  onClick={() => { setShowNewWalletForm(true); setSelectedWalletId(null); }}
                  className="w-full flex items-center gap-2 p-3 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-all text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Vincular nueva wallet
                </button>
              )}
            </div>
          )}

          {showNewWalletForm && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {(["apple", "google"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setWalletType(t)}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-xl border-2 font-medium text-sm transition-all",
                      walletType === t ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary-lighter"
                    )}
                  >
                    <Smartphone className="w-4 h-4" />
                    {t === "apple" ? "Apple Pay" : "Google Pay"}
                  </button>
                ))}
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Email de la cuenta</Label>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={walletEmail}
                  onChange={(e) => setWalletEmail(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── OXXO PAY ── */}
      {method === "oxxo" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Store className="w-5 h-5 text-[#DA0F2E]" />
            OXXO PAY — Código QR
          </h2>

          <div className="flex flex-col items-center gap-4 bg-card border border-border rounded-xl p-6">
            <div className="w-48 h-48 rounded-xl overflow-hidden border-2 border-border shadow-sm">
              <OxxoQRCode seed={oxxoRef} />
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs text-muted-foreground">Referencia de pago</p>
              <p className="font-mono font-bold text-foreground text-sm tracking-widest">
                {oxxoRef.match(/.{1,6}/g)?.join("  ")}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Monto a pagar</p>
              <p className="font-bold text-primary text-2xl mt-0.5">${total.toFixed(2)} MXN</p>
            </div>
          </div>

          <div className="bg-[#DA0F2E]/5 border border-[#DA0F2E]/20 rounded-xl p-4 space-y-2.5">
            <p className="text-sm font-semibold text-[#DA0F2E]">¿Cómo pagar en OXXO?</p>
            {[
              "Ve a cualquier tienda OXXO",
              'Dile al cajero: "Quiero pagar un servicio OXXO PAY"',
              "Muestra el código QR o proporciona la referencia",
              "Paga el monto exacto en efectivo",
              "Guarda tu ticket como comprobante",
            ].map((paso, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <span className="w-5 h-5 rounded-full bg-[#DA0F2E]/15 text-[#DA0F2E] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{paso}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Una vez pagado en caja, haz clic en "Verificar pago" para confirmar tu transacción.
          </p>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex gap-3 mt-2">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12 rounded-xl">
          Regresar
        </Button>

        {/* Tarjeta con tarjetas guardadas seleccionadas (no está en el form interno) */}
        {method === "tarjeta" && !showNewCardForm && (
          <Button
            onClick={handleUseExistingCard}
            disabled={!selectedCardId}
            className="flex-1 h-12 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-elevated hover:shadow-glow transition-all disabled:opacity-50"
          >
            Confirmar y pagar
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}

        {/* SPEI: verificar pago (falla primer intento, éxito en segundo) */}
        {method === "spei" && (
          <Button
            onClick={handleSpeiVerify}
            disabled={speiVerifying}
            className="flex-1 h-12 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-elevated hover:shadow-glow transition-all disabled:opacity-70"
          >
            {speiVerifying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verificando...
              </>
            ) : speiAttempts === 1 ? (
              <>
                <AlertCircle className="w-4 h-4 mr-2" />
                Reintentar verificación
              </>
            ) : (
              "Verificar pago"
            )}
          </Button>
        )}

        {/* Wallet */}
        {method === "wallet" && (
          <Button
            onClick={handleWalletConfirm}
            disabled={showNewWalletForm && !walletEmail}
            className="flex-1 h-12 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-elevated hover:shadow-glow transition-all disabled:opacity-50"
          >
            {showNewWalletForm ? "Vincular y pagar" : "Confirmar y pagar"}
          </Button>
        )}

        {/* OXXO PAY: verificar pago (falla primer intento, éxito en segundo) */}
        {method === "oxxo" && (
          <Button
            onClick={handleOxxoVerify}
            disabled={oxxoVerifying}
            className="flex-1 h-12 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-elevated hover:shadow-glow transition-all disabled:opacity-70"
          >
            {oxxoVerifying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verificando...
              </>
            ) : oxxoAttempts === 1 ? (
              <>
                <AlertCircle className="w-4 h-4 mr-2" />
                Reintentar verificación
              </>
            ) : (
              "Verificar pago"
            )}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default PaymentDetailStep;

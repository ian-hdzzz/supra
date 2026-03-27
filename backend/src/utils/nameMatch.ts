/**
 * Compara un nombre ingresado con el titular del contrato.
 * Métodos: exacto, normalizado, por iniciales.
 */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z\s]/g, "")
    .trim();
}

function tokenize(str: string): string[] {
  return normalize(str).split(/\s+/).filter(Boolean);
}

export interface MatchResult {
  validated: boolean;
  confidence: number;
  method: string;
}

export function matchName(input: string, titular: string): MatchResult {
  const normInput = normalize(input);
  const normTitular = normalize(titular);

  // Exacto
  if (normInput === normTitular) {
    return { validated: true, confidence: 1.0, method: "exact" };
  }

  // Tokens: al menos 2 palabras del input están en el titular
  const tokensInput = tokenize(input);
  const tokensTitular = tokenize(titular);
  const matches = tokensInput.filter((t) => tokensTitular.includes(t));
  const ratio = matches.length / Math.max(tokensInput.length, tokensTitular.length);

  if (ratio >= 0.6) {
    return { validated: true, confidence: ratio, method: "partial" };
  }

  // Iniciales: "M.G.T.H" o "MGTH"
  const initialsInput = tokensInput.map((t) => t[0]).join("");
  const initialsTitular = tokensTitular.map((t) => t[0]).join("");
  if (initialsInput === initialsTitular) {
    return { validated: true, confidence: 0.75, method: "initials" };
  }

  return { validated: false, confidence: ratio, method: "no_match" };
}

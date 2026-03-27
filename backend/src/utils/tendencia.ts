/**
 * Calcula tendencia comparando promedio de los 3 meses más recientes
 * vs los 3 meses más antiguos. Umbral: ±10%
 */
export function calcularTendencia(
  consumosMesDesc: number[] // ordenados del más reciente al más antiguo
): "aumentando" | "disminuyendo" | "estable" {
  if (consumosMesDesc.length < 6) return "estable";

  const recientes = consumosMesDesc.slice(0, 3);
  const antiguos = consumosMesDesc.slice(-3);

  const promedioReciente = recientes.reduce((a, b) => a + b, 0) / 3;
  const promedioAntiguo = antiguos.reduce((a, b) => a + b, 0) / 3;

  if (promedioAntiguo === 0) return "estable";

  const cambio = (promedioReciente - promedioAntiguo) / promedioAntiguo;

  if (cambio > 0.1) return "aumentando";
  if (cambio < -0.1) return "disminuyendo";
  return "estable";
}

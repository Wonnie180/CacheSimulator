export function esPotenciaDe2(numero: number): boolean {
  return numero != 0 && (numero & (numero - 1)) === 0;
}

export function obtenerCuantosBitsHayEnNumero(numero: number): number {
  if (numero == 0) return 1;

  return Math.floor(Math.log2(Math.abs(numero))) + 1;
}

export function obtenerNumeroBitsParaNConjuntos(
  numeroConjuntos: number,
): number {
  if (numeroConjuntos <= 1) return 0;
  return Math.ceil(Math.log2(numeroConjuntos));
}

export function calcularBitsLineaYConjunto(
  tamanoLineas: number,
  numeroConjuntos: number,
): { bitMaxLinea: number; bitMaxConjunto: number } {
  const bits_linea = obtenerNumeroBitsParaNConjuntos(tamanoLineas);
  const bits_conjunto = obtenerNumeroBitsParaNConjuntos(numeroConjuntos);

  const bitMaxLinea: number = bits_linea > 0 ? bits_linea - 1 : 0;
  const bitMaxConjunto: number = bitMaxLinea + bits_conjunto;

  return { bitMaxLinea, bitMaxConjunto };
}

export function rangoBits(
  bits: number,
  bitMenor: number,
  bitMayor: number,
  tamanoDireccion: number,
): number {
  if (bitMenor < 0 || bitMenor > tamanoDireccion - 1)
    throw new Error("Error: bitMenor fuera de rango");

  if (bitMayor < 0 || bitMayor > tamanoDireccion - 1)
    throw new Error("Error: bitMayor fuera de rango");

  if (bitMenor > bitMayor)
    throw new Error("Error: bitMenor mayor que bitMayor");

  let valorBitEnRango = bits >> bitMenor;
  const mascara = (1 << (bitMayor - bitMenor + 1)) - 1;
  valorBitEnRango &= mascara;

  return valorBitEnRango;
}

export function CalcularTAGCache(
  direccion: number,
  bitMaxLinea: number,
  bitMaxConjunto: number,
  numeroConjuntos: number,
  tamanoDireccion: number,
): number {
  const bitsMaxTAG = tamanoDireccion - 1;

  if (numeroConjuntos === 1)
    return rangoBits(direccion, bitMaxLinea + 1, bitsMaxTAG, tamanoDireccion);

  if (bitMaxConjunto >= bitsMaxTAG) return 0;

  return rangoBits(direccion, bitMaxConjunto + 1, bitsMaxTAG, tamanoDireccion);
}

export function CalcularTAGVictimCache(
  TAG: number,
  idConjunto: number,
  numeroConjuntos: number,
) {
  const bitsConjunto = obtenerNumeroBitsParaNConjuntos(numeroConjuntos);

  return (TAG << bitsConjunto) | idConjunto;
}

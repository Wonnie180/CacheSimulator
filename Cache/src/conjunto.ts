import { esPotenciaDe2 } from "./calculo_bits";
import LineaCache from "./linea_cache";

export default class ConjuntoCache {
  id: number;
  lineas: LineaCache[];

  constructor(id: number, asociatividad: number) {
    if (!esPotenciaDe2(asociatividad))
      throw new Error("La asociatividad no es una potencia de 2");

    this.id = id;
    this.lineas = [];

    for (let i = 0; i < asociatividad; i++) {
      this.lineas.push(new LineaCache());
    }
  }

  ActualizarAntiguedad() {
    this.lineas.forEach((linea) => linea.antiguedad++);
  }

  ObtenerLineaMasAntigua(): LineaCache {
    let lineaMasAntigua = this.lineas[0];

    for (const linea of this.lineas) {
      if (!linea.activa) return linea;

      if (linea.antiguedad > lineaMasAntigua.antiguedad)
        lineaMasAntigua = linea;
    }

    return lineaMasAntigua;
  }

  LRU(TAG: number): LineaCache {
    const linea = this.ObtenerLineaMasAntigua();

    linea.TAG = TAG;
    linea.antiguedad = 0;
    linea.activa = true;

    return linea;
  }

  BuscarLinea(TAG: number): LineaCache | null {
    const linea = this.lineas.find(
      (linea) => linea.TAG === TAG && linea.activa,
    );

    if (!linea) return null;

    this.ActualizarAntiguedad();
    linea.antiguedad = 0;
    return linea;
  }

  SobrescribirLinea(TAG: number, lineaAntigua: LineaCache): LineaCache {
    const indice = this.lineas.indexOf(lineaAntigua);

    if (indice === -1) throw new Error("La línea no pertenece a este conjunto");

    const linea = new LineaCache();
    linea.TAG = TAG;
    linea.antiguedad = 0;
    linea.activa = true;

    this.lineas[indice] = linea;

    return linea;
  }

  MostrarContenido(baseNumero: number): string {
    return this.lineas
      .map((linea) => linea.MostrarContenido(baseNumero))
      .join("\n");
  }
}

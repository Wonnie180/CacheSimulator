import {
  calcularBitsLineaYConjunto,
  CalcularTAGCache,
  CalcularTAGVictimCache,
  esPotenciaDe2,
  rangoBits,
} from "./calculo_bits";
import ConjuntoCache from "./conjunto";
import LineaCache from "./linea_cache";

export default class SimulatedCache {
  readonly TAMANO_DIRECCION: number = 32;
  readonly tamanoLineas: number;
  readonly bitMaxLinea: number;
  readonly bitMaxConjunto: number;
  readonly conjuntos: readonly ConjuntoCache[];
  readonly victimCache: SimulatedCache | null = null;

  hits: number;
  misses: number;

  constructor(
    numeroLineas: number,
    tamanoLineas: number,
    asociatividad: number,
    numeroLineasVC: number,
    tamanoDireccion?: number,
  ) {
    if (!esPotenciaDe2(numeroLineas))
      throw new Error("El número de líneas no es una potencia de 2");

    if (!esPotenciaDe2(tamanoLineas))
      throw new Error("El tamaño de línea no es una potencia de 2");

    if (!esPotenciaDe2(asociatividad))
      throw new Error("La asociatividad no es una potencia de 2");

    if (numeroLineasVC > 0 && !esPotenciaDe2(numeroLineasVC))
      throw new Error("El número de líneas de la VC no es una potencia de 2");

    this.hits = 0;
    this.misses = 0;
    this.TAMANO_DIRECCION = tamanoDireccion
      ? tamanoDireccion
      : this.TAMANO_DIRECCION;
    this.tamanoLineas = tamanoLineas;
    this.conjuntos = this.GenerarConjuntos(numeroLineas, asociatividad);

    const { bitMaxLinea, bitMaxConjunto } = calcularBitsLineaYConjunto(
      tamanoLineas,
      this.conjuntos.length,
    );
    this.bitMaxLinea = bitMaxLinea;
    this.bitMaxConjunto = bitMaxConjunto;

    if (numeroLineasVC > 0)
      this.victimCache = new SimulatedCache(
        numeroLineasVC,
        tamanoLineas,
        numeroLineasVC,
        0,
        this.TAMANO_DIRECCION,
      );
  }

  ObtenerConjuntoDeDireccion(direccion: number): ConjuntoCache {
    if (this.conjuntos.length === 1) return this.conjuntos[0];

    return this.conjuntos[
      rangoBits(
        direccion,
        this.bitMaxLinea + 1,
        this.bitMaxConjunto,
        this.TAMANO_DIRECCION,
      )
    ];
  }

  ObtenerLineaDeDireccion(direccion: number): LineaCache | null {
    const TAG = CalcularTAGCache(
      direccion,
      this.bitMaxLinea,
      this.bitMaxConjunto,
      this.conjuntos.length,
      this.TAMANO_DIRECCION,
    );
    const conjunto = this.ObtenerConjuntoDeDireccion(direccion);
    const linea = conjunto.BuscarLinea(TAG);

    if (linea) {
      this.hits++;
      return linea;
    }

    if (!this.victimCache) {
      this.misses++;
      conjunto.LRU(TAG);
      return null;
    }

    return this.ObtenerLineaDeVictimCache(direccion, conjunto, TAG);
  }

  MostrarContenido(baseNumero: number = 10): string {
    let resultado = "Cache:\n";

    for (const conjunto of this.conjuntos) {
      resultado += `Conjunto ${conjunto.id.toString(baseNumero)}:\n`;
      resultado += `${conjunto.MostrarContenido(baseNumero)}\n`;
    }

    if (this.victimCache) {
      resultado += `\nVictim Cache:\n`;
      resultado += `${this.victimCache.MostrarContenido(baseNumero)}\n`;
    }

    return resultado;
  }

  private GenerarConjuntos(
    numeroLineas: number,
    asociatividad: number,
  ): ConjuntoCache[] {
    const numeroConjuntos: number = numeroLineas / asociatividad;
    const conjuntos: ConjuntoCache[] = [];

    for (let i = 0; i < numeroConjuntos; i++) {
      conjuntos.push(new ConjuntoCache(i, asociatividad));
    }

    return conjuntos;
  }

  private ObtenerLineaDeVictimCache(
    direccion: number,
    conjunto: ConjuntoCache,
    TAG: number,
  ): LineaCache | null {
    if (!this.victimCache) return null;

    const TAGVictimCache = CalcularTAGVictimCache(
      TAG,
      conjunto.id,
      this.conjuntos.length,
    );
    const conjuntoVictimCache =
      this.victimCache.ObtenerConjuntoDeDireccion(direccion);
    const lineaVictimCache = conjuntoVictimCache.BuscarLinea(TAGVictimCache);

    if (lineaVictimCache)
      return this.HitEnVictimCache(
        conjunto,
        TAG,
        conjuntoVictimCache,
        lineaVictimCache,
      );

    return this.MissEnVictimCache(conjunto, TAG, conjuntoVictimCache);
  }

  private HitEnVictimCache(
    conjunto: ConjuntoCache,
    TAG: number,
    conjuntoVictimCache: ConjuntoCache,
    lineaVictimCache: LineaCache,
  ): LineaCache {
    this.hits++;

    const lineaMasAntigua = conjunto.ObtenerLineaMasAntigua();
    const lineaSobreescrita = conjunto.SobrescribirLinea(TAG, lineaMasAntigua);

    if (lineaMasAntigua.activa) {
      conjuntoVictimCache.SobrescribirLinea(
        CalcularTAGVictimCache(
          lineaMasAntigua.TAG,
          conjunto.id,
          this.conjuntos.length,
        ),
        lineaVictimCache,
      );

      return lineaSobreescrita;
    }

    lineaVictimCache.activa = false;
    return lineaSobreescrita;
  }

  private MissEnVictimCache(
    conjunto: ConjuntoCache,
    TAG: number,
    conjuntoVictimCache: ConjuntoCache,
  ): null {
    this.misses++;

    const lineaMasAntigua = conjunto.ObtenerLineaMasAntigua();

    if (lineaMasAntigua.activa) {
      const lineaMasAntiguaVictimCache =
        conjuntoVictimCache.ObtenerLineaMasAntigua();
      conjuntoVictimCache.SobrescribirLinea(
        CalcularTAGVictimCache(
          lineaMasAntigua.TAG,
          conjunto.id,
          this.conjuntos.length,
        ),
        lineaMasAntiguaVictimCache,
      );
    }

    conjunto.LRU(TAG);
    return null;
  }
}

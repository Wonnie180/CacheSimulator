import { calcularBitsLineaYConjunto, esPotenciaDe2, obtenerNumeroBitsParaNConjuntos, rangoBits } from "./calculo_bits";
import VictimCache from "./victim_cache";
import ConjuntoCache from "./conjunto";

export default class SimulatedCache {
    readonly TAMANO_DIRECCION: number = 32;
    readonly tamanoLineas: number;
    readonly bitMaxLinea: number;
    readonly bitMaxConjunto: number;
    readonly conjuntos: readonly ConjuntoCache[];
    readonly victimCache: VictimCache | null = null;

    hits: number;
    misses: number;

    constructor(numeroLineas: number, tamanoLineas: number, asociatividad: number,
        numeroLineasVC: number, tamanoDireccion?: number) {

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
        this.TAMANO_DIRECCION = tamanoDireccion ? tamanoDireccion : this.TAMANO_DIRECCION;
        this.tamanoLineas = tamanoLineas;
        this.conjuntos = this.GenerarConjuntos(numeroLineas, asociatividad);

        const { bitMaxLinea, bitMaxConjunto } = calcularBitsLineaYConjunto(tamanoLineas, this.conjuntos.length);
        this.bitMaxLinea = bitMaxLinea;
        this.bitMaxConjunto = bitMaxConjunto;

        if (numeroLineasVC > 0)        
            this.victimCache = new VictimCache();
    }

    ObtenerConjuntoDeDireccion(direccion: number): ConjuntoCache {     
        if (this.conjuntos.length === 1) return this.conjuntos[0];

        return this.conjuntos[rangoBits(direccion, this.bitMaxLinea + 1, this.bitMaxConjunto, this.TAMANO_DIRECCION)];
    }

    ObtenerLineaDeDireccion(direccion: number): void {
        const bitsMaxTAG = obtenerNumeroBitsParaNConjuntos(direccion);
        const TAG =
            this.conjuntos.length === 1 ?
                rangoBits(direccion, this.bitMaxLinea + 1, bitsMaxTAG, this.TAMANO_DIRECCION)
                : this.bitMaxConjunto < bitsMaxTAG ?
                    rangoBits(direccion, this.bitMaxConjunto + 1, bitsMaxTAG, this.TAMANO_DIRECCION)
                    : 0;

        const conjunto = this.ObtenerConjuntoDeDireccion(direccion);
        const linea = conjunto.BuscarLinea(TAG);

        if (!linea) {
            this.misses++;
            conjunto.LRU(TAG);
            return;
        }

        this.hits++;
    }

    private GenerarConjuntos(numeroLineas: number, asociatividad: number): ConjuntoCache[] {
        const numeroConjuntos: number = numeroLineas / asociatividad;
        const conjuntos: ConjuntoCache[] = [];

        for (let i = 0; i < numeroConjuntos; i++) {
            conjuntos.push(new ConjuntoCache(i, asociatividad));
        }

        return conjuntos;
    }
} 
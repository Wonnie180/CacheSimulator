import { calcularBitsLineaYConjunto, esPotenciaDe2, obtenerNumeroBitsParaNConjuntos, rangoBits } from "./calculo_bits";
import VictimCache from "./victim_cache";
import ConjuntoCache from "./conjunto";

export default class SimulatedCache {
    TAMANO_DIRECCION: number = 32;

    conjuntos: ConjuntoCache[];
    hits: number;
    misses: number;
    tamanoLineas: number;
    victimCache: VictimCache | null = null;

    bitMaxLinea: number;
    bitMaxConjunto: number;

    constructor(numeroLineas: number, tamanoLineas: number, asociatividad: number,
        numeroLineasVC: number, tamanoDireccion?: number) {

        if (asociatividad < 1) asociatividad = 1;

        if (!esPotenciaDe2(numeroLineas))
            throw new Error("El número de líneas no es una potencia de 2");

        if (!esPotenciaDe2(tamanoLineas))
            throw new Error("El tamaño de línea no es una potencia de 2");

        if (!esPotenciaDe2(asociatividad))
            throw new Error("La asociatividad no es una potencia de 2");

        this.hits = 0;
        this.misses = 0;
        this.TAMANO_DIRECCION = tamanoDireccion ? tamanoDireccion : this.TAMANO_DIRECCION;
        this.tamanoLineas = tamanoLineas;
        this.conjuntos = this.GenerarConjuntos(numeroLineas, asociatividad);

        const { bitMaxLinea, bitMaxConjunto } = calcularBitsLineaYConjunto(tamanoLineas, this.conjuntos.length);
        this.bitMaxLinea = bitMaxLinea;
        this.bitMaxConjunto = bitMaxConjunto;



        if (numeroLineasVC > 0) {
            if (!esPotenciaDe2(numeroLineasVC))
                throw new Error("El número de líneas de la VC no es una potencia de 2");

            this.victimCache = new VictimCache();
        }
    }

    ObtenerConjuntoDeDireccion(direccion: number): ConjuntoCache {
        if (this.conjuntos.length === 1) return this.conjuntos[0];

        return this.conjuntos[rangoBits(direccion, this.bitMaxLinea + 1, this.bitMaxConjunto, this.TAMANO_DIRECCION)];
    }

    ObtenerLineaDeDireccion(direccion: number): void {
        const conjunto = this.ObtenerConjuntoDeDireccion(direccion);

        const bitsMaxTAG = obtenerNumeroBitsParaNConjuntos(direccion);
        let TAG = 0;

        if (this.conjuntos.length === 1)
            TAG = TAG = rangoBits(direccion, this.bitMaxLinea + 1, bitsMaxTAG, this.TAMANO_DIRECCION);
        else if (this.bitMaxConjunto < bitsMaxTAG)
            TAG = rangoBits(direccion, this.bitMaxConjunto + 1, bitsMaxTAG, this.TAMANO_DIRECCION);

        const linea = conjunto.BuscarLinea(TAG);
        conjunto.ActualizarAntiguedad();

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
            conjuntos.push(new ConjuntoCache(i, this.tamanoLineas));
        }

        return conjuntos;
    }

} 
import { esPotenciaDe2, obtenerNumeroBitsNecesarios, rangoBits } from "./calculo_bits";
import VictimCache from "./victim_cache";
import ConjuntoCache from "./conjunto";

export default class SimulatedCache {
    TAMANO_DIRECCION: number = 32;

    conjuntos: ConjuntoCache[];
    hits: number;
    misses: number;
    tamanoLineas: number;
    victimCache: VictimCache;

    bit_max_linea: number;
    bit_max_conjunto: number;

    constructor(numeroLineas: number, tamanoLineas: number, asociatividad: number, 
                numeroLineasVC: number, tamanoDireccion: number){
       
        if (asociatividad < 1) asociatividad = 1;

        if (!esPotenciaDe2(numeroLineas))
            throw new Error("El número de líneas no es una potencia de 2");

        if (!esPotenciaDe2(tamanoLineas))
            throw new Error("El tamaño de línea no es una potencia de 2");

        if (!esPotenciaDe2(asociatividad))
            throw new Error("La asociatividad no es una potencia de 2");

        this.hits = 0;
        this.misses = 0;
        this.tamanoLineas = tamanoLineas;
        this.conjuntos = this.GenerarConjuntos(numeroLineas, asociatividad);
        this.CalcularBitsLineaYConjunto();

        if (numeroLineasVC > 0) {
            if (!esPotenciaDe2(numeroLineasVC))
                throw new Error("El número de líneas de la VC no es una potencia de 2");
            
            this.victimCache = new VictimCache();
        }
    }

    ObtenerConjuntoDeDireccion(direccion: number): ConjuntoCache {
        if (this.conjuntos.length === 1) return this.conjuntos[0];

        return this.conjuntos[rangoBits(direccion, this.bit_max_linea+1, this.bit_max_conjunto, this.TAMANO_DIRECCION)];
    }

    CalcularTAG_VC(TAG: number, idConjunto:number): number {
        const numeroConjuntos: number = this.conjuntos.length
        const TAG_VC = (TAG <<= obtenerNumeroBitsNecesarios(numeroConjuntos)) | idConjunto;

        return TAG_VC; 
    }

    private CalcularBitsLineaYConjunto() {
        this.bit_max_linea = obtenerNumeroBitsNecesarios(this.tamanoLineas);
        
        if (this.bit_max_linea > 0)
            this.bit_max_linea -= 1;

        this.bit_max_conjunto = obtenerNumeroBitsNecesarios(this.conjuntos.length) + this.bit_max_linea;
    }

    private GenerarConjuntos(numeroLineas:number, asociatividad: number): ConjuntoCache[] {
        
        const numeroConjuntos: number = numeroLineas / asociatividad;
        const conjuntos: ConjuntoCache[] = [];

        for (let i = 0; i < numeroConjuntos; i++) {
            conjuntos.push(new ConjuntoCache(this.tamanoLineas));
        }

        return conjuntos;
    }
} 
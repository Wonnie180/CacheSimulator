import { obtenerNumeroBitsNecesarios, rangoBits } from "./calculo_bits";

class SimulatedCache {
    conjuntos: ConjuntoCache[];
    hits: number;
    mmisses: number;
    tamanoLineas: number;

    constructor(numeroLineas: number, tamanoLineas: number, asociatividad: number, 
                numeroLineasVC: number, tamanoDireccion: number){
       
        if (asociatividad < 1) asociatividad = 1;

        this.conjuntos = ConjuntoCache[asociatividad];
    }

    ObtenerConjuntoDeDireccion(direccion: number): ConjuntoCache {
        if (this.conjuntos.length === 1) return this.conjuntos[0];

        return this.conjuntos[rangoBits(direccion, bit_max_linea+1, bit_max_conjunto), tamano_maximo];
    }

    CalcularTAG_VC(TAG: number, idConjunto:number): number {
        const numeroConjuntos: number = this.conjuntos.length
        const TAG_VC = (TAG <<= obtenerNumeroBitsNecesarios(numeroConjuntos)) | idConjunto;

        return TAG_VC; 
    }
} 
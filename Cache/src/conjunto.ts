import { obtenerNumeroBitsParaNConjuntos } from "./calculo_bits";
import LineaCache from "./linea_cache";

export default class ConjuntoCache {
    id: number;
    lineas: LineaCache[]

    constructor(id: number, numeroLineas: number) {
        this.id = id;
        this.lineas = [];

        for (let i = 0; i < numeroLineas; i++) {
            this.lineas.push(new LineaCache());
        }
    }

    ActualizarAntiguedad() {
        this.lineas.forEach(linea => linea.antiguedad++);
    }

    ObtenerLineaMasAntigua(): LineaCache {
        this.lineas.sort((a, b) => a.antiguedad - b.antiguedad);

        return this.lineas[0];
    }

    LRU(TAG: number) {
        const linea = this.ObtenerLineaMasAntigua();

        linea.TAG = TAG;
        linea.antiguedad = 0;
        linea.activa = true;
    }

    BuscarLinea(TAG: number): LineaCache | null {
        const linea = this.lineas.find(linea => linea.TAG === TAG && linea.activa);

        if (!linea) return null;

        linea.antiguedad = 0;
        
        return linea;
    }
}
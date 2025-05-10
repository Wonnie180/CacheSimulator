import { esPotenciaDe2, obtenerNumeroBitsParaNConjuntos } from "./calculo_bits";
import LineaCache from "./linea_cache";

export default class ConjuntoCache {
    id: number;
    lineas: LineaCache[]

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
        this.lineas.forEach(linea => linea.antiguedad++);
    }

    ObtenerLineaMasAntigua(): LineaCache {
        return this.lineas.reduce((min, current) =>
            current.antiguedad < min.antiguedad ? current : min
        );
    }

    LRU(TAG: number) {
        const linea = this.ObtenerLineaMasAntigua();

        linea.TAG = TAG;
        linea.antiguedad = 0;
        linea.activa = true;
    }

    BuscarLinea(TAG: number): LineaCache | null {
        const linea = this.lineas.find(linea => linea.TAG === TAG && linea.activa);
        this.ActualizarAntiguedad();

        if (!linea) return null;

        linea.antiguedad = 0;

        return linea;
    }
}
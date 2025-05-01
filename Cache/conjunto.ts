class ConjuntoCache {
    id: number;
    lineas: LineaCache[]

    constructor(numeroLineas: number){
        this.id = 0;
        this.lineas = LineaCache[numeroLineas];
    }

    ActualizarAntiguedad(){
        this.lineas.forEach(linea => linea.antiguedad++);
    }

    ObtenerLineaMasAntigua(): LineaCache {
        this.lineas.sort((a, b) => a.antiguedad - b.antiguedad);
        
        return this.lineas[0];
    }

    LRU(TAG: number){
        const linea = this.ObtenerLineaMasAntigua();

        linea.TAG = TAG;
        linea.antiguedad = 0;
        linea.activa = true;
    }
}
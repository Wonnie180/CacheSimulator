import SimulatedCache from "./cache";

export function main(){
    console.log("Cache Simulator");
    console.log("Version 1.0");
    console.log("Author: Your Name");
    console.log("Date: 2023-10-01");
    console.log("Description: A simple cache simulator.");
    
    // Initialize cache parameters
    const numeroLineas = 1024;
    const tamanoLineas = 64;
    const asociatividad = 8;
    const numeroLineasVC = 0;
    
    // Create a new cache instance
    const cache = new SimulatedCache(numeroLineas, tamanoLineas, asociatividad, numeroLineasVC);
    
    // Example usage
    const direccion = 0x87654321;
    const conjunto = cache.ObtenerConjuntoDeDireccion(direccion);
    console.log(`Numero Conjuntos: ${cache.conjuntos.length}`);
    console.log(`bitMaxLinea: ${cache.bitMaxLinea}; bitMaxConjunto: ${cache.bitMaxConjunto}`);
    console.log(`bits direccion: ${direccion.toString(2)/*.padStart(cache.TAMANO_DIRECCION, '0')*/}`);
    console.log(`Conjunto para la dirección ${direccion.toString(16)}: ${conjunto.id}`);
}

if (require.main === module) {
    main();
}
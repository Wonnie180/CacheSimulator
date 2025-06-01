import SimulatedCache from "./cache";

export function main() {
  const numeroLineas = 2;
  const tamanoLineas = 32;
  const asociatividad = 1;
  const numeroLineasVC = 0;

  const cache = new SimulatedCache(
    numeroLineas,
    tamanoLineas,
    asociatividad,
    numeroLineasVC,
  );

  const direccion = 0x4321;
  const conjunto = cache.ObtenerConjuntoDeDireccion(direccion);
  cache.ObtenerLineaDeDireccion(direccion);
  console.log(`Numero Conjuntos: ${cache.conjuntos.length}`);
  console.log(
    `bitMaxLinea: ${cache.bitMaxLinea}; bitMaxConjunto: ${cache.bitMaxConjunto}`,
  );
  console.log(
    `bits direccion: ${direccion.toString(2).padStart(cache.TAMANO_DIRECCION, "0")}`,
  );
  console.log(
    `Conjunto para la dirección 0x${direccion.toString(16)}: ${conjunto.id}`,
  );
  console.log(cache.MostrarContenido());
}

if (require.main === module) {
  main();
}

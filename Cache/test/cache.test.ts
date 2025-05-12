import SimulatedCache from '../src/cache';
import { CalcularTAGCache, CalcularTAGVictimCache } from '../src/calculo_bits';

describe('cache.ts', () => {
    describe('Cache', () => {
        test.each([
            { numeroLineas: 1, tamanoLineas: 1, asociatividad: 1, numeroLineasVC: 0 },
            { numeroLineas: 2, tamanoLineas: 2, asociatividad: 1, numeroLineasVC: 0 },
            { numeroLineas: 4, tamanoLineas: 4, asociatividad: 1, numeroLineasVC: 0 },
            { numeroLineas: 8, tamanoLineas: 8, asociatividad: 1, numeroLineasVC: 0 },
            { numeroLineas: 16, tamanoLineas: 16, asociatividad: 1, numeroLineasVC: 0 },
            { numeroLineas: 16, tamanoLineas: 16, asociatividad: 1, numeroLineasVC: 1 },
            { numeroLineas: 16, tamanoLineas: 16, asociatividad: 1, numeroLineasVC: 16 },
        ])('Construye correctamente', ({ numeroLineas, tamanoLineas, asociatividad, numeroLineasVC }) => {
            const cache = new SimulatedCache(numeroLineas, tamanoLineas, asociatividad, numeroLineasVC);

            expect(cache.hits).toBe(0);
            expect(cache.misses).toBe(0);
            expect(cache.TAMANO_DIRECCION).toBe(32);
            expect(cache.tamanoLineas).toBe(tamanoLineas);
            expect(cache.conjuntos.length).toBe(numeroLineas / asociatividad);
        });

        test.each([
            { numeroLineas: 1, asociatividad: 1, bitMaxLinea: 6, bitMaxConjunto: 6 },
            { numeroLineas: 2, asociatividad: 1, bitMaxLinea: 6, bitMaxConjunto: 7 },
            { numeroLineas: 4, asociatividad: 2, bitMaxLinea: 6, bitMaxConjunto: 7 },
            { numeroLineas: 8, asociatividad: 4, bitMaxLinea: 6, bitMaxConjunto: 7 },
            { numeroLineas: 8, asociatividad: 1, bitMaxLinea: 6, bitMaxConjunto: 9 },
            { numeroLineas: 16, asociatividad: 4, bitMaxLinea: 6, bitMaxConjunto: 8 },
            { numeroLineas: 128, asociatividad: 128, bitMaxLinea: 6, bitMaxConjunto: 6 },
            { numeroLineas: 16, asociatividad: 16, bitMaxLinea: 6, bitMaxConjunto: 6 }
        ])('Calcula correctamente las propiedades bitMaxLinea y bitMaxConjunto', ({ numeroLineas, asociatividad, bitMaxLinea, bitMaxConjunto }) => {
            const tamanoLineas = 128;
            const cache = new SimulatedCache(numeroLineas, tamanoLineas, asociatividad, 0);

            expect(cache.tamanoLineas).toBe(tamanoLineas);
            expect(cache.conjuntos.length).toBe(numeroLineas / asociatividad);
            expect(cache.bitMaxLinea).toBe(bitMaxLinea);
            expect(cache.bitMaxConjunto).toBe(bitMaxConjunto);
        });

        test.each([
            // Configuración 1: numeroLineas = 512, asociatividad = 4        
            { direccion: 0x12345678, numeroLineas: 512, asociatividad: 4, conjuntoEsperado: 89 },  // 0x12345678 = 0001001000110100010|1011001|111000
            { direccion: 0x87654321, numeroLineas: 512, asociatividad: 4, conjuntoEsperado: 12 },  // 0x87654321 = 1000011101100101010|0001100|100001
            { direccion: 0xFFFFFFFF, numeroLineas: 512, asociatividad: 4, conjuntoEsperado: 127 }, // 0xFFFFFFFF = 1111111111111111111|1111111|111111
            { direccion: 0x00000000, numeroLineas: 512, asociatividad: 4, conjuntoEsperado: 0 },   // 0x00000000 = 0000000000000000000|0000000|0000000

            // Configuración 2: numeroLineas = 256, asociatividad = 8                               
            { direccion: 0x12345678, numeroLineas: 256, asociatividad: 8, conjuntoEsperado: 25 }, // 0x12345678 = 000100100011010001010|11001|111000
            { direccion: 0x87654321, numeroLineas: 256, asociatividad: 8, conjuntoEsperado: 12 }, // 0x87654321 = 100001110110010101000|01100|100001
            { direccion: 0xFFFFFFFF, numeroLineas: 256, asociatividad: 8, conjuntoEsperado: 31 }, // 0xFFFFFFFF = 111111111111111111111|11111|111111
            { direccion: 0x00000000, numeroLineas: 256, asociatividad: 8, conjuntoEsperado: 0 },  // 0x00000000 = 000000000000000000000|00000|0000000

            // Configuración 3: numeroLineas = 2048, asociatividad = 32
            { direccion: 0x12345678, numeroLineas: 2048, asociatividad: 32, conjuntoEsperado: 25 }, // 0x12345678 = 00010010001101000101|011001|111000
            { direccion: 0x87654321, numeroLineas: 2048, asociatividad: 32, conjuntoEsperado: 12 }, // 0x87654321 = 10000111011001010100|001100|100001
            { direccion: 0xFFFFFFFF, numeroLineas: 2048, asociatividad: 32, conjuntoEsperado: 63 }, // 0xFFFFFFFF = 11111111111111111111|111111|111111
            { direccion: 0x00000000, numeroLineas: 2048, asociatividad: 32, conjuntoEsperado: 0 },  // 0x00000000 = 00000000000000000000|000000|0000000

            // Configuración 4: numeroLineas = 64, asociatividad = 64
            { direccion: 0x12345678, numeroLineas: 64, asociatividad: 64, conjuntoEsperado: 0 },
            { direccion: 0x87654321, numeroLineas: 64, asociatividad: 64, conjuntoEsperado: 0 },
            { direccion: 0xFFFFFFFF, numeroLineas: 64, asociatividad: 64, conjuntoEsperado: 0 },
            { direccion: 0x00000000, numeroLineas: 64, asociatividad: 64, conjuntoEsperado: 0 },

            // Configuración 5: numeroLineas = 1024, asociatividad = 8
            { direccion: 0x12345678, numeroLineas: 1024, asociatividad: 8, conjuntoEsperado: 89 },  // 0x12345678 = 0001001000110100010|1011001|111000
            { direccion: 0x87654321, numeroLineas: 1024, asociatividad: 8, conjuntoEsperado: 12 },  // 0x87654321 = 1000011101100101010|0001100|100001
            { direccion: 0xFFFFFFFF, numeroLineas: 1024, asociatividad: 8, conjuntoEsperado: 127 }, // 0xFFFFFFFF = 1111111111111111111|1111111|111111
            { direccion: 0x00000000, numeroLineas: 1024, asociatividad: 8, conjuntoEsperado: 0 },   // 0x00000000 = 0000000000000000000|0000000|0000000
        ])(
            'Calcula correctamente la dirección del conjunto',
            ({ direccion, numeroLineas, asociatividad, conjuntoEsperado }) => {
                const tamanoLineas = 64;
                const numeroLineasVC = 0;

                const cache = new SimulatedCache(numeroLineas, tamanoLineas, asociatividad, numeroLineasVC);

                const conjunto = cache.ObtenerConjuntoDeDireccion(direccion);
                expect(conjunto.id).toBe(conjuntoEsperado);
            }
        );

        test.each([
            { numeroHits: 1 },
            { numeroHits: 2 },
        ])('Contabiliza los hit correctamente', ({ numeroHits }) => {
            const numeroLineas = 1024;
            const tamanoLineas = 64;
            const asociatividad = 8;
            const numeroLineasVC = 0;
            const direccion = 0x12345678;

            const cache = new SimulatedCache(numeroLineas, tamanoLineas, asociatividad, numeroLineasVC);

            for (let i = 0; i <= numeroHits; i++)
                cache.ObtenerLineaDeDireccion(direccion);

            expect(cache.hits).toBe(numeroHits);
        });

        test.each([
            { numeroMisses: 1 },
            { numeroMisses: 2 },
        ])('Contabiliza los miss correctamente', ({ numeroMisses }) => {
            const numeroLineas = 1024;
            const tamanoLineas = 64;
            const asociatividad = 1;
            const numeroLineasVC = 0;

            const cache = new SimulatedCache(numeroLineas, tamanoLineas, asociatividad, numeroLineasVC);

            for (let i = 0; i < numeroMisses; i++)
                cache.ObtenerLineaDeDireccion(i * tamanoLineas + 1);

            expect(cache.misses).toBe(numeroMisses);
        });

        test('Verifica reemplazo en la victim cache', () => {
            const numeroLineas = 1;
            const tamanoLineas = 64;
            const asociatividad = 1;
            const numeroLineasVC = 1;
    
            const cache = new SimulatedCache(numeroLineas, tamanoLineas, asociatividad, numeroLineasVC, 64);
    
            const direccion1 = 0x12345678;
            const direccion2 = 0x87654321;
            const direccion3 = 0x57654321;

    
            expect(cache.ObtenerLineaDeDireccion(direccion1)).toBeNull();
            expect(cache.ObtenerLineaDeDireccion(direccion2)).toBeNull();
            expect(cache.ObtenerLineaDeDireccion(direccion1)).not.toBeNull();
            expect(cache.ObtenerLineaDeDireccion(direccion2)).not.toBeNull();

            expect(cache.hits).toBe(2);
            expect(cache.misses).toBe(2);

            cache.ObtenerLineaDeDireccion(direccion3);

            expect(cache.hits).toBe(2);
            expect(cache.misses).toBe(3);

            expect(cache.ObtenerLineaDeDireccion(direccion2)).not.toBeNull();
            expect(cache.ObtenerLineaDeDireccion(direccion3)).not.toBeNull();
            expect(cache.ObtenerLineaDeDireccion(direccion1)).toBeNull();
        });
    });
});
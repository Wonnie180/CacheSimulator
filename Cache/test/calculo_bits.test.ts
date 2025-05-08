import { esPotenciaDe2, obtenerCuantosBitsHayEnNumero, calcularBitsLineaYConjunto, rangoBits, obtenerNumeroBitsParaNConjuntos } from '../src/calculo_bits';

describe('calculo_bits.ts', () => {
    describe('esPotenciaDe2', () => {
        test.each([
            [1, true],
            [2, true],
            [4, true],
            [8, true],
            [0, false],
            [3, false],
            [5, false],
            [6, false],
            [1024, true]
        ])('para el número %d debería devolver %s', (numero, esperado) => {
            expect(esPotenciaDe2(numero)).toBe(esperado);
        });
    });

    describe('obtenerCuantosBitsHayEnNumero', () => {
        test.each([
            [0, 1],
            [-2, 2],
            [1, 1],
            [2, 2],
            [3, 2],
            [7, 3],
            [8, 4],
            [255, 8],
            [256, 9],
            [1023, 10]
        ])('para el número %d debería devolver %d bits necesarios', (numero, esperado) => {
            expect(obtenerCuantosBitsHayEnNumero(numero)).toBe(esperado);
        });
    });

    describe('obtenerNumeroBitsParaNConjuntos', () => {
        test.each([
            [0, 0],
            [1, 1],
            [2, 1],
            [3, 2],
            [4, 2],
            [5, 3],
            [6, 3],
            [7, 3],
            [8, 3],
            [9, 4],
            [15, 4],
            [16, 4],
            [17, 5],
            [31, 5],
            [32, 5],
            [33, 6],
            [63, 6],
            [64, 6],
            [65, 7],
            [100, 7],
            [127, 7],
            [128, 7],
            [129, 8],
            [255, 8],
            [256, 8],
            [300, 9],
            [511, 9],
            [512, 9],
            [1023, 10],
            [1024, 10],
            [1025, 11],
            [2047, 11],
            [2048, 11],
            [1000000, 20],
            [1048575, 20],
            [1048576, 20],
            [1048577, 21]
        ])('para el número %d debería devolver %d bits necesarios', (numero, esperado) => {
            expect(obtenerNumeroBitsParaNConjuntos(numero)).toBe(esperado);
        });
    });

    describe('calcularBitsLineaYConjunto', () => {
        test.each([
            [4, 8, { bitsLinea: 1, bitsConjunto: 4 }],
            [16, 32, { bitsLinea: 3, bitsConjunto: 8 }],
            [1, 1, { bitsLinea: 0, bitsConjunto: 1 }],
        ])(
            'para tamanoLineas %d y numeroConjuntos %d debería devolver %o',
            (tamanoLineas, numeroConjuntos, esperado) => {
                expect(calcularBitsLineaYConjunto(tamanoLineas, numeroConjuntos)).toEqual(esperado);
            }
        );
    });

    describe('rangoBits', () => {
        test.each([
            [0b11111, 0, 3, 32, 0b1111],
            [0b11111, 4, 7, 32, 0b1111],
            [0b11111111, 2, 5, 32, 0b1111],
            [0b1000, 0, 2, 32, 0b00],
            [0b1010101, 0, 4, 32, 0b10101]
        ])(
            'Dado el numero %d, si el rango de bits es de %d a %d con un tamaño de direccion %d debería devolver el valor %d',
            (bits, bitMenor, bitMayor, tamanoDireccion, esperado) => {
                expect(rangoBits(bits, bitMenor, bitMayor, tamanoDireccion)).toBe(esperado);
            }
        );

        test.each([
            [255, -1, 3, 8, 'Error: bitMenor fuera de rango'],
            [255, 8, 3, 8, 'Error: bitMenor fuera de rango'],
            [255, 0, -1, 8, 'Error: bitMayor fuera de rango'],
            [255, 0, 8, 8, 'Error: bitMayor fuera de rango'],
            [255, 4, 3, 8, 'Error: bitMenor mayor que bitMayor'],
        ])(
            'Dado el numero %d, si el rango de bits es de %d a %d con un tamaño de direccion %d debería lanzar el error: %s',
            (bit, bitMenor, bitMayor, tamanoDireccion, mensajeError) => {
                expect(() => rangoBits(bit, bitMenor, bitMayor, tamanoDireccion)).toThrow(mensajeError);
            }
        );
    });
});
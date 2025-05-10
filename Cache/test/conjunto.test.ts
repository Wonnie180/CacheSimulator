import ConjuntoCache from '../src/conjunto';

describe('conjunto.ts', () => {
    describe('ConjuntoCache', () => {
        test.each([
            {id: 0, numeroLineas: 1},
            {id: 1, numeroLineas: 2},
            {id: 2, numeroLineas: 4},
            {id: 3, numeroLineas: 256}           
        ])(' construye correctamente', ({id, numeroLineas}) => {
            const conjunto = new ConjuntoCache(id, numeroLineas);

            expect(conjunto.id).toBe(id);
            expect(conjunto.lineas.length).toBe(numeroLineas);
        });
    });
});
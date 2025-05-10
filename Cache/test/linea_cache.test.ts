import LineaCache  from '../src/linea_cache';

describe('linea_cache.ts', () => {
    describe('LineaCache', () => {
        it(' construye correctamente', () => {
            const cache = new LineaCache();
            
            expect(cache.TAG).toBe(0);
            expect(cache.antiguedad).toBe(0);
            expect(cache.activa).toBe(false);
        });
    });
});
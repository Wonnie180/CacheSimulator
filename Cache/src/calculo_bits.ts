export function esPotenciaDe2(numero: number): boolean{
    return numero != 0 && (numero & (numero - 1)) === 0;
}

export function obtenerCuantosBitsHayEnNumero(numero: number): number {
    if (numero < 0) numero = -numero;
    if (numero == 0) return 1;

    return Math.floor(Math.log2(numero)) + 1;
}


export function obtenerNumeroBitsParaNConjuntos(numeroConjuntos: number): number{
    if (numeroConjuntos < 1) return 0;
    if (numeroConjuntos <= 2) return 1;

    if (esPotenciaDe2(numeroConjuntos))
        numeroConjuntos--;

    return Math.ceil(Math.log2(numeroConjuntos));

}



export function calcularBitsLineaYConjunto(tamanoLineas: number, numeroConjuntos: number): {bitsLinea: number, bitsConjunto: number} {
    let bitsLinea = obtenerNumeroBitsParaNConjuntos(tamanoLineas);

    if (bitsLinea > 0)
        bitsLinea -= 1;

    let bitsConjunto = obtenerNumeroBitsParaNConjuntos(numeroConjuntos) + bitsLinea;

    return {
        bitsLinea: bitsLinea,
        bitsConjunto: bitsConjunto
    };
}

export function rangoBits(bits: number, bitMenor: number, bitMayor: number, tamanoDireccion: number): number {
    let bit1 = 1;
    let bit2 = 1;

    if (bitMenor < 0 || bitMenor > tamanoDireccion - 1) {
        throw new Error("Error: bitMenor fuera de rango");
    }

    if (bitMayor < 0 || bitMayor > tamanoDireccion - 1) {
        throw new Error("Error: bitMayor fuera de rango");
    }

    if (bitMenor > bitMayor) {
        throw new Error("Error: bitMenor mayor que bitMayor");
    }

    let valorBitEnRango = bits;
    const diferenciaRangoBits = bitMayor - bitMenor + 1;

    if (diferenciaRangoBits < tamanoDireccion){
        bit1 <<= bitMenor;
        bit2 <<= diferenciaRangoBits;

        valorBitEnRango / bit1;
        valorBitEnRango = valorBitEnRango % bit2;
    }

    return valorBitEnRango;
}


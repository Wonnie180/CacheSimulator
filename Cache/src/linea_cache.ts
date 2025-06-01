export default class LineaCache {
  TAG: number;
  antiguedad: number;
  activa: boolean;

  constructor() {
    this.TAG = 0;
    this.antiguedad = 0;
    this.activa = false;
  }

  MostrarContenido(baseNumero: number): string {
    return `TAG: ${this.TAG.toString(baseNumero)}, Antiguedad: ${this.antiguedad}, Activa: ${this.activa}`;
  }
}

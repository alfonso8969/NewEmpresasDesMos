import { Descripcion } from "./descripcion";

export class Empresa extends Descripcion {

   Id!: number;

   Nombre: string;

   Sector: string;

   Distrito: string;

   Poligono: string;

   Link?: string;

   Empresa_det_id: number;

   Habilitada: number

  // Constructor, donde debemos pasar todos los datos
  constructor (nombre: string, sector: string, distrito: string, poligono: string, link: string, Empresadetid: number) {
    super();
      this.Nombre = nombre
      this.Sector = sector
      this.Distrito = distrito
      this.Poligono = poligono
      this.Link = link
      this.Empresa_det_id = Empresadetid
      this.Habilitada = 1
  }

}

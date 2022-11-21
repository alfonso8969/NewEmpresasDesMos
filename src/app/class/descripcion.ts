import { Redes } from "./redes";

export class Descripcion extends Redes {

   Empdetid?: number;

   Web?: string;

   Telefono?: string;

   Email?: string;

   Direccion?: string;

   Localidad?: string;

   Provincia?: string;

   Cod_postal?: string;

  // Constructor, donde debemos pasar todos los datos
  constructor(web: string = "Sin datos", telefono: string = "Sin datos", email: string = "Sin datos", direccion: string = "Sin datos", localidad: string = "Sin datos", provincia: string = "Sin datos", codpostal: string = "Sin datos") {
    super();
    this.Web = web;
    this.Telefono = telefono;
    this.Email = email;
    this.Direccion = direccion;
    this.Localidad = localidad;
    this.Provincia = provincia;
    this.Cod_postal = codpostal;
  }

}

import { Empresa } from "./empresa";
import { Redes } from "./redes";

export class Descripcion extends Redes {

   private Empdetid!: number;
   private Telefono: string;
   private OtherTelefono?: string;
   private Email: string;
   private Persona_contacto?: string;
   private Direccion: string;
   private Localidad?: string;
   private Provincia?: string;
   private Cod_postal: string;

     // Constructor, donde debemos pasar todos los datos
  constructor(telefono: string = Empresa.SIN_DATOS, othertelefono: string = Empresa.SIN_DATOS, email: string = Empresa.SIN_DATOS,
    persona_contact: string = Empresa.SIN_DATOS,direccion: string = Empresa.SIN_DATOS, localidad: string = Empresa.SIN_DATOS, provincia: string = Empresa.SIN_DATOS, codpostal: string = Empresa.SIN_DATOS) {
    super();
    this.Telefono = telefono;
    this.OtherTelefono = othertelefono;
    this.Email = email;
    this.Persona_contacto = persona_contact;
    this.Direccion = direccion;
    this.Localidad = localidad;
    this.Provincia = provincia;
    this.Cod_postal = codpostal;
  }

    public getEmpdetid(): number {
        return this.Empdetid;
    }

    public setEmpdetid(Empdetid: number): void {
        this.Empdetid = Empdetid;
    }

    public getTelefono(): string {
        return this.Telefono;
    }

    public setTelefono(Telefono: string): void {
        this.Telefono = Telefono;
    }

    public getOtherTelefono(): string | undefined {
        return this.OtherTelefono;
    }

    public setOtherTelefono(OtherTelefono: string): void {
        this.OtherTelefono = OtherTelefono;
    }

    public getEmail(): string {
        return this.Email;
    }

    public setEmail(Email: string): void {
        this.Email = Email;
    }

    public getPersonaContacto(): string | undefined  {
        return this.Persona_contacto;
    }

    public setPersonaContacto(Persona_contacto: string): void {
        this.Persona_contacto = Persona_contacto;
    }

    public getDireccion(): string {
        return this.Direccion;
    }

    public setDireccion(Direccion: string): void {
        this.Direccion = Direccion;
    }

    public getLocalidad(): string | undefined {
        return this.Localidad;
    }

    public setLocalidad(Localidad: string): void {
        this.Localidad = Localidad;
    }

    public getProvincia(): string | undefined {
        return this.Provincia;
    }

    public setProvincia(Provincia: string): void {
        this.Provincia = Provincia;
    }

    public getCod_postal(): string {
        return this.Cod_postal;
    }

    public setCod_postal(Cod_postal: string): void {
        this.Cod_postal = Cod_postal;
    }

}

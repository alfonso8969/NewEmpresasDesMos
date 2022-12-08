import { Descripcion } from "./descripcion";

export class Empresa extends Descripcion {

    static SIN_DATOS: string = "sin datos";

    public Id!: number;
    public Nombre: string;
    public Sector: string;
    public Distrito?: number;
    public Poligono?: string;
    public Link?: string;
    public Empresa_det_id: number;
    public Habilitada: number
    public fecha_alta?: Date
    public fecha_baja: Date
    public user_id_baja?: number;
    public user_id_alta?: number;

 


    // Constructor, donde debemos pasar todos los datos
    constructor(nombre: string, sector: string, Empresadetid: number, distrito: number = 0, poligono: string = Empresa.SIN_DATOS, link: string = Empresa.SIN_DATOS) {
        super();
        this.Nombre = nombre
        this.Sector = sector
        this.Distrito = distrito
        this.Poligono = poligono
        this.Link = link
        this.Empresa_det_id = Empresadetid
        this.Habilitada = 1
        this.fecha_alta = new Date()
    }

    public getId(): number {
        return this.Id;
    }

    public setId(Id: number): void {
        this.Id = Id;
    }

    public getNombre(): string {
        return this.Nombre;
    }

    public setNombre(Nombre: string): void {
        this.Nombre = Nombre;
    }

    public getSector(): string {
        return this.Sector;
    }

    public setSector(Sector: string): void {
        this.Sector = Sector;
    }

    public getDistrito(): number {
        return this.Distrito || 0;
    }

    public setDistrito(Distrito: number): void {
        this.Distrito = Distrito;
    }

    public getPoligono(): string | undefined {
        return this.Poligono;
    }

    public setPoligono(Poligono: string): void {
        this.Poligono = Poligono;
    }

    public getLink(): string | undefined {
        return this.Link;
    }

    public setLink(Link: string): void {
        this.Link = Link;
    }

    public getEmpresa_det_id(): number {
        return this.Empresa_det_id;
    }

    public setEmpresa_det_id(Empresa_det_id: number): void {
        this.Empresa_det_id = Empresa_det_id;
    }

    public getHabilitada(): number {
        return this.Habilitada;
    }

    public setHabilitada(Habilitada: number): void {
        this.Habilitada = Habilitada;
    }

    public getFecha_alta(): Date | undefined {
        return this.fecha_alta;
    }

    public setFecha_alta(fecha_alta: Date): void {
        this.fecha_alta = fecha_alta;
    }

    public getFecha_baja(): Date {
        return this.fecha_baja;
    }

    public setFecha_baja(fecha_baja: Date): void {
        this.fecha_baja = fecha_baja;
    }

    public getUser_id_baja(): number | undefined {
        return this.user_id_baja;
    }

    public setUser_id_baja(user_id_baja: number): void {
        this.user_id_baja = user_id_baja;
    }

    public getUser_id_alta(): number | undefined {
        return this.user_id_alta;
    }

    public setUser_id_alta(user_id_alta: number): void {
        this.user_id_alta = user_id_alta;
    }
}

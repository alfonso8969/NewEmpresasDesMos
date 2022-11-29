import { Descripcion } from "./descripcion";

export class Empresa extends Descripcion {

    static SIN_DATOS: string = "Sin datos";

    private Id!: number;
    private Nombre: string;
    private Sector: string;
    private Distrito?: number;
    private Poligono?: string;
    private Link?: string;
    private Empresa_det_id: number;
    private Habilitada: number
    private fecha_alta: Date
    private fecha_baja: Date

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

    public getFecha_alta(): Date {
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
}

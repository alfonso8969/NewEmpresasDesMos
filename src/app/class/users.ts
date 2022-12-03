import { Rol } from "./rol";

export class User extends Rol {
    public id_user: number;
    public user_img: string;
    public user_password: string;
    public user_name: string;
    public user_lastName: string;
    public user_phone: string;
    public user_email: string;
    public user_rol: number;
    public habilitado: number;
    public fecha_alta: Date;
    public fecha_baja: Date;

    constructor() {
        super();
    }

    public getId_user(): number {
        return this.id_user;
    }

    public setId_user(id_user: number): void {
        this.id_user = id_user;
    }

    public getUser_img(): string {
        return this.user_img;
    }

    public setUser_img(user_img: string): void {
        this.user_img = user_img;
    }

    public getUser_password(): string {
        return this.user_password;
    }

    public setUser_password(user_password: string): void {
        this.user_password = user_password;
    }

    public getUser_name(): string {
        return this.user_name;
    }

    public setUser_name(user_name: string): void {
        this.user_name = user_name;
    }

    public getUser_lastName(): string {
        return this.user_lastName;
    }

    public setUser_lastName(user_lastName: string): void {
        this.user_lastName = user_lastName;
    }

    public getUser_phone(): string {
        return this.user_phone;
    }

    public setUser_phone(user_phone: string): void {
        this.user_phone = user_phone;
    }

    public getUser_rol(): number {
        return this.user_rol;
    }

    public setUser_rol(user_rol: number): void {
        this.user_rol = user_rol;
    }

    public getHabilitado(): number {
        return this.habilitado;
    }

    public setHabilitado(habilitado: number): void {
        this.habilitado = habilitado;
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

export class User {
    private id_user: number;
    private user_password: string;
    private user_name: string;
    private user_lastName: string;
    private user_phone: string;
    private user_rol: number;
    private habilitado: number;
    private fecha_alta: Date;
    private fecha_baja: Date;

    constructor() {

    }

    public getId_user(): number {
        return this.id_user;
    }

    public setId_user(id_user: number): void {
        this.id_user = id_user;
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

export class Rol {
    public id_rol: number;
    public rol_name: string;

    constructor() {

    }

    public getId_rol(): number {
        return this.id_rol;
    }

    public setId_rol(id_rol: number): void {
        this.id_rol = id_rol;
    }

    public getRol_name(): string {
        return this.rol_name;
    }

    public setRol_name(rol_name: string): void {
        this.rol_name = rol_name;
    }

}
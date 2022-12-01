import { Empresa } from "./empresa";

export class Redes {

    private Empredid!: number;
    private Web?: string;
    private Facebook: string;
    private Twitter: string;
    private Instagram: string;
    private Google_plus: string;
    private Linkedin: string;

    // Constructor, donde debemos pasar todos los datos
    constructor(web: string = Empresa.SIN_DATOS, facebook: string = Empresa.SIN_DATOS, twitter: string = Empresa.SIN_DATOS, instagram: string = Empresa.SIN_DATOS, googleplus: string = Empresa.SIN_DATOS, linkedin: string = Empresa.SIN_DATOS) {
        this.Web = web;
        this.Facebook = facebook;
        this.Twitter = twitter;
        this.Instagram = instagram;
        this.Google_plus = googleplus;
        this.Linkedin = linkedin;
    }

    public getWeb(): string {
        return this.Web || Empresa.SIN_DATOS;
    }

    public setWeb(Web: string): void {
        this.Web = Web;
    }

    public getEmpredid(): number {
        return this.Empredid;
    }

    public setEmpredid(Empredid: number): void {
        this.Empredid = Empredid;
    }

    public getFacebook(): string {
        return this.Facebook || Empresa.SIN_DATOS;
    }

    public setFacebook(Facebook: string): void {
        this.Facebook = Facebook == "" ? Empresa.SIN_DATOS : Facebook;
    }

    public getTwitter(): string {
        return this.Twitter || Empresa.SIN_DATOS;
    }

    public setTwitter(Twitter: string): void {
        this.Twitter = Twitter == "" ? Empresa.SIN_DATOS : Twitter;
    }

    public getInstagram(): string {
        return this.Instagram || Empresa.SIN_DATOS;
    }

    public setInstagram(Instagram: string): void {
        this.Instagram = Instagram == "" ? Empresa.SIN_DATOS : Instagram;
    }

    public getGoogle_plus(): string {
        return this.Google_plus || Empresa.SIN_DATOS;
    }

    public setGoogle_plus(Google_plus: string): void {
        this.Google_plus = Google_plus == "" ? Empresa.SIN_DATOS : Google_plus;
    }

    public getLinkedin(): string {
        return this.Linkedin || Empresa.SIN_DATOS;
    }

    public setLinkedin(Linkedin: string): void {
        this.Linkedin = Linkedin == "" ? Empresa.SIN_DATOS : Linkedin;
    }
}

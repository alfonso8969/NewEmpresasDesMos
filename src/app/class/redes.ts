import { Empresa } from "./empresa";

export class Redes {

   private Empredid!: number;
   private Facebook: string;
   private Twitter: string;
   private Instagram: string;
   private Google_plus: string;
   private Linkedin: string;

     // Constructor, donde debemos pasar todos los datos
  constructor(facebook: string= Empresa.SIN_DATOS, twitter: string= Empresa.SIN_DATOS, instagram: string= Empresa.SIN_DATOS, googleplus: string= Empresa.SIN_DATOS, linkedin: string= Empresa.SIN_DATOS) {
    this.Facebook =facebook;
    this.Twitter = twitter;
    this.Instagram = instagram;
    this.Google_plus = googleplus;
    this.Linkedin = linkedin;
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
        this.Facebook = Facebook;
    }

    public getTwitter(): string {
        return this.Twitter || Empresa.SIN_DATOS;
    }

    public setTwitter(Twitter: string): void {
        this.Twitter = Twitter;
    }

    public getInstagram(): string {
        return this.Instagram || Empresa.SIN_DATOS;
    }

    public setInstagram(Instagram: string): void {
        this.Instagram = Instagram;
    }

    public getGoogle_plus(): string {
        return this.Google_plus || Empresa.SIN_DATOS;
    }

    public setGoogle_plus(Google_plus: string): void {
        this.Google_plus = Google_plus;
    }

    public getLinkedin(): string {
        return this.Linkedin || Empresa.SIN_DATOS;
    }

    public setLinkedin(Linkedin: string): void {
        this.Linkedin = Linkedin;
    }
}


export class Redes {

   Empredid?: number;

   Facebook?: string;

   Twitter?: string;

   Instagram?: string;

   Google_plus?: string;

   Linkedin?: string;

  // Constructor, donde debemos pasar todos los datos
  constructor(facebook: string= "Sin datos", twitter: string= "Sin datos", instagram: string= "Sin datos", googleplus: string= "Sin datos", linkedin: string= "Sin datos") {
    this.Facebook =facebook;
    this.Twitter = twitter;
    this.Instagram = instagram;
    this.Google_plus = googleplus;
    this.Linkedin = linkedin;
  }


}

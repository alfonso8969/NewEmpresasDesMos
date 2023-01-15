import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { SortableHeadersEmailsDirective, SortEventEmail, compare } from 'src/app/events/sortable-headers.emails.directive';
import { Email } from 'src/app/interfaces/email';
import { FormInscription } from 'src/app/interfaces/formInscription';
import { Log } from 'src/app/interfaces/log';
import { EmailService } from 'src/app/services/email.service';
import { LogsService } from 'src/app/services/logs.service';

@Component({
  selector: 'app-technical-emails',
  templateUrl: './technical-emails.component.html',
  styleUrls: ['./technical-emails.component.css']
})
export class TechnicalEmailsComponent implements OnInit {

  emails: Email[];
  emailsTmp: Email[];
  log: Log;
  formInscription: FormInscription;

  emailsTotal: number = 0;
  emailsUnreadTotal: number= 0;
  emailsReadTotal: number= 0;
  emailsFavoritesTotal: number= 0;
  emailsDeletedTotal: number= 0;
  isInTrash: boolean = false;
  load: boolean = true;
  filter: string;

  public page: number = 1;
  public siguiente: string = "Siguiente";
  public anterior: string = "Anterior";


  @ViewChildren(SortableHeadersEmailsDirective)
  headers: QueryList<SortableHeadersEmailsDirective>;

  constructor(private emailService: EmailService,
    private logService: LogsService,
    private router: Router) {

    this.formInscription = {
      idEmail: 0,
      title: '',
      userName: '',
      userLastName: '',
      userEmail: '',
      userPhoneAreaCode: '',
      userPhone: 0,
      userOtherPhoneAreaCode: '',
      userOtherPhone: 0,
      userAddress: '',
      userAddress2: '',
      userCity: '',
      userRegion: '',
      userPostalCode: 0,
      companyName: '',
      CIF: '',
      companyEmail: '',
      companySector: '',
      companyPhoneAreaCode: '',
      companyPhone: 0,
      companyOtherPhoneAreaCode: '',
      companyOtherPhone: 0,
      companyContactPerson: '',
      companyYear: 0,
      companyWorks: 0,
      companyAddress: '',
      companyAddress2: '',
      companyCity: '',
      companyRegion: '',
      companyPostalCode: 0,
      companyDistrict: '',
      companyWorkArea: '',
      companyRedWeb: '',
      companyRedFacebook: '',
      companyRedInstagram: '',
      companyRedTwitter: '',
      companyRedLinkedin: '',
      companyRedTikTok: '',
      date: '',
      terms: false,
    }
    this.log = this.logService.initLog();
    this.getEmails();

  }

  onSort({ column, direction }: SortEventEmail) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortableEmail !== column) {
        header.direction = '';
      }
    });

    // sorting logs
    if (direction === '' || column === '') {
      this.emails = this.emailsTmp;
    } else {
      this.emails = [...this.emailsTmp].sort((a, b) => {
        const res = compare(a[column]!, b[column]!);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  public getEmails(): void {
    this.load = true;
    let emailsStorage: Email[] = JSON.parse(localStorage.getItem('emails')!);
    if (emailsStorage && emailsStorage != undefined) {
      this.setTotals(emailsStorage);
    }

    this.emailService.getEmails().subscribe({
      next: (result: Email[]) => {
        if (result != null) {
          console.log("Emails en result antes: ", result);
          result.forEach((email: Email) => {
            email.subject = this.prepareEmailFromAndSubject(email.subject);
            email.from = this.prepareEmailFromAndSubject(email.from);
            email.bodyText = email.bodyText.replace(/\r\n/g, "").trim();
            if(email.label.toLowerCase().includes('inscription')) {
              email.bodyText = this.prepareBody(email.idEmail!, email.bodyText);
            }
          });
          console.log("Emails en result después: ", result);

          if (emailsStorage && (emailsStorage.length < result.length)) {
            this.compareArray(emailsStorage, result)
          } else if (!emailsStorage) {
            this.setTotals(result);
          }
        }
      }, error: (error: HttpErrorResponse) => {
        this.log.action = 'Conseguir emails';
        this.log.status = false;
        this.log.message = `Error al conseguir emails jotForm.com: ${JSON.stringify(error)}`;
        this.logService.setLog(this.log);
        console.log('Error en conseguir emails:', error);
        this.load = false;
      }, complete: () => {
        console.log('Se consiguieron los emails:', this.emails);
        this.load = false;
      }
    })
  }

  private prepareEmailFromAndSubject(text: string): string {
    return text.replace(/UTF-8/g, ' ').replace(/_/g, ' ').replace(/\?/g, '').replace(/=/g, '').replace(/Q/g, '');
  }

  /**
   * Función que compara los emails guardados con posibles nuevos que lleguen desde
   * ```ts
   * getEmails()
   * ```
   * @description Si existe alguno nuevo, se inserta en los guardados.
   * @param {Email[]} emailsStorage Emails guardados
   * @param {Email[]} result Emails nuevos
   * @returns void
   */
  private compareArray(emailsStorage: Email[], result: Email[]) {
    localStorage.removeItem('emails');
    emailsStorage.forEach(emailStorage => {
      result.forEach(emailResult => {
        if (emailResult.idEmail !== emailStorage.idEmail) {
          emailsStorage.push(emailResult);
        }
      })
    });
    this.setTotals(emailsStorage);
  }

  public deleteEmails(): void {
    this.emails.forEach(email => {
      !email.unread && (email.deleted = true);
    });
    this.setTotals(this.emails);
  }

  public checkRead(email: Email): void {
    this.emails.forEach(em => {
      if (em.idEmail == email.idEmail) {
        em.unread = !em.unread;
      }
    })
    this.setTotals(this.emails);
  }

  public markFavorite(email: Email): void {
    this.emails.forEach(em => {
      if (em.idEmail == email.idEmail) {
        em.favorite = !em.favorite;
      }
    })

    this.setTotals(this.emails);
  }

  public checkAll(read: boolean): void {
    this.emails.forEach(email => {
      email.unread = read;
    });
    this.setTotals(this.emails);
  }

  public filterFavorites(): void {
    this.emails = this.emailsTmp.filter(email => email.favorite);
  }

  public filterInBox(): void {
    this.emails = this.emailsTmp.filter(email => !email.deleted);
  }

  public filterDeleted(): void {
    this.emails = this.emailsTmp.filter(email => email.deleted);
  }

  public navigateToDetail(email: Email): void {
    this.router.navigate(['dashboard/technical-emails-details' ]);
    
      localStorage.setItem('email', JSON.stringify(email));
      localStorage.setItem('formInscription', JSON.stringify(this.formInscription));
      localStorage.setItem('emailsTotal', this.emailsTotal.toString());
      localStorage.setItem('emailsUnreadTotal', this.emailsUnreadTotal.toString());
      localStorage.setItem('emailsReadTotal', this.emailsReadTotal.toString());
      localStorage.setItem('emailsFavoritesTotal', this.emailsFavoritesTotal.toString());
      localStorage.setItem('emailsDeletedTotal', this.emailsDeletedTotal.toString());
    console.log(email);
  }

  private setTotals(emails: Email[]): void {
    this.emails = emails.filter(email => !email.deleted);
    this.emailsTmp = JSON.parse(JSON.stringify(emails));
    this.emailsTotal = emails.length;
    this.emailsUnreadTotal = emails.filter(email => !email.unread).length;
    this.emailsReadTotal = emails.filter(email => email.unread).length;
    this.emailsFavoritesTotal = emails.filter(email => email.favorite).length;
    this.emailsDeletedTotal = emails.filter(email => email.deleted).length;
    localStorage.setItem('emails', JSON.stringify(emails));
  }

  private prepareBody(idEmail: number, text: string): string {
    this.formInscription.idEmail = idEmail;
    let body = text;
    let intForm = body.indexOf('Formulario:');
    this.formInscription.title = body.substring(intForm + 'Formulario:'.length, body.indexOf('Fecha:')).trim();
    let intDate = body.indexOf('Fecha:');
    this.formInscription.date = body.substring(intDate + 'Fecha:'.length, body.indexOf('Nombre')).trim();
    let intUserName = body.indexOf('Nombre');
    this.formInscription.userName = body.substring(intUserName + 'Nombre'.length, body.indexOf('Apellido')).trim();
    let intUserLastName = body.indexOf('Apellido');
    this.formInscription.userLastName = body.substring(intUserLastName + 'Apellido'.length, body.indexOf('Email')).trim();
    let intUserEmail = body.indexOf('Email');
    this.formInscription.userEmail = body.substring(intUserEmail + 'Email'.length, body.indexOf('Código de área')).trim();
    let intUserPhoneAreaCode = body.indexOf('Código de área');
    this.formInscription.userPhoneAreaCode = body.substring(intUserPhoneAreaCode + 'Código de área'.length, body.indexOf('Número de teléfono')).trim();
    let intUserPhone = body.indexOf('Número de teléfono');

    body = body.substring(intUserPhone, body.length);
    intUserPhone = body.indexOf('Número de teléfono');
    this.formInscription.userPhone = Number(body.substring(intUserPhone + 'Número de teléfono'.length, body.indexOf('Código de área')).trim());
    let intUserOtherPhoneAreaCode = body.indexOf('Código de área');
    this.formInscription.userOtherPhoneAreaCode = body.substring(intUserOtherPhoneAreaCode + 'Código de área'.length, body.indexOf('Otro teléfono')).trim();
    let intUserOtherPhone = body.indexOf('Otro teléfono');
    this.formInscription.userOtherPhone = Number(body.substring(intUserOtherPhone + 'Otro teléfono'.length, body.indexOf('Dirección de la calle')).trim());
    let intUserAddress = body.indexOf('Dirección de la calle');
    this.formInscription.userAddress = body.substring(intUserAddress + 'Dirección de la calle'.length, body.indexOf('Dirección de la calle Línea 2')).trim();
    let intUserAddress2 = body.indexOf('Dirección de la calle Línea 2');
    this.formInscription.userAddress2 = body.substring(intUserAddress2 + 'Dirección de la calle Línea 2'.length, body.indexOf('Ciudad')).trim();
    let intUserCity = body.indexOf('Ciudad');
    this.formInscription.userCity = body.substring(intUserCity + 'Ciudad'.length, body.indexOf('Estado / Provincia')).trim();
    let intUserRegion = body.indexOf('Estado / Provincia');
    this.formInscription.userRegion = body.substring(intUserRegion + 'Estado / Provincia'.length, body.indexOf('Código postal')).trim();
    let intUserPostalCode = body.indexOf('Código postal');
    this.formInscription.userPostalCode = Number(body.substring(intUserPostalCode + 'Código postal'.length, body.indexOf('Nombre de la empresa')).trim());

    // Empresa
    body = body.substring(body.indexOf('Nombre de la empresa'), body.length);
    let intCompanyName = body.indexOf('Nombre de la empresa');;
    this.formInscription.companyName = body.substring(intCompanyName + 'Nombre de la empresa'.length, body.indexOf('CIF')).trim();
    let intCIF = body.indexOf('CIF');
    this.formInscription.CIF = body.substring(intCIF + 'CIF'.length, body.indexOf('Email')).trim();
    let intCompanyEmail = body.indexOf('Email');
    this.formInscription.companyEmail = body.substring(intCompanyEmail + 'Email'.length, body.indexOf('Sector')).trim();
    let intCompanySector = body.indexOf('Sector');
    this.formInscription.companySector = body.substring(intCompanySector + 'Sector'.length, body.indexOf('Código de área')).trim();
    let intCompanyPhoneAreaCode = body.indexOf('Código de área');
    this.formInscription.companyPhoneAreaCode = body.substring(intCompanyPhoneAreaCode + 'Código de área'.length, body.indexOf('Número de teléfono')).trim();
    let intCompanyPhone = body.indexOf('Número de teléfono');

    body = body.substring(intCompanyPhone, body.length);
    intCompanyPhone = body.indexOf('Número de teléfono');

    this.formInscription.companyPhone = Number(body.substring(intCompanyPhone + 'Número de teléfono'.length, body.indexOf('Código de área')).trim());
    let intCompanyOtherPhoneAreaCode = body.indexOf('Código de área');
    this.formInscription.companyOtherPhoneAreaCode = body.substring(intCompanyOtherPhoneAreaCode + 'Código de área'.length, body.indexOf('Otro teléfono')).trim();
    let intCompanyOtherPhone = body.indexOf('Otro teléfono');
    this.formInscription.companyOtherPhone = Number(body.substring(intCompanyOtherPhone + 'Otro teléfono'.length, body.indexOf('Persona contacto')).trim());
    let intCompanyContactPerson = body.indexOf('Persona contacto');
    this.formInscription.companyContactPerson = body.substring(intCompanyContactPerson + 'Persona contacto'.length, body.indexOf('Año instalación')).trim();
    let intCompanyYear = body.indexOf('Año instalación');
    this.formInscription.companyYear = Number(body.substring(intCompanyYear + 'Año instalación'.length, body.indexOf('Nº Trabajadores')).trim());
    let intCompanyWorks = body.indexOf('Nº Trabajadores')
    this.formInscription.companyWorks = Number(body.substring(intCompanyWorks + 'Nº Trabajadores'.length, body.indexOf('Dirección de la calle')).trim());
    let intCompanyAddress = body.indexOf('Dirección de la calle');
    this.formInscription.companyAddress = body.substring(intCompanyAddress + 'Dirección de la calle'.length, body.indexOf('Dirección de la calle Línea 2')).trim();
    let intCompanyAddress2 = body.indexOf('Dirección de la calle Línea 2');
    this.formInscription.companyAddress2 = body.substring(intCompanyAddress2 + 'Dirección de la calle Línea 2'.length, body.indexOf('Ciudad')).trim();
    let intCompanyCity = body.indexOf('Ciudad');
    this.formInscription.companyCity = body.substring(intCompanyCity + 'Ciudad'.length, body.indexOf('Estado/Provincia')).trim();
    let intCompanyRegion = body.indexOf('Estado/Provincia');
    this.formInscription.companyRegion = body.substring(intCompanyRegion + 'Estado/Provincia'.length, body.indexOf('Código postal')).trim();
    let intCompanyPostalCode = body.indexOf('Código postal');
    this.formInscription.companyPostalCode = Number(body.substring(intCompanyPostalCode + 'Código postal'.length, body.indexOf('Distrito')).trim());
    let intDistrito = body.indexOf('Distrito');
    this.formInscription.companyDistrict = body.substring(intDistrito + 'Distrito'.length, body.indexOf('Polígono')).trim();
    let intPoligono = body.indexOf('Polígono');
    this.formInscription.companyWorkArea = body.substring(intPoligono + 'Polígono'.length, body.indexOf('Página Web')).trim();
    let intCompanyWeb = body.indexOf('Página Web');
    this.formInscription.companyRedWeb = body.substring(intCompanyWeb + 'Página Web'.length, body.indexOf('Twitter')).trim();
    let intCompanyTwitter = body.indexOf('Twitter');
    this.formInscription.companyRedTwitter = body.substring(intCompanyTwitter + 'Twitter'.length, body.indexOf('Facebook')).trim();
    let intCompanyFacebook = body.indexOf('Facebook');
    this.formInscription.companyRedFacebook = body.substring(intCompanyFacebook + 'Facebook'.length, body.indexOf('Instagram')).trim();
    let intCompanyInstagram = body.indexOf('Instagram');
    this.formInscription.companyRedInstagram = body.substring(intCompanyInstagram + 'Instagram'.length, body.indexOf('LinkedIn')).trim();
    let intCompanyLinkedin = body.indexOf('LinkedIn');
    this.formInscription.companyRedLinkedin = body.substring(intCompanyLinkedin + 'LinkedIn'.length, body.indexOf('TikTok')).trim();
    let intCompanyTikTok = body.indexOf('TikTok');
    this.formInscription.companyRedTikTok = body.substring(intCompanyTikTok + 'TikTok'.length, body.indexOf('Fecha')).trim();
    let intTerms = body.indexOf('Términos y condiciones');
    let intFirma = body.indexOf('Firma');
    let terms = body.substring(intTerms + 'Términos y condiciones'.length, intFirma).trim();
    this.formInscription.terms = terms == 'Aceptado' ? true : false;
    console.log("FormInscription:" , this.formInscription);
    return JSON.stringify(this.formInscription);
  }

  ngOnInit(): void {
  }

}

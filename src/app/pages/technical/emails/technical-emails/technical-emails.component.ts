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
  emailsResponse: Email[];
  emailsStorage: Email[];

  log: Log;
  formInscription: FormInscription;

  emailsTotal: number = 0;
  emailsUnreadTotal: number = 0;
  emailsReadTotal: number = 0;
  emailsFavoritesTotal: number = 0;
  emailsDeletedTotal: number = 0;
  emailsSendedTotal: number = 0;


  isInInbox: EmailCategory = {
    name: 'isInBox',
    value: false,
    label: ''
  }

  isInFavorite: EmailCategory = {
    name: 'isInFavorites',
    value: false,
    label: ''
  }

  isInSended: EmailCategory = {
    name: 'isInSent',
    value: false,
    label: ''
  }

  isInTrash: EmailCategory = {
    name: 'isInTrash',
    value: false,
    label: ''
  }

  isInLabels: EmailCategory = {
    name: 'isInLabels',
    value: false,
    label: ''
  }

  categories: EmailCategory[] = [this.isInInbox, this.isInFavorite, this.isInSended, this.isInTrash, this.isInLabels];

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
    this.isInInbox.value = true;

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
    this.emailsStorage = JSON.parse(localStorage.getItem('emails')!);
    if (this.emailsStorage != null && this.emailsStorage != undefined) {
      this.setTotals(this.emailsStorage);
    }

    this.emailService.getEmails().subscribe({
      next: (result: Email[]) => {
        if (result != null) {
          result.forEach((email: Email) => {
            email.subject = this.prepareEmailFromAndSubject(email.subject);
            email.from = this.prepareEmailFromAndSubject(email.from);
            email.bodyText = email.bodyText.replace(/\r\n/g, "").trim();
            if (email.label.toLowerCase().includes('inscription')) {
              email.bodyText = this.prepareBody(email, email.idEmail!, email.bodyText);
            }
          });

          if (this.emailsStorage === null || this.emailsStorage === undefined || this.emailsStorage.length === 0) {
            this.setTotals(result);
          } else {
            this.compareArray(this.emailsStorage, result);
          }
          setTimeout(() => {
            this.getEmailsResponse();
          }, 600);
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

  private getEmailsResponse(): void {
    this.emailService.getEmailsResponse().subscribe({
      next: (result: Email[]) => {
        result.forEach(email => {
          email.deleted = Boolean(Number(email.deleted));
          email.unread = Boolean(Number(email.unread));
          email.favorite = Boolean(Number(email.favorite));
          email.answered = Boolean(Number(email.answered));
          email.bodyHtml = '';
          email.bodyEtc = '';
          email.formInscription = undefined;
          let attTemp = email.attachments!.toString().replace('[', '').replace(']', '').replace('"', '').split(',');
          email.attachments = [];
          if (attTemp[0] !== '') {
            attTemp.forEach(att => email.attachments!.push(att.replace('"', '').replace(/\+|%28/g, '').replace(/\"/g, '')));
          }
        });
        this.emailsResponse = result;
        if (result != null && result.length > 0) {
          setTimeout(() => {
            this.emailsStorage = JSON.parse(localStorage.getItem('emails')!);
            this.compareArray(this.emailsStorage, this.emailsResponse)
          }, 600);
        }
      }, error: (error: any) => {
        this.log.action = 'Conseguir emails enviados';
        this.log.status = false;
        this.log.message = `Error al conseguir emails enviados: ${JSON.stringify(error)}`;
        this.logService.setLog(this.log);
        console.log('Error en conseguir emails:', error);

      }, complete: () => {
        console.log('Se consiguieron los emails enviados:', this.emailsResponse);
      }
    });
  }

  /**
   * Función que prepara (quita los caracteres no válidos ?=_) del from y del asunto del email.
   *
   * @param {string} text Texto a preparar
   *
   * @returns {string} Un string con los caracteres remplazados
   */
  private prepareEmailFromAndSubject(text: string): string {
    return text.replace(/UTF-8/g, ' ').replace(/_/g, ' ').replace(/\?/g, '').replace(/=/g, '').replace(/Q/, '');
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
    result.forEach((emailResult: Email) => {
      if (emailsStorage.findIndex((emailStorage: Email) => emailStorage.idEmail === emailResult.idEmail) < 0) {
        emailsStorage.push(emailResult);
      }
    });

    this.setTotals(emailsStorage);
  }

  public checkAll(read: boolean): void {
    this.emails = this.emailsTmp;
    let ct: EmailCategory = this.getValueBoolCategory();
    this.emails.forEach(email => {
      switch (ct.name) {
        case 'isInBox':
          if (!email.deleted && !email.answered)
            email.unread = !read;
          break;
        case 'isInFavorites':
          if (!email.deleted && !email.answered && email.favorite)
            email.unread = !read;
          break;
        case 'isInSent':
          if (!email.deleted && email.answered && !email.favorite)
            email.unread = !read;
          break;
        case 'isInTrash':
          if (email.deleted && !email.answered && !email.favorite)
            email.unread = !read;
          break;
        case 'isInLabels':
          if (ct.label == email.label)
            email.unread = !read;
          break;

        default:
          break;
      }
    });

    this.setTotals(this.emails);
  }

  public deleteEmails(): void {
    this.emails = this.emailsTmp;
    this.emails.forEach(email => {
      !email.unread && (email.deleted = true);
    });
    this.setTotals(this.emails);
  }

  public checkRead(email: Email): void {
    this.emails = this.emailsTmp;
    this.emails.forEach(em => {
      if (em.idEmail == email.idEmail) {
        em.unread = !em.unread;
      }
    })
    this.setTotals(this.emails);
  }

  public markFavorite(email: Email): void {
    this.emails = this.emailsTmp;
    this.emails.forEach(em => {
      if (em.idEmail == email.idEmail) {
        em.favorite = !em.favorite;
      }
    })

    this.setTotals(this.emails);
  }

  public filterFavorites(): void {
    this.setBoolCategory('isInFavorites', true, '');
    this.emails = this.emailsTmp.filter(email => email.favorite);
  }

  public filterInBox(): void {
    this.setBoolCategory('isInBox', true, '');
    this.emails = this.emailsTmp.filter(email => !email.deleted && !email.answered);
  }

  public filterDeleted(): void {
    this.setBoolCategory('isInTrash', true, '');
    this.emails = this.emailsTmp.filter(email => email.deleted);
  }

  public filterSended(): void {
    this.setBoolCategory('isInSent', true, '');
    this.emails = this.emailsTmp.filter(email => email.answered);
  }

  public filterByLabel(label: string): void {
    this.setBoolCategory('isInLabels', true, label);
    this.emails = this.emailsTmp.filter(email => email.label == label);
  }

  public navigateToDetail(email: Email): void {
    email.unread != !0 && this.checkRead(email);
    localStorage.setItem('email', JSON.stringify(email));
    this.router.navigate(['dashboard/technical-emails-details']);
    console.log(email);
  }

  private getValueBoolCategory(): EmailCategory {
    return this.categories.find((ct: EmailCategory) => ct.value)!;
  }

  private setBoolCategory(name: string, value: boolean, label: string): void {
    this.categories.forEach(ct => {
      if (ct.name == name) {
        ct.label = label;
        ct.value = value;
      } else {
        ct.value = !value;
        ct.label = '';
      }
    });
    console.log("set categories: ", this.categories);
  }

  private translateEmailLabel(label: string): string {
    let labelTranslate = '';
    switch (label) {
      case 'Inscription':
        labelTranslate = 'Inscripción';
        break;
      case 'Notices':
        labelTranslate = 'Avisos';
        break;
      case 'Communication':
        labelTranslate = 'Comunicación';
        break;
      case 'Company':
        labelTranslate = 'Empresa';
        break;
    }
    return labelTranslate;
  }

  private setTotals(emails: Email[]): void {
    this.emails = emails.filter(email => Boolean(!email.deleted) && Boolean(!email.answered));
    this.emailsTmp = JSON.parse(JSON.stringify(emails));
    this.emailsTotal = emails.length;
    this.emailsUnreadTotal = emails.filter(email => Boolean(!email.unread)).length;
    this.emailsReadTotal = emails.filter(email => Boolean(email.unread)).length;
    this.emailsFavoritesTotal = emails.filter(email => Boolean(email.favorite != !1)).length;
    this.emailsDeletedTotal = emails.filter(email => Boolean(email.deleted)).length;
    this.emailsSendedTotal = emails.filter(email => Boolean(email.answered)).length;

    localStorage.setItem('emailsTotal', this.emailsTotal.toString());
    localStorage.setItem('emailsUnreadTotal', this.emailsUnreadTotal.toString());
    localStorage.setItem('emailsReadTotal', this.emailsReadTotal.toString());
    localStorage.setItem('emailsFavoritesTotal', this.emailsFavoritesTotal.toString());
    localStorage.setItem('emailsDeletedTotal', this.emailsDeletedTotal.toString());
    localStorage.setItem('emailsSendedTotal', this.emailsSendedTotal.toString());
    localStorage.setItem('emails', JSON.stringify(emails));
  }

  private prepareBody(email: Email, idEmail: number, text: string): string {
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
    console.log("FormInscription:", this.formInscription);
    email.formInscription = this.formInscription;
    return JSON.stringify(this.formInscription);
  }

  ngOnInit(): void {
  }

}

export interface EmailCategory {
  name: string;
  value: boolean;
  label: string;
}

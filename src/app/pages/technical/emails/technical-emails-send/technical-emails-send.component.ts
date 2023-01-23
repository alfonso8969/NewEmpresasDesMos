import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { User } from 'src/app/class/users';
import { Email } from 'src/app/interfaces/email';
import { FormInscription } from 'src/app/interfaces/formInscription';
import { Log } from 'src/app/interfaces/log';
import { EmailService } from 'src/app/services/email.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { LogsService } from 'src/app/services/logs.service';
import { UsersService } from 'src/app/services/users.service';
import { Utils } from 'src/app/utils/utils';
import { environment } from 'src/environments/environment';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { DatePipe } from '@angular/common';

declare function RichTextEditor(selector: string): typeof RichTextEditor;

@Component({
  selector: 'app-technical-emails-send',
  templateUrl: './technical-emails-send.component.html',
  styleUrls: ['./technical-emails-send.component.css'],
  providers: [DatePipe]
})
export class TechnicalEmailsSendComponent implements OnInit, OnDestroy {

  url: string = environment.apiUrl;

  user: User;
  email: Email;
  log: Log;
  formInscription: FormInscription;
  sendEmailForm: FormGroup;
  fileUp: File;

  emailSended: boolean = false;
  filesName: string[] = [];
  lastIdEmail: number;
  files: any[] = [];
  editor: any;
  load: boolean;
  simulatorLoadFinish: boolean;
  label: 'Inscription' |
    'Notices' |
    'Communication' |
    'Company';

  public dataForm = {
    id_user: 0,
    name: '',
    email: '',
    message: '',
    subject: '',
    from: 'Admin Empresas',
    attachments: [''],
    unread: 0,
    answered: 0,
    deleted: 0,
    label: '',
    favorite: 0,
    date: '',
  };

  sendEmailMessages = {
    titleError: "Error",
    titleSuccess: "Correcto",
    noData: "Los datos enviados no pueden estar vacíos",
    messageError: "Hubo algún error enviando el correo",
    messageSuccess: "El correo fue enviado correctamente",
  }

  private sendEmailResult = {
    title: '',
    message: ''
  };

  userEMail: string;
  subject: string;
  emailsTotal: number = 0;
  emailsUnreadTotal: number = 0;
  emailsReadTotal: number = 0;
  emailsFavoritesTotal: number = 0;
  emailsDeletedTotal: number = 0;
  emailsSendedTotal: number = 0;


  constructor(private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private emailService: EmailService,
    private logService: LogsService,
    private userService: UsersService,
    private uploadFileService: FileUploadService,
    private datePipe: DatePipe) {
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

    this.getLastIdEmail();

    this.user = this.userService.getUserLogged();
    this.log = this.logService.initLog();
    this.simulatorLoadFinish = false;
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.userEMail = params.get('emailTo')!;
      this.subject = params.get('subject')!;
    });

    this.sendEmailForm = this.fb.group({
      to: [this.userEMail || '', [Validators.required, Validators.pattern(Utils.emailReg)]],
      subject: [this.subject || '', Validators.required],
      label: ['', [Validators.required, Validators.pattern(Utils.labelRegex)]]
    });
  }

  ngOnInit(): void {
    this.editor = RichTextEditor('#editor');
    this.email = JSON.parse(localStorage.getItem('email')!);
    !this.email && (this.email = {
      from: '',
      to: '',
      date: this.datePipe.transform(new Date(), 'dd-MM-YYYY HH:mm:ss')!,
      bodyText: '',
      bodyHtml: '',
      subject: '',
      label: 'Inscription'
    });

    this.formInscription = this.email && (this.email.formInscription || this.formInscription);
    this.emailsTotal = Number(localStorage.getItem('emailsTotal')!);
    this.emailsUnreadTotal = Number(localStorage.getItem('emailsUnreadTotal')!);
    this.emailsReadTotal = Number(localStorage.getItem('emailsReadTotal')!);
    this.emailsFavoritesTotal = Number(localStorage.getItem('emailsFavoritesTotal')!);
    this.emailsDeletedTotal = Number(localStorage.getItem('emailsDeletedTotal')!);
  }

  private getLastIdEmail(): void {
    this.uploadFileService.getLastIdEmail().subscribe({
      next: (lastIdEmail: number) => { this.lastIdEmail = lastIdEmail }
      , error: (err: any) => {
        this.log.action = 'Conseguir lastIdEmail';
        this.log.status = false;
        this.log.message = `Error consiguiendo el último id de emails: ${JSON.stringify(err)}`;
        this.logService.setLog(this.log);
        console.log("Error consiguiendo el último id de emails", err);
      }, complete: () => console.log("Conseguido last id email", this.lastIdEmail)
    });
  }

  /**
 * on file drop handler
 */
  onFileDropped($event: any[]) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(event: any) {
    let files = event.files;
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
    let fileName = this.filesName.splice(index, 1);
    this.uploadFileService.unSaveAttachments(this.lastIdEmail + '-' + fileName[0])
      .subscribe({
        next: (res: any) => console.log("Archivo eliminado", res)
        , error: (err: any) => {
          this.log.action = 'Eliminar archivo';
          this.log.status = false;
          this.log.message = `Error eliminando el archivo: ${JSON.stringify(err)}`;
          this.logService.setLog(this.log);
          console.log("Error eliminando el archivo", err);
        }
      });
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        this.simulatorLoadFinish = false;
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
            this.files[index].progress === 100 && (this.simulatorLoadFinish = false);
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    this.simulatorLoadFinish = true;
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
      this.uploadFile(item);
    }
    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: number, decimals: number = 0) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  public uploadFile(elem: File): void {
    this.fileUp = elem;
    this.filesName.push(this.lastIdEmail + '-' + elem.name);
    this.uploadFileService.uploadFileAttachments(this.fileUp, this.lastIdEmail + '-' + elem.name)
      .subscribe({
        next: (data: any) => {
          console.log("Data: ", data)
          if (data.type === 4) {
            console.log(data.body.data);
          }
        },
        error: (err: any) => {
          console.log("Error: ", err);
          this.log.action = 'Subir archivo';
          this.log.status = false;
          this.log.message = `Error al subir archivo adjunto: ${JSON.stringify(err)}`;
          this.logService.setLog(this.log);
          if (err.error && err.error.message) {
            console.log("Error: ", err.error.message);
          } else {
            console.log('Could not upload the file!');
          }
        }
      });
    console.log(elem)
  }

  public setEmailLabel(label: 'Inscription' | 'Notices' | 'Communication' | 'Company'): void {
    this.label = label;
    switch (label) {
      case 'Inscription':
        this.sendEmailForm.get('label')!.setValue('Inscripción');
        break;
      case 'Notices':
        this.sendEmailForm.get('label')!.setValue('Avisos');
        break;
      case 'Communication':
        this.sendEmailForm.get('label')!.setValue('Comunicación')
        break;
      case 'Company':
        this.sendEmailForm.get('label')!.setValue('Empresa')
        break;
    }
  }

  public sendEmail(): void {
    this.load = true;
    this.email.to = this.sendEmailForm.get('to')!.value.trim();
    this.email.subject = this.sendEmailForm.get('subject')!.value.trim();
    this.email.label = this.label;
    this.email.bodyHtml = this.editor.getHTMLCode();
    this.email.attachments = this.filesName;

    this.dataForm = {
      id_user: this.user.id_user,
      name: this.email.formInscription != undefined ? this.email.formInscription?.userName : this.email.to,
      email: this.email.to,
      subject: this.email.subject,
      message: this.email.bodyHtml,
      from: 'Admin Empresas',
      attachments: this.email.attachments,
      date: this.email.date,
      unread: 0,
      answered: 1,
      deleted: 0,
      label: this.email.label,
      favorite: 0
    };

    this.log.action = 'Enviar email ' + this.email.label;
    this.emailService.sendCustomEmail(this.dataForm).subscribe({
      next: (result: any) => {
        if (result.title.includes('error')) {
          this.showSwal('error');
          this.log.status = false;
          this.log.message = `Error al enviar email ${this.email.label}: ${JSON.stringify(result.message)}`;
          this.logService.setLog(this.log);
          this.load = false;
          return;
        }
        this.emailSended = true;
        this.sendEmailResult.title = this.sendEmailMessages.titleSuccess;
        this.sendEmailResult.message = this.sendEmailMessages.messageSuccess;
        this.log.status = true;
        this.log.message = `Enviar email ${this.email.label} satisfactorio: ${JSON.stringify(this.dataForm)}`;
        this.logService.setLog(this.log);
        this.load = false;
        this.getLastIdEmail();
        this.showSwal('success');
      }, error: (error: any) => {
        this.load = false;
        this.sendEmailResult.title = this.sendEmailMessages.titleError;
        this.sendEmailResult.message = `Error al enviar email ${this.email.label}`;
        this.deleteAttachments();
        this.showSwal('error');
        this.log.status = false;
        this.log.message = `Error al enviar email ${this.email.label}: ${JSON.stringify(error)}`;
        this.logService.setLog(this.log);
        console.log('Respuesta send email Error', error);
      }, complete: () => {
        console.log("Complete send email");
      }
    });
  }

  public getMessageSendButton(): string {
    return (this.sendEmailForm.invalid || this.editor!.getHTMLCode() === '') ? 'Faltan campos obligatorios'
      : this.simulatorLoadFinish ?
        'Cargando archivos....' :
        'Enviar email'
  }

  private showSwal(option: SweetAlertIcon): void {
    Swal.fire({
      icon: option,
      title: this.sendEmailResult.title,
      text: this.sendEmailResult.message,
    });
    this.clearDataForm();
  }

  private clearDataForm(): void {
    this.dataForm = {
      id_user: 0,
      name: '',
      email: '',
      message: '',
      from: '',
      subject: '',
      attachments: [''],
      unread: 0,
      answered: 0,
      deleted: 0,
      label: '',
      favorite: 0,
      date: '',
    };
    this.sendEmailForm.get('to')!.setValue('');
    this.sendEmailForm.get('subject')!.setValue('');
    this.sendEmailForm.get('label')!.setValue('');
    this.sendEmailForm.markAsUntouched();
    this.editor!.setHTMLCode('');
    this.files = [];
    this.filesName = [];

  }

  public goToManagementEmails(): void {
    this.router.navigateByUrl('/dashboard/technical-emails-management');
  }

  private deleteAttachments(): void {
    this.filesName.forEach((fileName: string) => {
      this.uploadFileService.unSaveAttachments(fileName)
        .subscribe({
          next: (res: any) => console.log("Archivo eliminado", res)
          , error: (err: any) => {
            this.log.action = 'Eliminar archivo';
            this.log.status = false;
            this.log.message = `Error eliminando el archivo en enviar email componente: ${JSON.stringify(err)}`;
            this.logService.setLog(this.log);
            console.log("Error eliminando el archivo", err);
          }
        });
      if (!this.emailSended && this.filesName.length > 0) {
        this.sendEmailResult.title = "Borrado de archivos"
        this.sendEmailResult.message = "Los archivos adjuntos han sido borrados"
        this.showSwal('info');
      }
    })
  }

  ngOnDestroy() {
    if (!this.emailSended || this.filesName.length > 0) {
      this.deleteAttachments();
    }
  }
}

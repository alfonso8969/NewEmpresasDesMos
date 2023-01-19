import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Email } from 'src/app/interfaces/email';
import { FormInscription } from 'src/app/interfaces/formInscription';
import { Log } from 'src/app/interfaces/log';
import { EmailService } from 'src/app/services/email.service';
import { LogsService } from 'src/app/services/logs.service';
import { environment } from 'src/environments/environment';
import Swal, { SweetAlertIcon } from 'sweetalert2';

declare function RichTextEditor(selector: string): typeof RichTextEditor;

@Component({
  selector: 'app-technical-emails-send',
  templateUrl: './technical-emails-send.component.html',
  styleUrls: ['./technical-emails-send.component.css']
})
export class TechnicalEmailsSendComponent implements OnInit {

  url: string = environment.apiUrl;

  email: Email;
  log: Log;
  formInscription: FormInscription;
  sendEmailForm: FormGroup;

  files: any[] = [];
  editor: any;
  load: boolean;
  simulatorLoadFinish: boolean;

  public dataForm = {
    name: '',
    email: '',
    message: '',
    subject: '',
    from: 'Admin Empresas',
    attachments: ['']
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

  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private emailService: EmailService,
              private logService: LogsService) {

    this.log = this.logService.initLog();
    this.simulatorLoadFinish = false;
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.userEMail = params.get('emailTo')!;
      this.subject = params.get('subject')!;
    });

    this.sendEmailForm = this.fb.group({
      to: [this.userEMail || '', Validators.required],
      subject: [this.subject || '', Validators.required]
    });
  }

  ngOnInit(): void {
    this.editor = RichTextEditor('#editor');
    this.email = JSON.parse(localStorage.getItem('email')!);
    this.formInscription = JSON.parse(localStorage.getItem('formInscription')!);
    this.emailsTotal = Number(localStorage.getItem('emailsTotal')!);
    this.emailsUnreadTotal = Number(localStorage.getItem('emailsUnreadTotal')!);
    this.emailsReadTotal = Number(localStorage.getItem('emailsReadTotal')!);
    this.emailsFavoritesTotal = Number(localStorage.getItem('emailsFavoritesTotal')!);
    this.emailsDeletedTotal = Number(localStorage.getItem('emailsDeletedTotal')!);
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

  public sendEmail(): void {
    this.load = true;
    this.email.to = this.sendEmailForm.get('to')!.value;
    this.email.subject = this.sendEmailForm.get('subject')!.value;
    this.email.bodyHtml = this.editor!.getHTMLCode();
    this.email.attachments = this.files;

    this.dataForm = {
      name: this.formInscription.userName,
      email: this.email.to,
      subject: this.email.subject,
      message: this.email.bodyHtml,
      from: 'Admin Empresas',
      attachments: this.email.attachments
    };

    this.log.action = 'Enviar email respuesta';
    this.emailService.sendCustomEmail(this.dataForm).subscribe({
      next: (result: any) => {
        if (result.title.includes('error')) {
          this.showSwal('error');
          this.log.status = false;
          this.log.message = `Error enviar email respuesta: ${JSON.stringify(result.message)}`;
          this.logService.setLog(this.log);
          this.load = false;
          return;
        }
        this.sendEmailResult.title = this.sendEmailMessages.titleSuccess;
        this.sendEmailResult.message = this.sendEmailMessages.messageSuccess;
        this.log.status = true;
        this.log.message = `Enviar email respuesta satisfactorio: ${JSON.stringify(this.dataForm)}`;
        this.logService.setLog(this.log);
        this.load = false;
        this.showSwal('success');
      }, error: (error: any) => {
        this.load = false;
        this.sendEmailResult.title = this.sendEmailMessages.titleError;
        this.sendEmailResult.message = error.message;
        this.showSwal('error');
        this.log.status = false;
        this.log.message = `Error enviar email respuesta: ${JSON.stringify(error)}`;
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
    this.clearDataForm();
    Swal.fire({
      icon: option,
      title: this.sendEmailResult.title,
      text: this.sendEmailResult.message,
    });
  }

  private clearDataForm(): void {
    this.dataForm = {
      name: '',
      email: '',
      message: '',
      from: '',
      subject: '',
      attachments: ['']
    };
    this.sendEmailForm.get('to')!.setValue('');
    this.sendEmailForm.get('subject')!.setValue('');
    this.editor!.setHTMLCode('');
    this.files = [];
  }

  public goToManagementEmails(): void {
    this.router.navigateByUrl('/dashboard/technical-emails-management');
  }
}

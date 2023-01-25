import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Email } from 'src/app/interfaces/email';
import { FormInscription } from 'src/app/interfaces/formInscription';
import { ViewSDKClient } from 'src/app/services/view-sdk.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-technical-emails-details',
  templateUrl: './technical-emails-details.component.html',
  styleUrls: ['./technical-emails-details.component.css']
})
export class TechnicalEmailsDetailsComponent implements OnInit, AfterViewInit {

  url: string = environment.apiUrl;
  extensionsImg = ['jpg', 'png', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'webp', 'svg'];

  load: boolean = true;
  email: Email;
  formInscription: FormInscription;
  fileExtension: string;
  attachmentDiv: string;

  emailsTotal: number = 0;
  emailsUnreadTotal: number = 0;
  emailsReadTotal: number = 0;
  emailsFavoritesTotal: number = 0;
  emailsDeletedTotal: number = 0;
  emailsSendedTotal: number = 0;

  constructor(private viewSDKClient: ViewSDKClient,
              private router: Router) {
  }

  ngAfterViewInit() {
  }

  ngOnInit(): void {
    this.load = true;
    this.email = JSON.parse(localStorage.getItem('email')!);
    this.formInscription = this.email.formInscription!;
    this.emailsTotal = Number(localStorage.getItem('emailsTotal')!);
    this.emailsUnreadTotal = Number(localStorage.getItem('emailsUnreadTotal')!);
    this.emailsReadTotal = Number(localStorage.getItem('emailsReadTotal')!);
    this.emailsFavoritesTotal = Number(localStorage.getItem('emailsFavoritesTotal')!);
    this.emailsDeletedTotal = Number(localStorage.getItem('emailsDeletedTotal')!);
    this.emailsSendedTotal = Number(localStorage.getItem('emailsSendedTotal')!);
    this.previewFile();
  }

  public previewFile(): void {
    if (this.email.attachments && this.email.attachments.length > 0) {
      this.email.attachments = this.email.attachments.toString().replace('[', '').replace(']', '').replace('"', '').replace(/\+|%28/g, '').replace(/\"/g, '').split(',');
      this.email.attachments.forEach(attachment => {
        if (attachment.split('.')[1] == 'pdf' || attachment.split('.')[1] == 'PDF') {
          this.viewSDKClient.ready().then(() => {
            this.load = false;
            /* Invoke file preview */
            this.attachmentDiv = 'pdf-div-min' + attachment;
            this.viewSDKClient.previewFile(this.attachmentDiv, this.url + '/attachment/' + attachment, attachment, {
              /* Pass the embed mode option here */
              embedMode: 'IN_LINE'
            });
          });
        }
      });
    }
    this.load = false;
  }

  public viewFile(file: string) {
    this.router.navigate(['/dashboard/technical-emails-view-attachment', { file: file }])
  }



}

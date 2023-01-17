import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Email } from 'src/app/interfaces/email';
import { FormInscription } from 'src/app/interfaces/formInscription';
import { Log } from 'src/app/interfaces/log';
import { ViewSDKClient } from 'src/app/services/view-sdk.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-technical-emails-details',
  templateUrl: './technical-emails-details.component.html',
  styleUrls: ['./technical-emails-details.component.css']
})
export class TechnicalEmailsDetailsComponent implements OnInit, AfterViewInit {

  url: string = environment.apiUrl;

  load: boolean = true;
  email: Email;
  log: Log;
  formInscription: FormInscription;

  emailsTotal: number = 0;
  emailsUnreadTotal: number = 0;
  emailsReadTotal: number = 0;
  emailsFavoritesTotal: number = 0;
  emailsDeletedTotal: number = 0;

  constructor(private viewSDKClient: ViewSDKClient,
              private router: Router) {
  }

  ngAfterViewInit() {
  }

  ngOnInit(): void {
    this.load = true;
    this.email = JSON.parse(localStorage.getItem('email')!);
    this.formInscription = JSON.parse(localStorage.getItem('formInscription')!);
    this.emailsTotal = Number(localStorage.getItem('emailsTotal')!);
    this.emailsUnreadTotal = Number(localStorage.getItem('emailsUnreadTotal')!);
    this.emailsReadTotal = Number(localStorage.getItem('emailsReadTotal')!);
    this.emailsFavoritesTotal = Number(localStorage.getItem('emailsFavoritesTotal')!);
    this.emailsDeletedTotal = Number(localStorage.getItem('emailsDeletedTotal')!);
    this.previewFile();
  }

  public previewFile(): void {
    if (this.email.attachments && this.email.attachments.length > 0) {
      this.email.attachments.forEach(attachment => {
        this.viewSDKClient.ready().then(() => {
          this.load = false;
          /* Invoke file preview */
          this.viewSDKClient.previewFile('pdf-div-min', this.url + '/attachment/' + attachment, attachment, {
            /* Pass the embed mode option here */
            embedMode: 'IN_LINE'
          });
        });
      });
    }
    this.load = false;
  }

  public viewFile(file: string) {
    this.router.navigate(['/dashboard/technical-emails-view-attachment', { file: file }])
  }



}

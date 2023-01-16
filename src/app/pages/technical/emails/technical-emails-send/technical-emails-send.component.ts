import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Email } from 'src/app/interfaces/email';
import { FormInscription } from 'src/app/interfaces/formInscription';
import { Log } from 'src/app/interfaces/log';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-technical-emails-send',
  templateUrl: './technical-emails-send.component.html',
  styleUrls: ['./technical-emails-send.component.css']
})
export class TechnicalEmailsSendComponent implements OnInit {

  url: string = environment.apiUrl;

  load: boolean;
  email: Email;
  log: Log;
  formInscription: FormInscription;
  sendEmailForm: FormGroup;
  
  userEMail: string;
  subject: string;
  emailsTotal: number = 0;
  emailsUnreadTotal: number = 0;
  emailsReadTotal: number = 0;
  emailsFavoritesTotal: number = 0;
  emailsDeletedTotal: number = 0;

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder){
   
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.userEMail = params.get('emailTo')!;
      this.subject = params.get('subject')!;
    });

    this.sendEmailForm = this.fb.group({
      to: [ this.userEMail || '', Validators.required],
      subject: [ this.subject || '', Validators.required],
      message: ['', Validators.required],
      attachment: [['']]
    });
  }

  ngOnInit(): void {
    this.email = JSON.parse(localStorage.getItem('email')!);
    this.formInscription = JSON.parse(localStorage.getItem('formInscription')!);
    this.emailsTotal = Number(localStorage.getItem('emailsTotal')!);
    this.emailsUnreadTotal = Number(localStorage.getItem('emailsUnreadTotal')!);
    this.emailsReadTotal = Number(localStorage.getItem('emailsReadTotal')!);
    this.emailsFavoritesTotal = Number(localStorage.getItem('emailsFavoritesTotal')!);
    this.emailsDeletedTotal = Number(localStorage.getItem('emailsDeletedTotal')!);
  }

  public sendEmail(): void {

  }

}

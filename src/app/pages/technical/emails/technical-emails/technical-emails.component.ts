import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Email } from 'src/app/interfaces/email';
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

  emailsTotal: number = 0;
  emailsUnreadTotal: number;
  emailsReadTotal: number;
  emailsFavoritesTotal: number;
  emailsDeletedTotal: number;
  load: boolean;
  filter: string;

  public page: number = 1;
  public siguiente: string = "Siguiente";
  public anterior: string = "Anterior";

  constructor(private emailService: EmailService,
              private logService: LogsService,
              private router: Router) {
   this.log = this.logService.initLog();
   this.getEmails();
  }

  public getEmails(): void {
    this.load = true;
    this.emailService.getEmails().subscribe({
      next: (result: Email[]) => {
        if (result != null) {
          result.forEach((email) => {
            email.subject = email.subject.split('?')[3].replace(/_/g, ' ');
            let index = email.body.indexOf('8bit');
            email.body = email.body.substring(index+4).trim().replace(/\r\n/g, "");
          })
          this.emails = result.filter(email => !email.deleted);
          this.emailsTmp = JSON.parse(JSON.stringify(this.emails));
          this.emailsTotal = this.emails.length;
          this.emailsUnreadTotal = this.emails.filter(email => email.unread).length;
          this.emailsReadTotal = this.emails.filter(email => !email.unread).length;
          this.emailsFavoritesTotal = this.emails.filter(email => email.favorite).length;
          this.emailsDeletedTotal = this.emails.filter(email => email.deleted).length;
          console.log(result);
        }
      }, error: (error: HttpErrorResponse) => {
        console.log(`Error en conseguir emails:  ${JSON.stringify(error)}`);
        this.load = false;
      }, complete: () => {
        console.log('Se consiguieron los emails:', this.emails);
        this.load = false;
      }
    })
  }

  public deleteEmails(): void {
    this.emails.forEach(email => {
      !email.unread && (email.deleted = true);
    });
    this.emails = this.emails.filter(email => !email.deleted);
    this.emailsDeletedTotal = this.emails.length;
  }

  public checkRead(email: Email): void {
    email.unread = !email.unread ;
    this.emailsUnreadTotal = this.emails.filter(email => email.unread).length;
    this.emailsReadTotal = this.emails.filter(email => !email.unread).length;
  }
  
  public markFavorite(email: Email): void {
    email.favorite = !email.favorite ;
    this.emailsFavoritesTotal = this.emails.filter(email => email.favorite).length;
  }

  public checkAll(read: boolean): void {
    this.emails.forEach(email => {
      email.unread = read;
    });
    this.emailsUnreadTotal = this.emails.filter(email => email.unread).length;
    this.emailsReadTotal = this.emails.filter(email => !email.unread).length;
  }

  public filterFavorites(): void {
     this.emails = this.emails.filter(email => email.favorite);
  }

  public filterInBox(): void {
     this.emails = this.emailsTmp;
  }

  public filterDeleted(): void {
    this.emails = this.emails.filter(email => email.deleted);
  }

  public navigateToDetail(email: Email): void {
    console.log(email);
  }

  ngOnInit(): void {
  }

}

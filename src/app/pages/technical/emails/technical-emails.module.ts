import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechnicalEmailsDetailsComponent } from './technical-emails-details/technical-emails-details.component';
import { TechnicalEmailsSendComponent } from './technical-emails-send/technical-emails-send.component';
import { TechnicalEmailsComponent } from './technical-emails/technical-emails.component';

@NgModule({
  declarations: [
    TechnicalEmailsComponent,
    TechnicalEmailsDetailsComponent,
    TechnicalEmailsSendComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TechnicalEmailsModule { }

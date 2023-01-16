import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from 'src/app/components/components.module';
import { TechnicalEmailsDetailsComponent } from './technical-emails-details/technical-emails-details.component';
import { TechnicalEmailsSendComponent } from './technical-emails-send/technical-emails-send.component';
import { TechnicalEmailsComponent } from './technical-emails/technical-emails.component';
import { NgMaterialModule } from 'src/app/design/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { DirectivesModule } from 'src/app/events/directives.module';
import { ViewPdfComponent } from './view-pdf/view-pdf.component';


@NgModule({
  declarations: [
    TechnicalEmailsComponent,
    TechnicalEmailsDetailsComponent,
    TechnicalEmailsSendComponent,
    ViewPdfComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    NgMaterialModule,
    PipesModule,
    NgxPaginationModule,
    DirectivesModule,
    RouterModule
  ],
  exports: [
    TechnicalEmailsComponent,
    TechnicalEmailsDetailsComponent,
    TechnicalEmailsSendComponent
  ]
})
export class TechnicalEmailsModule { }

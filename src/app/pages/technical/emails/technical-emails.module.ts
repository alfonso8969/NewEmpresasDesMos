import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechnicalEmailsDetailsComponent } from './technical-emails-details/technical-emails-details.component';
import { TechnicalEmailsSendComponent } from './technical-emails-send/technical-emails-send.component';
import { TechnicalEmailsComponent } from './technical-emails/technical-emails.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { FormsModule } from '@angular/forms';
import { NgMaterialModule } from 'src/app/design/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    TechnicalEmailsComponent,
    TechnicalEmailsDetailsComponent,
    TechnicalEmailsSendComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    NgMaterialModule,
    PipesModule,
    NgxPaginationModule
  ],
  exports: [
    TechnicalEmailsComponent,
    TechnicalEmailsDetailsComponent,
    TechnicalEmailsSendComponent
  ]
})
export class TechnicalEmailsModule { }

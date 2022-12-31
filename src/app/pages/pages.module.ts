import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AddCompanyRedesComponent } from './Controller-Company/add-company-redes/add-company-redes.component';
import { AddCompanyComponent } from './Controller-Company/add-company/add-company.component';
import { HistoryCompaniesComponent } from './Controller-Company/history-companies/history-companies.component';
import { ListCompaniesComponent } from './Controller-Company/list-companies/list-companies.component';
import { ViewCompanyComponent } from './Controller-Company/view-company/view-company.component';
import { CompaniesOutComponent } from './Controller-Company/companies-out/companies-out.component';
import { LoginComponent } from './login/login.component';
import { ListUsersComponent } from './users/list-users/list-users.component';
import { ViewUserComponent } from './users/view-user/view-user.component';
import { AdminUsersComponent } from './users/admin-users/admin-users.component';
import { AddUserComponent } from './users/add-user/add-user.component';
import { AddFieldsComponent } from './admin/add-fields/add-fields.component';
import { AdminFieldsComponent } from './admin/admin-fields/admin-fields.component';
import { PagesComponent } from './pages.component';
import { NgMaterialModule } from '../design/material.module';
import { ComponentsModule } from '../components/components.module';
import { DirectivesModule } from '../events/directives.module';
import { TrimPipe } from '../pipes/trim.pipe';
import { SharedModule } from 'src/shared/shared.module';
import { DistritosEchartsComponent } from './benchmarks/distritos-echarts/distritos-echarts.component';
import { PoligonosEchartsComponent } from './benchmarks/poligonos-echarts/poligonos-echarts.component';
import { SectoresEchartsComponent } from './benchmarks/sectores-echarts/sectores-echarts.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxPaginationModule } from 'ngx-pagination';
import { LogoutComponent } from './login/logout.component';
import { NotFoundComponent } from './login/notfound.component';
import { TicketSupportComponent } from './support/ticket-support/ticket-support.component';
import { HelpSupportComponent } from './support/help-support/help-support.component';
import { TechnicalLogsComponent } from './technical/technical-logs/technical-logs.component';
import { AddTechnicalComponent } from './technical/add-technical/add-technical.component';
import { TechnicalSessionsComponent } from './technical/technical-sessions/technical-sessions.component';
import { TicketManagementComponent } from './technical/ticket-management/ticket-management.component';
import { ListTechnicalComponent } from './technical/list-technical/list-technical.component';
import { TechnicalThemesComponent } from './technical/technical-themes/technical-themes.component';
import { TechnicalEmailsModule } from './technical/emails/technical-emails.module';

@NgModule({
  declarations: [
    PagesComponent,
    LoginComponent,
    AddCompanyComponent,
    AddCompanyRedesComponent,
    ListCompaniesComponent,
    HistoryCompaniesComponent,
    ViewCompanyComponent,
    ListUsersComponent,
    ViewUserComponent,
    CompaniesOutComponent,
    AdminUsersComponent,
    AddUserComponent,
    AddFieldsComponent,
    AdminFieldsComponent,
    TrimPipe,
    DistritosEchartsComponent,
    PoligonosEchartsComponent,
    SectoresEchartsComponent,
    LogoutComponent,
    NotFoundComponent,
    TicketSupportComponent,
    HelpSupportComponent,
    TechnicalLogsComponent,
    AddTechnicalComponent,
    TechnicalSessionsComponent,
    TicketManagementComponent,
    ListTechnicalComponent,
    TechnicalThemesComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgMaterialModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    ComponentsModule,
    DirectivesModule,
    GoogleMapsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
    }),
    NgxPaginationModule,
    SharedModule,
    TechnicalEmailsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PagesModule { }

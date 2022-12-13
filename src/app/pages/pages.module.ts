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
import { ChartsComponent } from './charts/charts/charts.component';
import { DirectivesModule } from '../events/directives.module';
import { TrimPipe } from '../pipes/trim.pipe';


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
    ChartsComponent,
    TrimPipe
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
    GoogleMapsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PagesModule { }

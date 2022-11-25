import { AddCompanyComponent } from './add-company/add-company.component';
import { AddCompanyRedesComponent } from './add-company-redes/add-company-redes.component';
import { CommonModule } from '@angular/common';
import { HistoryCompaniesComponent } from './history-companies/history-companies.component';
import { ListCompaniesComponent } from './list-companies/list-companies.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { RouterModule } from '@angular/router';
import { ViewCompanyComponent } from './view-company/view-company.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { NgMaterialModule } from '../design/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentsModule } from '../components/components.module';
import { CompaniesOutComponent } from './companies-out/companies-out.component';

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
    CompaniesOutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgMaterialModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    ComponentsModule
  ]
})
export class PagesModule { }

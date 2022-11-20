import { AddCompanyComponent } from './add-company/add-company.component';
import { AddCompanyDescriptionComponent } from './add-company-description/add-company-description.component';
import { AddCompanyRedesComponent } from './add-company-redes/add-company-redes.component';
import { CommonModule } from '@angular/common';
import { HistoryCompaniesComponent } from './history-companies/history-companies.component';
import { ListCompaniesComponent } from './list-companies/list-companies.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { RouterModule } from '@angular/router';
import { ViewCompanyComponent } from './view-company/view-company.component';

@NgModule({
  declarations: [
    PagesComponent,
    LoginComponent,
    AddCompanyComponent,
    AddCompanyDescriptionComponent,
    AddCompanyRedesComponent,
    ListCompaniesComponent,
    HistoryCompaniesComponent,
    ViewCompanyComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class PagesModule { }

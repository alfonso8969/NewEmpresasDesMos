import { RouterModule, Routes } from '@angular/router';

import { AddCompanyComponent } from './add-company/add-company.component';
import { AddCompanyDescriptionComponent } from './add-company-description/add-company-description.component';
import { AddCompanyRedesComponent } from './add-company-redes/add-company-redes.component';
import { HistoryCompaniesComponent } from './history-companies/history-companies.component';
import { ListCompaniesComponent } from './list-companies/list-companies.component';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { ViewCompanyComponent } from './view-company/view-company.component';

const routes: Routes = [
  {
    path: 'dashboard', component: PagesComponent,
    children: [
      { path: 'add-company', component: AddCompanyComponent },
      { path: 'add-description', component: AddCompanyDescriptionComponent },
      { path: 'add-redes', component: AddCompanyRedesComponent },
      { path: 'list-companies', component: ListCompaniesComponent },
      { path: 'history-companies', component: HistoryCompaniesComponent },
      { path: 'view-company/:id', component: ViewCompanyComponent }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }

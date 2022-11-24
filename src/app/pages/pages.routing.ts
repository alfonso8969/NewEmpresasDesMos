import { RouterModule, RouterStateSnapshot, Routes, TitleStrategy } from '@angular/router';
import { AddCompanyComponent } from './add-company/add-company.component';
import { AddCompanyRedesComponent } from './add-company-redes/add-company-redes.component';
import { HistoryCompaniesComponent } from './history-companies/history-companies.component';
import { ListCompaniesComponent } from './list-companies/list-companies.component';
import { Injectable, NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { ViewCompanyComponent } from './view-company/view-company.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { Title } from '@angular/platform-browser';

@Injectable({providedIn: 'root'})
export class TemplatePageTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(`Empresas - ${title}`);
    }
  }
}

const routes: Routes = [
  {
    path: 'dashboard', component: PagesComponent,
    children: [
      { path: 'add-company', title: "Crear empresa", component: AddCompanyComponent },
      { path: 'add-redes', title: "Añadir redes", component: AddCompanyRedesComponent },
      { path: 'list-companies', title: "Listado empresas", component: ListCompaniesComponent },
      { path: 'history-companies', title: "Historial empresa", component: HistoryCompaniesComponent },
      { path: 'view-company/:id', title: "Ver empresa", component: ViewCompanyComponent },
      { path: 'list-users', title: "Listado usuarios", component: ListUsersComponent },
      { path: 'view-user/:id', title: "Ver empresa", component: ViewUserComponent }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    {provide: TitleStrategy, useClass: TemplatePageTitleStrategy},
  ]
})
export class PagesRoutingModule { }

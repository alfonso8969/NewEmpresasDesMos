import { RouterModule, RouterStateSnapshot, Routes, TitleStrategy } from '@angular/router';
import { AddCompanyComponent } from './Controller-Company/add-company/add-company.component';
import { AddCompanyRedesComponent } from './Controller-Company/add-company-redes/add-company-redes.component';
import { HistoryCompaniesComponent } from './Controller-Company/history-companies/history-companies.component';
import { ListCompaniesComponent } from './Controller-Company/list-companies/list-companies.component';
import { Injectable, NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { ViewCompanyComponent } from './Controller-Company/view-company/view-company.component';
import { ListUsersComponent } from './users/list-users/list-users.component';
import { ViewUserComponent } from './users/view-user/view-user.component';
import { Title } from '@angular/platform-browser';
import { CompaniesOutComponent } from './Controller-Company/companies-out/companies-out.component';
import { AddUserComponent } from './users/add-user/add-user.component';
import { AdminUsersComponent } from './users/admin-users/admin-users.component';
import { AdminFieldsComponent } from './admin/admin-fields/admin-fields.component';
import { AddFieldsComponent } from './admin/add-fields/add-fields.component';

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
    path: 'dashboard', title: "Página principal", component: PagesComponent,
    children: [
      { path: 'add-company', title: "Crear empresa", component: AddCompanyComponent },
      { path: 'add-redes', title: "Añadir redes", component: AddCompanyRedesComponent },
      { path: 'list-companies', title: "Listado empresas", component: ListCompaniesComponent },
      { path: 'history-companies', title: "Historial empresa", component: HistoryCompaniesComponent },
      { path: 'companies-out', title: "Empresas dshabilitadas", component: CompaniesOutComponent },
      { path: 'view-company/:id', title: "Ver empresa", component: ViewCompanyComponent },
      { path: 'list-users', title: "Listado usuarios", component: ListUsersComponent },
      { path: 'view-user/:id', title: "Ver usuario", component: ViewUserComponent },
      { path: 'add-user', title: "Añadir usuario", component: AddUserComponent },
      { path: 'admin-users', title: "Administrar usuarios", component: AdminUsersComponent },
      { path: 'edit-delete-fields', title: "Administrar campos", component: AdminFieldsComponent },
      { path: 'add-fields', title: "Crear campos", component: AddFieldsComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    { provide: TitleStrategy, useClass: TemplatePageTitleStrategy },

  ]
})
export class PagesRoutingModule { }

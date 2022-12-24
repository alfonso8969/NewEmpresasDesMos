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
import { SectoresEchartsComponent } from './benchmarks/sectores-echarts/sectores-echarts.component';
import { DistritosEchartsComponent } from './benchmarks/distritos-echarts/distritos-echarts.component';
import { PoligonosEchartsComponent } from './benchmarks/poligonos-echarts/poligonos-echarts.component';
import { AuthGuard } from '../guards/auth.guard';
import { HelpSupportComponent } from './support/help-support/help-support.component';
import { TicketSupportComponent } from './support/ticket-support/ticket-support.component';
import { TechnicalLogsComponent } from './technical/technical-logs/technical-logs.component';
import { TicketManagementComponent } from './technical/ticket-management/ticket-management.component';

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
    canActivate: [ AuthGuard ],
    children: [
      { path: 'add-company', title: "Crear empresa", component: AddCompanyComponent , data: { rol: ['ROL_ADMIN', 'ROL_SUPERADMIN'] }},
      { path: 'add-redes', title: "Añadir redes", component: AddCompanyRedesComponent, data: { rol: ['ROL_ADMIN', 'ROL_SUPERADMIN'] } },
      { path: 'list-companies', title: "Listado empresas", component: ListCompaniesComponent, data: { rol: ['ROL_USER','ROL_ADMIN', 'ROL_SUPERADMIN'] } },
      { path: 'history-companies', title: "Historial empresa", component: HistoryCompaniesComponent, data: { rol: ['ROL_USER','ROL_ADMIN', 'ROL_SUPERADMIN'] } },
      { path: 'companies-out', title: "Empresas deshabilitadas", component: CompaniesOutComponent, data: { rol: ['ROL_USER','ROL_ADMIN', 'ROL_SUPERADMIN'] } },
      { path: 'view-company', title: "Ver empresa", component: ViewCompanyComponent, data: { rol: ['ROL_USER','ROL_ADMIN', 'ROL_SUPERADMIN'] }},
      { path: 'list-users', title: "Listado usuarios", component: ListUsersComponent, data: { rol: ['ROL_USER','ROL_ADMIN', 'ROL_SUPERADMIN'] } },
      { path: 'view-user/:id', title: "Perfil usuario", component: ViewUserComponent, data: { rol: ['ROL_USER','ROL_ADMIN', 'ROL_SUPERADMIN'] } },
      { path: 'add-user', title: "Añadir usuario", component: AddUserComponent, data: { rol: ['ROL_ADMIN', 'ROL_SUPERADMIN'] } },
      { path: 'admin-users', title: "Administrar usuarios", component: AdminUsersComponent, data: { rol: ['ROL_USER', 'ROL_ADMIN', 'ROL_SUPERADMIN'] } },
      { path: 'edit-fields', title: "Administrar campos", component: AdminFieldsComponent , data: { rol: ['ROL_ADMIN', 'ROL_SUPERADMIN'] }},
      { path: 'add-fields', title: "Crear campos", component: AddFieldsComponent , data: { rol: ['ROL_ADMIN', 'ROL_SUPERADMIN'] }},
      { path: 'graph-sectores', title: "Gráficas sectores", component: SectoresEchartsComponent, data: { rol: ['ROL_USER', 'ROL_ADMIN', 'ROL_SUPERADMIN'] } },
      { path: 'graph-distritos', title: "Gráficas distritos", component: DistritosEchartsComponent, data: { rol: ['ROL_USER', 'ROL_ADMIN', 'ROL_SUPERADMIN'] } },
      { path: 'graph-poligonos', title: "Gráficas polígonos", component: PoligonosEchartsComponent, data: { rol: ['ROL_USER', 'ROL_ADMIN', 'ROL_SUPERADMIN'] } },
      { path: 'help-support', title: "Ayuda", component: HelpSupportComponent, data: { rol: ['ROL_USER','ROL_ADMIN', 'ROL_SUPERADMIN'] } },
      { path: 'ticket-support', title: "Ticket soporte", component: TicketSupportComponent, data: { rol: ['ROL_USER', 'ROL_ADMIN', 'ROL_SUPERADMIN'] } },
      { path: 'technical-logs', title: "Técnico logs", component: TechnicalLogsComponent, data: { rol: ['ROL_TECHNICAL'] } },
      { path: 'technical-sessions', title: "Técnico sesiones", component: TicketSupportComponent, data: { rol: ['ROL_TECHNICAL'] } },
      { path: 'technical-create', title: "Agregar técnico", component: TicketSupportComponent, data: { rol: ['ROL_TECHNICAL'] } },
      { path: 'technical-ticket', title: "Gestión tickets", component: TicketManagementComponent, data: { rol: ['ROL_TECHNICAL'] } },
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

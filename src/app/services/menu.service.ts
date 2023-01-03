import { Injectable } from '@angular/core';
import { User } from '../class/users';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  user: User;

  admin: boolean;
  user_rol: boolean;
  superAdmin: boolean;
  technical: boolean;

  public menu: Array<any> = []
  public menuAdminUsers: Array<any> = []
  public menuAdminFields: Array<any> = []
  public menuGraphs: Array<any> = [];
  public menuSupport: Array<any> = [];
  public menuTechnical: Array<any> = [];


  constructor(private userService: UsersService) {

    this.user = this.userService.getUserLogged();

    this.admin = Number(this.user.user_rol) === 1 ? true : false;
    this.user_rol = Number(this.user.user_rol) === 2 ? true : false;
    this.superAdmin = Number(this.user.user_rol) === 3 ? true : false;
    this.technical = Number(this.user.user_rol) === 4 ? true : false;

    this.menu = [
      {
        title: 'Empresas',
        icon: 'fa fa-building',
        rol: !this.technical,
        submenu: [
          {
            title: 'Listado empresas', url: '/dashboard/list-companies', rol: !this.technical
          },
          {
            title: 'Crear empresa', url: '/dashboard/add-company', rol: this.admin || this.superAdmin
          }
        ]
      },
      {
        title: 'Historial empresas',
        icon: 'fa fa-archive',
        rol: !this.technical,
        submenu: [
          {
            title: 'Empresas deshabilitadas', url: '/dashboard/companies-out', rol: true && !this.technical
          },
          {
            title: 'Historial', url: '/dashboard/history-companies', rol: true && !this.technical
          }
        ]
      }
    ]
    this.menuAdminUsers = [
      {
        title: 'Usuarios',
        icon: 'fa fa-id-card',
        rol: !this.technical,
        submenu: [
          {
            title: 'Listado usuarios', url: '/dashboard/list-users', rol: true && !this.technical
          },
          {
            title: 'Crear usuario', url: '/dashboard/add-user', rol: this.admin || this.superAdmin
          },
          {
            title: 'Administrar usuarios', url: '/dashboard/admin-users', rol: this.admin || this.superAdmin
          }
        ]
      }
    ]
    this.menuAdminFields = [
      {
        title: 'Administración',
        icon: 'fa fa-toolbox',
        rol: this.superAdmin,
        submenu: [
          {
            title: 'Administrar Campos', url: '/dashboard/edit-fields'
          },
          {
            title: 'Crear Campos', url: '/dashboard/add-fields'
          }
        ]
      }
    ]
    this.menuGraphs =
      [
        {
          title: 'Gráficas',
          icon: 'fa fa-chart-bar',
          rol: !this.technical,
          submenu: [
            {
              title: 'Gráfica por sectores', url: '/dashboard/graph-sectores'
            },
            {
              title: 'Gráfica por distritos', url: '/dashboard/graph-distritos'
            },
            {
              title: 'Gráfica por polígonos', url: '/dashboard/graph-poligonos'
            },
          ]
        }
      ]
    this.menuSupport =
      [
        {
          title: 'Soporte',
          icon: 'fa fa-wrench',
          rol: !this.technical,
          submenu: [
            {
              title: 'Ticket soporte', url: '/dashboard/ticket-support', rol: !this.technical
            },
            {
              title: 'Ayuda', url: '/dashboard/help-support', rol: this.user_rol
            },
            {
              title: 'Ayuda Admin', url: '/dashboard/help-support', rol: this.admin
            },
            {
              title: 'Ayuda Super Admin', url: '/dashboard/help-support', rol: this.superAdmin
            }
          ]
        }
      ]
    this.menuTechnical =
      [
        {
          title: 'Técnico',
          icon: 'fa fa-wrench',
          rol: this.technical,
          submenu: [
            {
              title: 'Gestión tickets', url: '/dashboard/technical-ticket'
            },
            {
              title: 'Logs', url: '/dashboard/technical-logs'
            },
            {
              title: 'Sesiones', url: '/dashboard/technical-sessions'
            },
            {
              title: 'Crear técnico', url: '/dashboard/technical-create'
            },
            {
              title: 'Listado de técnicos', url: '/dashboard/list-technical'
            },
            {
              title: 'Temas tickets', url: '/dashboard/technical-themes'
            }

          ]
        },
        {
          title: 'Emails',
          icon: 'fa fa-mail-bulk',
          rol: this.technical,
          submenu: [
            {
              title: 'Gestión emails', url: '/dashboard/technical-emails-management'
            },
            {
              title: 'Emails detalles', url: '/dashboard/technical-emails-details'
            },
            {
              title: 'Mandar emails', url: '/dashboard/technical-emails-send'
            }
          ]
        }
      ]
  }
}

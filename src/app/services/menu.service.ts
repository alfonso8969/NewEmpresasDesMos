import { Injectable } from '@angular/core';
import { User } from '../class/users';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  user: User;
  admin: boolean;
  user_rol: boolean;
  superAdmin: boolean;
  technical: boolean;
  support: boolean;

  public menu: Array<any> = []

  public menuAdminUsers: Array<any> = []
  public menuAdminFields: Array<any> = []

  public menuGraphs: Array<any> = [];
  public menuSupport: Array<any> = [];
  public menuTechnical: Array<any> = [];


  constructor() {
    let userLogged = localStorage.getItem('userlogged');
    if (userLogged && userLogged != "undefined") {
      console.log('localstorage userlogged MenuService: ', JSON.parse(localStorage.getItem('userlogged')!))
      this.user = JSON.parse(userLogged);
    }
    this.superAdmin = Number(this.user.user_rol) === 3 ? true : false;
    this.admin = Number(this.user.user_rol) === 1 ? true : false;
    this.user_rol = Number(this.user.user_rol) === 2 ? true : false;
    this.technical = Number(this.user.user_rol) === 4 ? true : false;
    console.log("this.user.id_rol ", this.user.user_rol);
    console.log("this.admin ", this.admin);
    this.menu = [
      {
        title: 'Empresas',
        icon: 'fa fa-building',
        rol: true && !this.technical,
        submenu: [
          {
            title: 'Listado empresas', url: '/dashboard/list-companies', rol: true && !this.technical
          },
          {
            title: 'Crear empresa', url: '/dashboard/add-company', rol: this.admin || this.superAdmin
          }
        ]
      },
      {
        title: 'Historial empresas',
        icon: 'fa fa-archive',
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
        rol: true && !this.technical,
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
          rol: true && !this.technical,
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
          rol: true && !this.technical,
          submenu: [
            {
              title: 'Ticket soporte', url: '/dashboard/ticket-support', rol: true && !this.technical
            },
            {
              title: 'Ayuda', url: '/dashboard/help-support', rol: this.user_rol
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
            }
          ]
        }
      ]
  }
}

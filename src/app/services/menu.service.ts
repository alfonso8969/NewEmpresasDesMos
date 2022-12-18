import { Injectable } from '@angular/core';
import { User } from '../class/users';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  user: User;
  admin: boolean;

  public menu: Array<any> = []

  public menuAdminUsers: Array<any> = []
  public menuAdminFields: Array<any> = []

  public menuGraphs: Array<any> = [];


  constructor() {
    let userLogged = localStorage.getItem('userlogged');
    if (userLogged && userLogged != "undefined") {
      console.log('localstorage userlogged MenuService: ', JSON.parse(localStorage.getItem('userlogged')!))
      this.user = JSON.parse(userLogged);
    }
    this.admin = Number(this.user.user_rol) === 1 ? true : false;
    console.log("this.user.id_rol ", this.user.user_rol);
    console.log("this.admin ", this.admin);
    this.menu = [
      {
        title: 'Empresas',
        icon: 'fa fa-building',
        submenu: [
          {
            title: 'Listado empresas', url: '/dashboard/list-companies', rol: true
          },
          {
            title: 'Crear empresa', url: '/dashboard/add-company', rol: this.admin
          }
        ]
      },
      {
        title: 'Historial empresas',
        icon: 'fa fa-archive',
        submenu: [
          {
            title: 'Empresas deshabilitadas', url: '/dashboard/companies-out', rol: true
          },
          {
            title: 'Historial', url: '/dashboard/history-companies', rol: true
          }
        ]
      }
    ]

    this.menuAdminUsers = [
      {
        title: 'Usuarios',
        icon: 'fa fa-id-card',
        submenu: [
          {
            title: 'Listado usuarios', url: '/dashboard/list-users', rol: true
          },
          {
            title: 'Crear usuario', url: '/dashboard/add-user', rol: this.admin
          },
          {
            title: 'Administrar usuarios', url: '/dashboard/admin-users', rol: this.admin
          }
        ]
      }
    ]

    this.menuAdminFields = [
      {
        title: 'Administración',
        icon: 'fa fa-toolbox',
        rol: this.admin,
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
  }
}

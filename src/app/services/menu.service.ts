import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  public menu = [
    {
      title: 'Empresas',
      icon: 'fa fa-building',
      submenu: [
        {
          title: 'Listado empresas', url: '/dashboard/list-companies'
        },
        {
          title: 'Crear empresa', url: '/dashboard/add-company'
        }
      ]
    },
    {
      title: 'Historial empresas',
      icon: 'fa fa-archive',
      submenu: [
        {
          title: 'Empresas deshabilitadas', url: '/dashboard/companies-out'
        },
        {
          title: 'Historial', url: '/dashboard/history-companies'
        }
      ]
    }
  ]

  public menuAdmin = [
    {
      title: 'Usuarios',
      icon: 'fa fa-id-card',
      submenu: [
        {
          title: 'Listado usuarios', url: '/dashboard/list-users'
        },
        {
          title: 'Crear usuario', url: '/dashboard/add-user'
        },
        {
          title: 'Administrar usuarios', url: '/dashboard/admin-users'
        }
      ]
    },
    {
      title: 'Administración',
      icon: 'fa fa-toolbox',
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

  public menuGraphs = [
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

  constructor() { }
}

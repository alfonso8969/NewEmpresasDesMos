import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {


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
          title: 'Empresas deshabilitadas', url: '/dashboard/history-companies'
        }
      ]
    },
    {
      title: 'Usuarios',
      icon: 'fa fa-id-card',
      submenu: [
        {
          title: 'Listado usuarios', url: '/dashboard/list-users'
        }
      ]
    }

  ]

  constructor() { }
}

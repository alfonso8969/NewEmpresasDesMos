import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Empresa } from '../class/empresa';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  // url: string = "http://localhost/api-angular-php"
  url: string = "https://alfonsogonz.es/api-angular-php"

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
          title: 'Listado usuarios', url: '/dashboard/list-user'
        }
      ]
    }
  ]

  constructor(private http: HttpClient) { }

  public getCompanies(): Observable<Empresa[]> {
     return this.http.get<Empresa[]>(`${ this.url }/listCompanies.php`);
  }

}

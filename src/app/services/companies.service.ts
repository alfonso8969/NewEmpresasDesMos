import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { Empresa } from '../class/empresa';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  url: String;
  urlDevMode: string = "http://localhost/api-angular-php"
  urlProdMode: string = "https://alfonsogonz.es/api-angular-php"

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

  constructor(private http: HttpClient) {

    if (isDevMode()) {
      console.log('Development!');
      this.url = this.urlDevMode ;
    } else {
      console.log('Production!');
      this.url = this.urlProdMode;
    }
   }

  public getCompanies(): Observable<Empresa[]> {
     return this.http.get<Empresa[]>(`${ this.url }/listCompanies.php`);
  }

}

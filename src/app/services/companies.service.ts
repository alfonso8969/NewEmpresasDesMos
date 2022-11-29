import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { Empresa } from '../class/empresa';
import { Fields } from '../interfaces/Fileds';

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
          title: 'Administrar Campos', url: '/dashboard/edit-delete-fields'
        },
        {
          title: 'Crear Campos', url: '/dashboard/add-fields'
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

  public getApi(): any {
    return this.http.get('./assets/secret/api.txt', { responseType: 'text' });
  }

  public getFields(field: string):Observable<Fields[]> {
    return this.http.post<Fields[]>(`${ this.url }/getFields.php`, { field: field} )
  }

  public getLastEmpDetId(): Observable<number> {
    return this.http.get<number>(`${ this.url }/getLastEmpDetId.php`);
  }

}

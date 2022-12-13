import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Empresa } from '../class/empresa';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  url: String = environment.apiUrl;

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
  constructor(private http: HttpClient) {

    if (isDevMode()) {
      console.log('Development!:', this.url);
    } else {
      console.log('Production!: ', this.url);
    }
   }

  public getCompanies(): Observable<Empresa[]> {
     return this.http.get<Empresa[]>(`${ this.url }/listCompanies.php`);
  }

  public getCompany(id: number): Observable<Empresa> {
     return this.http.post<Empresa>(`${ this.url }/getCompany.php`, { id: id });
  }

  getCompaniesInha() {
    return this.http.get<Empresa[]>(`${ this.url }/listCompaniesInha.php`);
  }

  getComapniesHistory(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${ this.url }/listCompaniesHistory.php`);
  }

  getComapniesHistoryHab(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${ this.url }/listCompaniesHistoryHab.php`);
  }

  addCompany(emp: Empresa): Observable<number> {
    return this.http.post<number>(`${ this.url }/addCompany.php`, { empresa: emp });
  }

  public updateCompany(emp: Empresa): Observable<number> {
    return this.http.post<number>(`${ this.url }/updateCompany.php`, { empresa: emp });
 }

  public getApi(): any {
    return this.http.get('./assets/secret/api.txt', { responseType: 'text' });
  }

  public getLastEmpDetId(): Observable<number> {
    return this.http.get<number>(`${ this.url }/getLastEmpDetId.php`);
  }

  public toAbleDisableCompany(emp: Empresa): Observable<number> {
    return this.http.post<number>(`${this.url}/ableDisableCompany.php`, { empresa: emp });
  }

}

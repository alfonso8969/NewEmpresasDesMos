import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Empresa } from '../class/empresa';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  url: string = environment.apiUrl;

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

  getCompaniesHistory(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${ this.url }/listCompaniesHistory.php`);
  }

  getCompaniesHistoryHab(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${ this.url }/listCompaniesHistoryHab.php`);
  }

  addCompany(emp: Empresa): Observable<number> {
    return this.http.post<number>(`${ this.url }/addCompany.php`, { empresa: emp });
  }

  public updateCompany(emp: Empresa): Observable<number> {
    return this.http.post<number>(`${ this.url }/updateCompany.php`, { empresa: emp });
 }

  public getApi(): any {
    return this.http.get('./assets/utils-assets/util.txt', { responseType: 'text' });
  }

  public getLastEmpDetId(): Observable<number> {
    return this.http.get<number>(`${ this.url }/getLastEmpDetId.php`);
  }

  public toAbleDisableCompany(emp: Empresa): Observable<number> {
    return this.http.post<number>(`${this.url}/ableDisableCompany.php`, { empresa: emp });
  }

}

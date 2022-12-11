import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Fields } from '../interfaces/fields';

@Injectable({
  providedIn: 'root'
})
export class FieldsService {

  url: String = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getFields(field: string):Observable<Fields[]> {
    return this.http.post<Fields[]>(`${ this.url }/getFields.php`, { field: field } )
  }

  public addField(field: Fields):Observable<number> {
    return this.http.post<number>(`${ this.url }/addField.php`, { field: field } )
  }

  public updateField(field: Fields):Observable<number> {
    return this.http.post<number>(`${ this.url }/updateFields.php`, { field: field } )
  }

  public getLastDistrito():Observable<number> {
    return this.http.get<number>(`${ this.url }/getLastDistrito.php`)
  }
}

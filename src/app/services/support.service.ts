import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Tema } from '../interfaces/tema';
import { Ticket } from '../interfaces/ticket';

@Injectable({
  providedIn: 'root'
})
export class SupportService {


  private url: string;
  private baseUrl: string;


  constructor(private http: HttpClient) {
    this.url = environment.urlPHPEmail;
    this.baseUrl = environment.apiUrl;
  }

  public getTemas(): Observable<Tema[]> {
    return this.http.get<Tema[]>(`${this.baseUrl}/getTemas.php`)
  }

  public saveTicket(ticket: Ticket): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/saveTicket.php`, { ticket: ticket })
  }
}

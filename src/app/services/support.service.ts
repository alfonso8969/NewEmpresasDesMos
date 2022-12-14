import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../class/users';
import { Tema } from '../interfaces/tema';
import { Ticket } from '../interfaces/ticket';
import { TicketByUser } from '../interfaces/ticketByUser';

@Injectable({
  providedIn: 'root'
})
export class SupportService {


  private urlEmail: string;
  private baseUrl: string;


  constructor(private http: HttpClient) {
    this.urlEmail = environment.urlPHPEmail;
    this.baseUrl = environment.apiUrl;
  }

  public getTemas(): Observable<Tema[]> {
    return this.http.get<Tema[]>(`${this.baseUrl}/getTemas.php`);
  }

  public saveTicket(ticket: Ticket): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/saveTicket.php`, { ticket: ticket });
  }

  public getTicketByUser(user: User): Observable<TicketByUser[]> {
    return this.http.post<TicketByUser[]>(`${this.baseUrl}/getTicketSupportByUser.php`, { user: user });
  }

  public getTicketTratadosByUser(code: string): Observable<TicketByUser[]> {
    return this.http.post<TicketByUser[]>(`${this.baseUrl}/getTicketTratadosByUser.php`, { code: code });
  }

  public checkTicketExitByCode(code: string): Observable<TicketByUser> {
    return this.http.post<TicketByUser>(`${this.baseUrl}/checkTicketExitByCode.php`, { code: code });
  }

  public checkTicketRefCode(code: string): Observable<TicketByUser[]> {
    return this.http.post<TicketByUser[]>(`${this.baseUrl}/checkTicketRefCode.php`, { code: code });
  }

  public markTicketFixed(code: string): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/markTicketFixed.php`, { code: code });
  }

  public insertTicketResponse(ticket: TicketByUser): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/insertTicketResponse.php`, { ticket: ticket });
  }

  public getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.baseUrl}/getTickets.php`);
  }

  public getTicketTratadosByCode(code: string): Observable<TicketByUser> {
    return this.http.post<TicketByUser>(`${this.baseUrl}/getTicketTratadosByCode.php`, { code: code });
  }
}

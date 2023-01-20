import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../class/users';
import { Email } from '../interfaces/email';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private urlEmail: string;
  private urlPHPCustomEmail: string;
  private baseUrl: string;


  constructor(private http: HttpClient) {
    this.urlEmail = environment.urlPHPEmail;
    this.urlPHPCustomEmail = environment.urlPHPCustomEmail;
    this.baseUrl = environment.apiUrl;
  }

  sendCustomEmail(data: any): Observable<any> {
    const options = new HttpHeaders()
      .set('Content-Type', 'Content-Type:text/plain; charset=UTF-8');
    return this.http.post(this.urlPHPCustomEmail, data, { headers: options });
  }

  sendEmail(data: any): Observable<any> {
    const options = new HttpHeaders()
      .set('Content-Type', 'Content-Type:text/plain; charset=UTF-8');
    return this.http.post(this.urlEmail, data, { headers: options });
  }

  public checkEmail(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/checkEmail.php`, { user: user })
  }

  /**
   * Función que recoge los emails recibidos, lo hace a través de imap
   * 
   * @return {Observable<Email[]>} Un observer de Array de Emails
   */
  public getEmails(): Observable<Email[]> {
    return this.http.get<Email[]>(`${this.baseUrl}/getEmails.php`);
  }

  /**
   * Función que recoge los emails enviados, lo hace a través de la BBDD
   * 
   * @return {Observable<Email[]>} Un observer de Array de Emails
   */
  public getEmailsResponse(): Observable<Email[]> {
    return this.http.get<Email[]>(`${this.baseUrl}/getEmailsResponse.php`);
  }
}

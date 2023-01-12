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

  private url: string;
  private baseUrl: string;


  constructor(private http: HttpClient) {
    this.url = environment.urlPHPEmail;
    this.baseUrl = environment.apiUrl;
  }

  sendEmail(data: any): Observable<any> {
    const options = new HttpHeaders()
      .set('Content-Type', 'Content-Type:text/plain; charset=UTF-8');
    return this.http.post(this.url, data, { headers: options });
  }

  public checkEmail(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/checkEmail.php`, { user: user })
  }

  public getEmails(): Observable<Email[]> {
    return this.http.get<Email[]>(`${this.baseUrl}/getEmails.php`);
  }
}

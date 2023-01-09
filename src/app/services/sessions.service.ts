import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Session } from '../interfaces/session';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {

  private urlEmail: string;
  private baseUrl: string;
  private ipAddress: string = '';

  constructor(private http: HttpClient) {
    this.urlEmail = environment.urlPHPEmail;
    this.baseUrl = environment.apiUrl;
    this.getIPAddress();
  }

  public getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.baseUrl}/getSessions.php`);
  }

  public setSession(session: Session): Observable<number> {
    session.ip = this.ipAddress;
    return this.http.post<number>(`${this.baseUrl}/setSession.php`, { session: session });
  }

  public getIPAddress(): void {
    this.http.get("https://api.ipify.org/?format=json").subscribe((res: any)=>{
      this.ipAddress = res.ip;
      console.log("IP: ", this.ipAddress);
    });
  }
}

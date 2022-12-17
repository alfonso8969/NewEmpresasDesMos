import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../class/users';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl = environment.apiUrl;

  @Output() userEmitter: EventEmitter<User> = new EventEmitter();

  constructor(private http: HttpClient) { }

  public login(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/login.php`, { user: user })
    .pipe(map( (Users: User) => {
      console.log('Users: ', Users);
      localStorage.setItem('userlogged', JSON.stringify(Users));
      this.userEmitter.emit(Users);
      this.setToken(Users.user_name);
      return Users;
    }));
  }

  public checkPassword(user: User): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/checkPassword.php`, { user: user })
  }

  private setToken(token: string) {
    localStorage.setItem('token', token);
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public isLoggedIn() {
    const userToken = this.getToken();
    if (userToken != null){
      return true;
    }
    return false;
  }

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userlogged');
    localStorage.removeItem('remember');
  }
}


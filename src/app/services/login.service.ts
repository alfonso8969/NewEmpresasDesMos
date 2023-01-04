import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { User } from '../class/users';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl = environment.apiUrl;
  roleAs: number;

  @Output() userEmitter: EventEmitter<User> = new EventEmitter();

  constructor(private http: HttpClient) { }

  public login(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/login.php`, { user: user })
    .pipe(map( (Users: User) => {
      console.log('Users: ', Users);
      this.roleAs = Users.user_rol;
      if (this.roleAs) {
        localStorage.setItem('userLogged', JSON.stringify(Users));
        sessionStorage.setItem('userLogged', JSON.stringify(Users));
        localStorage.setItem('ROLE', this.roleAs.toString());
        this.userEmitter.emit(Users);
        this.setToken(Users.user_name);
      }
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
    return userToken != null;
  }

  getRole() {
    this.roleAs = Number(localStorage.getItem('ROLE')!);
    return this.roleAs;
  }

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userLogged');
    localStorage.removeItem('ROLE');
    localStorage.removeItem('remember');
  }
}


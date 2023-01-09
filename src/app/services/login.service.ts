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

  public $l(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/login.php`, { user: user })
    .pipe(map( (Users: User) => {
      console.log('Users: ', Users);
      this.roleAs = Users.user_rol;
      if (this.roleAs) {
        localStorage.setItem('userLogged', JSON.stringify(Users));
        sessionStorage.setItem('userLogged', JSON.stringify(Users));
        localStorage.setItem('ROLE', this.roleAs.toString());
        this.userEmitter.emit(Users);
        this.sT(Users.user_name);
      }
      return Users;
    }));
  }

  /**
   * Check Password
   * @param {User} user Usuario to check password
   * @returns {Observable<boolean} true if exits, otherwise false 
   */
  public cP(user: User): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/checkPassword.php`, { user: user })
  }

  /**
   * Set Token
   * @param {string} token Token to auth
   */
  private sT(token: string): void {
    localStorage.setItem('token', token);
  }

  /**
   * Get Token
   * @returns {string | null } Token auth
   */
  public gT(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * User is logged
   * @returns {boolean} true if the user is logged, otherwise false 
   */
  public isLoggedIn(): boolean {
    const userToken = this.gT();
    return userToken != null;
  }

  /**
   * Get Rol
   * @returns {number} rol User Rol
   */
  gR(): number {
    this.roleAs = Number(localStorage.getItem('ROLE')!);
    return this.roleAs;
  }

  /**
   * Logout
   */
  public lG(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userLogged');
    localStorage.removeItem('ROLE');
    localStorage.removeItem('remember');
  }
}


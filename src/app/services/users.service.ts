import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../class/users';
import { Address } from '../interfaces/address';
import { TechnicalInsert } from '../interfaces/technicalInsert';

@Injectable({
  providedIn: 'root'
})
export class UsersService {


  url: string = environment.apiUrl;
  user: User;

  constructor(private http: HttpClient) {
    if (isDevMode()) {
      console.log('Development!:', this.url);
    } else {
      console.log('Production!: ', this.url);
    }
  }

  /**
   * Función que regresa al usuario logueado correctamente
   */
  public getUserLogged(): User {
    let userLogged = localStorage.getItem('userLogged');
    if (userLogged && userLogged != "undefined") {
      console.log('localStorage userLogged LoginService: ', JSON.parse(localStorage.getItem('userLogged')!))
      this.user = JSON.parse(userLogged);
    }

    return this.user;
  }

  /**
   * Función que regresa al usuario por Id desde la Base de Datos
   * @param { number } id Id del usuario
   * @returns { Observable<User> } User
   * @public
   */
  public getUser(id: number): Observable<User> {
    return this.http.post<User>(`${this.url}/getUser.php`, { id: id });
  }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/listUsers.php`);
  }

  public getUsersEnabled(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/listUsersEnabled.php`);
  }

  public getUsersDisabled(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/listUsersDisabled.php`);
  }

  public addUser(user: User): Observable<number> {
    return this.http.post<number>(`${this.url}/addUser.php`, { user: user });
  }

  public updateUser(user: User): Observable<number> {
    return this.http.post<number>(`${this.url}/updateUser.php`, { user: user });
  }

  public updateRolUser(user: User): Observable<number> {
    return this.http.post<number>(`${this.url}/updateRolUser.php`, { user: user });
  }

  public toAbleDisableUser(user: User): Observable<number> {
    return this.http.post<number>(`${this.url}/ableDisableUser.php`, { user: user });
  }

  public resetPassword(user: User): Observable<number> {
    return this.http.post<number>(`${this.url}/resetPassword.php`, { user: user });
  }

  public addTechnical(formData: TechnicalInsert): Observable<number>  {
    return this.http.post<number>(`${this.url}/addTechnical.php`, { formData: formData });
  }

  public updateTechnical(formData: TechnicalInsert): Observable<number>  {
    return this.http.post<number>(`${this.url}/updateTechnical.php`, { formData: formData });
  }

  public getUserAddress(id: number): Observable<Address> {
    return this.http.post<Address>(`${this.url}/getUserAddress.php`, { id: id });
  }
}

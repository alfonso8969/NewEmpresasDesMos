import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../class/users';
import { Fields } from '../interfaces/fields';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  url: String = environment.apiUrl;

  constructor(private http: HttpClient) {
    if (isDevMode()) {
      console.log('Development!:', this.url);
    } else {
      console.log('Production!: ', this.url);
    }
  }


  public getUser(id: number): Observable<User> {
    return this.http.post<User>(`${this.url}/getUser.php`, { id: id });
  }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/listUsers.php`);
  }

  public getUsersHab(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/listUsersHab.php`);
  }

  public getUsersInha(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/listUsersInha.php`);
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
}

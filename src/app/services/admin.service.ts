import { Injectable } from '@angular/core';
import { User } from '../class/users';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  user: User;
  isAdmin: boolean;

  constructor() { }

  public setLocalStrorage(user: User): void {

  }
}

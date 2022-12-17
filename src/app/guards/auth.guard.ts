import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return this.isLogin();
  }

  isLogin(): any {
    if (this.loginService.isLoggedIn()) {
      console.log('estoy logueado');
      return true;
    }

    console.log('no estoy logueado');
    return false;
  }

}

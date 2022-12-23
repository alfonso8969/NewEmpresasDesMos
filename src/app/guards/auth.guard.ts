import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import Swal from 'sweetalert2';
import { Roles } from '../interfaces/roles';
import { LoginService } from '../services/login.service';
import { User } from 'src/app/class/users';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  user: User;
  
  constructor(private loginService: LoginService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    let url: string = state.root.children[0].url[0].path;
    return this.isLogin(route, url);

  }

  isLogin(route: ActivatedRouteSnapshot, url: any): any {
    if (this.loginService.isLoggedIn()) {
      let userLogged = localStorage.getItem('userlogged');
      if (userLogged && userLogged != "undefined") {
        console.log('localstorage userlogged: ', JSON.parse(localStorage.getItem('userlogged')!))
        this.user = JSON.parse(userLogged);
      }
      const userRol = this.loginService.getRole();
      console.log('estoy logueado');
      let roles: Roles[] = route.children[0] != undefined && route.children[0].data['rol'];
      let found: Roles | undefined;
      if (roles) {
        found = roles.find(r => Number(Roles[r.valueOf()]) === userRol);
        if (found) {
          return true;
        } else {
          Swal.fire({
            title: 'Login',
            html: `<p>EL usuario ${ this.user.user_name } no tiene permisos</p>
            <p>Pongase en contacto con el administrador, Muchas gracias</p>`,
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          });
          this.router.navigateByUrl(url);
          return false;
        }
      }
      return true;
    }

    console.log('no estoy logueado');
    this.router.navigate(['login']);
    return false;
  }
}

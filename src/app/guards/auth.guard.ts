import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import Swal from 'sweetalert2';
import { Roles } from '../interfaces/roles';
import { LoginService } from '../services/login.service';
import { User } from 'src/app/class/users';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  user: User;
  
  constructor(private loginService: LoginService,
              private userService: UsersService,
              private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    let url: string = state.root.children[0].url[0].path;
    return this.isLogin(route, url);
  }

  isLogin(route: ActivatedRouteSnapshot, url: any): any {
    if (this.loginService.isLoggedIn()) {
      this.user = this.userService.getUserLogged();
      const userRol = this.loginService.getRole();
      console.log('estoy logueado');
      let roles: Roles[] = route.children[0] != undefined ? route.children[0].data['rol'] : route.data['rol'];
      let found: Roles | undefined;
      if (roles && Number(Roles[roles[0].valueOf()]) != Roles.ALL) {
        found = roles.find(r => Number(Roles[r.valueOf()]) === userRol);
        if (found) {
          return true;
        } else {
          Swal.fire({
            title: 'Login',
            html: `<p>EL usuario ${ this.user.user_name } no tiene permisos</p>
            <p>Póngase en contacto con el administrador, Muchas gracias</p>`,
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

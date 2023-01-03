import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, ViewChild, isDevMode } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DetailComponent } from 'src/shared/components/detail/detail.component';
import { CookieService } from 'ngx-cookie-service';
import { CompaniesService } from '../services/companies.service';
import { MenuService } from '../services/menu.service';
import { LoginService } from '../services/login.service';
import { UsersService } from '../services/users.service';
import { User } from '../class/users';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  longText = `Establecer objetivos es el primer paso para convertir lo invisible en visible.`;
  longText2 = `Nuestras vidas están definidas por oportunidades, incluso las que perdemos.`;
  longText3 = `No son los individuos los que hacen las empresas exitosas, sino los equipos.`;


  @ViewChild(DetailComponent, { static: false }) parentDetail: DetailComponent;

  // tslint:disable-next-line: no-output-native
  @Output() close: EventEmitter<boolean>;

  public linkMoreIfoCookies: string;
  public showDetail: boolean;
  private cookieExists: boolean;

  public user: User;
  public user_rol_technical: boolean;
  public url: string = environment.apiUrl;
  private expiredDate: Date;

  // google maps
  @ViewChild('myMap') map: GoogleMap;
  apiLoaded: Observable<boolean>;
  center: google.maps.LatLngLiteral = { lat: 40.323319593781754, lng: -3.867631361170662 };
  zoom: number = 14.5;

  viewDashBoard: boolean = false;

  constructor(public menuService: MenuService,
    public companiesService: CompaniesService,
    private _router: Router,
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private loginService: LoginService,
    private userService: UsersService,
  ) {

    this.user = this.userService.getUserLogged();
    let user_rol = Number(this.user.user_rol);
    this.user_rol_technical = user_rol === 4 ? true : false;
    let login = localStorage.getItem('login');
    if(!Boolean(login)) {
      this._router.navigateByUrl("login")
    }

    this.companiesService.getApi()
      .subscribe((data: any) => {
        let key = isDevMode() ? '' : data;
        this.apiLoaded = this.httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=' + key, 'callback')
          .pipe(
            map(() => true),
            catchError(() => of(false))
          );
      });

    console.log("ruta: ", this._router.url);

    if (this._router.url === '/dashboard' || this._router.url === '/dashboard#no-back-button') {
      this.viewDashBoard = true;
    }

    this.cookieExists = cookieService.check('Cookie');
    // Event when closing the detail
    this.close = new EventEmitter<boolean>();

    this.linkMoreIfoCookies = `https://policies.google.com/technologies/cookies?hl=es-419`;
    this.cookieExists ?
      this.showDetail = false :
      this.showDetailSetTime();
  }

  ngOnInit(): void {
  }

  navigateTo(url: string, event: any) {
    let aes = document.querySelectorAll('a');
    aes.forEach(a => a.classList.remove('active'));
    event.target.className = "active " + event.target.className;
    this.viewDashBoard = false;
    this._router.navigate([url]);
  }

  funcViewDashboard() {
    this._router.navigate(["/dashboard"])
      .then(() => {
        window.location.reload();
      });
  }

  /**
 * Close the detail
 * @param $event Window status
 */
  closeDetail($event: boolean) {
    this.animationClose();
    this.close.emit($event);
  }

  public showDetailSetTime(): void {
    setTimeout(() => {
      this.showDetail = true;
    }, 600);
  }

  saveGDPR() {
    this.expiredDate = new Date();
    this.expiredDate.setDate( this.expiredDate.getDate() + 15);
    const secure = true;
    this.cookieService.set('Cookie', 'GDPR', this.expiredDate, '', '', secure);
    this.animationClose();
    this.parentDetail.closeDetail();
  }

  refuseCookies() {
    this.cookieService.set('Cookie', 'No-GDPR');
    this.animationClose();
    this.parentDetail.closeDetail();
  }

  animationClose() {
    setTimeout(() => {
      this.showDetail = false;
    }, 600);
  }

  logout() {
    let remember = localStorage.getItem('remember');
    let title = remember ? '¿Está seguro de querer cerrar la sesión?' : 'Salir';
    let message = remember ? 'Si cierra la sesión, deberá volver a iniciar sesión para poder acceder a la aplicación'
      : '¿Está seguro de querer salir de la aplicación?';

    let confirmButtonText = remember ? 'Si, cerrar sesión' : 'Si, salir';

    Swal.fire({
      title: title,
      html: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: "Cancelar",
      confirmButtonText: confirmButtonText
    }).then((confirm) => {
      if (confirm.isConfirmed) {
        this.loginService.logout();
        this._router.navigateByUrl('/login')
        .then(() => {
          window.location.reload();
        });
      }
    });
  }

  exit() {
    if (Boolean(localStorage.getItem('remember'))) {
      this._router.navigateByUrl('exit');
    } else {
      this.loginService.logout();
      this._router.navigateByUrl('exit')
      .then(() => {
        window.location.reload();
      });
    }
  }
}


import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, ViewChild, isDevMode } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DetailComponent } from 'src/shared/components/detail/detail.component';
import { User } from '../class/users';
import { CompaniesService } from '../services/companies.service';
import { CookieService } from 'ngx-cookie-service';
import { MenuService } from '../services/menu.service';
import { LoginService } from '../services/login.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  longText = `Establecer ojetivos es el primer paso para convertir lo invisible en visible.`;
  longText2 = `Nuestras vidas están definidas por oportunidades, incluso las que perdemos.`;
  longText3 = `No son los individuos los que hacen las empresas exitosas, sino los equipos.`;


  @ViewChild(DetailComponent, { static: false }) parentDetail: DetailComponent;

  // tslint:disable-next-line: no-output-native
  @Output() close: EventEmitter<boolean>;

  linkMoreIfoCookies: string;
  public showDetail: boolean;
  private cookieExists: boolean;

  user: User;
  user_rol_technical: boolean;
  url: string = environment.apiUrl;

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
    private loginService: LoginService
  ) {
    let userLogged = localStorage.getItem('userlogged');
    if (userLogged && userLogged != "undefined") {
      console.log('localstorage userlogged: ', JSON.parse(localStorage.getItem('userlogged')!))
      this.user = JSON.parse(userLogged);
      let user_rol = Number(this.user.user_rol);
      this.user_rol_technical = user_rol === 4 ? true : false;

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
      this.showDetailsetTime();
  }

  ngOnInit(): void {
  }

  navigateTo(url: string, event: any) {
    let aes = document.querySelectorAll('a');
    aes.forEach(a => a.classList.remove('active'));
    event.target.className = "active " + event.target.className;
    this.viewDashBoard = false;
    this._router.navigateByUrl(url);
  }

  functViewDashboard() {
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

  public showDetailsetTime(): void {
    setTimeout(() => {
      this.showDetail = true;
    }, 600);
  }

  saveGDPR() {
    this.cookieService.set('Cookie', 'GDPR');
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

    let confirmButtonText = remember ? 'Si, cerrar sessión' : 'Si, salir';

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
      }
    });
  }

  exit() {
    this._router.navigateByUrl('exit');
  }
}


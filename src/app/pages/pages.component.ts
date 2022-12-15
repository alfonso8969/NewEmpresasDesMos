import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DetailComponent } from 'src/shared/components/detail/detail.component';
import { User } from '../class/users';
import { CompaniesService } from '../services/companies.service';
import { CookieService } from 'ngx-cookie-service';
import { MenuService } from '../services/menu.service';

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
  url: string = environment.apiUrl;

  // google maps
  @ViewChild('myMap') map: GoogleMap;
  apiLoaded: Observable<boolean>;
  center: google.maps.LatLngLiteral = { lat: 40.3095534, lng: -3.9005684 };
  zoom: number = 13;

  viewDashBoard: boolean = false;

  constructor(public menuService: MenuService,
              public companiesService: CompaniesService,
              private _router: Router,
              private httpClient: HttpClient,
              private cookieService: CookieService
              ) {
    this.user = new User();
    this.user.setUser_name("Alfonso José");
    this.user.setUser_email("alfonso8969@gmail.com");
    this.user.setUser_img("alfonso.jpg");

    this.companiesService.getApi()
      .subscribe((data: any) => {
        this.apiLoaded = this.httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key='/* + data*/, 'callback')
          .pipe(
            map(() => true),
            catchError(() => of(false))
          );
      });

    console.log()//("ruta: ", this._router.url);

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
    this._router.navigateByUrl('/login')
  }
}

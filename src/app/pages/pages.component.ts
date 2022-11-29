import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { CompaniesService } from '../services/companies.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;

  // google maps
  @ViewChild('myMap') map: GoogleMap;
  apiLoaded: Observable<boolean>;
  center: google.maps.LatLngLiteral = { lat: 40.3095534, lng: -3.9005684 };
  zoom: number = 10;

  viewDashBoard: boolean = false;

  constructor(public companiesService: CompaniesService, private _router: Router, private httpClient: HttpClient) {
    this.companiesService.getApi()
      .subscribe((data: any) => {
        this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=' + data, 'callback')
          .pipe(
            map(() => true),
            catchError(() => of(false))
          );
      });
    console.log("ruta: ", this._router.url);
    if (this._router.url === '/dashboard' || this._router.url === '/dashboard#no-back-button') {
      this.viewDashBoard = true;
    }

  }

  ngOnInit(): void {
  }

  navigateTo(url: string, event: any) {
    event.target.className = "active";
    this.viewDashBoard = false;
    this._router.navigateByUrl(url);
  }

  functViewDashboard() {
    this._router.navigate(["/dashboard"])
      .then(() => {
        window.location.reload();
      });
  }

  logout() {
    this._router.navigateByUrl('/login')
  }
}

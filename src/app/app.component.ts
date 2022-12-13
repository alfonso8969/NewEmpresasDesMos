import { Component, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { DetailComponent } from 'src/shared/components/detail/detail.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnDestroy {
  title = 'NewEmpresasMs';

  
  @ViewChild(DetailComponent, { static: false }) parentDetail: DetailComponent;

  // tslint:disable-next-line: no-output-native
  @Output() close: EventEmitter<boolean>;

  linkMoreIfoCookies: string;
  public showDetail: boolean;
  private cookieExists: boolean;

  private mySubscription: Subscription;

  constructor(private router: Router, private cookieService: CookieService) {

    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
         // Trick the Router into believing it's last link wasn't previously loaded
         this.router.navigated = false;
      }
    });

    this.cookieExists = cookieService.check('Cookie');
    // Event when closing the detail
    this.close = new EventEmitter<boolean>();

    this.linkMoreIfoCookies = `https://policies.google.com/technologies/cookies?hl=es-419`;
    this.cookieExists ?
    this.showDetail = false :
    this.showDetail = true;
  }

  /**
   * Close the detail
   * @param $event Window status
   */
  closeDetail($event: boolean) {
    this.animationClose();
    this.close.emit($event);
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

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
}

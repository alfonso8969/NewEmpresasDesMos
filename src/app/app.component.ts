import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnDestroy {
  title = 'NewEmpresasMs';


  private mySubscription: Subscription;

  constructor(private router: Router,
              private loginService: LoginService) {

    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
         // Trick the Router into believing it's last link wasn't previously loaded
         this.router.navigated = false;
      }
    });

  }



  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }

    if (localStorage.getItem('remember') == "false") {
      this.loginService.lG();
    }
  }
}

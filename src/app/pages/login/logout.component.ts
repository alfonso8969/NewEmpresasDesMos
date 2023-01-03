import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/src/ScrollTrigger";
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {


  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any) {
    console.log('window:beforeunload', event);
    console.log('route', this.router);
    this.router.navigate(['/externalRedirect', { externalUrl: 'https:/alfonsogonz.es/' }]);
    return false;
  }

  isActive: boolean = true;
  title: string = "Admin Empresas";
  
  constructor(private router: Router) {
    localStorage.removeItem('login');
    this.showMessage();
  }

  private showMessage(): void {
    setTimeout(() => {
      Swal.fire({
        title: 'Salir de Admin Empresas',
        html: '<p>Gracias por usa la aplicación</p><p>Vuelva cuando quiera, le estaremos esperando</p>',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, salir',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((confirm) => {
        if (confirm.isConfirmed) {
          this.router.navigate(['/externalRedirect', { externalUrl: 'https:/alfonsogonz.es/' }]);
        } else {
          window.history.forward();
          window.history.go(1);
          window.location.hash = "no-back-button";
          window.location.hash = "Again-No-back-button" //chrome
          window.onhashchange = function () { window.location.hash = "no-back-button"; }
          // console.clear();
          gsap.registerPlugin(ScrollTrigger);
          gsap.to('progress', {
            value: 0,
            ease: 'none',
            scrollTrigger: {
              scrub: 0.3
            }
          });
        }
      })
    }, 600);
  }
}

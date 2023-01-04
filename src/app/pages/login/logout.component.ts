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

 @HostListener('window:beforeunload', [ '$event' ])
 beforeUnloadHandler(event: any) {
  console.log('window:beforeunload', event)
  alert('¿Está seguro de querer cerrar la sesión?');
  this.router.navigate(['/externalRedirect', { externalUrl: 'https://unseen.co/labs/webgl-rain/' }]);
  return false;
 }

  title: string = "Admin Empresas";

  constructor(private router: Router) {
    window.history.forward();
    window.history.go(0);
    window.location.hash = "no-back-button";
    window.location.hash = "Again-No-back-button" //chrome
    window.onhashchange = function () { window.location.hash = "no-back-button"; }
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
          this.router.navigate(['/externalRedirect', { externalUrl: 'https://unseen.co/labs/webgl-rain/' }]);
        } else {          
          console.clear();
        }
      })
    }, 300);
  }
}

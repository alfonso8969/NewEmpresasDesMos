import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {


  @HostListener('window:beforeunload', [ '$event' ])
   beforeUnloadHandler(event: any) {
    console.log('window:beforeunload', event);
    console.log('route',  this.router);
    this.router.navigate(['/externalRedirect', { externalUrl: 'https:/alfonsogonz.es/' }]);
    return false;
   }

  isActive: boolean = true;
  title: string = "Admin Empresas";

  constructor(private router: Router) {
    this.showMessage();
  }

  ngOnInit(): void {

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
        confirmButtonText: 'Si, salir'
      }).then((confirm) => {
        if (confirm.isConfirmed) {
          this.router.navigate(['/externalRedirect', { externalUrl: 'https:/alfonsogonz.es/' }]);
        } else {
          this.isActive = false;
          window.location.hash = "no-back-button";
          window.location.hash = "Again-No-back-button" //chrome
          window.onhashchange = function () { window.location.hash = "no-back-button"; }
        }
      })
    }, 600);
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/class/users';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  user: User;


  passwordHtml: HTMLElement;
  passwordIcon: HTMLElement;

  constructor(private router: Router,
              private fb: FormBuilder,
              private loginService: LoginService) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      checkboxsignup: ['']
    });
    let userLogged = localStorage.getItem('userlogged');
    let remember = localStorage.getItem('remember');
    if (userLogged && userLogged != "undefined" && remember == "true") {
      console.log('localstorage userlogged: in login ', JSON.parse(localStorage.getItem('userlogged')!))
      this.user = JSON.parse(userLogged);
      this.router.navigateByUrl("/dashboard")
      .then(() => {
        window.location.reload();
      });
    }
  }

  ngOnInit(): void {
    this.passwordHtml = document.getElementById('password')!;
    this.passwordIcon = document.getElementById('togglePassword')!;

    this.passwordIcon.addEventListener('click', (e) => {
      this.changeEye(this.passwordIcon, this.passwordHtml);
      this.changeEyeTime(this.passwordIcon, this.passwordHtml);
    });
  }

  public changeEye(element: HTMLElement, elementClose: HTMLElement):  void {
    const type = elementClose.getAttribute('type') === 'password' ? 'text' : 'password';
    elementClose.setAttribute('type', type);
    const clase = element.getAttribute('class')=== 'far fa-eye' ? 'far fa-eye-slash' : 'far fa-eye';
    element.setAttribute('class', clase)!;
  }

  public changeEyeTime(element: HTMLElement, elementClose: HTMLElement ): void {
    setTimeout(() => {
      this.changeEye(element, elementClose);
    }, 2000);
  }

  login() {
    this.user = new User();
    let remember = this.loginForm.get('checkboxsignup')!.value;
    if (remember) {
      localStorage.setItem('remember', "true");
    }
    this.user.user_password = this.loginForm.get('password')!.value;
    this.user.user_email = this.loginForm.get('email')!.value;
    this.loginService.login(this.user).subscribe({
      next: (user: User) => {
        if (user.id_user) {
          if (Number(user.habilitado) === 0) {
            Swal.fire({
              title: 'Login',
              html: `<p>El usuario ${ user.user_name } está deshabilitado</p>
              <p>Pongase en contacto con el administrador, Muchas gracias</p>`,
              icon: 'warning',
              confirmButtonText: 'Aceptar'
            });
            return;
          }
          this.router.navigateByUrl("/dashboard")
          .then(() => {
            window.location.reload();
          });
        } else {
          Swal.fire({
            title: 'Login',
            text: `Las claves no son correctas`,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      },
      error: (error: any) => {
        console.log("Error: ", error);
        Swal.fire({
          title: 'Login',
          html: `<p>Se produjo un error al loguearse el usuario</p>`,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      },
      complete: () => console.log("Complete User: ", this.user)
    });
  }

}

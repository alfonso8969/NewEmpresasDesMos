import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/class/users';
import { EmailService } from 'src/app/services/email.service';
import { LoginService } from 'src/app/services/login.service';
import { UsersService } from 'src/app/services/users.service';
import { Utils } from 'src/app/utils/utils';
import Swal, { SweetAlertIcon } from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  user: User;

  passwordHtml: HTMLElement;
  passwordIcon: HTMLElement;

  public dataForm = {
    name: '',
    email: '',
    message: '',
    from: 'Admin Empresas',
    password: false
  };

  private sendEmailResult = {
    title: '',
    message: ''
  };

  sendEmailMessages = {
    titleerror: "Error",
    titlesuccess: "Correcto",
    nodata: "Los datos enviados no pueden estar vacios",
    messageerror: "Hubo algún error enviando el correo",
    messagesuccess: "El correo fue enviado correctamente",
  }

  load: boolean;

  constructor(private router: Router,
              private fb: FormBuilder,
              private loginService: LoginService,
              private emailService: EmailService,
              private userService: UsersService) {

    this.load = false;

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(Utils.emailReg)]],
      password: ['', [Validators.required, Validators.pattern(Utils.passwordReg)]],
      checkboxsignup: ['']
    });

    this.forgotPasswordForm = this.fb.group({
      emailRecover: ['', [Validators.required, Validators.pattern(Utils.emailReg)]],
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
    localStorage.removeItem('remember');
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

  public recoverPasswordShow(): void {
    let a = document.getElementById('to-recover')!;
    a.innerText = a.innerText == "Olvidó la contraseña?" ? "Cerrar olvidó" : "Olvidó la contraseña?"
    let form = document.getElementById('recoverform')!;
    let clase = form.getAttribute('class')!;
    if (clase?.includes('showRecoverForm')) {
      let clases: string[] = clase.split(' ');
      clases.splice(clases.indexOf('showRecoverForm'), 1);
      form.setAttribute('class', clases.join(' '));
    } else {
      form.setAttribute('class', clase + ' showRecoverForm');
    }

  }

  public recoverPassword(email: string): void {
    console.log(email);
    this.checkEmail(email);
  }

  private checkEmail(email: string): void {
    this.load = true;
    let userEmail: User = new User();
    userEmail.user_email = email;
    this.emailService.checkEmail(userEmail)
      .subscribe({
        next: (data: User) => {
          if(data.user_name != undefined) {
            userEmail.user_name = data.user_name;
            userEmail.user_lastName = data.user_lastName;
            let match = false;
            let newPassword = '';
            do {
              newPassword = Utils.makeString(9);
              match = Utils.passwordReg.test(newPassword);
            } while (!match);

            if(match) {
              userEmail.user_password = newPassword;
              this.userService.resetPassword(userEmail)
              .subscribe({
                next: (data: number) => {
                  if (data === 1) {
                    this.dataForm = {
                      name: userEmail.user_name + ' ' + userEmail.user_lastName,
                      email: userEmail.user_email,
                      message: Utils.getTemplateEmail(userEmail.user_name, userEmail.user_lastName, newPassword),
                      from: 'Empresas Admin',
                      password: true
                    }
                    this.sendEmail();
                  }
                }, error: (error: any) => {
                  console.log(error)
                  alert("Hubo un error al resetear la contraseña")
                  this.load = false;
                }
              });
            } else {
              alert("Hubo un problema regenerando el código de la contraseña");
              this.load = false;

            }
          } else {
            this.load = false;
            Swal.fire({
              title: 'Recuperar contraseña',
              text: `El email ${ email },  no está registrado`,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
      }, error: (error:any) => {
        this.load = false;
        Swal.fire({
          title: 'Recuperar contraseña',
          text: `Hubo un error al comprobar el email: ${ email }`,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }, complete: () => console.log('Check email complete')
    });

  }

  private sendEmail(): void {

    this.emailService.sendEmail(this.dataForm).subscribe({
     next: (result: any) => {
      this.load = false;
      console.log('ContactComponent response', result);
      if (result.title.includes('error')) {
        this.showSwal('error');
        return;
      }
      this.sendEmailResult.title = this.sendEmailMessages.titlesuccess;
      this.sendEmailResult.message = this.sendEmailMessages.messagesuccess;
      this.showSwal('success');
     }, error: (error: any) => {
      this.load = false;
      this.sendEmailResult.title = this.sendEmailMessages.titleerror;
      this.sendEmailResult.message = error.message;
      this.showSwal('error');
      console.log('Login send email Error', error);
     }, complete: () => console.log("Complete send email")
    });
  }

  private clearDataForm(): void {
    this.dataForm = {
      name: '',
      email: '',
      message: '',
      from: '',
      password: false
    };
  }

  private showSwal(option: SweetAlertIcon): void {
    this.clearDataForm();
    Swal.fire({
      icon: option,
      title: this.sendEmailResult.title,
      text: this.sendEmailResult.message,
    });
    this.forgotPasswordForm.get('emailRecover')?.setValue('');
    this.forgotPasswordForm.markAsUntouched();
    this.recoverPasswordShow();
  }

}

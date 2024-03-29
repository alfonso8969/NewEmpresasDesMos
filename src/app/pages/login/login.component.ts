import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { User } from 'src/app/class/users';
import { Session } from 'src/app/interfaces/session';
import { EmailService } from 'src/app/services/email.service';
import { LoginService } from 'src/app/services/login.service';
import { SessionsService } from 'src/app/services/sessions.service';
import { LogsService } from 'src/app/services/logs.service';
import { UsersService } from 'src/app/services/users.service';
import { Utils } from 'src/app/utils/utils';
import Swal, { SweetAlertIcon } from 'sweetalert2'
import { Log } from 'src/app/interfaces/log';

// Crypto
declare function hex_sha512(pass: string): string;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [DatePipe]

})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  user: User;
  session: Session;
  log: Log;

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
    titleError: "Error",
    titleSuccess: "Correcto",
    noData: "Los datos enviados no pueden estar vacíos",
    messageError: "Hubo algún error enviando el correo",
    messageSuccess: "El correo fue enviado correctamente",
  }

  load: boolean;
  viewRecoverForm: boolean;
  viewSingUpForm: boolean;

  constructor(private router: Router,
    private fb: FormBuilder,
    private loginService: LoginService,
    private emailService: EmailService,
    private userService: UsersService,
    private sessionService: SessionsService,
    private logService: LogsService,
    private datePipe: DatePipe) {

    this.load = false;
    this.viewRecoverForm = false;
    this.viewSingUpForm = false;

    this.session = {
      id_user: 0,
      user_email: '',
      date: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss')!,
      message: '',
      complete: false
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(Utils.emailReg)]],
      password: ['', [Validators.required, Validators.pattern(Utils.passwordReg)]],
      checkBoxSignup: ['']
    });

    this.forgotPasswordForm = this.fb.group({
      emailRecover: ['', [Validators.required, Validators.pattern(Utils.emailReg)]],
    });

    let userLogged = this.userService.getUserLogged();
    let remember = localStorage.getItem('remember');
    if (userLogged && remember == "true") {
      this.user = userLogged;
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
      Utils.changeEye(this.passwordIcon, this.passwordHtml);
      Utils.changeEyeTime(this.passwordIcon, this.passwordHtml);
    });
  }

  /**
   * Función login
   */
  $l() {
    this.load = true;
    this.user = new User();
    let remember = this.loginForm.get('checkBoxSignup')!.value;
    if (remember) {
      localStorage.setItem('remember', "true");
    } else {
      localStorage.setItem('remember', "false");
    }
    this.user.user_password = hex_sha512(this.loginForm.get('password')!.value);
    this.user.user_email = this.loginForm.get('email')!.value;
    this.log = this.logService.initLog();
    this.log.action = 'Login';

    this.loginService.$l(this.user).subscribe({
      next: (user: User) => {
        if (user.id_user) {
          this.user = user;
          this.session.id_user = user.id_user;
          this.session.user_email = user.user_email;
          this.log.user_email = user.user_email;
          if (user.habilitado == 0) {
            this.session.message = "El usuario esta deshabilitado";
            this.session.complete = false;
            this.setSession(this.session);
            Swal.fire({
              title: 'Login',
              html: `<p>El usuario ${user.user_name} está deshabilitado</p>
              <p>Póngase en contacto con el administrador, Muchas gracias</p>`,
              icon: 'warning',
              confirmButtonText: 'Aceptar'
            });
            this.load = false;
            this.log.id_user = 0;
            return;
          }
          this.log.id_user = user.id_user;
          this.session.message = "Sesión empezada correctamente";
          this.session.complete = true;
          this.sessionService.setSession(this.session).subscribe({
            next: (echo: number) => {
              this.load = false;
              if (echo == 1) {
                setTimeout(() => {
                  this.router.navigateByUrl("/dashboard")
                    .then(() => {
                      window.location.reload();
                    });
                }, 1000);
              } else {
                this.showError();
              }
            }, error: (error: any) => {
              console.log("Error guardar sesión: ", error);
              this.load = false;
            }
          });
        } else {
          this.session.message = "Las claves son incorrectas";
          this.session.user_email = user.user_email;
          this.session.complete = false;
          this.session.id_user = 0;
          this.setSession(this.session);
          Swal.fire({
            title: 'Login',
            text: `Las claves no son correctas`,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
          this.load = false;
        }
      },
      error: (error: any) => {
        console.log("Error login", "Se produjo un error al loguearse el usuario: ", error);
        this.showError();
        this.load = false;
        this.log.status = false;
        this.log.message = `Error en login: ${JSON.stringify(error)}`;
        this.logService.setLog(this.log);
      },

      complete: () => {
        console.log("Complete User: ", this.user);
        this.log.status = this.log.id_user != 0 ? true : false;
        this.log.message = this.log.id_user != 0 ? `Login satisfactorio user: ${JSON.stringify(this.user)}` : `Login fallido usuario deshabilitado`;
        this.logService.setLog(this.log);
      }
    });
  }

  private showError(): void {
    Swal.fire({
      title: 'Login',
      html: `<p>Se produjo un error al loguearse el usuario</p>`,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
  }

  private setSession(session: Session): void {
    this.log.action = 'Guardar sesión';
    this.sessionService.setSession(session).subscribe({
      next: (result: number) => {
        if(result !== 1) {
          this.log.status = false;
          this.log.message = `(login) Error al guardar sesión result: ${JSON.stringify(result)}`;
          this.logService.setLog(this.log);
        }
        console.log("Sesión guardada: ", result == 1 ? "True" : "False");
        this.load = false;
      }, error: (error: any) => {
        this.log.status = false;
        this.log.message = `(login) Error al guardar sesión error: ${JSON.stringify(error)}`;
        this.logService.setLog(this.log);
        console.log("Error guardar sesión: ", error);
        this.load = false;
      }
    });
  }

  /**
   * Función que muestra el formulario para Recuperar contraseña
   */
  public rPS(): void {
    let a = document.getElementById('to-recover')!;
    a.innerText = a.innerText == "Olvidó la contraseña?" ? "Cerrar olvidó" : "Olvidó la contraseña?"
    this.viewRecoverForm = !this.viewRecoverForm;
  }

  /**
   * Función que muestra el formulario para crea cuenta.
   */
  public sUpS(): void {
    let a = document.getElementById('to-singUp')!;
    a.innerText = a.innerText == "click aquí" ? "Cerrar" : "click aquí"
    this.viewSingUpForm = !this.viewSingUpForm;
  }

  /**
   * Función que chequea si el email existe para recuperar la contraseña,
   * si existe lanza el email al usuario con la nueva contraseña.
   *
   * @param {string} email Email del usuario.
   *
   * @returns void
   */
  public cE(email: string, action: string): void {
    this.load = true;
    let userEmail: User = new User();
    userEmail.user_email = email;
    if (action == 'recover') {
      this.emailService.checkEmail(userEmail)
        .subscribe({
          next: (data: User) => {
            if (data.user_name != undefined) {
              userEmail.user_name = data.user_name;
              userEmail.user_lastName = data.user_lastName;
              let match = false;
              let newPassword = '';
              do {
                newPassword = Utils.makeString(9);
                match = Utils.passwordReg.test(newPassword);
              } while (!match);

              if (match) {
                userEmail.user_password = hex_sha512(newPassword);
                this.log.action = 'Recuperar contraseña';
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
                        this.log.status = true;
                        this.log.message = `Recuperar contraseña satisfactoriamente: ${JSON.stringify(this.dataForm)}`;
                        this.logService.setLog(this.log);
                        this.sE();
                      }
                    }, error: (error: any) => {
                      console.log(error)
                      alert("Hubo un error al resetear la contraseña")
                      this.load = false;
                      this.log.status = false;
                      this.log.message = `Error en resetear la contraseña: ${JSON.stringify(error)}`;
                      this.logService.setLog(this.log);
                    }, complete: () => {
                      console.log(`Se lanzo el email al usuario: ${this.dataForm.name}, con la nueva password: ${newPassword}`)
                    }
                  });
              } else {
                alert("Hubo un problema regenerando el código de la contraseña");
                this.load = false;
                this.log.status = false;
                this.log.message = `Error en regenerando la contraseña: { 'error': 'Hubo un problema regenerando el código de la contraseña'}`;
                this.logService.setLog(this.log);
              }
            } else {
              this.load = false;
              console.log(`El email ${email}, no está registrado`);
              Swal.fire({
                title: 'Recuperar contraseña',
                text: `El email ${email}, no está registrado`,
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
          }, error: (error: any) => {
            console.log(`Hubo un error al comprobar el email: ${email}`, error);
            this.log.action = 'Comprobar email';
            this.load = false;
            this.log.status = false;
            this.log.message = `Error en comprobar el email: ${JSON.stringify(error)}`;
            this.logService.setLog(this.log);
            Swal.fire({
              title: 'Recuperar contraseña',
              text: `Hubo un error al comprobar el email: ${email}`,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }, complete: () => {
            console.log('Check email complete');
          }
        });
    } else {
      this.log.action = 'Crear cuenta';
      this.emailService.checkEmail(userEmail)
        .subscribe({
          next: (data: User) => {
            if (data.user_name != undefined) {
              this.load = false;
              Swal.fire({
                title: 'Registro',
                text: `El email ${email}, ya está registrado`,
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            } else {
              this.dataForm = {
                name: userEmail.user_email,
                email: userEmail.user_email,
                message: Utils.getTemplateEmailCreateAccount("Querido amigo", userEmail.user_email, ''),
                from: 'Crear cuenta Empresas Admin',
                password: false
              }
              this.sE();
            }
          }, error: (error: any) => {
            console.log("Crear cuenta", `Hubo un error al comprobar el email: ${email}`, error);
            this.load = false;
            this.log.status = false;
            this.log.message = `Error al comprobar el email al crear cuenta: ${JSON.stringify(error)}`;
            this.logService.setLog(this.log);
            Swal.fire({
              title: 'Crear cuenta',
              text: `Hubo un error al comprobar el email: ${email}`,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }, complete: () => {
            console.log('Check email complete');
          }
        });
    }
  }

  /**
   * Send email to create account
   */
  private sE(): void {
    this.log.action = 'Enviar email';
    this.emailService.sendEmail(this.dataForm).subscribe({
      next: (result: any) => {
        this.load = false;
        if (result.title.includes('error')) {
          this.showSwal('error');
          this.log.status = false;
          this.log.message = `Error enviar email crea cuenta: ${JSON.stringify(result.title)}`;
          this.logService.setLog(this.log);
          return;
        }
        this.sendEmailResult.title = this.sendEmailMessages.titleSuccess;
        this.sendEmailResult.message = this.sendEmailMessages.messageSuccess;
        this.showSwal('success');
        this.log.status = true;
        this.log.message = `Enviar email crear cuenta satisfactorio: ${JSON.stringify(this.dataForm)}`;
        this.logService.setLog(this.log);
      }, error: (error: any) => {
        this.load = false;
        this.sendEmailResult.title = this.sendEmailMessages.titleError;
        this.sendEmailResult.message = error.message || this.sendEmailMessages.messageError;
        this.showSwal('error');
        this.log.status = false;
        this.log.message = `Error enviar email crear cuenta: ${JSON.stringify(error)}`;
        this.logService.setLog(this.log);
        console.log('Login send email Error', error);
      }, complete: () => {
        console.log("Complete send email");
      }
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
    this.rPS();
  }
}

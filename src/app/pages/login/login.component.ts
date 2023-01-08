import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/class/users';
import { EmailService } from 'src/app/services/email.service';
import { LoginService } from 'src/app/services/login.service';
import { UsersService } from 'src/app/services/users.service';
import { Utils } from 'src/app/utils/utils';
import Swal, { SweetAlertIcon } from 'sweetalert2'

// Crypto
declare function hex_sha512(pass: string): string;

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
              private userService: UsersService) {

    this.load = false;
    this.viewRecoverForm = false;
    this.viewSingUpForm = false;

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
    this.user = new User();
    let remember = this.loginForm.get('checkBoxSignup')!.value;
    if (remember) {
      localStorage.setItem('remember', "true");
    } else {
      localStorage.setItem('remember', "false");
    }
    this.user.user_password = hex_sha512(this.loginForm.get('password')!.value);
    this.user.user_email = this.loginForm.get('email')!.value;

    this.loginService.login(this.user).subscribe({
      next: (user: User) => {
        if (user.id_user) {
          if (user.habilitado == 0) {
            Swal.fire({
              title: 'Login',
              html: `<p>El usuario ${ user.user_name } está deshabilitado</p>
              <p>Póngase en contacto con el administrador, Muchas gracias</p>`,
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
        console.log("Error login", "Se produjo un error al loguearse el usuario: ", error);
        Swal.fire({
          title: 'Login',
          html: `<p>Se produjo un error al loguearse el usuario</p>`,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      },
      complete: () => {
        console.log("Complete User: ", this.user);
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
                userEmail.user_password = hex_sha512(newPassword);
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
                      this.sE();
                    }
                  }, error: (error: any) => {
                    console.log(error)
                    alert("Hubo un error al resetear la contraseña")
                    this.load = false;
                  }, complete: () => {
                    console.log(`Se lanzo el email al usuario: ${ this.dataForm.name }, con la nueva password: ${ newPassword }`)
                  }
                });
              } else {
                alert("Hubo un problema regenerando el código de la contraseña");
                this.load = false;
  
              }
            } else {
              this.load = false;
              console.log(`El email ${ email },  no está registrado`);
              Swal.fire({
                title: 'Recuperar contraseña',
                text: `El email ${ email },  no está registrado`,
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
        }, error: (error: any) => {
          console.log(`Hubo un error al comprobar el email: ${ email }` , error);
          this.load = false;
          Swal.fire({
            title: 'Recuperar contraseña',
            text: `Hubo un error al comprobar el email: ${ email }`,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }, complete: () =>  { 
          console.log('Check email complete'); 
        }
      });
    } else {
      this.emailService.checkEmail(userEmail)
      .subscribe({
        next: (data: User) => {
          if(data.user_name != undefined) {
            this.load = false;
            Swal.fire({
              title: 'Registro',
              text: `El email ${ email }, ya está registrado`,
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
        console.log("Crear cuenta", `Hubo un error al comprobar el email: ${ email }` , error);
        this.load = false;
        Swal.fire({
          title: 'Crear cuenta',
          text: `Hubo un error al comprobar el email: ${ email }`,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }, complete: () =>  { 
        console.log('Check email complete'); 
      }
    });
    }
  }

  private sE(): void {

    this.emailService.sendEmail(this.dataForm).subscribe({
     next: (result: any) => {
      this.load = false;
      if (result.title.includes('error')) {
        this.showSwal('error');
        return;
      }
      this.sendEmailResult.title = this.sendEmailMessages.titleSuccess;
      this.sendEmailResult.message = this.sendEmailMessages.messageSuccess;
      this.showSwal('success');
     }, error: (error: any) => {
      this.load = false;
      this.sendEmailResult.title = this.sendEmailMessages.titleError;
      this.sendEmailResult.message = error.message;
      this.showSwal('error');
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

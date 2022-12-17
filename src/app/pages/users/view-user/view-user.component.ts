import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { User } from 'src/app/class/users';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { LoginService } from 'src/app/services/login.service';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {

  url: string = environment.apiUrl;

  user: User;
  newUser: User;
  fileUp: File;
  fileName: string;
  img: HTMLElement | null;
  actPasswordHtml: HTMLElement;
  newPasswordHtml: HTMLElement;
  compPasswordHtml: HTMLElement;
  actPasswordIcon: HTMLElement;
  newPasswordIcon: HTMLElement;
  compPasswordIcon: HTMLElement;
  isEdited: boolean = false;

  addUserForm: FormGroup;
  phoneReg: RegExp = new RegExp(/[0-9]{9}/);
  emailReg: RegExp = new RegExp(/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/);
  passReg: RegExp = new RegExp(/(?!^[0-9]*$)(?!^[a-zA-Z!@#$%^&*()_+=<>?]*$)^([a-zA-Z!@#$%^&*()_+=<>?0-9]{6,15})$/g);

  constructor(private fb: FormBuilder, 
              private uploadService: FileUploadService,
              private loginService: LoginService,
              private userSevice: UsersService) {

   let userLogged = localStorage.getItem('userlogged');
    if (userLogged && userLogged != "undefined") {
      console.log('localstorage userlogged: ', JSON.parse(localStorage.getItem('userlogged')!))
      this.user = JSON.parse(userLogged);
    }

    this.fillFormUser(this.user);
    this.setFormControlsReadOnly(this.addUserForm);
  }

  private fillFormUser(user: User): void {
    this.addUserForm = this.fb.group({
      userimg: [''],
      nombre: [user.user_name, Validators.required],
      apellidos: [user.user_lastName, Validators.required],
      telefono: [user.user_phone, [Validators.required, Validators.pattern(this.phoneReg)]],
      email: [user.user_email, [Validators.required, Validators.pattern(this.emailReg)]],
      rol: [Number(user.user_rol) ,Validators.required],
      actPassword: ['' ,Validators.pattern(this.passReg)],
      newPassword: ['' ,Validators.pattern(this.passReg)],
      comparePasswords: ['' ,Validators.pattern(this.passReg)],
    });
  }

  ngOnInit(): void {
    this.actPasswordIcon = document.getElementById('toggleActPassword')!;
    this.newPasswordIcon = document.getElementById('toggleNewPassword')!;
    this.compPasswordIcon = document.getElementById('toggleCompPassword')!;

    this.actPasswordHtml = document.getElementById('actPassword')!;
    this.newPasswordHtml = document.getElementById('newPassword')!;
    this.compPasswordHtml = document.getElementById('comparePasswords')!;

    this.actPasswordIcon.addEventListener('click', (e) => {
      this.changeEye(this.actPasswordIcon, this.actPasswordHtml);
      this.changeEyeTime(this.actPasswordIcon, this.actPasswordHtml);
    });

    this.newPasswordIcon.addEventListener('click', (e) => {
      this.changeEye(this.newPasswordIcon, this.newPasswordHtml);
      this.changeEyeTime(this.newPasswordIcon, this.newPasswordHtml);
    });

    this.compPasswordIcon.addEventListener('click', (e) => {
      this.changeEye(this.compPasswordIcon, this.compPasswordHtml);
      this.changeEyeTime(this.compPasswordIcon, this.compPasswordHtml);
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
  
  public edit() {
    this.isEdited = true;
    this.setFormControlsReadOnly(this.addUserForm, false);
  }
  
  public addUser(): void {
    let newUser = new User();
    newUser.id_user = this.user.id_user;
    newUser.setUser_name(this.addUserForm.get('nombre')!.value);
    newUser.setUser_lastName(this.addUserForm.get('apellidos')!.value);
    newUser.setUser_phone(this.addUserForm.get('telefono')!.value);
    newUser.setUser_email(this.addUserForm.get('email')!.value);
    newUser.setUser_rol(this.addUserForm.get('rol')!.value);
    newUser.setUser_img(this.user.user_img);

    if (this.fileUp) {

      let name = this.fileUp.name;
      
      this.fileName = (this.user.user_name.split(' ')[0] + Math.ceil((Math.random() * 10000 + 1)) + '.' + name.split('.')[1]).toLowerCase();
      
      this.uploadService.uploadFile(this.fileUp, this.fileName)
      .subscribe({
        next: (data: any) => {
          console.log("Data: ", data)
          if (data.type === 4) {
            console.log(data.body.data);
            newUser.newuser_img = this.fileName;   
          }
        },
        error: (err: any) => {
          console.log("Error: ", err);     
          if (err.error && err.error.message) {
            console.log("Error: ", err.error.message);
          } else {
            console.log('Could not upload the file!');
          }
        }
      });
    }

    if (this.addUserForm.get('actPassword')!.value != '') {
      this.user.user_password = this.addUserForm.get('actPassword')!.value;
      this.loginService.checkPassword(this.user).subscribe({ 
        next: (result: boolean) => {
          if (result) {
            newUser.user_password = this.addUserForm.get('newPassword')!.value;
            this.saveUser(newUser);
          } else {
            Swal.fire({
              title: 'Actualizar usuario',
              text: `La contraseña actual del usario ${ this.user.user_name } no es válida `,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        }, error: (error: any) => {
          console.log(`Se produjo un error al cotejar la contraseña del usuario: ${ error } `);
            Swal.fire({
              title: 'Actualizar usuario',
              text: `Se produjo un error al actualizar al usuario ${ newUser.user_name } `,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
            this.cleanForm();        
        },
        complete: () => console.log('Se completo el cotejar la contraseña del usuario')
      });
    } else {
      this.saveUser(newUser);
    }
  }

  public saveUser(user: User): void {
    this.userSevice.updateUser(user).subscribe({
      next: (data: number) => {
        if (data === 1) {
          Swal.fire({
            title: 'Actualizar usuario',
            text: `El usuario ${ user.user_name } se actualizo exitosamente`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        } else {
          throw new Error(`Se produjo un error al actualizar al usuario ${user.user_name } `);
        }
        this.cleanForm();
      }, error: (error: any) => {
        console.log(`Se produjo un error al actualizar al usuario: ${ error } `);
          Swal.fire({
            title: 'Actualizar usuario',
            text: `Se produjo un error al actualizar al usuario ${ user.user_name } `,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
          this.cleanForm();        
      },
      complete: () => console.log('Se completo la actualización del usuario')
    });
  }
  
  public cleanForm(): void {
    this.fillFormUser(this.user);
    this.isEdited = false;
    this.setFormControlsReadOnly(this.addUserForm);
    this.addUserForm.get('actPassword')!.setValue('');
    this.addUserForm.get('newPassword')!.setValue('');
    this.addUserForm.get('compPassword')!.setValue('');
  }

  public setFormControlsReadOnly(form: FormGroup, enabled: boolean = true): void {
    Object.keys(form.controls).forEach(key => {
      const control: AbstractControl = form!.get(key)!;
      if (control && enabled) {
        control.disable({
          emitEvent: enabled,
          onlySelf: enabled
        });
      } else {
        control.enable({
          emitEvent: enabled,
          onlySelf: enabled
        });
      }
    });
  }

  isDisabled(): boolean {
    return this.addUserForm.get('rol')?.value == 0;
  }

  public uploadFile(elem: any): void {
    this.img = document.getElementById('img-user');
    this.fileUp = elem.target.files[0];

    let reader = new FileReader();
    reader.onload = (e) => {
      this.img?.setAttribute('src', e.target!.result!.toString());
    }

    reader.readAsDataURL(elem.target.files[0]);

    console.log(elem)
  }

  public getFormValidationErrors(form: FormGroup): string {

    const result: { Campo: string; error: string; value: any }[] = [];
    Object.keys(form.controls).forEach(key => {

      const controlErrors: any = form.get(key)!.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          result.push({
            Campo: key,
            'error': keyError,
            value: form.get(key)!.value
          });
        });
      }
    });

    return JSON.stringify(result);
  }
}

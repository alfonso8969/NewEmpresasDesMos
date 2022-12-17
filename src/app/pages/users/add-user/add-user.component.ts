import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/class/users';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit, AfterViewInit {

  addUserForm: FormGroup;
  fileUp: File;
  fileName: string;
  user: User;
  img: HTMLElement | null;

  newPasswordHtml: HTMLElement;
  compPasswordHtml: HTMLElement;

  newPasswordIcon: HTMLElement;
  compPasswordIcon: HTMLElement;

  phoneReg: RegExp = new RegExp(/[0-9]{9}/);
  emailReg: RegExp = new RegExp(/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/);
  passReg: RegExp = new RegExp(/(?!^[0-9]*$)(?!^[a-zA-Z!@#$%^&*()_+=<>?]*$)^([a-zA-Z!@#$%^&*()_+=<>?0-9]{6,15})$/g);

  constructor(private fb: FormBuilder, private http: HttpClient,
    private uploadService: FileUploadService,
    private userSevice: UsersService,
    private router: Router) {
    this.fillForm();
  }

  ngAfterViewInit(): void {
    this.img = document.getElementById('img-user');
  }

  public fillForm(): void {

    this.addUserForm = this.fb.group({
      userimg: [''],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(this.phoneReg)]],
      email: ['', [Validators.required, Validators.pattern(this.emailReg)]],
      rol: [0, Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(this.passReg)]],
      comparePasswords: ['', [Validators.required, Validators.pattern(this.passReg)]],

    });
  }


  ngOnInit(): void {

    this.newPasswordIcon = document.getElementById('toggleNewPassword')!;
    this.compPasswordIcon = document.getElementById('toggleCompPassword')!;

    this.newPasswordHtml = document.getElementById('newPassword')!;
    this.compPasswordHtml = document.getElementById('comparePasswords')!;

    this.newPasswordIcon.addEventListener('click', (e) => {
      this.changeEye(this.newPasswordIcon, this.newPasswordHtml);
      this.changeEyeTime(this.newPasswordIcon, this.newPasswordHtml);
    });

    this.compPasswordIcon.addEventListener('click', (e) => {
      this.changeEye(this.compPasswordIcon, this.compPasswordHtml);
      this.changeEyeTime(this.compPasswordIcon, this.compPasswordHtml);
    });
  }

  public changeEye(element: HTMLElement, elementClose: HTMLElement): void {
    const type = elementClose.getAttribute('type') === 'password' ? 'text' : 'password';
    elementClose.setAttribute('type', type);
    const clase = element.getAttribute('class') === 'far fa-eye' ? 'far fa-eye-slash' : 'far fa-eye';
    element.setAttribute('class', clase)!;
  }

  public changeEyeTime(element: HTMLElement, elementClose: HTMLElement): void {
    setTimeout(() => {
      this.changeEye(element, elementClose);
    }, 2000);
  }

  public addUser(): void {
    this.user = new User();
    this.user.setUser_name(this.addUserForm.get('nombre')!.value);
    this.user.setUser_lastName(this.addUserForm.get('apellidos')!.value);
    this.user.setUser_phone(this.addUserForm.get('telefono')!.value);
    this.user.setUser_email(this.addUserForm.get('email')!.value);
    this.user.setUser_rol(this.addUserForm.get('rol')!.value);
    this.user.setFecha_alta(new Date());
    this.user.setUser_password(this.addUserForm.get('newPassword')!.value);
    this.user.setHabilitado(1);

    if (this.fileUp) {

      let name = this.fileUp.name;

      this.fileName = (this.user.user_name.split(' ')[0] + Math.ceil((Math.random() * 10000 + 1)) + '.' + name.split('.')[1]).toLowerCase();

      this.uploadService.uploadFile(this.fileUp, this.fileName)
        .subscribe({
          next: (data: any) => {
            console.log("Data: ", data)
            if (data.type === 4) {
              console.log(data.body.data);
              this.user.setUser_img(this.fileName);
              this.saveUser(this.user);
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
    } else {
      this.saveUser(this.user);
    }
  }

  public saveUser(user: User): void {
    this.userSevice.addUser(user).subscribe({
      next: (data: number) => {
        if (data === 1) {
          Swal.fire({
            title: 'Añadir usuario',
            text: `El usuario ${user.user_name} se añadio exitosamente`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.router.navigate(['dashboard/list-users']);
        } else {
          throw new Error(`Se produjo un error al añadir al usuario ${user.getUser_name()} `);
        }
      }, error: (error: any) => {
        console.log(`Se produjo un error al añadir al usuario: ${ error } `);
        if (error.error.text.includes("Duplicate")) {
          Swal.fire({
            title: 'Añadir usuario: ' + user.user_name,
            text: `El email ${ user.user_email } ya exite`,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        } else {
          Swal.fire({
            title: 'Añadir usuario',
            text: `Se produjo un error al añadir al usuario ${ user.user_name } `,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      },
      complete: () => console.log('Se completo la inserción del usuario')
    });
  }

  public cleanForm(): void {
    this.fillForm();
    this.img?.setAttribute('src', './assets/images/icon/staff.png');
  }

  public uploadFile(elem: any): void {
    this.fileUp = elem.target.files[0];
    let reader = new FileReader();
    reader.onload = (e) => {
      this.img?.setAttribute('src', e.target!.result!.toString());
    }

    reader.readAsDataURL(elem.target.files[0]);

    console.log(elem)
  }

  isDisabled(): boolean {
    return this.addUserForm.get('rol')?.value == 0;
  }

  public getFormValidationErrors(form: FormGroup): string {

    const result: { Campo: string; error: string; value: any }[] = [];
    Object.keys(form.controls).forEach(key => {

      const controlErrors: any = form!.get(key)!.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          result.push({
            Campo: key,
            'error': keyError,
            value: form!.get(key)!.value
          });
        });
      }
    });

    return JSON.stringify(result);
  }
}

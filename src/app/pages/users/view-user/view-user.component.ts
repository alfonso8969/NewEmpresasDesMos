import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { User } from 'src/app/class/users';
import { Address } from 'src/app/interfaces/address';
import { TechnicalInsert } from 'src/app/interfaces/technicalInsert';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { LoginService } from 'src/app/services/login.service';
import { UsersService } from 'src/app/services/users.service';
import { Utils } from 'src/app/utils/utils';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {

  url: string = environment.apiUrl;

  addUserForm: FormGroup;
  user: User;
  newUser: User;
  address: Address;
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
  user_rol_technical: boolean = false;
  formData: TechnicalInsert;

  constructor(private fb: FormBuilder,
              private uploadService: FileUploadService,
              private loginService: LoginService,
              private userService: UsersService) {

    this.user = this.userService.getUserLogged();
    this.user_rol_technical = this.user.user_rol == 4;
    this.userService.getUserAddress(this.user.id_user).subscribe({
      next: (address: Address) => {
        if (address != null) {
          this.address = address;
          this.fillFormUser(this.user);
          this.setFormControlsReadOnly(this.addUserForm);
        }
      }, error: (error: any) => {
        console.log("Error consiguiendo address: ", error);
      },
      complete: () => console.log('Se completo conseguir address del usuario', this.address)
    });
    
    this.fillFormUser(this.user);
  }

  private fillFormUser(user: User): void {
    if (this.user_rol_technical) { 
      this.addUserForm = this.fb.group({
        user_img: [''],
        nombre: [user.user_name, Validators.required],
        apellidos: [user.user_lastName, Validators.required],
        phone: [user.user_phone, [Validators.required, Validators.pattern(Utils.phoneReg)]],
        other_phone: [user.user_other_phone, [Validators.pattern(Utils.phoneReg)]],
        email: [user.user_email, [Validators.required, Validators.pattern(Utils.emailReg)]],
        rol: [Number(user.user_rol) ,Validators.required],
        address: [this.address && this.address.address_user, Validators.required],
        region: [this.address && this.address.region, Validators.required],
        city: [this.address && this.address.city, Validators.required],
        cod_postal: [this.address && this.address.cod_postal, Validators.required],
        actPassword: ['' ,Validators.pattern(Utils.passReg)],
        newPassword: ['' ,Validators.pattern(Utils.passReg)],
        comparePasswords: ['' ,Validators.pattern(Utils.passReg)],
      });

    } else {
      this.addUserForm = this.fb.group({
        user_img: [''],
        nombre: [user.user_name, Validators.required],
        apellidos: [user.user_lastName, Validators.required],
        phone: [user.user_phone, [Validators.required, Validators.pattern(Utils.phoneReg)]],
        other_phone: [user.user_other_phone, [Validators.pattern(Utils.phoneReg)]],
        email: [user.user_email, [Validators.required, Validators.pattern(Utils.emailReg)]],
        rol: [Number(user.user_rol) ,Validators.required],
        actPassword: ['' ,Validators.pattern(Utils.passReg)],
        newPassword: ['' ,Validators.pattern(Utils.passReg)],
        comparePasswords: ['' ,Validators.pattern(Utils.passReg)],
      });
    }
  }

  ngOnInit(): void {
    this.actPasswordIcon = document.getElementById('toggleActPassword')!;
    this.newPasswordIcon = document.getElementById('toggleNewPassword')!;
    this.compPasswordIcon = document.getElementById('toggleCompPassword')!;

    this.actPasswordHtml = document.getElementById('actPassword')!;
    this.newPasswordHtml = document.getElementById('newPassword')!;
    this.compPasswordHtml = document.getElementById('comparePasswords')!;

    this.actPasswordIcon.addEventListener('click', (e) => {
      Utils.changeEye(this.actPasswordIcon, this.actPasswordHtml);
      Utils.changeEyeTime(this.actPasswordIcon, this.actPasswordHtml);
    });

    this.newPasswordIcon.addEventListener('click', (e) => {
      Utils.changeEye(this.newPasswordIcon, this.newPasswordHtml);
      Utils.changeEyeTime(this.newPasswordIcon, this.newPasswordHtml);
    });

    this.compPasswordIcon.addEventListener('click', (e) => {
      Utils.changeEye(this.compPasswordIcon, this.compPasswordHtml);
      Utils.changeEyeTime(this.compPasswordIcon, this.compPasswordHtml);
    });
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
    newUser.setUser_phone(this.addUserForm.get('phone')!.value);
    newUser.setUser_other_phone(this.addUserForm.get('other_phone')!.value);
    newUser.setUser_email(this.addUserForm.get('email')!.value);
    newUser.setUser_rol(this.addUserForm.get('rol')!.value);
    newUser.setUser_img(this.user.user_img);

    if (this.user_rol_technical) {
      this.address.address_user = this.addUserForm.get('address')!.value;
      this.address.region = this.addUserForm.get('region')!.value;
      this.address.city = this.addUserForm.get('city')!.value;
      this.address.cod_postal = this.addUserForm.get('cod_postal')!.value;
      this.formData = {
        user: this.user,
        address: this.address
      };
    }

    if (this.fileUp) {

      let name = this.fileUp.name;

      this.fileName = (this.user.user_name.split(' ')[0] + Math.ceil((Math.random() * 10000 + 1)) + '.' + name.split('.')[1]).toLowerCase();

      this.uploadService.uploadFile(this.fileUp, this.fileName)
      .subscribe({
        next: (data: any) => {
          console.log("Data: ", data)
          if (data.type === 4) {
            console.log(data.body.data);
            newUser.newUser_img = this.fileName;
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
            if (!this.user_rol_technical) { 
              this.saveUser(newUser); 
            } else {
              this.saveTechnical(this.formData); 
            }
          } else {
            Swal.fire({
              title: 'Actualizar usuario',
              text: `La contraseña actual del usuario ${ this.user.user_name } no es válida `,
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
      if (!this.user_rol_technical) { 
        this.saveUser(newUser); 
      } else {
        this.saveTechnical(this.formData); 
      }
    }
  }

  public saveUser(user: User): void {
    this.userService.updateUser(user).subscribe({
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

  public saveTechnical(formData: TechnicalInsert): void {
    this.userService.updateTechnical(formData).subscribe({
      next: (data: number) => {
        if (data === 1) {
          Swal.fire({
            title: 'Actualizar técnico',
            text: `El técnico ${formData.user.user_name} se actualizo exitosamente`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        } else {
          throw new Error(`Se produjo un error al actualizar al técnico ${formData.user.getUser_name()} `);
        }
      }, error: (error: any) => {
        console.log(`Se produjo un error al actualizar al técnico: ${ error } `);
        if (error.error.text.includes("Duplicate")) {
          Swal.fire({
            title: 'Actualizar técnico: ' + formData.user.user_name,
            text: `El email ${ formData.user.user_email } ya existe`,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        } else {
          Swal.fire({
            title: 'Actualizar técnico',
            text: `Se produjo un error al actualizar al técnico ${ formData.user.user_name } `,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      },
      complete: () => console.log('Se completo la actualización del técnico')
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
            error: keyError,
            value: form.get(key)!.value
          });
        });
      }
    });

    return JSON.stringify(result);
  }
}

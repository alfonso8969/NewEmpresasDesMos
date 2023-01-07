import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/class/users';
import { Address } from 'src/app/interfaces/address';
import { TechnicalInsert } from 'src/app/interfaces/technicalInsert';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { LoginService } from 'src/app/services/login.service';
import { UsersService } from 'src/app/services/users.service';
import { Utils } from 'src/app/utils/utils';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'

// Crypto
declare function hex_sha512(pass: string): string;

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit, OnDestroy {

  url: string = environment.apiUrl;

  addUserForm: FormGroup;
  user: User;
  editUser: User;
  address: Address;
  fileUp: File;

  fileName: string;
  user_id: number;
  urlSended: string;
  img: HTMLElement | null;
  actPasswordHtml: HTMLElement;
  newPasswordHtml: HTMLElement;
  compPasswordHtml: HTMLElement;
  actPasswordIcon: HTMLElement;
  newPasswordIcon: HTMLElement;
  compPasswordIcon: HTMLElement;
  viewProfile1: HTMLElement;
  viewProfile2: HTMLElement;

  isEdited: boolean = false;
  viewSpinner: boolean;
  user_rol_technical: boolean = false;
  formData: TechnicalInsert;

  constructor(private fb: FormBuilder,
              private uploadService: FileUploadService,
              private loginService: LoginService,
              private userService: UsersService,
              private route: ActivatedRoute) {

    this.route.paramMap.subscribe((params: any) => {
      this.user_id = params.get('id');
      this.urlSended = params.get('url');
      console.log(this.urlSended);
    });

    if (this.urlSended && this.urlSended != '') {
      this.viewProfile1 = document.getElementById('viewProfile1')!;
      this.viewProfile1.style.display = 'none';
      this.viewProfile2 = document.getElementById('viewProfile2')!;
      this.viewProfile2.style.display = 'none';
      this.user_rol_technical = true;
      this.fillFormUser(new User());
      this.userService.getUser(this.user_id).subscribe({
        next: (user: User) => {
          this.user = user;
          this.getAddressUser();
        }, error: (error: any) => {
          console.log("Error consiguiendo user del listado: ", error);
          this.viewSpinner = false;
        }, complete: () =>  { console.log("Completado getUser desde listado", this.user) }
      });
    } else {
      this.user = this.userService.getUserLogged();
      this.user_rol_technical = this.user.user_rol == 4;
      this.fillFormUser(this.user);
      this.getAddressUser();
      setTimeout(() => {
        this.viewSpinner = false;
      }, 1000);
    }
  }

  private getAddressUser(): void {
    this.userService.getUserAddress(this.user.id_user).subscribe({
      next: (address: Address) => {
        if (address != null) {
          this.address = address;
          this.fillFormUser(this.user);
          this.setFormControlsReadOnly(this.addUserForm);
        } else {
          this.fillFormUser(this.user);
          this.setFormControlsReadOnly(this.addUserForm);
        }
      }, error: (error: any) => {
        this.viewSpinner = false;
        console.log("Error consiguiendo address: ", error);
      },
      complete: () => console.log('Se completo conseguir address del usuario', this.address)
    });
  }

  private fillFormUser(user: User): void {
    this.viewSpinner = false;
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
        actPassword: ['' ,Validators.pattern(Utils.passwordReg)],
        newPassword: ['' ,Validators.pattern(Utils.passwordReg)],
        comparePasswords: ['' ,Validators.pattern(Utils.passwordReg)],
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
        actPassword: ['' ,Validators.pattern(Utils.passwordReg)],
        newPassword: ['' ,Validators.pattern(Utils.passwordReg)],
        comparePasswords: ['' ,Validators.pattern(Utils.passwordReg)],
      });

    }
  }

  ngOnInit(): void {
    this.viewSpinner = true;
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

  public keyPressed(event: any, count: number): boolean {
    console.log(event);
    if((event.charCode < 48 || event.charCode > 57) || event.srcElement.value.length == count) return false;
    return true;
  }

  public sendEditUser(): void {
    let editUser = new User();
    editUser.id_user = this.user.id_user;
    editUser.setUser_name(this.addUserForm.get('nombre')!.value);
    editUser.setUser_lastName(this.addUserForm.get('apellidos')!.value);
    editUser.setUser_phone(this.addUserForm.get('phone')!.value);
    editUser.setUser_other_phone(this.addUserForm.get('other_phone')!.value);
    editUser.setUser_email(this.addUserForm.get('email')!.value);
    editUser.setUser_rol(this.addUserForm.get('rol')!.value);
    editUser.setUser_img(this.user.user_img);

    if (this.user_rol_technical) {
      this.address.address_user = this.addUserForm.get('address')!.value;
      this.address.region = this.addUserForm.get('region')!.value;
      this.address.city = this.addUserForm.get('city')!.value;
      this.address.cod_postal = this.addUserForm.get('cod_postal')!.value;
      this.formData = {
        user: editUser,
        address: this.address
      };
    }

    if (this.fileUp) {

      let name = this.fileUp.name;

      this.fileName = (editUser.user_name.split(' ')[0] + Math.ceil((Math.random() * 10000 + 1)) + '.' + name.split('.')[1]).toLowerCase();

      this.uploadService.uploadFile(this.fileUp, this.fileName)
      .subscribe({
        next: (data: any) => {
          console.log("Data: ", data)
          if (data.type === 4) {
            console.log(data.body.data);
            editUser.newUser_img = this.fileName;
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
      this.user.user_password = hex_sha512(this.addUserForm.get('actPassword')!.value);
      this.loginService.checkPassword(this.user).subscribe({
        next: (result: boolean) => {
          if (result) {
            editUser.user_password = hex_sha512(this.addUserForm.get('newPassword')!.value);
            if (!this.user_rol_technical) {
              this.saveUser(editUser);
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
              text: `Se produjo un error al actualizar al usuario ${ editUser.user_name } `,
              icon: 'error',

              confirmButtonText: 'Aceptar'
            });
            this.cleanForm();
        },
        complete: () => console.log('Se completo el cotejar la contraseña del usuario')
      });
    } else {
      if (!this.user_rol_technical) {
        this.saveUser(editUser);
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
    this.addUserForm.get('comparePasswords')!.setValue('');
  }

  public setFormControlsReadOnly(form: FormGroup, enabled: boolean = true): void {
    Utils.setFormControlsReadOnly(form, enabled);
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
    return Utils.getFormValidationErrors(form);
  }

  ngOnDestroy(): void {
    if (this.urlSended) {
      this.viewProfile1.style.display = 'inline-block';
      this.viewProfile2.style.display = 'block';
    }
  }
}

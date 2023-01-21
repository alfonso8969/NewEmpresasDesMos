import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, AfterViewInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/class/users';
import { Address } from 'src/app/interfaces/address';
import { Log } from 'src/app/interfaces/log';
import { TechnicalInsert } from 'src/app/interfaces/technicalInsert';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { LogsService } from 'src/app/services/logs.service';
import { UsersService } from 'src/app/services/users.service';
import { Utils } from 'src/app/utils/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-technical',
  templateUrl: './add-technical.component.html',
  styleUrls: ['./add-technical.component.css']
})
export class AddTechnicalComponent implements OnInit, AfterViewInit {

  @HostListener('window:unload', [ '$event' ])
  unloadHandler(event: any) {
   console.log('window:unload', event);
    alert('¿Está seguro de querer cerrar la sesión?');
  }

  @HostListener('window:beforeunload', [ '$event' ])
   beforeUnloadHandler(event: any) {
    console.log('window:beforeunload', event)
    return false;
   }

  log: Log;
  addTechnicalUserForm: FormGroup;
  fileUp: File;
  user: User;
  address: Address = {
    address_user: '',
    region: '',
    city: '',
    cod_postal: ''
  };

  fileName: string;
  img: HTMLElement | null;

  newPasswordHtml: HTMLElement;
  compPasswordHtml: HTMLElement;

  newPasswordIcon: HTMLElement;
  compPasswordIcon: HTMLElement;

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private uploadService: FileUploadService,
              private userService: UsersService,
              private router: Router,
              private logService: LogsService) {
                this.log = this.logService.initLog();
                this.fillForm();
              }

  ngAfterViewInit(): void {
    this.img = document.getElementById('img-user');
  }

  ngOnInit(): void {
    this.newPasswordIcon = document.getElementById('toggleNewPassword')!;
    this.compPasswordIcon = document.getElementById('toggleCompPassword')!;

    this.newPasswordHtml = document.getElementById('newPassword')!;
    this.compPasswordHtml = document.getElementById('confirmPassword')!;

    this.newPasswordIcon.addEventListener('click', (e) => {
      Utils.changeEye(this.newPasswordIcon, this.newPasswordHtml);
      Utils.changeEyeTime(this.newPasswordIcon, this.newPasswordHtml);
    });

    this.compPasswordIcon.addEventListener('click', (e) => {
      Utils.changeEye(this.compPasswordIcon, this.compPasswordHtml);
      Utils.changeEyeTime(this.compPasswordIcon, this.compPasswordHtml);
    });
  }

  public fillForm(): void {
    this.addTechnicalUserForm = this.fb.group({
      user_img: [''],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(Utils.phoneReg)]],
      other_phone: ['', [Validators.pattern(Utils.phoneReg)]],
      email: ['', [Validators.required, Validators.pattern(Utils.emailReg)]],
      address: ['', Validators.required],
      region: ['', Validators.required],
      city: ['', Validators.required],
      cod_postal: ['', Validators.required],
      rol: [4, Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(Utils.passwordReg)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(Utils.passwordReg)]]
    }, { validator: this.checkIfPasswordAreEquals } as AbstractControlOptions );
  }

  public checkIfPasswordAreEquals(control: AbstractControl): ValidationErrors | null {
    if (control && control.get("newPassword")!.value && control.get("confirmPassword")!.value) {
      let comp = control.get('newPassword')!.value === control.get('confirmPassword')!.value;
      return comp ? null : { invalidComparison: true };
    }
    return null;
  }

  public keyPressed(event: any, count: number): boolean {
    console.log(event);
    if((event.charCode < 48 || event.charCode > 57) || event.srcElement.value.length == count) return false;
    return true;
  }

  addTechnicalUser() {
    this.user = new User();
    this.user.setUser_name(this.addTechnicalUserForm.get('nombre')!.value);
    this.user.setUser_lastName(this.addTechnicalUserForm.get('apellidos')!.value);
    this.user.setUser_phone(this.addTechnicalUserForm.get('phone')!.value);
    this.user.setUser_other_phone(this.addTechnicalUserForm.get('other_phone')!.value);
    this.user.setUser_email(this.addTechnicalUserForm.get('email')!.value);
    this.user.setUser_rol(this.addTechnicalUserForm.get('rol')!.value);
    this.user.setFecha_alta(new Date());
    this.user.setUser_password(this.addTechnicalUserForm.get('newPassword')!.value);
    this.user.setHabilitado(1);
    this.address.address_user = this.addTechnicalUserForm.get('address')!.value;
    this.address.region = this.addTechnicalUserForm.get('region')!.value;
    this.address.city = this.addTechnicalUserForm.get('city')!.value;
    this.address.cod_postal = this.addTechnicalUserForm.get('cod_postal')!.value;
    let formData: TechnicalInsert = {
      user: this.user,
      address: this.address
    };

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
              this.saveUser(formData);
            }
          },
          error: (err: any) => {
            console.log("Error: ", err);
            this.log.action = 'Subir imagen usuario';
            this.log.status = false;
            this.log.message = `Error al subir imagen técnico: ${JSON.stringify(err)}`;
            this.logService.setLog(this.log);
            if (err.error && err.error.message) {
              console.log("Error: ", err.error.message);
            } else {
              console.log('Could not upload the file!');
            }
          }
        });
    } else {
      this.saveUser(formData);
    }
  }

  public saveUser(formData: TechnicalInsert): void {
    this.userService.addTechnical(formData).subscribe({
      next: (data: number) => {
        if (data === 1) {
          Swal.fire({
            title: 'Añadir técnico',
            text: `El técnico ${formData.user.user_name} se añadió exitosamente`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.router.navigate(['dashboard/list-technical']);
        } else {
          throw new Error(`Se produjo un error al añadir al técnico ${formData.user.getUser_name()} `);
        }
      }, error: (error: any) => {
        console.log(`Se produjo un error al añadir al técnico: ${ error } `);
        if (error.error.text.includes("Duplicate")) {
          Swal.fire({
            title: 'Añadir técnico: ' + formData.user.user_name,
            text: `El email ${ formData.user.user_email } ya existe`,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        } else {
          Swal.fire({
            title: 'Añadir técnico',
            text: `Se produjo un error al añadir al técnico ${ formData.user.user_name } `,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      },
      complete: () => console.log('Se completo la inserción del técnico')
    });
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

  cleanForm() {
    this.fillForm();
    this.img?.setAttribute('src', './assets/images/icon/staff.png');
  }

  public getFormValidationErrors(form: FormGroup): Object {
    return Utils.getFormValidationErrors(form);
  }
}


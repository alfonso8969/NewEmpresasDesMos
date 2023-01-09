import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as d3 from 'd3';
import { User } from 'src/app/class/users';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsersService } from 'src/app/services/users.service';
import { Utils } from 'src/app/utils/utils';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit, AfterViewInit {

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

  editUserForm: FormGroup;

  url: string = environment.apiUrl;

  admin: boolean;

  fileUp: File;
  fileName: string;

  filterValueAct: string = '';

  img: HTMLElement | null;

  user: User;
  userLogged: User;
  users: User[];
  usersTemp: User[];

  public page: number = 1;
  public page2: number = 1;
  public siguiente: string = "Siguiente";
  public anterior: string = "Anterior";

  viewSpinner: boolean = true;
  constructor(private fb: FormBuilder,
              private usersService: UsersService,
              private uploadService: FileUploadService) {

    this.userLogged = this.usersService.getUserLogged();

    let user_rol = Number(this.userLogged.user_rol);
    this.admin = user_rol === 1 || user_rol === 3 ? true : false;

    this.usersService.getUsers().subscribe({
      next: (users: any) => {
        if (users != null) {
          this.users = users.data.filter((user: User) => user.id_user != 0);
          this.usersTemp = JSON.parse(JSON.stringify(this.users));
        } else {
          alert("Hubo un error")
        }
        this.viewSpinner = false;
      },
      error: (error: any) => {
        console.log(error);
        this.viewSpinner = false;
        alert(error.message)
      },
      complete: () => console.log("Complete", this.users)
    });


    this.editUserForm = this.fb.group({
      userimg: [''],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(Utils.phoneReg)]],
      email: ['', [Validators.required, Validators.pattern(Utils.emailReg)]]
    });
  }

  ngAfterViewInit(): void {
    d3.selectAll(".close").on('mouseover', function(event) {
      d3.select(this).style("color", "red");
    });
    d3.selectAll(".close").on('mouseout', function(event) {
      d3.select(this).style("color", "black");
    });
  }

  fillUserForm(user: User): void {
    this.editUserForm = this.fb.group({
      userimg: [''],
      nombre: [user.user_name, Validators.required],
      apellidos: [user.user_lastName, Validators.required],
      phone: [user.user_phone, [Validators.required, Validators.pattern(Utils.phoneReg)]],
      email: [user.user_email, [Validators.required, Validators.pattern(Utils.emailReg)]]
    });
  }


  ngOnInit(): void {
  }

  public getUser(user: User): void {
    this.user = user;
    this.fillUserForm(user);

    console.log(user)
  }

  public applyFilter(filterValue: any): void {
    console.log(filterValue.target.value)
    if (filterValue.target.value === '') {
      this.users = this.usersTemp;
    }

    if (this.filterValueAct.length > filterValue.target.value.length) {
      this.filterValueAct = filterValue.target.value.trim().toLowerCase();
      this.users = this.usersTemp;
      this.users = this.users.filter((emp: User) => emp.user_name.toLowerCase().trim().includes(filterValue.target.value.trim().toLowerCase()));
    } else {
      this.filterValueAct = filterValue.target.value.trim().toLowerCase();
      this.users = this.users.filter((emp: User) => emp.user_name.toLowerCase().trim().includes(this.filterValueAct));
    }
  }

  public editUser(): void {

    this.user.user_name = this.editUserForm.get('nombre')!.value;
    this.user.user_lastName = this.editUserForm.get('apellidos')!.value;
    this.user.user_phone = this.editUserForm.get('telefono')!.value;
    this.user.user_email = this.editUserForm.get('email')!.value;
    if (this.fileUp) {

      let name = this.fileUp.name;
      if (name != this.user.user_img) {
        this.fileName = (this.user.user_name.split(' ')[0] + Math.ceil((Math.random()*10000 + 1)) + '.' + name.split('.')[1]).toLowerCase();

        this.uploadService.uploadFile(this.fileUp, this.fileName)
        .subscribe({
          next: (data: any) =>  {
             console.log("Data: ", data)
              if(data.type === 4) {
                console.log(data.body.data);
                this.user.newUser_img = this.fileName;
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
      }
    } else {
      this.saveUser(this.user);
    }
  }

  public saveUser(user: User): void {
    this.usersService.updateUser(user).subscribe({
      next: (data: number) => {
        if (data === 1) {
          Swal.fire({
            title: 'Actualizar usuario',
            text: `El usuario ${ user.user_name } se actualizó exitosamente`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        } else {
          throw new Error(`Se produjo un error al actualizar al usuario ${ user.user_name } `);
        }
      }, error: (error: any) => {
        console.log(`Se produjo un error al actualizar al usuario: ${ error } `);
        Swal.fire({
          title: 'Actualizar usuario',
          text: `Se produjo un error al actualizar al usuario ${ user.user_name } `,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      },
      complete: () => console.log('Se completo la actualización del usuario')
    });
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

  // Función de prueba de campos erróneos, esta en casi todos los componentes que usan formularios
  public getFormValidationErrors(form: FormGroup): string {
    return Utils.getFormValidationErrors(form);
  }
}

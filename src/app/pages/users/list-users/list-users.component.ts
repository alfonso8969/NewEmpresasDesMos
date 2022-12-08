import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as d3 from 'd3';
import { User } from 'src/app/class/users';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit, AfterViewInit {

  editUserForm: FormGroup;
  phoneReg: RegExp = new RegExp(/[0-9]{9}/);
  emailReg: RegExp = new RegExp(/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/);

  url: string = environment.apiUrl;
  fileUp: File;
  fileName: string;
  img: HTMLElement | null;
  user: User;
  users: User[];

  viewSpinner: boolean = true;
  constructor(private fb: FormBuilder,
              private usersService: UsersService,
              private uploadService: FileUploadService) {
    this.usersService.getUsers().subscribe({
      next: (users: any) => {
        if (users != null) {
          this.users = users.data;
        } else {
          alert("Hubo un error")
        }
        this.viewSpinner = false;
      },
      error: (error: any) => {
        console.log()//(error);
        this.viewSpinner = false;
        alert(error.message)
      },
      complete: () => console.log()//("Complete", this.users)
    });


    this.editUserForm = this.fb.group({
      userimg: [''],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(this.phoneReg)]],
      email: ['', [Validators.required, Validators.pattern(this.emailReg)]]
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
      telefono: [user.user_phone, [Validators.required, Validators.pattern(this.phoneReg)]],
      email: [user.user_email, [Validators.required, Validators.pattern(this.emailReg)]]
    });
  }


  ngOnInit(): void {
  }

  public getUser(user: User): void {
    this.user = user;
    this.fillUserForm(user);
    console.log()//(user)
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
             console.log()//("Data: ", data)
              if(data.type === 4) {
                console.log()//(data.body.data);
                this.user.newuser_img = this.fileName;
                this.saveUser(this.user);
              }
            },
            error: (err: any) => {
              console.log()//("Error: ", err);

              if (err.error && err.error.message) {
                console.log()//("Error: ", err.error.message);
              } else {
                console.log()//('Could not upload the file!');
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
        console.log()//(`Se produjo un error al actualizar al usuario: ${ error } `);
        Swal.fire({
          title: 'Actualizar usuario',
          text: `Se produjo un error al actualizar al usuario ${ user.user_name } `,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      },
      complete: () => console.log()//('Se completo la actualización del usuario')
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

    console.log()//(elem)
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

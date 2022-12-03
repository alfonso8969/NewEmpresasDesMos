import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import * as d3 from 'd3';
import { User } from 'src/app/class/users';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit, AfterViewInit {

  editUserForm: FormGroup;
  phoneReg: RegExp = new RegExp(/[0-9]{9}/);
  emailReg: RegExp = new RegExp(/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/);

  user: User;
  users: User[];

  viewSpinner: boolean = true;
  constructor(private fb: FormBuilder, private usersService: UsersService) {
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

  filUser(user: User): void {
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
    this.filUser(user);
    console.log(user)
  }

  public editUser(): void {
    
  }

  public uploadFile(elem: any): void {
    let img = document.getElementById('img-user');
    let reader = new FileReader();
    reader.onload = function (e) {
      img?.setAttribute('src', e.target!.result!.toString());
    }

    reader.readAsDataURL(elem.target.files[0]);

    console.log(elem)
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

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/class/users';
import * as d3 from 'd3';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit, AfterViewInit {

  user: User;
  usersHab: User[];
  usersInHab: User[];

  viewSpinner: boolean = true;
  rolvalue: number;
  rolstr: string;

  editUserRolForm: FormGroup

  constructor(private fb: FormBuilder, private usersService: UsersService) {
    this.usersService.getUsersHab().subscribe({
      next: (users: any) => {
        if (users != null) {
          this.usersHab = users.data;
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
      complete: () => console.log("Complete", this.usersHab)
    });

    this.usersService.getUsersInha().subscribe({
      next: (users: any) => {
        if (users != null) {
          this.usersInHab = users.data;
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
      complete: () => console.log("Complete", this.usersInHab)
    });

    this.editUserRolForm = this.fb.group({
      nombre: [''],
      rol: [0, Validators.required]
    });
  }

  public getUser(index: number): void {
    console.log(index);
    let user = this.usersHab[index];
    console.log(user);
    this.editUserRolForm = this.fb.group({
      nombre: [user.user_name + ' ' + user.user_lastName],
      rol: [Number(user.user_rol), Validators.required]
    });
  }

  public changeRol(event: any): void {
    this.rolvalue = Number(event.target.selectedOptions[0].value.split(':')[1].trim());
    this.rolstr = event.target.selectedOptions[0].text;
    console.log(this.rolvalue)
    console.log(this.rolstr)
  }

  public deleteUser(index: number): void {
    let user = this.usersHab[index];
    user.habilitado = 0;
    user.fecha_baja = new Date();
    console.log(user)
  }

  public toAbleUser(user: User): void {
    user.habilitado = 1;
    user.fecha_alta = new Date();
    console.log(user)
  }

  ngAfterViewInit(): void {
    d3.selectAll(".close").on('mouseover', function(event) { 
      d3.select(this).style("color", "red");
    });

    d3.selectAll(".close").on('mouseout', function(event) { 
      d3.select(this).style("color", "black");
    });
  }


  ngOnInit(): void {
  }

  public editUserRol(): void {

  }

}

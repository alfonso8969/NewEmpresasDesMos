import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/class/users';
import { UsersService } from 'src/app/services/users.service';
import * as d3 from 'd3';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit, AfterViewInit {

  user: User;
  usersHab: User[];
  usersInHab: User[];
  usersHabTmp: User[];
  usersInHabTmp: User[];

  viewSpinner: boolean = true;
  rolValue: number;
  rolStr: string;
  filterValueAct: string = '';

  public page: number = 1;
  public page2: number = 1;

  public siguiente: string = "Siguiente";
  public anterior: string = "Anterior";

  editUserRolForm: FormGroup

  constructor(private fb: FormBuilder, private usersService: UsersService) {
   
    this.fillTables();

    this.editUserRolForm = this.fb.group({
      nombre: [''],
      rol: [0, Validators.required]
    });
  }

  fillTables() {
    this.usersService.getUsersHab().subscribe({
      next: (users: any) => {
        if (users != null) {
          this.usersHab = users.data;
          this.usersHabTmp = JSON.parse(JSON.stringify(this.usersHab));
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
          this.usersInHabTmp = JSON.parse(JSON.stringify(this.usersInHab));
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
  }

  public getUser(index: number): void {
    console.log(index);
    this.user = this.usersHab[index];
    console.log(this.user);
    this.editUserRolForm = this.fb.group({
      nombre: [this.user.user_name + ' ' + this.user.user_lastName],
      rol: [Number(this.user.user_rol), Validators.required]
    });
  }

  public changeRol(event: any): void {
    this.rolValue = Number(event.target.selectedOptions[0].value.split(':')[1].trim());
    this.rolStr = event.target.selectedOptions[0].text;
    this.user.user_rol = this.rolValue;
    console.log(this.rolValue)
    console.log(this.rolStr)
  }

  public deleteUser(index: number): void {
    let user = this.usersHab[index];
    user.habilitado = 0;
    console.log(user);
    this.toAbleDisabledUser(user);
  }

  public toAbleUser(user: User): void {
    user.habilitado = 1;
    console.log(user);
    this.toAbleDisabledUser(user);
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

  public toAbleDisabledUser(user: User): void {
    let title = user.habilitado == 1 ? 'Habilitar' : 'Deshabilitar';
    let message = user.habilitado == 1 ? '¿Está seguro que desea habilitar al usuario ' : '¿Está seguro que desea deshabilitar al usuario ';
    Swal.fire({
      title: title + ' usuario',
      html: message  + user.user_name + ' ' + user.user_lastName + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, ' + title.toLowerCase()
    }).then((confirm) => {
      if (confirm.isConfirmed) {
        this.usersService.toAbleDisableUser(user).subscribe({
          next: (result: number) => {
            if (result === 1) {
              Swal.fire({
                title: title + ' usuario',
                text: 'El usuario ' +  user.user_name + ' ' + user.user_lastName + ' se pudo ' + title.toLowerCase() + ' correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
              this.fillTables();
            } else{
              Swal.fire({
                title: title + ' usuario',
                text: 'El usuario ' +  user.user_name + ' ' + user.user_lastName + ' no se pudo ' + title.toLowerCase() + ' correctamente',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }   
          },
          error: (error: any) => {
            console.log(error);
            Swal.fire({
              title: title + ' usuario',
              text: 'Hubo algún error al ' + title.toLowerCase() + ` al usuario ${ user.user_name + ' ' + user.user_lastName }`,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          },
          complete: () => console.log("Update habilitado complete")
        });
      }
    })
  }

  public applyFilter(filterValue: any, hab: number): void {
    console.log(filterValue.target.value)
    if (filterValue.target.value === '') { 
      this.usersHab = this.usersHabTmp;      
      this.usersInHab = this.usersInHabTmp;
    }

    if (this.filterValueAct.length > filterValue.target.value.length) {
      this.filterValueAct = filterValue.target.value.trim().toLowerCase();
      this.usersHab = this.usersHabTmp;      
      this.usersInHab = this.usersInHabTmp;
      if (hab === 1) {
        this.usersHab = this.usersHab.filter((emp: User) => emp.user_name.toLowerCase().trim().includes(filterValue.target.value.trim().toLowerCase()));
      } else {
        this.usersInHab = this.usersInHab.filter((emp: User) => emp.user_name.toLowerCase().trim().includes(filterValue.target.value.trim().toLowerCase()));
      }
    } else {
      this.filterValueAct = filterValue.target.value.trim().toLowerCase();
      if (hab === 1) {
        this.usersHab = this.usersHab.filter((emp: User) => emp.user_name.toLowerCase().trim().includes(this.filterValueAct));
      } else {
        this.usersInHab = this.usersInHab.filter((emp: User) => emp.user_name.toLowerCase().trim().includes(this.filterValueAct));
      }
    }  
  }

  public editUserRol(): void {
    let message ='<p>¿Está seguro que desea actualizar el rol al usuario </p>';
    let user = this.user;
    Swal.fire({
      title: 'Actualizar rol usuario',
      html: message  + '<p>' +  user.user_name + ' ' + user.user_lastName + '?</p>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, actualizar'
    }).then((confirm) => {
      if (confirm.isConfirmed) {
        this.usersService.updateRolUser(user).subscribe({
          next: (result: number) => {
            if (result === 1) {
              Swal.fire({
                title: 'Actualizar rol usuario',
                text: 'El usuario ' +  user.user_name + ' ' + user.user_lastName + ' fue actualizado correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
              this.fillTables();
            } else{
              Swal.fire({
                title: 'Actualizar rol usuario',
                text: 'El usuario ' +  user.user_name + ' ' + user.user_lastName + ' no pudo ser actualizado correctamente',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            } 
          },
          error: (error: any) => {
            console.log(error);
            Swal.fire({
              title: 'Actualizar rol usuario',
              text: `Hubo algún error al actualizar al usuario ${ user.user_name + ' ' + user.user_lastName }`,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          },
          complete: () => console.log("Update rol complete")
        });
      }
    })
  }
}

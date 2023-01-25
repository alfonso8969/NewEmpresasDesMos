import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/class/users';
import { UsersService } from 'src/app/services/users.service';
import * as d3 from 'd3';
import Swal from 'sweetalert2'
import { Log } from 'src/app/interfaces/log';
import { LogsService } from 'src/app/services/logs.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit, AfterViewInit {

  user: User;
  usersHab: User[];
  usersHabTmp: User[];
  usersInHab: User[];
  usersInHabTmp: User[];
  log: Log;

  viewSpinner: boolean;
  rolValue: number;
  rolStr: string;
  filterValueAct: string = '';

  public page: number = 1;
  public page2: number = 1;

  public siguiente: string = "Siguiente";
  public anterior: string = "Anterior";

  editUserRolForm: FormGroup

  constructor(private fb: FormBuilder, 
              private usersService: UsersService,
              private logService: LogsService) {

    this.viewSpinner = true;
    this.log = this.logService.initLog();
    this.fillTables();

    this.editUserRolForm = this.fb.group({
      nombre: [''],
      rol: [0, Validators.required]
    });
  }

  fillTables() {
    this.log.action = 'Conseguir usuarios habilitados';
    this.usersService.getUsersEnabled().subscribe({
      next: (users: any) => {
        if (users != null) {
          this.usersHab = users.data;
          this.usersHabTmp = JSON.parse(JSON.stringify(this.usersHab));
        } else {
          alert("Hubo un error");
          this.log.status = false;
          this.log.message = `Error al conseguir usuarios habilitados: ${JSON.stringify(users)}`;
          this.logService.setLog(this.log);
        }
        this.viewSpinner = false;
      },
      error: (error: any) => {
        this.log.status = false;
        this.log.message = `Error al conseguir usuarios habilitados: ${JSON.stringify(error)}`;
        this.logService.setLog(this.log);
        console.log(error);
        this.viewSpinner = false;
        alert(error.message)
      },
      complete: () => console.log("Complete", this.usersHab)
    });

    this.log.action = 'Conseguir usuarios inhabilitados';
    this.usersService.getUsersDisabled().subscribe({
      next: (users: any) => {
        if (users != null) {
          this.usersInHab = users.data.filter((user: User) => user.id_user != 0);;
          this.usersInHabTmp = JSON.parse(JSON.stringify(this.usersInHab));
        } else {
          this.log.status = false;
          this.log.message = `Error al conseguir usuarios inhabilitados: ${JSON.stringify(users)}`;
          this.logService.setLog(this.log);
          alert("Hubo un error");
        }
        this.viewSpinner = false;
      },
      error: (error: any) => {
        this.log.status = false;
        this.log.message = `Error al conseguir usuarios inhabilitados: ${JSON.stringify(error)}`;
        this.logService.setLog(this.log);
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
    this.log.action = `${title} usuario`;
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
              this.log.status = true;
              this.log.message = `Usuario ${user.user_name} se pudo ${title.toLowerCase()} correctamente`;
              this.logService.setLog(this.log);
              this.fillTables();
            } else{
              Swal.fire({
                title: title + ' usuario',
                text: 'El usuario ' +  user.user_name + ' ' + user.user_lastName + ' no se pudo ' + title.toLowerCase() + ' correctamente',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
              this.log.status = false;
              this.log.message = `Usuario ${user.user_name} no se pudo ${title.toLowerCase()} correctamente`;
              this.logService.setLog(this.log);
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
            this.log.status = false;
            this.log.message = `Usuario ${user.user_name} no se pudo ${title.toLowerCase()} correctamente: ${JSON.stringify(error)}`;
            this.logService.setLog(this.log);
          },
          complete: () => { 
            console.log(`${ title.toLowerCase()} usuario ${ user.user_name + ' ' + user.user_lastName } completado`); 
          }
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
    let title = 'Actualizar rol usuario';
    this.log.action = title;
    Swal.fire({
      title: title,
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
                title: title,
                text: 'El usuario ' +  user.user_name + ' ' + user.user_lastName + ' fue actualizado correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
              this.log.status = true;
              this.log.message = `Usuario ${user.user_name} actualizo rol a ${user.user_rol} correctamente`;
              this.logService.setLog(this.log);
              this.fillTables();
            } else{
              Swal.fire({
                title: title,
                text: 'El usuario ' +  user.user_name + ' ' + user.user_lastName + ' no pudo ser actualizado correctamente',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
              this.log.status = false;
              this.log.message = `Usuario ${user.user_name} no pudo actualizar rol a ${user.user_rol} correctamente`;
              this.logService.setLog(this.log);
            } 
          },
          error: (error: any) => {
            console.log(error);
            Swal.fire({
              title: title,
              text: `Hubo algún error al actualizar al usuario ${ user.user_name + ' ' + user.user_lastName }`,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
            this.log.status = false;
            this.log.message = `Usuario ${user.user_name} no pudo actualizar rol a ${user.user_rol} correctamente: ${JSON.stringify(error)}`;
            this.logService.setLog(this.log);
          },
          complete: () => { 
            console.log(title + ` ${ user.user_name + ' ' + user.user_lastName } completado`); 
          }
        });
      }
    })
  }
}

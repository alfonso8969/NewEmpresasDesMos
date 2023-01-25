import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/class/users';
import { Log } from 'src/app/interfaces/log';
import { LogsService } from 'src/app/services/logs.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-list-technical',
  templateUrl: './list-technical.component.html',
  styleUrls: ['./list-technical.component.css']
})
export class ListTechnicalComponent implements OnInit {

  filterValueAct: string = '';

  userLogged: User;
  users: User[];
  usersTemp: User[];
  log: Log;

  public page: number = 1;
  public page2: number = 1;
  public siguiente: string = "Siguiente";
  public anterior: string = "Anterior";

  viewSpinner: boolean = true;

  constructor(private router: Router,
              private userService: UsersService,
              private logService: LogsService) {

    this.log = this.logService.initLog();
    this.userLogged = this.userService.getUserLogged();

    let user_rol = Number(this.userLogged.user_rol);

    this.userService.getUsers().subscribe({
      next: (users: any) => {
        if (users != null) {
          this.users = users.data.filter((user: User) => user.rol_name == "Technical");
          this.usersTemp = JSON.parse(JSON.stringify(this.users));
        } else {
          alert("Hubo un error");
          this.log.action = 'Conseguir técnicos';
          this.log.status = false;
          this.log.message = `Error al conseguir técnicos: ${JSON.stringify(users)}`;
          this.logService.setLog(this.log);
        }
        this.viewSpinner = false;
      },
      error: (error: any) => {
        this.log.action = 'Conseguir técnicos';
        this.log.status = false;
        this.log.message = `Error al conseguir técnicos: ${JSON.stringify(error)}`;
        this.logService.setLog(this.log);
        console.log(error);
        this.viewSpinner = false;
        alert(error.message || "Error al conseguir técnicos");
      },
      complete: () => console.log("Complete", this.users)
    });
  }

  ngOnInit(): void {
  }

  public getUser(user: User): void {
    this.router.navigate(['dashboard/view-user/' + user.id_user, { url: '/dashboard/list-technical' }]);
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

}

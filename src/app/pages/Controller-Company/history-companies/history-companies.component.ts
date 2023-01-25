import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Empresa } from 'src/app/class/empresa';
import { User } from 'src/app/class/users';
import { Log } from 'src/app/interfaces/log';
import { CompaniesService } from 'src/app/services/companies.service';
import { LogsService } from 'src/app/services/logs.service';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-history-companies',
  templateUrl: './history-companies.component.html',
  styleUrls: ['./history-companies.component.css']
})
export class HistoryCompaniesComponent implements OnInit {

  user: User;
  admin: boolean;
  empresa: Empresa;
  empresasInHab: Empresa[];
  empresasHab: Empresa[];
  empresasTmp: Empresa[];
  empresasHabTmp: Empresa[];
  log: Log;

  viewSpinner: boolean = true;
  filterValueAct: string = '';

  public page: number = 1;
  public page2: number = 1;

  public siguiente: string = "Siguiente";
  public anterior: string = "Anterior";

  constructor(private companiesService: CompaniesService,
              private userService: UsersService,
              private router: Router,
              private logService: LogsService) {
                
    this.log = this.logService.initLog()            
    this.user = this.userService.getUserLogged();
    let user_rol = Number(this.user?.user_rol);
    this.admin = user_rol === 1 || user_rol === 3 ? true : false;
    this.fillTables();
   }

  ngOnInit(): void {
  }

  public fillTables(): void {
    this.companiesService.getCompaniesHistory().subscribe({
      next: async (result: any) => {
        if (result != null) {
          this.empresasInHab = result.data;
          this.empresasTmp = JSON.parse(JSON.stringify(this.empresasInHab));
        } else {
          alert("Hubo un error")
        }
        this.viewSpinner = false;
      },
      error: (error: any) => {
        this.log.action = 'Conseguir historial empresas';
        this.log.status = false;
        this.log.message = `(history-companies) Se produjo un error al conseguir el historial de las empresas inhabilitadas: ${JSON.stringify(error)}`;
        this.logService.setLog(this.log);
        console.log(error);
        this.viewSpinner = false;
        alert(error.message)
      },
      complete: () => console.log("Complete", this.empresasInHab)
    });

    this.companiesService.getCompaniesHistoryHab().subscribe({
      next: async (result: any) => {
        if (result != null) {
          this.empresasHab = result.data;
          this.empresasHabTmp = JSON.parse(JSON.stringify(this.empresasHab));
        } else {
          alert("Hubo un error")
        }
        this.viewSpinner = false;
      },
      error: (error: any) => {
        this.log.action = 'Conseguir historial empresas';
        this.log.status = false;
        this.log.message = `(history-companies) Se produjo un error al conseguir el historial de las empresas habilitadas: ${JSON.stringify(error)}`;
        this.logService.setLog(this.log);
        console.log(error);
        this.viewSpinner = false;
        alert(error.message)
      },
      complete: () => console.log("Complete", this.empresasHab)
    });
  }

  public getEmpresa(emp: Empresa, navigate: boolean, hab: number = 3): void {
    if (navigate && hab == 3) {
      this.router.navigate(['/dashboard/view-company', { id: emp.Empresa_det_id, url: '/dashboard/history-companies' }]);
      return;
    }
    this.empresa = emp;
    this.empresa.Habilitada = hab;
    if (hab === 0) {
      this.empresa.user_id_baja = this.user.id_user;
    } else {
      this.empresa.user_id_alta = this.user.id_user;
    }
    console.log(this.empresa);
    this.toAbleDisabledCompany(this.empresa);
  }

  public applyFilter(filterValue: any, hab: number): void {
    console.log(filterValue.target.value)
    if (filterValue.target.value === '') {
      this.empresasInHab = this.empresasTmp;
      this.empresasHab = this.empresasHabTmp;
    }

    if (this.filterValueAct.length > filterValue.target.value.length) {
      this.filterValueAct = filterValue.target.value.trim().toLowerCase();
      this.empresasInHab = this.empresasTmp;
      this.empresasHab = this.empresasHabTmp;
      if (hab === 0) {
        this.empresasInHab = this.empresasInHab.filter((emp: Empresa) => emp.Nombre.toLowerCase().trim().includes(filterValue.target.value.trim().toLowerCase()));
      } else {
        this.empresasHab = this.empresasHab.filter((emp: Empresa) => emp.Nombre.toLowerCase().trim().includes(filterValue.target.value.trim().toLowerCase()));
      }
    } else {
      this.filterValueAct = filterValue.target.value.trim().toLowerCase();
      if (hab === 0) {
        this.empresasInHab = this.empresasInHab.filter((emp: Empresa) => emp.Nombre.toLowerCase().trim().includes(this.filterValueAct));
      } else {
        this.empresasHab = this.empresasHab.filter((emp: Empresa) => emp.Nombre.toLowerCase().trim().includes(this.filterValueAct));
      }
    }
  }

  public toAbleDisabledCompany(empresa: Empresa): void {
    let title = empresa.Habilitada == 1 ? 'Habilitar' : 'Deshabilitar';
    let message = `¿Está seguro que desea ${ title.toLowerCase() } la empresa ${ empresa.Nombre }?`;
    Swal.fire({
      title: title + ' empresa',
      html: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, ' + title.toLowerCase()
    }).then((confirm) => {
      if (confirm.isConfirmed) {
        this.log.action = `${title} empresa`;
        this.companiesService.toAbleDisableCompany(empresa).subscribe({
          next: (result: number) => {
            if (result === 1) {
              Swal.fire({
                title: title + ' empresa',
                text: 'La empresa ' +  empresa.Nombre + ' se pudo ' + title.toLowerCase() + ' correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
              this.log.status = true;
              this.log.message = `(history-companies) Se pudo ${title} la empresa correctamente: ${empresa.Nombre}`;
              this.logService.setLog(this.log);
              this.fillTables();
            } else{
              Swal.fire({
                title: title + ' empresa',
                text: 'La empresa ' +  empresa.Nombre + ' no se pudo ' + title.toLowerCase() + ' correctamente',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
              this.log.status = false;
              this.log.message = `(history-companies) Se produjo un error al ${title} la empresa: ${empresa.Nombre}`;
              this.logService.setLog(this.log);
            }
          },
          error: (error: any) => {
            console.log(error);
            this.log.status = false;
            this.log.message = `(history-companies) Se produjo un error al ${title} la empresa ${ empresa.Nombre }: ${JSON.stringify(error)}`;
            this.logService.setLog(this.log);
            Swal.fire({
              title: title + ' empresa',
              text: 'Hubo algún error al ' + title.toLowerCase() + ` la empresa ${ empresa.Nombre }`,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          },
          complete: () => console.log(`Update ${title} ${ empresa.Nombre } complete`)
        });
      }
    })
  }
}

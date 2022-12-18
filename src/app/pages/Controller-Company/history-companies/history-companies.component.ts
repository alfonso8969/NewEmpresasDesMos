import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Empresa } from 'src/app/class/empresa';
import { User } from 'src/app/class/users';
import { CompaniesService } from 'src/app/services/companies.service';
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

  viewSpinner: boolean = true;
  filterValueAct: string = '';

  public page: number = 1;
  public page2: number = 1;

  public siguiente: string = "Siguiente";
  public anterior: string = "Anterior";

  constructor(private companiesService: CompaniesService, private router: Router) {
    let userLogged = localStorage.getItem('userlogged');
    if (userLogged && userLogged != "undefined") {
      console.log('localstorage userlogged MenuService: ', JSON.parse(localStorage.getItem('userlogged')!))
      this.user = JSON.parse(userLogged);
    }
    this.admin = Number(this.user.user_rol) === 1 ? true : false;
    this.fillTables();
   }

  ngOnInit(): void {
  }

  public fillTables(): void {
    this.companiesService.getComapniesHistory().subscribe({
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
        console.log(error);
        this.viewSpinner = false;
        alert(error.message)
      },
      complete: () => console.log("Complete", this.empresasInHab)
    });

    this.companiesService.getComapniesHistoryHab().subscribe({
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
    this.toAbledisabledCompany(this.empresa);
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

  public toAbledisabledCompany(empresa: Empresa): void {
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
        this.companiesService.toAbleDisableCompany(empresa).subscribe({
          next: (result: number) => {
            if (result === 1) {
              Swal.fire({
                title: title + ' empresa',
                text: 'La empresa ' +  empresa.Nombre + ' se pudo ' + title.toLowerCase() + ' correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
              this.fillTables();
            } else{
              Swal.fire({
                title: title + ' empresa',
                text: 'La empresa ' +  empresa.Nombre + ' no se pudo ' + title.toLowerCase() + ' correctamente',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
          },
          error: (error: any) => {
            console.log(error);
            Swal.fire({
              title: title + ' empresa',
              text: 'Hubo algún error al ' + title.toLowerCase() + ` la empresa ${ empresa.Nombre }`,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          },
          complete: () => console.log("Update habilitada complete")
        });
      }
    })
  }

}

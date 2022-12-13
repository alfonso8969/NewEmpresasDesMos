import { Component, OnInit } from '@angular/core';
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
  empresa: Empresa;
  empresas: Empresa[];
  empresasHab: Empresa[];
  empresasTmp: Empresa[];
  empresasHabTmp: Empresa[];

  viewSpinner: boolean = true;
  filterValueAct: string = '';
  constructor(private companiesService: CompaniesService) {
    this.user = new User();
    this.user.id_user = 1;
    this.fillTables();
   }

  ngOnInit(): void {
  }

  public fillTables(): void {
    this.companiesService.getComapniesHistory().subscribe({
      next: async (result: any) => {
        if (result != null) {
          this.empresas = result.data;
          this.empresasTmp = JSON.parse(JSON.stringify(this.empresas));
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
      complete: () => console.log("Complete", this.empresas)
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

  public getEmpresa(emp: Empresa): void {
    this.empresa = emp;
    this.empresa.Habilitada = 1;
    this.empresa.user_id_alta = this.user.id_user;
    console.log(this.empresa);
    this.toAbledisabledUser(this.empresa);
  }

  public getEmpresaHab(emp: Empresa): void {
    this.empresa = emp;
    this.empresa.Habilitada = 0;
    this.empresa.user_id_baja = this.user.id_user;
    console.log(this.empresa);
    this.toAbledisabledUser(this.empresa);
  }

  public applyFilter(filterValue: any, hab: number): void {
    console.log(filterValue.target.value)
    if (filterValue.target.value === '') { 
      this.empresas = this.empresasTmp;      
      this.empresasHab = this.empresasHabTmp;
    }

    if (this.filterValueAct.length > filterValue.target.value.length) {
      this.filterValueAct = filterValue.target.value.trim().toLowerCase();
      this.empresas = this.empresasTmp;      
      this.empresasHab = this.empresasHabTmp;
      if (hab === 0) {
        this.empresas = this.empresas.filter((emp: Empresa) => emp.Nombre.toLowerCase().trim().includes(filterValue.target.value.trim().toLowerCase()));
      } else {
        this.empresasHab = this.empresasHab.filter((emp: Empresa) => emp.Nombre.toLowerCase().trim().includes(filterValue.target.value.trim().toLowerCase()));
      }
    } else {
      this.filterValueAct = filterValue.target.value.trim().toLowerCase();
      if (hab === 0) {
        this.empresas = this.empresas.filter((emp: Empresa) => emp.Nombre.toLowerCase().trim().includes(this.filterValueAct));
      } else {
        this.empresasHab = this.empresasHab.filter((emp: Empresa) => emp.Nombre.toLowerCase().trim().includes(this.filterValueAct));
      }
    }  
  }

  public toAbledisabledUser(empresa: Empresa): void {
    let title = empresa.Habilitada == 1 ? 'Habilitar' : 'Deshabilitar';
    let message = empresa.Habilitada == 1 ? '¿Está seguro que desea habilitar la empresa ' : '¿Está seguro que desea deshabilitar la empresa ';
    Swal.fire({
      title: title + ' empresa',
      html: message  + empresa.Nombre + '?',
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

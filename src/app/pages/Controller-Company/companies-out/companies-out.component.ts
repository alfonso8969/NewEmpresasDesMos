import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Empresa } from 'src/app/class/empresa';
import { Log } from 'src/app/interfaces/log';
import { CompaniesService } from 'src/app/services/companies.service';
import { LogsService } from 'src/app/services/logs.service';

@Component({
  selector: 'app-companies-out',
  templateUrl: './companies-out.component.html',
  styleUrls: ['./companies-out.component.css']
})
export class CompaniesOutComponent implements OnInit {

  listEmpresas: Empresa[]
  div: Element;
  log: Log;

  displayedColumns: string[] = ['Nombre', 'Distrito', 'Fecha baja', 'Usuario'];

  dataSource: MatTableDataSource<Empresa>;

  @ViewChild(MatPaginator, {static: false})
  set paginator(value: MatPaginator) {
    if (this.dataSource){
      this.dataSource.paginator = value;
    }
  }
  @ViewChild(MatSort, {static: false})
  set sort(value: MatSort) {
    if (this.dataSource){
      this.dataSource.sort = value;
    }
  }

  viewSpinner: boolean = true;
  message: string;

  constructor(private companiesService: CompaniesService, 
              private route: Router,
              private logService: LogsService) {
    this.log = this.logService.initLog();
    this.listEmpresas = [];
    this.getCompanies();
  }

  ngOnInit(): void {
    this.div = document.getElementsByClassName('page-wrapper')[0];
    this.div.className = "viewSpinner";
  }


  public getCompanies(): void {
    this.companiesService.getCompaniesInha().subscribe({
      next: async (result: any) => {
        if (result != null) {
          this.listEmpresas = result.data;
          this.dataSource = new MatTableDataSource<Empresa>(this.listEmpresas);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          await this.sleep()
        } else {
          alert("Hubo un error")
        }
        this.viewSpinner = false;
      },
      error: (error: any) => {
        this.log.action = 'Conseguir empresas inhabilitadas';
        this.log.status = false;
        this.log.message = `(companies-out) Se produjo un error al conseguir las empresa inhabilitadas: ${JSON.stringify(error)}`;
        this.logService.setLog(this.log);
        this.viewSpinner = false;
        this.div.className = "page-wrapper";
        console.log('Conseguir empresas inhabilitadas', error);
        alert('Error al conseguir empresas inhabilitadas')
      },
      complete: () => console.log("Complete", this.listEmpresas)
    });
  }

  public applyFilter(filterValue: any): void {
    console.log(filterValue.target.value)
    filterValue = filterValue.target.value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  view(item: Empresa) {
    console.log(item.Empresa_det_id);
    this.route.navigate(['dashboard/view-company', { id: item.Empresa_det_id, url: '/dashboard/companies-out' }]);
  }

  private delay(ms: number) {
    setTimeout(() => {
      this.div.className = "page-wrapper";
    }, ms);
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async sleep() {
    await this.delay(2000);
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Empresa } from 'src/app/class/empresa';
import { CompaniesService } from 'src/app/services/companies.service';

@Component({
  selector: 'app-companies-out',
  templateUrl: './companies-out.component.html',
  styleUrls: ['./companies-out.component.css']
})
export class CompaniesOutComponent implements OnInit {

  listEmpresas: Empresa[]
  div: Element;


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

  constructor(private companiesService: CompaniesService, private route: Router) {
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
        console.log()//(error);
        this.viewSpinner = false;
        this.div.className = "page-wrapper";
        alert(error.message)
      },
      complete: () => console.log()//("Complete", this.listEmpresas)
    });
  }

  view(item: Empresa) {
    console.log()//(item.Empresa_det_id);
    this.route.navigate(['dashboard/view-company', item.Empresa_det_id]);
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

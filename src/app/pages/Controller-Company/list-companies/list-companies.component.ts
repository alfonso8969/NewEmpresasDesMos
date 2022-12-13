import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Empresa } from 'src/app/class/empresa';
import { Fields } from 'src/app/interfaces/fields';
import { CompaniesService } from 'src/app/services/companies.service';
import { FieldsService } from 'src/app/services/fields.service';

@Component({
  selector: 'app-list-companies',
  templateUrl: './list-companies.component.html',
  styleUrls: ['./list-companies.component.css']
})
export class ListCompaniesComponent implements OnInit {

  listEmpresas: Empresa[]
  div: Element;
  sectores: Fields[];

  displayedColumns: string[] = ['Nombre', 'Sector', 'Distrito', 'Poligono'];
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

  constructor(private companiesService: CompaniesService, private route: Router, private fieldsService: FieldsService) {
    this.listEmpresas = [];
    this.getCompanies();

    this.fieldsService.getFields("sector").subscribe({
      next: (result: any) => {
        if (result != null) {
          this.sectores = result.data;
        } else {
          alert("Hubo un error")
        }
      },
      error: (error: any) => {
        console.log(error);
        alert(error.message)
      },
      complete: () => console.log("Complete", this.sectores)
    });
  }

  ngOnInit(): void {
    this.div = document.getElementsByClassName('page-wrapper')[0];
    this.div.className = "viewSpinner";
  }

  public applyFilter(filterValue: any): void {
    console.log(filterValue.target.value)
    filterValue = filterValue.target.value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  public select(value: number): void {
    console.log(value);
    let sector = this.sectores.filter((sec: Fields) => sec.sector_id == value);
    this.dataSource.filter = sector.length > 0 ? sector[0].empresas_sector_name.trim().toLowerCase() : '';
  }

  public getCompanies(): void {
    this.companiesService.getCompanies().subscribe({
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
        console.log(error);
        this.viewSpinner = false;
        this.div.className = "page-wrapper";
        alert(error.message)
      },
      complete: () => console.log("Complete", this.listEmpresas)
    });
  }

  public view(item: Empresa): void {
    console.log(item.Empresa_det_id);
    this.route.navigate(['dashboard/view-company', { id: item.Empresa_det_id, url: '/dashboard/list-companies' } ]);
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

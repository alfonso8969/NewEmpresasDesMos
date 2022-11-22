import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Empresa } from 'src/app/class/empresa';
import { CompaniesService } from 'src/app/services/companies.service';

@Component({
  selector: 'app-list-companies',
  templateUrl: './list-companies.component.html',
  styleUrls: ['./list-companies.component.css']
})
export class ListCompaniesComponent implements OnInit, OnDestroy {

  listEmpresas: Empresa[]

  displayedColumns: string[] = ['Nombre', 'Sector', 'Distrito', 'Poligono'];

  dataSource: MatTableDataSource<Empresa>;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private companiesService: CompaniesService) {
    this.listEmpresas = [];
    this.getCompanies();
  }

  ngOnInit(): void {

  }

  public getCompanies(): void {
    this.companiesService.getCompanies().subscribe({
      next: (result: any) => {
        this.listEmpresas = result.data;
        this.dataSource = new MatTableDataSource<Empresa>(this.listEmpresas);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (error: any) => console.log(error),
      complete: () => console.log("Complete", this.listEmpresas)
    });
  }

  view(item: Empresa) {
    console.log(item);
  }


  ngOnDestroy() {

  }
}

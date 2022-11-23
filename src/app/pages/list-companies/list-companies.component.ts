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
  div: Element;


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
  message: string;

  constructor(private companiesService: CompaniesService) {
    this.listEmpresas = [];
    this.getCompanies();
  }

  ngOnInit(): void {
    this.div = document.getElementsByClassName('page-wrapper')[0];
    this.div.className = "viewSpinner";
  }


  public getCompanies(): void {
    this.companiesService.getCompanies().subscribe({
      next: async (result: any) => {
        this.listEmpresas = result.data;
        this.dataSource = new MatTableDataSource<Empresa>(this.listEmpresas);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        await this.sleep()
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

  view(item: Empresa) {
    console.log(item);
  }

  private delay(ms: number) {
    setTimeout(() => {
      this.div.className = "page-wrapper";
    }, ms);
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async sleep() {
    await this.delay(3000);
  }

  ngOnDestroy() {

  }
}

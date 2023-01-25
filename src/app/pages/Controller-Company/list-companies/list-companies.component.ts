import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Empresa } from 'src/app/class/empresa';
import { User } from 'src/app/class/users';
import { Fields } from 'src/app/interfaces/fields';
import { Log } from 'src/app/interfaces/log';
import { CompaniesService } from 'src/app/services/companies.service';
import { FieldsService } from 'src/app/services/fields.service';
import { LogsService } from 'src/app/services/logs.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-list-companies',
  templateUrl: './list-companies.component.html',
  styleUrls: ['./list-companies.component.css']
})
export class ListCompaniesComponent implements OnInit, AfterViewInit {

  listEmpresas: Empresa[]
  sectores: Fields[];
  user: User;
  log: Log;

  admin: boolean;
  div: Element;
  slc: Element;
  filter: string;
  filterSended: boolean = false;
  field: string;
  id: string;
  url: string;

  selectSector: FormGroup;

  displayedColumns: string[] = ['Nombre', 'Sector', 'Distrito', 'Poligono'];
  dataSource: MatTableDataSource<Empresa>;

  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }
  @ViewChild(MatSort, { static: false })
  set sort(value: MatSort) {
    if (this.dataSource) {
      this.dataSource.sort = value;
    }
  }

  viewSpinner: boolean = true;

  constructor(private companiesService: CompaniesService,
    private router: Router,
    private fieldsService: FieldsService,
    private route: ActivatedRoute,
    private userService: UsersService,
    private fb: FormBuilder,
    private logService: LogsService) {

    this.log = this.logService.initLog();
    this.user = this.userService.getUserLogged();
    let user_rol = Number(this.user?.user_rol);
    this.admin = user_rol === 1 || user_rol === 3 ? true : false;

    this.selectSector = this.fb.group({
      nombreSector: [0]
    });


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
        this.log.action = 'Conseguir sectores';
        this.log.status = false;
        this.log.message = `(list-companies) Error al conseguir sectores ${JSON.stringify(error)}`;
        this.logService.setLog(this.log);
        console.log(error);
        alert(error.message)
      },
      complete: () => console.log("Complete", this.sectores)
    });
  }

  ngAfterViewInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.keys.length > 0) {
        this.filter = params.get('filter')!;
        this.field = params.get('field')!;
        this.filterSended = Boolean(params.get('filterSended'))!;
        this.url = params.get('url')!;
        this.id = params.get('id')!;
        console.log(this.filter);
        setTimeout(() => {
          this.applyFilter(this.filter);
          this.selectSector.get('nombreSector')!.setValue(this.id);
        }, 600);
      }
    });
  }

  ngOnInit(): void {
    this.div = document.getElementsByClassName('page-wrapper')[0];
    this.div.className = "viewSpinner";
  }

  public applyFilter(filterValue: any): void {
    console.log(filterValue)
    if (typeof (filterValue) !== 'string') {
      filterValue = filterValue.target.value.trim().toLowerCase();
      this.filterSended = false;
    }
    this.dataSource.filter = filterValue;
  }

  public select(): void {
    let sectorId = this.selectSector.get('nombreSector')?.value;
    this.filterSended = false;
    let sector = this.sectores.filter((sec: Fields) => sec.sector_id == sectorId);
    this.dataSource.filter = sector.length > 0 ? sector[0].empresas_sector_name!.trim().toLowerCase() : '';
  }

  public getCompanies(): void {
    this.log.action = 'Conseguir empresas';
    this.companiesService.getCompanies().subscribe({
      next: async (result: any) => {
        if (result != null) {
          this.listEmpresas = result.data;
          this.dataSource = new MatTableDataSource<Empresa>(this.listEmpresas);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          await this.sleep()
        } else {
          this.log.status = false;
          this.log.message = `(list-companies) Error al conseguir empresas: ${JSON.stringify(result)}`;
          this.logService.setLog(this.log);
          alert("Hubo un error")
        }
        this.viewSpinner = false;
      },
      error: (error: any) => {
        this.log.status = false;
        this.log.message = `(list-companies) Error al conseguir empresas ${JSON.stringify(error)}`;
        this.logService.setLog(this.log);
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
    this.router.navigate(['dashboard/view-company', { id: item.Empresa_det_id, url: '/dashboard/list-companies' }]);
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

import { Component, OnInit } from '@angular/core';
import { Empresa } from 'src/app/class/empresa';
import { CompaniesService } from 'src/app/services/companies.service';

@Component({
  selector: 'app-history-companies',
  templateUrl: './history-companies.component.html',
  styleUrls: ['./history-companies.component.css']
})
export class HistoryCompaniesComponent implements OnInit {

  
  empresa: Empresa;
  empresas: any[];
  empresasHab: any;

  viewSpinner: boolean = true;
  constructor(private companiesService: CompaniesService) {
    this.companiesService.getComapniesHistory().subscribe({
      next: async (result: any) => {
        if (result != null) {
          this.empresas = result.data;
        } else {
          alert("Hubo un error")
        }
        this.viewSpinner = false;
      },
      error: (error: any) => {
        console.log()//(error);
        this.viewSpinner = false;
        alert(error.message)
      },
      complete: () => console.log()//("Complete", this.empresas)
    });

    this.companiesService.getComapniesHistoryHab().subscribe({
      next: async (result: any) => {
        if (result != null) {
          this.empresasHab = result.data;
        } else {
          alert("Hubo un error")
        }
        this.viewSpinner = false;
      },
      error: (error: any) => {
        console.log()//(error);
        this.viewSpinner = false;
        alert(error.message)
      },
      complete: () => console.log()//("Complete", this.empresasHab)
    });
   }

  ngOnInit(): void {
  }

  public getEpresa(emp: Empresa): void {
    console.log()//(emp);
  }
  
  public getEpresaHab(emp: Empresa): void {
    console.log()//(emp);
  }

}

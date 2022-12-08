import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Fields } from 'src/app/interfaces/Fileds';
import { CompaniesService } from 'src/app/services/companies.service';

@Component({
  selector: 'app-admin-fields',
  templateUrl: './admin-fields.component.html',
  styleUrls: ['./admin-fields.component.css']
})
export class AdminFieldsComponent implements OnInit {

  addFieldSectorForm: FormGroup;
  addFieldDistritoForm: FormGroup;
  addFieldPoligonoForm: FormGroup;

  sectores: Fields[];
  distritos: Fields[];
  poligonos: Fields[];

  sectorId: number;
  distritoId: number;
  poligonoId: number;

  constructor(private fb: FormBuilder, private companiesService: CompaniesService) {
    this.addFieldSectorForm = this.fb.group({ 
      sector: [0],
      nombreSector: ['', Validators.required]
    });
    this.addFieldDistritoForm = this.fb.group({ 
      distrito: [0],
      nombreDistrito: ['', Validators.required]
    });
    this.addFieldPoligonoForm = this.fb.group({ 
      poligono: [0],
      nombrePoligono: ['', Validators.required]
    });

    this.companiesService.getFields("sector").subscribe({
      next: (result: any) => {
        if (result != null) {
          this.sectores = result.data;
        } else {
          alert("Hubo un error")
        }
      },
      error: (error: any) => {
        console.log()//(error);
        alert(error.message)
      },
      complete: () => console.log()//("Complete", this.sectores)
    });
    
    this.companiesService.getFields("distrito").subscribe({
      next: (result: any) => {
        if (result != null) {
          this.distritos = result.data;
        } else {
          alert("Hubo un error")
        }
      },
      error: (error: any) => {
        console.log()//(error);
        alert(error.message)
      },
      complete: () => console.log()//("Complete", this.distritos)
    });

    this.companiesService.getFields("poligono").subscribe({
      next: (result: any) => {
        if (result != null) {
          this.poligonos = result.data;
        } else {
          alert("Hubo un error")
        }
      },
      error: (error: any) => {
        console.log()//(error);
        alert(error.message)
      },
      complete: () => console.log()//("Complete", this.poligonos)
    });
   }

  ngOnInit(): void {
  }

  
  public addFieldSector(): void {
    
  }
  
  changeDistrito(event: any) {
    this.distritoId = this.addFieldDistritoForm.get('nombreDistrito')?.value;
    let distrito = event.target.selectedOptions[0].text;
    this.addFieldDistritoForm.get('nombreDistrito')?.setValue(distrito);
  }

  public addFieldDistrito(): void {

  }

  changePoligono(event: any) {
    this.poligonoId = this.addFieldPoligonoForm.get('nombrePoligono')?.value;
    let poligono = event.target.selectedOptions[0].text;
    this.addFieldPoligonoForm.get('nombrePoligono')?.setValue(poligono);
  }

  public addFieldPoligono(): void {

  }

  changeSector(event: any) {
    this.sectorId = this.addFieldSectorForm.get('nombreSector')?.value;
    let sector = event.target.selectedOptions[0].text;
    this.addFieldSectorForm.get('nombreSector')?.setValue(sector);
  }

  public cleanFormSector(): void {

  }

  public cleanFormDistrito(): void {

  }

  public cleanFormPoligono(): void {

  }

}

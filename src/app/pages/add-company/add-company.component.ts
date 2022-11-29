import { Component, OnInit } from '@angular/core';
import { Empresa } from 'src/app/class/empresa';
import { Fields } from 'src/app/interfaces/Fileds';
import { CompaniesService } from 'src/app/services/companies.service';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css']
})
export class AddCompanyComponent implements OnInit {

  empresa: Empresa;
  city: string = "Móstoles";
  region: string = "Madrid";
  lastEmpDetId: number;

  sectores: Fields[];
  distritos: Fields[];
  poligonos: Fields[];

  addCompanyForm: FormGroup;

  constructor(private companiesService: CompaniesService, private fb: FormBuilder, private router: Router) {
    this.addCompanyForm = this.fb.group({
      nombre: ['', Validators.required],
      sector: [0, Validators.required],
      distrito: [0, Validators.required],
      poligono: [0, Validators.required],
      email: ['', Validators.required],
      telefono: ['', Validators.required],
      otherTelefono: [''],
      direccion: ['', Validators.required],
      localidad: [''],
      provincia: [''],
      cod_postal: ['', Validators.required]

    })
    this.companiesService.getFields("sector").subscribe({
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
    this.companiesService.getFields("distrito").subscribe({
      next: (result: any) => {
        if (result != null) {
          this.distritos = result.data;
        } else {
          alert("Hubo un error")
        }
      },
      error: (error: any) => {
        console.log(error);
        alert(error.message)
      },
      complete: () => console.log("Complete", this.distritos)
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
        console.log(error);
        alert(error.message)
      },
      complete: () => console.log("Complete", this.poligonos)
    });
    this.companiesService.getLastEmpDetId().subscribe({
      next: (result: any) => this.lastEmpDetId = result,
      error: (error: any) => {
        console.log(error);
        alert(error.message)
      },
      complete: () => console.log("Complete", this.lastEmpDetId)
    })
  }

  ngOnInit(): void {
  }

  addCompany() {
    let local = this.addCompanyForm.get("localidad")?.value;
    let prov = this.addCompanyForm.get("provincia")?.value;
    this.empresa = new Empresa(
      this.addCompanyForm.get("name")?.value,
      this.addCompanyForm.get("sector")?.value,
      this.lastEmpDetId,
      this.addCompanyForm.get("distrito")?.value,
      this.addCompanyForm.get("poligono")?.value
    );

    this.empresa.setEmail(this.addCompanyForm.get("email")?.value);
    this.empresa.setTelefono(this.addCompanyForm.get("telefono")?.value);
    this.empresa.setOtherTelefono(this.addCompanyForm.get("othertelefono")?.value);
    this.empresa.setDireccion(this.addCompanyForm.get("direccion")?.value);
    this.empresa.setLocalidad(local == "" ? this.city : local);
    this.empresa.setProvincia(prov == "" ? this.region : prov);
    this.empresa.setCod_postal(this.addCompanyForm.get("cod_postal")?.value);
    console.log(this.empresa);
  }

  setRedes() {

  }

  isDisabled(): boolean {
    return this.addCompanyForm.get('sector')?.value == 0 || this.addCompanyForm.get('distrito')?.value == 0 || this.addCompanyForm.get('poligono')?.value == 0
  }

  getFormValidationErrors(form: FormGroup) {

    const result: { Campo: string; error: string;  }[] = [];
    Object.keys(form.controls).forEach(key => {

      const controlErrors: any = form!.get(key)!.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          result.push({
             Campo: key,
            'error': keyError
          });
        });
      }
    });

    return JSON.stringify(result);
  }

}

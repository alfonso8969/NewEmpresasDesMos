import { Component, OnInit } from '@angular/core';
import { Empresa } from 'src/app/class/empresa';
import { Fields } from 'src/app/interfaces/Fileds';
import { CompaniesService } from 'src/app/services/companies.service';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

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
  codPostalReg: RegExp = new RegExp(/289+\d{2}/gm);
  phoneReg: RegExp = new RegExp(/[0-9]{9}/);
  emailReg: RegExp = new RegExp(/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/gm);

  addCompanyForm: FormGroup;
  newEmp: any ;
  newRedes: any ;

  constructor(private companiesService: CompaniesService, private fb: FormBuilder, private router: Router) {
    let emp = localStorage.getItem('empresa');
    if (emp && emp != "undefined") {
      this.newEmp = JSON.parse(emp);
      this.fillFormNewEmp(this.newEmp);
    } else {
      this.fillForm();
    }

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

  public fillForm(): void {
    this.addCompanyForm = this.fb.group({
      nombre: ['' , Validators.required],
      sector: [0 , Validators.required],
      distrito: [0 , Validators.required],
      poligono: [0 , Validators.required],
      email: ['' , [Validators.required, Validators.pattern(this.emailReg)]],
      telefono: ['' , [Validators.required, Validators.pattern(this.phoneReg)]],
      otherTelefono: ['' , [Validators.pattern(this.phoneReg)]],
      contactperson: [''],
      direccion: ['', Validators.required],
      localidad: [''],
      provincia: [''],
      cod_postal: ['', [Validators.required, Validators.pattern(this.codPostalReg)]]
    });
  }

  public fillFormNewEmp(newEmp: any): void {
    this.addCompanyForm = this.fb.group({
      nombre: [newEmp['Nombre'] , Validators.required],
      sector: [newEmp['Sector'] , Validators.required],
      distrito: [newEmp['Distrito'] , Validators.required],
      poligono: [newEmp['Poligono'] , Validators.required],
      email: [newEmp['Email'] , [Validators.required, Validators.pattern(this.emailReg)]],
      telefono: [newEmp['Telefono'] , [Validators.required, Validators.pattern(this.phoneReg)]],
      otherTelefono: [newEmp['OtherTelefono'] , [Validators.pattern(this.phoneReg)]],
      contactperson: [newEmp['Persona_contacto'] ],
      direccion: [newEmp['Direccion'] , Validators.required],
      localidad: [''],
      provincia: [''],
      cod_postal: [newEmp['Cod_postal'] , [Validators.required, Validators.pattern(this.codPostalReg)]]
    });
  }

  public addCompany(redes: boolean = false): void {
    let local = this.addCompanyForm.get("localidad")?.value;
    let prov = this.addCompanyForm.get("provincia")?.value;
    this.empresa = new Empresa(
      this.addCompanyForm.get("nombre")?.value,
      this.addCompanyForm.get("sector")?.value,
      this.lastEmpDetId,
      this.addCompanyForm.get("distrito")?.value,
      this.addCompanyForm.get("poligono")?.value
    );

    this.empresa.setPersonaContacto(this.addCompanyForm.get('contactperson')?.value);
    this.empresa.setEmail(this.addCompanyForm.get("email")?.value);
    this.empresa.setTelefono(this.addCompanyForm.get("telefono")?.value);
    this.empresa.setOtherTelefono(this.addCompanyForm.get("otherTelefono")?.value);
    this.empresa.setDireccion(this.addCompanyForm.get("direccion")?.value);
    this.empresa.setLocalidad(local == "" ? this.city : local);
    this.empresa.setProvincia(prov == "" ? this.region : prov);
    this.empresa.setCod_postal(this.addCompanyForm.get("cod_postal")?.value);
    let red = localStorage.getItem('redes');
    if (red && red != "undefined") {
      this.newRedes = JSON.parse(red);
      this.empresa.setWeb(this.newRedes['Web']);
      this.empresa.setTwitter(this.newRedes['Twitter']);
      this.empresa.setFacebook(this.newRedes['Facebook']);
      this.empresa.setInstagram(this.newRedes['Instagram']);
      this.empresa.setLinkedin(this.newRedes['Linkedin']);
      this.empresa.setGoogle_plus(this.newRedes['Google_plus']);
    }
    console.log(this.empresa);
    if (!redes) {
      this.saveEmpresa(this.empresa);
    }
  }

  public saveEmpresa(empresa: Empresa): void {
    localStorage.removeItem("empresa");
    localStorage.removeItem("redes");
    this.companiesService.addCompany(empresa).subscribe({
      next: (data: number) => {
        if (data === 1) {
          Swal.fire({
            title: 'Añadir empresa',
            text: `La empresa ${ empresa.getNombre() } se añadio exitosamente`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.router.navigate(['dashboard/list-companies']);
        } else {
          throw new Error(`Se produjo un error al añadir la empresa ${ empresa.getNombre() } `);
        }
      }, error: (error: any) => { 
        console.log(`Se produjo un error al añadir la empresa: ${ error } `);
        Swal.fire({
          title: 'Añadir empresa',
          text: `Se produjo un error al añadir la empresa ${ empresa.getNombre() } `,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      },
      complete: () => console.log('Se completo la inserción de empresa')
    });    
  }

  public setRedes(): void {
    this.addCompany(true);
    localStorage.setItem("empresa", JSON.stringify(this.empresa));
    this.router.navigateByUrl('dashboard/add-redes');
  }

  isDisabled(): boolean {
    return this.addCompanyForm.get('sector')?.value == 0 || this.addCompanyForm.get('distrito')?.value == 0 || this.addCompanyForm.get('poligono')?.value == 0
  }

  public getFormValidationErrors(form: FormGroup): string {

    const result: { Campo: string; error: string; value: any }[] = [];
    Object.keys(form.controls).forEach(key => {

      const controlErrors: any = form!.get(key)!.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          result.push({
             Campo: key,
            'error': keyError,
            value: form!.get(key)!.value
          });
        });
      }
    });

    return JSON.stringify(result);
  }

  cleanForm() {
    localStorage.removeItem("empresa");
    localStorage.removeItem("redes");
    this.fillForm();
  }

}

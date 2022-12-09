import { Component, OnInit } from '@angular/core';
import { Empresa } from 'src/app/class/empresa';
import { Fields } from 'src/app/interfaces/Fileds';
import { CompaniesService } from 'src/app/services/companies.service';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { User } from 'src/app/class/users';
import { keyframes } from '@angular/animations';
import { Result } from 'src/app/interfaces/result';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css']
})
export class AddCompanyComponent implements OnInit {

  empresa: Empresa;
  user: User;
  city: string = "Móstoles";
  region: string = "Madrid";
  lastEmpDetId: number;

  sectores: Fields[];
  distritos: Fields[];
  poligonos: Fields[];
  codPostalReg: RegExp = new RegExp(/289+\d{2}/gm);
  phoneReg: RegExp = new RegExp(/[0-9]{9}/);
  emailReg: RegExp = new RegExp(/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9](\-){0,1})+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/);

  addCompanyForm: FormGroup;
  newEmp: any ;
  newRedes: any ;

  constructor(private companiesService: CompaniesService, private fb: FormBuilder, private router: Router) {
    this.user = new User();
    this.user.setId_user(1);
    let emp = localStorage.getItem('empresa');
    if (emp && emp != "undefined") {
      console.log('localstorage empresa: ', JSON.parse(localStorage.getItem('empresa')!))
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
      complete: () => console.log("Complete sectores", this.sectores)
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
      complete: () => console.log("Complete distritos", this.distritos)
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
      complete: () => console.log("Complete poligonos", this.poligonos)
    });

    this.companiesService.getLastEmpDetId().subscribe({
      next: (result: any) => this.lastEmpDetId = result,
      error: (error: any) => {
        console.log(error);
        alert(error.message)
      },
      complete: () => console.log("Complete lastEmpDetId", this.lastEmpDetId)
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
      this.addCompanyForm.get("nombre")?.value.toUpperCase(),
      this.addCompanyForm.get("sector")?.value,
      this.lastEmpDetId,
      this.addCompanyForm.get("distrito")?.value,
      this.addCompanyForm.get("poligono")?.value
    );

    this.empresa.setUser_id_alta(this.user.getId_user());
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
    console.log("addCompany", this.empresa);
    if (!redes) {
      this.saveEmpresa(this.empresa);
    }
  }

  public saveEmpresa(empresa: Empresa): void {

    this.companiesService.addCompany(empresa).subscribe({
      next: (data: number) => {
        if (data === 1) {
          Swal.fire({
            title: 'Añadir empresa',
            text: `La empresa ${ empresa.getNombre() } se añadio exitosamente`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          localStorage.removeItem("empresa");
          localStorage.removeItem("redes");
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
      complete: () => console.log('Se completo la inserción de la empresa')
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

  public getFormValidationErrors(form: FormGroup): Result[] {

    const result: Result[] = [];
    Object.keys(form.controls).forEach(key => {
      if (form!.get(key)!.value === 0) {
        result.push({
          Campo: key,
          Error: 'requerido',
          Valor: form!.get(key)!.value
        });
      }
      const controlErrors: any = form!.get(key)!.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
         
          keyError == 'required' && (keyError = 'requerido');
          keyError == 'pattern' && (keyError = 'no válido');
          let value = form!.get(key)!.value;
          result.push({
            Campo: key,
            Error: keyError,
            Valor: value == "" ? "Sin valor" : value
          });
        });
      }
    });

    return result;
  }

  cleanForm() {
    localStorage.removeItem("empresa");
    localStorage.removeItem("redes");
    this.fillForm();
  }

}
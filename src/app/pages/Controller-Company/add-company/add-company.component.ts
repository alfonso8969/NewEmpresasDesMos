import { Component, HostListener, OnInit } from '@angular/core';
import { Empresa } from 'src/app/class/empresa';
import { CompaniesService } from 'src/app/services/companies.service';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { User } from 'src/app/class/users';
import { Result } from 'src/app/interfaces/result';
import { FieldsService } from 'src/app/services/fields.service';
import { Fields } from 'src/app/interfaces/fields';
import { Utils } from 'src/app/utils/utils';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css']
})
export class AddCompanyComponent implements OnInit {

  @HostListener('window:unload', [ '$event' ])
    unloadHandler(event: any) {
    console.log('window:unload', event);
    return false;
  }

  @HostListener('window:beforeunload', [ '$event' ])
   beforeUnloadHandler(event: any) {
    console.log('window:beforeunload', event)
    return false;
   }

  empresa: Empresa;
  user: User;
  sectores: Fields[];
  distritos: Fields[];
  poligonos: Fields[];
  regex: RegExp;
  addCompanyForm: FormGroup;

  city: string = "Móstoles";
  region: string = "Madrid";
  actualYear: number = new Date().getFullYear();

  public type: string;
  lastEmpDetId: number;
  newEmp: any ;
  newRedes: any ;

  constructor(private companiesService: CompaniesService,
              private fieldsService: FieldsService,
              private userService: UsersService,
              private fb: FormBuilder,
              private router: Router) {

    this.user = this.userService.getUserLogged();
    let emp = localStorage.getItem('empresa');
    if (emp && emp != "undefined") {
      console.log('localStorage empresa: ', JSON.parse(localStorage.getItem('empresa')!))
      this.newEmp = JSON.parse(emp);
      this.fillFormNewEmp(this.newEmp);
    } else {
      this.fillForm();
    }

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
      complete: () => console.log("Complete sectores", this.sectores)
    });

    this.fieldsService.getFields("distrito").subscribe({
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

    this.fieldsService.getFields("poligono").subscribe({
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
      complete: () => console.log("Complete polígonos", this.poligonos)
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
      cif: ['' , [Validators.required, Validators.pattern(this.regex)]],
      sector: [0 , Validators.required],
      distrito: [0 , Validators.required],
      polygon: [0 , Validators.required],
      email: ['' , [Validators.required, Validators.pattern(Utils.emailReg)]],
      phone: ['' , [Validators.required, Validators.pattern(Utils.phoneReg)]],
      otherPhone: ['' , [Validators.pattern(Utils.phoneReg)]],
      contactPerson: [''],
      installation_year: [''],
      workers_number: [''],
      address: ['', Validators.required],
      localidad: [''],
      provincia: [''],
      cod_postal: ['', [Validators.required, Validators.pattern(Utils.codPostalReg)]]
    }, {  validator: Utils.getRegexDocument } as AbstractControlOptions );
  }

  public fillFormNewEmp(newEmp: any): void {
    this.addCompanyForm = this.fb.group({
      nombre: [newEmp['Nombre'] , Validators.required],
      cif: [newEmp['CIF'] , [Validators.required]],
      sector: [newEmp['Sector'] , Validators.required],
      distrito: [newEmp['Distrito'] , Validators.required],
      polygon: [newEmp['Poligono'] , Validators.required],
      email: [newEmp['Email'] , [Validators.required, Validators.pattern(Utils.emailReg)]],
      phone: [newEmp['Telefono'] , [Validators.required, Validators.pattern(Utils.phoneReg)]],
      otherPhone: [newEmp['OtherTelefono'] , [Validators.pattern(Utils.phoneReg)]],
      contactPerson: [newEmp['Persona_contacto'] ],
      installation_year: [newEmp['installation_year'], Validators.maxLength(4)],
      workers_number: [newEmp['workers_number']],
      address: [newEmp['Direccion'] , Validators.required],
      localidad: [''],
      provincia: [''],
      cod_postal: [newEmp['Cod_postal'] , [Validators.required, Validators.pattern(Utils.codPostalReg), Validators.maxLength(5)]]
    }, {  validator: [Utils.getRegexDocument] } as AbstractControlOptions );
  }

  public addCompany(redes: boolean = false): void {
    let local = this.addCompanyForm.get("localidad")?.value;
    let prov = this.addCompanyForm.get("provincia")?.value;
    this.empresa = new Empresa(
      this.addCompanyForm.get("nombre")?.value.toUpperCase(),
      this.addCompanyForm.get("sector")?.value,
      this.lastEmpDetId,
      this.addCompanyForm.get("distrito")?.value,
      this.addCompanyForm.get("polygon")?.value
    );

    this.empresa.setUser_id_alta(this.user.id_user);
    this.empresa.setPersonaContacto(this.addCompanyForm.get('contactPerson')?.value);
    this.empresa.setCIF(this.addCompanyForm.get('cif')?.value);
    this.empresa.setEmail(this.addCompanyForm.get("email")?.value);
    this.empresa.setTelefono(this.addCompanyForm.get("phone")?.value);
    this.empresa.setOtherTelefono(this.addCompanyForm.get("otherPhone")?.value);
    this.empresa.setDireccion(this.addCompanyForm.get("address")?.value);
    this.empresa.setInstallation_year(this.addCompanyForm.get("installation_year")?.value);
    this.empresa.setWorkers_number(this.addCompanyForm.get("workers_number")?.value);
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
            text: `La empresa ${ empresa.getNombre() } se añadió exitosamente`,
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

  /**
   * Función que nos dirige al formulario de redes sociales de la empresa.
   * @description
   * Para poder ir, el formulario de empresa debe ser válido.
   * Construimos la empresa
   *
   * ```ts
   * this.addCompany(true)
   * ```
   * con true (si va a redes) para que no la guarde en la Base de Datos
   * Guardamos en LocalStorage la empresa
   * ```ts
   * localStorage.setItem("empresa", JSON.stringify(this.empresa))
   * ```
   * @returns void
   */
  public setRedes(): void {
    this.addCompany(true);
    localStorage.setItem("empresa", JSON.stringify(this.empresa));
    this.router.navigateByUrl('dashboard/add-redes');
  }

  /**
   * Función que comprueba que los comboboxes no estén sin selección,
   * ```ts
   * [ngValue]=0
   * ```
   * @returns {boolean} true si es cierto, false de otra manera
  */
  public isDisabled(): boolean {
    return this.addCompanyForm.get('sector')?.value == 0 || this.addCompanyForm.get('distrito')?.value == 0 || this.addCompanyForm.get('poligono')?.value == 0
  }

  /**
   * Función que comprueba que ciertos campos númericos (Año instalación, Número de trabajadores, Código postal)
   *
   * @param {any} event Evento del input
   * ```ts
   * KeyPressedEvent
   * ```
   * @param {number} count Número de caracteres permitidos para ese input
   *
   *  @returns {boolean} true si es cierto, false de otra manera
   */
  public keyPressed(event: any, count: number): boolean {
    console.log(event);
    if((event.charCode < 48 || event.charCode > 57) || event.srcElement.value.length == count) return false;
    return true;
  }

  public getFormValidationErrors(form: FormGroup): Result[] {
    const result: Result[] = [];
    if(form.hasError('invalidPattern')) {
      result.push({
        Campo: "Documento",
        Error: 'no válido',
        Valor: form.get('cif')!.value
      });
    }
    Object.keys(form.controls).forEach(key => {
      if (form.get(key)!.value === 0) {
        result.push({
          Campo: key,
          Error: 'requerido',
          Valor: form.get(key)!.value
        });
      }
      const controlErrors: any = form!.get(key)!.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          keyError == 'required' && (keyError = 'requerido');
          keyError == 'pattern' && (keyError = 'no válido');
          let value = form.get(key)!.value;
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

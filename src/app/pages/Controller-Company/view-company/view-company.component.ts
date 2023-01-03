import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl, AbstractControlOptions } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Empresa } from 'src/app/class/empresa';
import { User } from 'src/app/class/users';
import { Fields } from 'src/app/interfaces/fields';
import { Result } from 'src/app/interfaces/result';
import { CompaniesService } from 'src/app/services/companies.service';
import { FieldsService } from 'src/app/services/fields.service';
import { UsersService } from 'src/app/services/users.service';
import { Utils } from 'src/app/utils/utils';

import { Operation, compare } from 'fast-json-patch';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-view-company',
  templateUrl: './view-company.component.html',
  styleUrls: ['./view-company.component.css']
})
export class ViewCompanyComponent implements OnInit {

  @HostListener('window:beforeunload', [ '$event' ])
  beforeUnloadHandler(event: any) {
   console.log('window:beforeunload', event)
   return false;
  }

  empresa: Empresa;
  empresaTmp: Empresa;
  Empresa_det_id: number;
  url: string;
  city: string = "Móstoles";
  region: string = "Madrid";
  actualYear: number = new Date().getFullYear();

  user: User;
  admin: boolean;

  sectores: Fields[];
  distritos: Fields[];
  poligonos: Fields[];

  editCompanyForm: FormGroup;
  newEmp: any;
  newRedes: any;

  isEdited: boolean = false;

  constructor(private companiesService: CompaniesService,
    private fieldsService: FieldsService,
    private fb: FormBuilder,
    private router: Router,
    private userService: UsersService,
    private route: ActivatedRoute) {

    this.user = this.userService.getUserLogged();
    let user_rol = Number(this.user.user_rol);
    this.admin = user_rol === 1 || user_rol === 3 ? true : false;

    this.fillEditForm();

    this.route.paramMap.subscribe((params: any) => {
        this.Empresa_det_id = params.get('id');
        this.url = params.get('url');
        console.log(this.url);

        this.companiesService.getCompany(this.Empresa_det_id).subscribe({
          next: (result: any) => {
            if (result != null) {
              this.empresa = result;
              this.empresaTmp = JSON.parse(JSON.stringify(this.empresa));
              this.empresaTmp.Habilitada = 1;
              console.log("Deep copy", this.empresaTmp)
              this.fillEditFormEmp(this.empresa);
            } else {
              alert("Hubo un error")
            }
          },
          error: (error: any) => {
            console.log(error);
            alert(error.message)
          },
          complete: () => console.log("Complete", this.empresa)
        });
      });

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
      complete: () => console.log("Complete", this.distritos)
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
      complete: () => console.log("Complete", this.poligonos)
    });

  }

  public keyPressed(event: any, count: number): boolean {
    console.log(event);
    if((event.charCode < 48 || event.charCode > 57) || event.srcElement.value.length == count) return false;
    return true;
  }

  public fillEditForm(): void {
    this.editCompanyForm = this.fb.group({
      nombre: new FormControl(''),
      cif: new FormControl(''),
      sector: new FormControl(0),
      distrito: new FormControl(0),
      polygon: new FormControl(0),
      email: new FormControl(''),
      phone: new FormControl(''),
      otherPhone: new FormControl(''),
      contactPerson: new FormControl(''),
      installation_year: new FormControl(''),
      workers_number: new FormControl(''),
      address: new FormControl(''),
      localidad: new FormControl(''),
      provincia: new FormControl(''),
      cod_postal: new FormControl(''),
      web: new FormControl(''),
      facebook: new FormControl(''),
      instagram: new FormControl(''),
      twitter: new FormControl(''),
      linkedIn: new FormControl(''),
      tiktok: new FormControl('')
    });
  }

  public fillEditFormEmp(emp: Empresa) {
    let web = this.empresa['Web'];
    let face = this.empresa['Facebook'];
    let inst = this.empresa['Instagram'];
    let twi = this.empresa['Twitter'];
    let link = this.empresa['Linkedin'];
    let tik = this.empresa['Google_plus'];
    let otherPhone = emp['OtherTelefono'];

    this.editCompanyForm = this.fb.group({
      nombre: [emp['Nombre'], Validators.required],
      cif: [emp['CIF'], Validators.required],
      sector: [emp['Sector'], Validators.required],
      distrito: [emp['Distrito'], Validators.required],
      polygon: [emp['Poligono'], Validators.required],
      email: [emp['Email'], [Validators.required, Validators.pattern(Utils.emailReg)]],
      phone: [emp['Telefono'], [Validators.required, Validators.pattern(Utils.phoneReg)]],
      otherPhone: [otherPhone != 'sin datos' ? otherPhone : '', [Validators.pattern(Utils.phoneReg)]],
      contactPerson: [emp['Persona_contacto']],
      installation_year: [emp['installation_year'], Validators.maxLength(4)],
      workers_number: [emp['workers_number']],
      address: [emp['Direccion'], Validators.required],
      localidad: [emp['Localidad']],
      provincia: [emp['Provincia']],
      cod_postal: [emp['Cod_postal'], [Validators.required, Validators.pattern(Utils.codPostalReg), Validators.maxLength(5)]],
      web: [web?.toLowerCase() != 'sin datos' ? web : '', Validators.pattern(Utils.webReg)],
      facebook: [face.toLowerCase() != 'sin datos' ? face : '', Validators.pattern(Utils.FacebookReg)],
      instagram: [inst.toLowerCase() != 'sin datos' ? inst : '', Validators.pattern(Utils.InstagramReg)],
      twitter: [twi.toLowerCase() != 'sin datos' ? twi : '', Validators.pattern(Utils.TwitterReg)],
      linkedIn: [link.toLowerCase() != 'sin datos' ? link : '', Validators.pattern(Utils.linkedInReg)],
      tiktok: [tik.toLowerCase() != 'sin datos' ? tik : '', Validators.pattern(Utils.TikTokReg)]
    }, {  validator: [Utils.getRegexDocument] }  as AbstractControlOptions);
    this.setFormControlsReadOnly(this.editCompanyForm);
  }

  ngOnInit(): void {
  }

  public addCompany(): void {
    let local = this.editCompanyForm.get("localidad")?.value;
    let prov = this.editCompanyForm.get("provincia")?.value;
    let otherPhone = this.editCompanyForm.get("otherPhone")?.value;

    this.empresa = new Empresa(
      this.editCompanyForm.get("nombre")?.value,
      this.editCompanyForm.get("sector")?.value,
      this.Empresa_det_id,
      this.editCompanyForm.get("distrito")?.value,
      this.editCompanyForm.get("polygon")?.value
    );

    delete this.empresa['fecha_alta'];
    delete this.empresa['Link'];

    this.empresa.setPersonaContacto(this.editCompanyForm.get('contactPerson')?.value);
    this.empresa.setInstallation_year(this.editCompanyForm.get("installation_year")?.value);
    this.empresa.setWorkers_number(this.editCompanyForm.get("workers_number")?.value);
    this.empresa.setCIF(this.editCompanyForm.get('cif')?.value);
    this.empresa.setEmail(this.editCompanyForm.get("email")?.value);
    this.empresa.setTelefono(this.editCompanyForm.get("phone")?.value);
    this.empresa.setOtherTelefono(otherPhone != '' ? otherPhone : 'sin datos');
    this.empresa.setDireccion(this.editCompanyForm.get("address")?.value);
    this.empresa.setLocalidad(local == "" ? this.city : local);
    this.empresa.setProvincia(prov == "" ? this.region : prov);
    this.empresa.setCod_postal(this.editCompanyForm.get("cod_postal")?.value);
    this.empresa.setWeb(this.editCompanyForm.get('web')!.value);
    this.empresa.setTwitter(this.editCompanyForm.get('twitter')!.value);
    this.empresa.setFacebook(this.editCompanyForm.get('facebook')!.value);
    this.empresa.setInstagram(this.editCompanyForm.get('instagram')!.value);
    this.empresa.setLinkedin(this.editCompanyForm.get('linkedIn')!.value);
    this.empresa.setGoogle_plus(this.editCompanyForm.get('tiktok')!.value);

    this.saveEmpresa(this.empresa);
  }

  public saveEmpresa(empresa: Empresa): void {
    const shallowComparison = this.compareResults();
    if (shallowComparison) {
      Swal.fire({
        title: 'Actualizar empresa',
        text: `La empresa ${ this.empresaTmp['Nombre'] } no ha sido modificada`,
        icon: 'info',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    this.companiesService.updateCompany(empresa).subscribe({
      next: (data: number) => {
        if (data === 1) {
          Swal.fire({
            title: 'Actualizar empresa',
            text: `La empresa ${ empresa.getNombre() } se actualizó exitosamente`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.router.navigate(['dashboard/list-companies']);
        } else {
          throw new Error(`Se produjo un error al actualizar la empresa ${ this.empresaTmp['Nombre'] } `);
        }
      }, error: (error: any) => {
        console.log(`Se produjo un error al actualizar la empresa: ${ error } `);
        Swal.fire({
          title: 'Actualizar empresa',
          text: `Se produjo un error al actualizar la empresa ${ this.empresaTmp['Nombre']  } `,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      },
      complete: () => console.log('Se completo la actualización de la empresa')
    });
  }

  public compareResults(): boolean {
    const patch: Array<Operation> = compare(this.empresa, this.empresaTmp);
    console.log(patch);
    return patch.length === 0;
  }

  public isDisabled(): boolean {
    return this.editCompanyForm.get('sector')?.value == 0 || this.editCompanyForm.get('distrito')?.value == 0 || this.editCompanyForm.get('poligono')?.value == 0
  }

  public cleanForm(): void {
    localStorage.removeItem("empresa");
    this.fillEditFormEmp(this.empresa);
    this.isEdited = false;
  }

  public edit(): void {
    if (this.empresa['Habilitada'] == 0) {
      Swal.fire({
        title: 'Empresa deshabilitada',
        text: 'No se pueden editar los datos de una empresa deshabilitada, vaya a \"Historial empresas->Historial\" y habilite la empresa',
        icon: 'info',
        confirmButtonText: 'Aceptar'
      });
    } else {
      this.isEdited = true;
      this.setFormControlsReadOnly(this.editCompanyForm, false);
    }
  }

  public setFormControlsReadOnly(form: FormGroup, enabled: boolean = true): void {
    Utils.setFormControlsReadOnly(form, enabled);
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
}

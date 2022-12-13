import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Empresa } from 'src/app/class/empresa';
import { Fields } from 'src/app/interfaces/fields';
import { Result } from 'src/app/interfaces/result';
import { CompaniesService } from 'src/app/services/companies.service';
import { FieldsService } from 'src/app/services/fields.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-view-company',
  templateUrl: './view-company.component.html',
  styleUrls: ['./view-company.component.css']
})
export class ViewCompanyComponent implements OnInit {

  empresa: Empresa;
  empresaTmp: Empresa;
  Empresa_det_id: number;
  url: string;
  city: string = "Móstoles";
  region: string = "Madrid";

  sectores: Fields[];
  distritos: Fields[];
  poligonos: Fields[];
  codPostalReg: RegExp = new RegExp(/289+\d{2}/);
  phoneReg: RegExp = new RegExp(/[0-9]{9}/);
  emailReg: RegExp = new RegExp(/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9](\-){0,1})+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/);

  editCompanyForm: FormGroup;
  newEmp: any;
  newRedes: any;

  isEdited: boolean = false;

  constructor(private companiesService: CompaniesService,
    private fieldsService: FieldsService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {
    this.fillEditForm();

    this.route.paramMap
      .subscribe((params: any) => {
        this.Empresa_det_id = params.get('id');
        this.url = params.get('url');
        console.log(this.url);
        this.companiesService.getCompany(this.Empresa_det_id).subscribe({
          next: (result: any) => {
            if (result != null) {
              this.empresa = result;
              this.empresaTmp = JSON.parse(JSON.stringify(this.empresa));
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

  public fillEditForm(): void {
    this.editCompanyForm = this.fb.group({
      nombre: ['', Validators.required],
      sector: [0, Validators.required],
      distrito: [0, Validators.required],
      poligono: [0, Validators.required],
      email: ['', [Validators.required, Validators.pattern(this.emailReg)]],
      telefono: ['', [Validators.required, Validators.pattern(this.phoneReg)]],
      otherTelefono: ['', [Validators.pattern(this.phoneReg)]],
      contactperson: [''],
      direccion: ['', Validators.required],
      localidad: [''],
      provincia: [''],
      cod_postal: ['', [Validators.required, Validators.pattern(this.codPostalReg)]],
      web: ['', Validators.pattern(/((http|https)\:\/\/||www)[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/g)],
      facebook: ['', Validators.pattern(/((http|https):\/\/|)(www\.|)facebook\.com\/[a-zA-Z0-9.]{1,}/)],
      instagram: ['', Validators.pattern(/(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9_.]{1,30}\/?/)],
      twitter: ['', Validators.pattern(/(\@[a-zA-Z0-9_%]*)/)],
      linkedin: ['', Validators.pattern(/[(https:\/\/www\.linkedin.com)]{20}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)+/)],
      tiktok: ['', Validators.pattern(/(\@[a-zA-Z0-9_%]*)/)]
    });
  }

  public fillEditFormEmp(emp: Empresa) {
    let web = this.empresa['Web'];
    let face = this.empresa['Facebook'];
    let inst = this.empresa['Instagram'];
    let twi = this.empresa['Twitter'];
    let link = this.empresa['Linkedin'];
    let tik = this.empresa['Google_plus'];
    let otherTlefono = emp['OtherTelefono'];

    this.editCompanyForm = this.fb.group({
      nombre: [emp['Nombre'], Validators.required],
      sector: [emp['Sector'], Validators.required],
      distrito: [emp['Distrito'], Validators.required],
      poligono: [emp['Poligono'], Validators.required],
      email: [emp['Email'], [Validators.required, Validators.pattern(this.emailReg)]],
      telefono: [emp['Telefono'], [Validators.required, Validators.pattern(this.phoneReg)]],
      otherTelefono: [otherTlefono != 'sin datos' ? otherTlefono : '', [Validators.pattern(this.phoneReg)]],
      contactperson: [emp['Persona_contacto']],
      direccion: [emp['Direccion'], Validators.required],
      localidad: [emp['Localidad']],
      provincia: [emp['Provincia']],
      cod_postal: [emp['Cod_postal'], [Validators.required, Validators.pattern(this.codPostalReg)]],
      web: [web?.toLowerCase() != 'sin datos' ? web : '', Validators.pattern(/^((http:\/\/)|(https:\/\/))?([a-zA-Z0-9]+[.])+[a-zA-Z]{2,4}(:\d+)?(\/[~_.\-a-zA-Z0-9=&%@:]+)*\??[~_.\-a-zA-Z0-9=&%@:]*$/)],
      facebook: [face.toLowerCase() != 'sin datos' ? face : '', Validators.pattern(/((http|https):\/\/|)(www\.|)facebook\.com\/[a-zA-Z0-9.]{1,}/)],
      instagram: [inst.toLowerCase() != 'sin datos' ? inst : '', Validators.pattern(/(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9_.]{1,30}\/?/)],
      twitter: [twi.toLowerCase() != 'sin datos' ? twi : '', Validators.pattern(/(\@[a-zA-Z0-9_%]*)/)],
      linkedin: [link.toLowerCase() != 'sin datos' ? link : '', Validators.pattern(/[(https:\/\/www\.linkedin.com)]{20}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)+/)],
      tiktok: [tik.toLowerCase() != 'sin datos' ? tik : '', Validators.pattern(/(\@[a-zA-Z0-9_%]*)/)]
    });
    this.setFormControlsReadOnly(this.editCompanyForm);
  }

  ngOnInit(): void {
  }


  public addCompany(): void {
    let local = this.editCompanyForm.get("localidad")?.value;
    let prov = this.editCompanyForm.get("provincia")?.value;
    this.empresa = new Empresa(
      this.editCompanyForm.get("nombre")?.value,
      this.editCompanyForm.get("sector")?.value,
      this.Empresa_det_id,
      this.editCompanyForm.get("distrito")?.value,
      this.editCompanyForm.get("poligono")?.value
    );

    delete this.empresa['fecha_alta'];
    delete this.empresa['Link'];

    this.empresa.setPersonaContacto(this.editCompanyForm.get('contactperson')?.value);
    this.empresa.setEmail(this.editCompanyForm.get("email")?.value);
    this.empresa.setTelefono(this.editCompanyForm.get("telefono")?.value);
    let otherTelefono = this.editCompanyForm.get("otherTelefono")?.value;
    this.empresa.setOtherTelefono(otherTelefono != '' ? otherTelefono : 'sin datos');
    this.empresa.setDireccion(this.editCompanyForm.get("direccion")?.value);
    this.empresa.setLocalidad(local == "" ? this.city : local);
    this.empresa.setProvincia(prov == "" ? this.region : prov);
    this.empresa.setCod_postal(this.editCompanyForm.get("cod_postal")?.value);
    this.empresa.setWeb(this.editCompanyForm.get('web')!.value);
    let twi = this.editCompanyForm.get('twitter')!.value;
    this.empresa.setTwitter(twi != '' ? 'https://twitter.com/' + this.editCompanyForm.get('twitter')!.value : twi);
    this.empresa.setFacebook(this.editCompanyForm.get('facebook')!.value);
    this.empresa.setInstagram(this.editCompanyForm.get('instagram')!.value);
    this.empresa.setLinkedin(this.editCompanyForm.get('linkedin')!.value);
    let tik = this.editCompanyForm.get('tiktok')!.value;
    this.empresa.setGoogle_plus(tik != '' ? 'https://www.tiktok.com/' + this.editCompanyForm.get('tiktok')!.value : tik);
    console.log("Después de del: ", this.empresa);
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
    return this.empresa['Nombre'] == this.empresaTmp['Nombre'] &&
    this.empresa['Sector'] == this.empresaTmp['Sector'] &&
    this.empresa['Distrito'] == this.empresaTmp['Distrito'] &&
    this.empresa['Poligono'] == this.empresaTmp['Poligono'] &&
    this.empresa['Telefono'] == this.empresaTmp['Telefono'] &&
    this.empresa['OtherTelefono'] == this.empresaTmp['OtherTelefono'] &&
    this.empresa['Email'] == this.empresaTmp['Email'] &&
    this.empresa['Persona_contacto'] == this.empresaTmp['Persona_contacto'] &&
    this.empresa['Direccion'] == this.empresaTmp['Direccion'] &&
    this.empresa['Localidad'] == this.empresaTmp['Localidad'] &&
    this.empresa['Provincia'] == this.empresaTmp['Provincia'] &&
    this.empresa['Cod_postal'] == this.empresaTmp['Cod_postal'] &&
    this.empresa['Web'] == this.empresaTmp['Web'] &&
    this.empresa['Facebook'] == this.empresaTmp['Facebook'] &&
    this.empresa['Instagram'] == this.empresaTmp['Instagram'] &&
    this.empresa['Twitter'] == this.empresaTmp['Twitter'] &&
    this.empresa['Linkedin'] == this.empresaTmp['Linkedin'] &&
    this.empresa['Google_plus'] == this.empresaTmp['Google_plus'];
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
        text: 'No se pueden editar los datos de una empresa deshabilitada, vaya a \"Historial empresas->Historial\" y habilitela',
        icon: 'info',
        confirmButtonText: 'Aceptar'
      });
    } else {
      this.isEdited = true;
      this.setFormControlsReadOnly(this.editCompanyForm, false);
    }
  }

  public setFormControlsReadOnly(form: FormGroup, enabled: boolean = true): void {
    Object.keys(form.controls).forEach(key => {
      const control: AbstractControl = form!.get(key)!;
      if (control && enabled) {
        control.disable({
          emitEvent: enabled,
          onlySelf: enabled
        });
      } else {
        control.enable({
          emitEvent: enabled,
          onlySelf: enabled
        });
      }
    });
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

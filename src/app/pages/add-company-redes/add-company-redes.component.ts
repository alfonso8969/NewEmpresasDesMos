import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Empresa } from 'src/app/class/empresa';
import { Redes } from 'src/app/class/redes';

@Component({
  selector: 'app-add-company-redes',
  templateUrl: './add-company-redes.component.html',
  styleUrls: ['./add-company-redes.component.css']
})
export class AddCompanyRedesComponent implements OnInit {

  empresa: Empresa;
  redes: Redes;
  newEmp: any;

  addRedesForm: FormGroup;
  constructor(private fb: FormBuilder, private router: Router) {
    let emp = localStorage.getItem('empresa');
    if (emp && emp != "undefined") {
      this.newEmp = JSON.parse(emp!);
      this.empresa = new Empresa(
        this.newEmp['Nombre'],
        this.newEmp['Sector'],
        this.newEmp['Empresa_det_id'],
        this.newEmp['Distrito'],
        this.newEmp['Poligono'],
      );

      this.empresa.setPersonaContacto(this.newEmp['Persona_contacto']);
      this.empresa.setEmail(this.newEmp['Email']);
      this.empresa.setTelefono(this.newEmp['Telefono']);
      this.empresa.setOtherTelefono(this.newEmp['OtherTelefono']);
      this.empresa.setDireccion(this.newEmp['Direccion']);
      this.empresa.setLocalidad(this.newEmp['Localidad']);
      this.empresa.setProvincia(this.newEmp['Provincia']);
      this.empresa.setCod_postal(this.newEmp['Cod_postal']);
      this.empresa.setFecha_alta(this.newEmp['fecha_alta']);
      this.empresa.setWeb(this.newEmp['Web']);
      this.empresa.setFacebook(this.newEmp['Facebook']);
      this.empresa.setInstagram(this.newEmp['Instagram']);
      this.empresa.setTwitter(this.newEmp['Twitter']);
      this.empresa.setLinkedin(this.newEmp['Linkedin']);
      this.empresa.setGoogle_plus(this.newEmp['Google_plus']);
    }

    this.fillForm();
  }

  public fillForm(): void {

    let web = this.empresa.getWeb();
    let face = this.empresa.getFacebook();
    let inst = this.empresa.getInstagram();
    let twi = this.empresa.getTwitter();
    let link = this.empresa.getLinkedin();
    let tik = this.empresa.getGoogle_plus();

    this.addRedesForm = this.fb.group({
      web: [web.toLowerCase() != 'sin datos' ? web : '', Validators.pattern(/^((http:\/\/)|(https:\/\/))?([a-zA-Z0-9]+[.])+[a-zA-Z]{2,4}(:\d+)?(\/[~_.\-a-zA-Z0-9=&%@:]+)*\??[~_.\-a-zA-Z0-9=&%@:]*$/g)],
      facebook: [face.toLowerCase() != 'sin datos' ? face : '', Validators.pattern(/((http|https):\/\/|)(www\.|)facebook\.com\/[a-zA-Z0-9.]{1,}/g)],
      instagram: [inst.toLowerCase() != 'sin datos' ? inst : '', Validators.pattern(/(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9_.]{1,30}\/?/g)],
      twitter: [twi.toLowerCase() != 'sin datos' ? twi : '', Validators.pattern(/(\@[a-zA-Z0-9_%]*)/g)],
      linkedin: [link.toLowerCase() != 'sin datos' ? link : '', Validators.pattern(/[(https:\/\/www\.linkedin.com)]{20}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)+/g)],
      tiktok: [tik.toLowerCase() != 'sin datos' ? tik : '', Validators.pattern(/(\@[a-zA-Z0-9_%]*)/g)]
    })
  }

  ngOnInit(): void {
  }

  public addRedes(back: boolean): void {
    let empty = true;
    Object.keys(this.addRedesForm.controls).forEach(key => {
      if (this.addRedesForm.get(key)!.value != "")  {
        empty = false;
        return;
      }
    });
    if(empty && !back) {
      alert("No hizo ningún cambio, seleccione volver, si no desea añadir datos");
    } else {
      this.empresa.setWeb(this.addRedesForm.get('web')!.value);
      let twi = this.addRedesForm.get('twitter')!.value;
      this.empresa.setTwitter(twi != '' ? 'https://twitter.com/' + this.addRedesForm.get('twitter')!.value : twi);
      this.empresa.setFacebook(this.addRedesForm.get('facebook')!.value);
      this.empresa.setInstagram(this.addRedesForm.get('instagram')!.value);
      this.empresa.setLinkedin(this.addRedesForm.get('linkedin')!.value);
      let tik = this.addRedesForm.get('tiktok')!.value;
      this.empresa.setGoogle_plus(tik != '' ? 'https://www.tiktok.com/' + this.addRedesForm.get('tiktok')!.value: tik);
      this.redes = new Redes(
        this.empresa.getWeb(),
        this.empresa.getFacebook(),
        this.empresa.getTwitter(),
        this.empresa.getInstagram(),
        this.empresa.getGoogle_plus(),
        this.empresa.getLinkedin()
      )
      localStorage.setItem("redes", JSON.stringify(this.redes));
      console.log(this.redes);
    }


    console.log(this.empresa);
  }


  public backToAddCompany(): void {
    if (this.addRedesForm.valid) {
      this.addRedes(true);
    }
    this.router.navigateByUrl('dashboard/add-company');
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
}

import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Empresa } from 'src/app/class/empresa';
import { Redes } from 'src/app/class/redes';
import { Result } from 'src/app/interfaces/result';
import { Utils } from 'src/app/utils/utils';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-add-company-redes',
  templateUrl: './add-company-redes.component.html',
  styleUrls: ['./add-company-redes.component.css']
})
export class AddCompanyRedesComponent implements OnInit {

  @HostListener('window:unload', [ '$event' ])
    unloadHandler(event: any) {
      console.log('window:unload', event);
      alert('¿Está seguro de querer cerrar la sesión?');
    }

  @HostListener('window:beforeunload', [ '$event' ])
    beforeUnloadHandler(event: any) {
        console.log('window:beforeunload', event)
        return false;
      }

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
        this.newEmp['Empresa_det_id']
      );

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
      web: [web.toLowerCase() != 'sin datos' ? web : '', Validators.pattern(Utils.webReg)],
      facebook: [face.toLowerCase() != 'sin datos' ? face : '', Validators.pattern(Utils.FacebookReg)],
      instagram: [inst.toLowerCase() != 'sin datos' ? inst : '', Validators.pattern(Utils.InstagramReg)],
      twitter: [twi.toLowerCase() != 'sin datos' ? twi : '', Validators.pattern(Utils.TwitterReg)],
      linkedIn: [link.toLowerCase() != 'sin datos' ? link : '', Validators.pattern(Utils.linkedInReg)],
      tiktok: [tik.toLowerCase() != 'sin datos' ? tik : '', Validators.pattern(Utils.TikTokReg)]
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
      Swal.fire({
        title: 'Sin cambios',
        text: 'No hizo ningún cambio, seleccione volver, si no desea añadir datos',
        icon: 'info',
        confirmButtonText: 'Aceptar'
      });
    } else if(!empty)  {
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
      console.log("addRedes redes", this.redes);
      console.log("addRedes empresa", this.empresa);
      Swal.fire({
        title: 'Cambios guardados',
        text: 'Se guardaron los cambios realizados',
        icon: 'info',
        confirmButtonText: 'Aceptar'
      });
      this.router.navigateByUrl('dashboard/add-company');
    } else {
      this.router.navigateByUrl('dashboard/add-company');
    }
  }

  public backToAddCompany(): void {
    if (this.addRedesForm.valid) {
      this.addRedes(true);
    } else {
      Swal.fire({
        title: 'Cambios',
        text: 'Hay errores en el formulario',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  }

  public getFormValidationErrors(form: FormGroup): Result[] {

    const result: Result[] = [];
    Object.keys(form.controls).forEach(key => {
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
    localStorage.removeItem("redes");
    this.fillForm();
  }
}

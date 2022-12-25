import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Fields } from 'src/app/interfaces/fields';
import { FieldsService } from 'src/app/services/fields.service';
import { Utils } from 'src/app/utils/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-fields',
  templateUrl: './admin-fields.component.html',
  styleUrls: ['./admin-fields.component.css']
})
export class AdminFieldsComponent implements OnInit {

  updateFieldSectorForm: FormGroup;
  updateFieldDistritoForm: FormGroup;
  updateFieldPoligonoForm: FormGroup;

  sectores: Fields[];
  distritos: Fields[];
  poligonos: Fields[];

  field: Fields;

  sectorId: number;
  distritoId: number;
  poligonoId: number;
  sector: string;
  distrito: string;
  poligono: string;

  constructor(private fb: FormBuilder, private fieldsService: FieldsService) {

    this.field = {
      field_name: '',
      sector_id: 0,
      empresas_sector_name: '',
      distrito_id: 0,
      distrito_name: '',
      poligono_id: 0,
      empresas_poligono_name: ''
    }
    this.distritos = [];

    this.updateFieldSectorForm = this.fb.group({
      sector: [0],
      nombreSector: ['', [Validators.required, Validators.pattern(Utils.regex)]]
    });

    this.updateFieldDistritoForm = this.fb.group({
      distrito: [0],
      nombreDistrito: ['', [Validators.required, Validators.pattern(Utils.regex2)]]
    });

    this.updateFieldPoligonoForm = this.fb.group({
      poligono: [0],
      nombrePoligono: ['', [Validators.required, Validators.pattern(Utils.regex3)]]
    });

    this.fillComboboxes();
  }

  public fillComboboxes() {
    this.sectores = [];
    this.distritos = [];
    this.poligonos = [];
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
          result.data.forEach((field: Fields) => {
            if (field.distrito_name != 'Sin datos')
              this.distritos.push(field);
          });
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
          result.data.forEach((field: Fields) => {
            if (field.empresas_poligono_name != 'Sin polígono')
              this.poligonos.push(field);
          });
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

  ngOnInit(): void {
  }

  changeSector(event: any) {
    this.sectorId = this.updateFieldSectorForm.get('sector')?.value;
    this.sector = event.target.selectedOptions[0].text;
    console.log("this.sectorId", this.sectorId);
    console.log("this.sector", this.sector);
    this.updateFieldSectorForm.get('nombreSector')?.setValue(this.sector);
  }

  public askUpdateFieldSector(): void {
    this.showAlertMessage('sector');
  }

  changeDistrito(event: any) {
    this.distritoId = this.updateFieldDistritoForm.get('distrito')?.value;
    this.distrito = event.target.selectedOptions[0].text;
    console.log("this.distritoId", this.distritoId);
    console.log("this.distrito", this.distrito);
    this.updateFieldDistritoForm.get('nombreDistrito')?.setValue(this.distrito.split(' ')[1]);
  }

  public askUpdateFieldDistrito(): void {
    this.showAlertMessage('distrito');
  }

  changePoligono(event: any) {
    this.poligonoId = this.updateFieldPoligonoForm.get('poligono')?.value;
    this.poligono = event.target.selectedOptions[0].text;
    console.log("this.poligonoId", this.poligonoId);
    console.log("this.poligono", this.poligono);
    this.updateFieldPoligonoForm.get('nombrePoligono')?.setValue(this.poligono);
  }

  public askUpdateFieldPoligono(): void {
    this.showAlertMessage('poligono');
  }

  public updateField(field: Fields): void {
   
    this.fieldsService.updateField(field).subscribe({
      next: (result: any) => {
        if (result == 1) {
          Swal.fire({
            title: 'Actualizar campo: ' + field.field_name,
            text: `El ${field.field_name} se actualizó correctamente`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.fillComboboxes();
        } else {
          Swal.fire({
            title: 'Actualizar campo: ' + field.field_name,
            text: `Hubo algún error al actualizar el ${field.field_name}`,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      },
      error: (error: any) => {
        console.log(error);
        if (error.error.text.includes("Duplicate")) {
          Swal.fire({
            title: 'Añadir campo: ' + this.field.field_name,
            text: `El ${ this.field.field_name } ya exite`,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        } else {
          Swal.fire({
            title: 'Actualizar campo: ' + field.field_name,
            text: `Hubo algún error al actualizar el ${field.field_name}`,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
        this.clearForms();
      },
      complete: () => {
       console.log("Complete se ctualizó el campo correctamente");
       this.clearForms(); 
      }
        
    });
    
  }

  private showAlertMessage(field: string) {
    let message =  `<p>Está seguro de querer actualizar el ${ field } ?</p>`;
    this.field.field_name = field;
    switch (field) {
      case 'sector':
        message += '<p>Recuerde que si actualiza el Sector, actualizará todas las empresas que estaban en el sector antiguo</p>';
        this.field.empresas_sector_name = this.updateFieldSectorForm.get('nombreSector')?.value;
        this.field.sector_id = this.sectorId;
        break;
      case 'distrito':
        message += '<p>Recuerde que si actualiza el Distrito, actualizará todas las empresas que estaban en el distrito antiguo</p>';
        this.field.distrito_name = this.distrito.split(' ')[0] + ' ' + this.updateFieldDistritoForm.get('nombreDistrito')?.value + ' ' + this.distrito.split(' ')[2] + ' ' + this.distrito.split(' ')[3];
        this.field.distrito_id = this.distritoId;
        break;
      case 'poligono':
        message += '<p>Recuerde que si actualiza el Polígono, actualizará todas las empresas que estaban en el polígono antiguo</p>';
        this.field.empresas_poligono_name = this.updateFieldPoligonoForm.get('nombrePoligono')?.value;
        this.field.poligono_id = this.poligonoId;
        break;

      default:
        Swal.fire({
          title: 'Actualizar campo: ' + field,
          text: `Hubo algún error al actualizar el ${field}`,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        break;
    }

    Swal.fire({
      title: 'Actualizar campo: ' + field,
      html: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, actualizar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateField(this.field);
      } else {
        this.clearForms();
      }
    })
  }

  public clearForms() {
    this.updateFieldPoligonoForm.get('nombrePoligono')?.setValue('');
    this.updateFieldDistritoForm.get('nombreDistrito')?.setValue('');
    this.updateFieldSectorForm.get('nombreSector')?.setValue('');
    this.updateFieldSectorForm.get('sector')?.setValue(0);
    this.updateFieldPoligonoForm.get('poligono')?.setValue(0);
    this.updateFieldDistritoForm.get('distrito')?.setValue(0);
    this.updateFieldSectorForm.markAsUntouched();
    this.updateFieldPoligonoForm.markAsUntouched();
    this.updateFieldDistritoForm.markAsUntouched();
    
  }

}

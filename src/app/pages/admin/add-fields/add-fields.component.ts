import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Fields } from 'src/app/interfaces/fields';
import { FieldsService } from 'src/app/services/fields.service';
import { Utils } from 'src/app/utils/utils';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-add-fields',
  templateUrl: './add-fields.component.html',
  styleUrls: ['./add-fields.component.css']
})
export class AddFieldsComponent implements OnInit {

  addFieldSectorForm: FormGroup;
  addFieldDistritoForm: FormGroup;
  addFieldPoligonoForm: FormGroup;

  field: Fields;
  lastDistrito: number;

  constructor(private fb: FormBuilder,
              private fieldsService: FieldsService) {

    this.field = {
      field_name: '',
      empresas_sector_name: '',
      distrito_name: '',
      empresas_poligono_name: ''
    }

    this.fieldsService.getLastDistrito().subscribe({
      next: (result: number) => {
        if (result != null) {
          this.lastDistrito = result;
        } else {
          alert("Hubo un error")
        }
      },
      error: (error: any) => {
        console.log(error);
        alert(error.message)
      },
      complete: () => console.log("Complete getLastDistrito", this.lastDistrito)
    });

    this.addFieldSectorForm = this.fb.group({
      nombreSector: ['', [Validators.required, Validators.pattern(Utils.regex)]]
    });

    this.addFieldDistritoForm = this.fb.group({
      nombreDistrito: ['', [Validators.required, Validators.pattern(Utils.regex2)]]
    });

    this.addFieldPoligonoForm = this.fb.group({
      nombrePoligono: ['', [Validators.required, Validators.pattern(Utils.regex3)]]
    });
   }

  ngOnInit(): void {

  }

  public addFieldSector(): void {
    this.field.field_name = 'sector';
    this.field.empresas_sector_name = this.addFieldSectorForm.get('nombreSector')?.value;
    this.fieldsService.addField(this.field).subscribe({
      next: (result: number) => {
        if (result === 1) {
          Swal.fire({
            title: 'Añadir campo: ' + this.field.field_name,
            text: `El campo ${ this.field.empresas_sector_name } se añadio exitosamente`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        } else {
          throw new Error(`Se produjo un error al añadir el campo ${ this.field.empresas_sector_name } `);
        }

      },
      error: (error: any) => {
        console.log("Sector error: ", error);
        this.cleanFormSector();
        if (error.error.text.includes("Duplicate")) {
          Swal.fire({
            title: 'Añadir campo: ' + this.field.field_name,
            text: `El sector ${ this.field.empresas_sector_name } ya exite`,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        } else {
          Swal.fire({
            title: 'Añadir campo: ' + this.field.field_name,
            text: `Se produjo un error al añadir el campo ${ this.field.empresas_sector_name } `,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });

        }
      },
      complete: () =>  {
        console.log(`El campo ${ this.field.empresas_sector_name} se insertó correctamente`);
        this.cleanFormSector();
      }
    });
  }

  public addFieldDistrito(): void {
    this.field.field_name = 'distrito';
    this.field.distrito_name =`Distrito ${ this.addFieldDistritoForm.get('nombreDistrito')?.value } (Nº ${ this.lastDistrito + 1 })`;
    if (this.addFieldDistritoForm.get('nombreDistrito')?.value.toLowerCase().includes('distrito') || this.addFieldDistritoForm.get('nombreDistrito')?.value.split(' ').length > 1) {
      Swal.fire({
        title: 'Añadir campo: ' + this.field.field_name,
        text: `Se produjo un error al añadir el campo ${ this.field.distrito_name } `,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      this.cleanFormDistrito();
      return;
    }
    this.fieldsService.addField(this.field).subscribe({
      next: (result: number) => {
        if (result === 1) {
          Swal.fire({
            title: 'Añadir campo: ' + this.field.field_name,
            text: `El campo ${ this.field.distrito_name } se añadio exitosamente`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        } else {
          throw new Error(`Se produjo un error al añadir el campo ${ this.field.distrito_name } `);
        }

      },
      error: (error: any) => {
        console.log("Distrito error: ", error);
        this.cleanFormDistrito();
        if (error.error.text.includes("Duplicate")) {
          Swal.fire({
            title: 'Añadir campo: ' + this.field.field_name,
            text: `El distrito ${ this.field.distrito_name.split("(")[0] } ya exite`,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        } else {
          Swal.fire({
            title: 'Añadir campo: ' + this.field.field_name,
            text: `Se produjo un error al añadir el campo ${ this.field.distrito_name } `,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      },
      complete: () =>  {
        console.log(`El campo ${ this.field.distrito_name} se insertó correctamente`);
        this.cleanFormDistrito();
      }
    });
  }

  public addFieldPoligono(): void {
    this.field.field_name = 'poligono';
    this.field.empresas_poligono_name = this.addFieldPoligonoForm.get('nombrePoligono')?.value;
    this.fieldsService.addField(this.field).subscribe({
      next: (result: number) => {
        if (result === 1) {
          Swal.fire({
            title: 'Añadir campo: ' + this.field.field_name,
            text: `El campo ${ this.field.empresas_poligono_name } se añadio exitosamente`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        } else {
          throw new Error(`Se produjo un error al añadir el campo ${ this.field.empresas_poligono_name } `);
        }

      },
      error: (error: any) => {
        console.log("Poligono error: ", error);
        this.cleanFormPoligono();
        if (error.error.text.includes("Duplicate")) {
          Swal.fire({
            title: 'Añadir campo: ' + this.field.field_name,
            text: `El polígono ${ this.field.empresas_poligono_name } ya exite`,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        } else {
          Swal.fire({
            title: 'Añadir campo: ' + this.field.field_name,
            text: `Se produjo un error al añadir el campo ${ this.field.empresas_poligono_name } `,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      },
      complete: () =>  {
        console.log(`El campo ${ this.field.empresas_poligono_name} se insertó correctamente`);
        this.cleanFormPoligono();
       }
    });
  }

  public cleanFormSector(): void {
    this.addFieldSectorForm.get('sector')?.setValue('');
    this.addFieldSectorForm.markAsUntouched();
  }

  public cleanFormDistrito(): void {
    this.addFieldDistritoForm.get('distrito')?.setValue('');
    this.addFieldDistritoForm.markAsUntouched();
  }

  public cleanFormPoligono(): void {
    this.addFieldPoligonoForm.get('poligono')?.setValue('');
    this.addFieldPoligonoForm.markAsUntouched();
  }

}

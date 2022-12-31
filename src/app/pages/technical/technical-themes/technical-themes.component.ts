import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/class/users';
import { Fields } from 'src/app/interfaces/fields';
import { Tema } from 'src/app/interfaces/tema';
import { FieldsService } from 'src/app/services/fields.service';
import { SupportService } from 'src/app/services/support.service';
import { UsersService } from 'src/app/services/users.service';
import { Utils } from 'src/app/utils/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-technical-themes',
  templateUrl: './technical-themes.component.html',
  styleUrls: ['./technical-themes.component.css']
})
export class TechnicalThemesComponent implements OnInit {

  user: User;
  addFieldThemeForm: FormGroup;
  updateFieldThemeForm: FormGroup;
  themes: Tema[];
  theme: Tema;
  field: Fields;
  temaId: number;

  constructor(private supportService: SupportService,
    private fb: FormBuilder,
    private fieldsService: FieldsService,
    private userService: UsersService) {

    this.user = this.userService.getUserLogged();

    this.field = {
      field_name: '',
      tema_id: 0,
      tema_name: '',
      tema_rol: ''
    }

    this.getTemas();
    this.fillAddFormTheme();
    this.fillUpdateFormTheme();
  }

  public getTemas(): void {
    this.supportService.getTemas().subscribe({
      next: (result: Tema[]) => {
        if (result != null) {
          this.themes = result;
        } else {
          alert("Hubo un error")
        }
      },
      error: (error: any) => {
        console.log(error);
        alert(error.message)
      },
      complete: () => console.log("Complete get temas", this.themes)
    });
  }

  public fillUpdateFormTheme(): void {
    this.updateFieldThemeForm = this.fb.group({
      tema: [0],
      nameTheme: ['', [Validators.required, Validators.pattern(Utils.regexTheme)]],
      AdminRolSelected: [false],
      SuperAdminRolSelected: [false],
      UserRolSelected: [false]
    });
  }

  public fillAddFormTheme(): void {
    this.addFieldThemeForm = this.fb.group({
      nameTheme2: ['', [Validators.required, Validators.pattern(Utils.regexTheme)]],
      AdminRol: [false],
      SuperAdminRol: [false],
      UserRol: [false]
    });
  }

  ngOnInit(): void {
  }

  public onCheckboxChange(event: any): void {
    console.log(event);
    let words: Array<string> = [];
    words = this.field.tema_rol!.split(',');
    switch (event.srcElement.id) {
      case 'AdminRol':
        this.field.tema_rol += this.field.tema_rol != '' ? ',ROL_ADMIN' : 'ROL_ADMIN';
        break;
      case 'SuperAdminRol':
        this.field.tema_rol += this.field.tema_rol != '' ? ',ROL_SUPERADMIN' : 'ROL_SUPERADMIN';
        break;
      case 'UserRol':
        this.field.tema_rol += this.field.tema_rol != '' ? ',ROL_USER' : 'ROL_USER';
        break;
      case 'AdminRolSelected':
        event.target.checked ?
          this.field.tema_rol += this.field.tema_rol != '' ? ',ROL_ADMIN' : 'ROL_ADMIN'
          : this.field.tema_rol = words.filter(w => w != 'ROL_ADMIN').join(',');
        break;
      case 'SuperAdminRolSelected':
        event.target.checked ?
          this.field.tema_rol += this.field.tema_rol != '' ? ',ROL_SUPERADMIN' : 'ROL_SUPERADMIN'
          : this.field.tema_rol = words.filter(w => w != 'ROL_SUPERADMIN').join(',');
        break;
      case 'UserRolSelected':
        event.target.checked ?
          this.field.tema_rol += this.field.tema_rol != '' ? ',ROL_USER' : 'ROL_USER'
          : this.field.tema_rol = words.filter(w => w != 'ROL_USER').join(',');
        break;
      default:
        this.field.tema_rol = '';
        break;
    }
  }

  public addFieldTheme(): void {
    if (this.field.tema_rol == '') {
      this.showMessageNotRoles();
      return;
    }
    this.field.field_name = 'tema';
    this.field.tema_name = this.capitalizeFirstWordOfTheme(this.addFieldThemeForm.get('nameTheme2')?.value);
    this.fieldsService.addField(this.field).subscribe({
      next: (result: number) => {
        if (result === 1) {
          Swal.fire({
            title: 'Añadir tema: ' + this.field.field_name,
            text: `El tema ${this.field.tema_name} se añadió exitosamente`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.getTemas();
        } else {
          throw new Error(`Se produjo un error al añadir el tema ${this.field.tema_name} `);
        }
      },
      error: (error: any) => {
        console.log("Tema error: ", error);
        this.cleanFormsTema();
        if (error.error.text.includes("Duplicate")) {
          Swal.fire({
            title: 'Añadir tema: ' + this.field.field_name,
            text: `El tema ${this.field.tema_name} ya existe`,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        } else {
          Swal.fire({
            title: 'Añadir tema: ' + this.field.field_name,
            text: `Se produjo un error al añadir el tema ${this.field.tema_name} `,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      },
      complete: () => {
        console.log(`El tema ${this.field.tema_name} se insertó correctamente`);
        this.cleanFormsTema();
      }
    });
  }

  public capitalizeFirstWordOfTheme(value: string): string {
    let words: Array<string> = value.split(" ");
    let firstWord: string = words[0];
    let firstWordCapitalize: string = firstWord.charAt(0).toUpperCase() + firstWord.substring(1).toLocaleLowerCase();
    words[0] = firstWordCapitalize;
    value = words.join(' ');
    return value.trim();
  }

  public changeTheme(event: any): void {
    this.field.tema_rol = '';
    this.temaId = this.updateFieldThemeForm.get('tema')?.value;
    if (this.temaId != 0) {
      this.theme = this.themes.find((t: Tema) => t.name === event.target.selectedOptions[0].text)!;
      this.field.tema_id = this.theme.id;
      this.field.tema_name = this.theme.name;
      console.log("this.temaId", this.temaId);
      console.log("this.tema", this.theme);

      if (this.theme.tema_rol?.includes('ROL_ADMIN')) {
        this.field.tema_rol += this.field.tema_rol != '' ? ',ROL_ADMIN' : 'ROL_ADMIN';
        this.updateFieldThemeForm.get('AdminRolSelected')!.setValue(true);
      } else {
        this.updateFieldThemeForm.get('AdminRolSelected')!.setValue(false);
      }

      if (this.theme.tema_rol?.includes('ROL_SUPERADMIN')) {
        this.field.tema_rol += this.field.tema_rol != '' ? ',ROL_SUPERADMIN' : 'ROL_SUPERADMIN';
        this.updateFieldThemeForm.get('SuperAdminRolSelected')!.setValue(true);
      } else {
        this.updateFieldThemeForm.get('SuperAdminRolSelected')!.setValue(false);
      }

      if (this.theme.tema_rol?.includes('ROL_USER')) {
        this.field.tema_rol += this.field.tema_rol != '' ? ',ROL_USER' : 'ROL_USER';
        this.updateFieldThemeForm.get('UserRolSelected')!.setValue(true);
      } else {
        this.updateFieldThemeForm.get('UserRolSelected')!.setValue(false);
      }

      this.updateFieldThemeForm.get('nameTheme')!.setValue(this.theme.name);

    } else {
      this.fillUpdateFormTheme();
    }

  }

  public askUpdateFieldSector() {
    if (this.field.tema_rol == '') {
      this.showMessageNotRoles();
      return;
    }
    this.showAlertMessage('tema');
  }

  showMessageNotRoles() {
    Swal.fire({

      title: 'Añadir tema',
      text: `Debe elegir al menos un rol`,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
  }

  private showAlertMessage(field: string) {
    let message = `<p>Está seguro de querer actualizar el ${field} ?</p>`;
    this.field.field_name = field;
    if (!field) {
      Swal.fire({
        title: 'Actualizar campo: ' + field,
        text: `Hubo algún error al actualizar el ${field}`,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
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
        this.cleanFormsTema();
      }
    })
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
          this.getTemas();
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
            title: 'Añadir tema: ' + this.field.tema_name,
            text: `El tema ${this.field.tema_name} ya existe`,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        } else {
          Swal.fire({
            title: 'Actualizar tema: ' + field.tema_name,
            text: `Hubo algún error al actualizar el tema ${field.tema_name}`,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
        this.cleanFormsTema();
      },
      complete: () => {
        console.log("Complete se actualizó el tema correctamente");
        this.cleanFormsTema();
      }
    });
  }

  public cleanFormsTema(): void {
    this.fillAddFormTheme();
    this.fillUpdateFormTheme();
    this.addFieldThemeForm.markAsUntouched();
    this.updateFieldThemeForm.markAsUntouched();
  }

  public getFormValidationErrors(form: FormGroup): string {
   return Utils.getFormValidationErrors(form);
  }
}

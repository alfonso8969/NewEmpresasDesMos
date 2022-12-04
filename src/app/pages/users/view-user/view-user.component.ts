import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {

  fileUp: File;
  fileName: string;
  img: HTMLElement | null;

  addUserForm: FormGroup;
  phoneReg: RegExp = new RegExp(/[0-9]{9}/);
  emailReg: RegExp = new RegExp(/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/gm);

  constructor(private fb: FormBuilder) {
    this.addUserForm = this.fb.group({
      userimg: [''],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(this.phoneReg)]],
      email: ['', [Validators.required, Validators.pattern(this.emailReg)]],
      rol: [0, Validators.required]

    });
   }

  ngOnInit(): void {
  }

  public addUser(): void {

  }

  public cleanForm():void {

  }

  isDisabled(): boolean {
    return this.addUserForm.get('rol')?.value == 0;
  }

  public uploadFile(elem: any): void {
    this.img = document.getElementById('img-user');
    this.fileUp = elem.target.files[0];

    let reader = new FileReader();
    reader.onload = (e) => {
      this.img?.setAttribute('src', e.target!.result!.toString());
    }

    reader.readAsDataURL(elem.target.files[0]);

    console.log(elem)
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

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-fields',
  templateUrl: './add-fields.component.html',
  styleUrls: ['./add-fields.component.css']
})
export class AddFieldsComponent implements OnInit {

  addFieldSectorForm: FormGroup;
  addFieldDistritoForm: FormGroup;
  addFieldPoligonoForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.addFieldSectorForm = this.fb.group({ 
      nombreSector: ['', Validators.required]
    });
    this.addFieldDistritoForm = this.fb.group({ 
      nombreDistrito: ['', Validators.required]
    });
    this.addFieldPoligonoForm = this.fb.group({ 
      nombrePoligono: ['', Validators.required]
    });
   }

  ngOnInit(): void {
  }

  public addFieldSector(): void {

  }

  public addFieldDistrito(): void {

  }

  public addFieldPoligono(): void {

  }

  public cleanFormSector(): void {

  }

  public cleanFormDistrito(): void {

  }

  public cleanFormPoligono(): void {

  }

}

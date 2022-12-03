import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import * as d3 from 'd3';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit, AfterViewInit {

  editUserForm: FormGroup;
  phoneReg: RegExp = new RegExp(/[0-9]{9}/);
  emailReg: RegExp = new RegExp(/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/gm);

  constructor(private fb: FormBuilder) {

    this.editUserForm = this.fb.group({
      userimg: [''],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(this.phoneReg)]],
      email: ['', [Validators.required, Validators.pattern(this.emailReg)]]
    });
  }

  ngAfterViewInit(): void {
    d3.selectAll(".close").on('mouseover', function(event) { 
      d3.select(this).style("color", "red");
    });
    d3.selectAll(".close").on('mouseout', function(event) { 
      d3.select(this).style("color", "black");
    });
  }


  ngOnInit(): void {
  }

  public editUser(): void {

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

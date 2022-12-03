import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as d3 from 'd3';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit, AfterViewInit {
  editUserRolForm: FormGroup

  constructor(private fb: FormBuilder) { 
    this.editUserRolForm = this.fb.group({
      rol: [0, Validators.required]

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

  public editUserRol(): void {

  }

}

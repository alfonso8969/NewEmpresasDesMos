import { Component, OnInit } from '@angular/core';
import { Empresa } from 'src/app/class/empresa';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css']
})
export class AddCompanyComponent implements OnInit {

  empresa: Empresa;
  city: string = "Móstoles";
  region: string = "Madrid";
  constructor() {}

  ngOnInit(): void {
  }

}

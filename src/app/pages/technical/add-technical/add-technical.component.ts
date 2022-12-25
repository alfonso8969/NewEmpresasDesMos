import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-technical',
  templateUrl: './add-technical.component.html',
  styleUrls: ['./add-technical.component.css']
})
export class AddTechnicalComponent implements OnInit {
  addUserForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }
  
  addTechnicalUser() {
  throw new Error('Method not implemented.');
  }

  uploadFile($event: Event) {
  throw new Error('Method not implemented.');
  }

  isDisabled(): any {
  throw new Error('Method not implemented.');
  }

  cleanForm() {
    throw new Error('Method not implemented.');
  }
}

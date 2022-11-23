import { Component, Input, OnInit } from '@angular/core';
import {  ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-mat-spinner-overlay',
  templateUrl: './mat-spinner-overlay.component.html',
  styleUrls: ['./mat-spinner-overlay.component.css']
})
export class MatSpinnerOverlayComponent implements OnInit {


  constructor() { }

  @Input() value : number = 100;
  @Input() diameter: number = 100;
  @Input() mode : ProgressSpinnerMode = 'indeterminate'
  @Input() strokeWidth : number = 10;
  @Input() overlay: boolean = false;
  @Input() color: string = "primary";


  ngOnInit(): void {
  }

}

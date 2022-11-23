import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgMaterialModule } from '../design/material.module';
import { MatSpinnerOverlayComponent } from './mat-spinner-overlay/mat-spinner-overlay.component';



@NgModule({
  declarations: [
    MatSpinnerOverlayComponent
  ],
  imports: [
    CommonModule,
    NgMaterialModule
  ],
  exports: [MatSpinnerOverlayComponent]

})
export class ComponentsModule { }

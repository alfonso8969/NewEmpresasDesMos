import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgMaterialModule } from '../design/material.module';
import { MatSpinnerOverlayComponent } from './mat-spinner-overlay/mat-spinner-overlay.component';
import { ProgressComponent } from './progress/progress.component';

@NgModule({
  declarations: [
    MatSpinnerOverlayComponent,
    ProgressComponent

  ],
  imports: [
    CommonModule,
    NgMaterialModule
  ],
  exports: [
    MatSpinnerOverlayComponent,
    ProgressComponent
  ]

})
export class ComponentsModule { }

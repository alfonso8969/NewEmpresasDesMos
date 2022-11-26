import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialElevationDirective } from './MaterialElevation.directive';


@NgModule({
  declarations: [MaterialElevationDirective],
  imports: [
    CommonModule
  ],
  exports: [MaterialElevationDirective]
})
export class DirectivesModule { }

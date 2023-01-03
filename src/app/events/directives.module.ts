import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialElevationDirective } from './MaterialElevation.directive';
import { SortableHeaderDirective } from './sortable-header.directive';


@NgModule({
  declarations: [MaterialElevationDirective, SortableHeaderDirective],
  imports: [
    CommonModule
  ],
  exports: [MaterialElevationDirective, SortableHeaderDirective]
})
export class DirectivesModule { }

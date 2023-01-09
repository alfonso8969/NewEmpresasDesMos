import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialElevationDirective } from './MaterialElevation.directive';
import { SortableHeaderDirective } from './sortable-header.directive';
import { SortableHeaderSessionsDirective } from './sortable-header-sessions.directive';


@NgModule({
  declarations: [
    MaterialElevationDirective,
    SortableHeaderDirective,
    SortableHeaderSessionsDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MaterialElevationDirective,
    SortableHeaderDirective,
    SortableHeaderSessionsDirective
  ]
})
export class DirectivesModule { }

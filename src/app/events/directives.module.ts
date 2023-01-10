import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialElevationDirective } from './MaterialElevation.directive';
import { SortableHeaderDirective } from './sortable-header.directive';
import { SortableHeaderSessionsDirective } from './sortable-header-sessions.directive';
import { SortableHeaderLogsDirective } from './sortable-header-logs.directive';


@NgModule({
  declarations: [
    MaterialElevationDirective,
    SortableHeaderDirective,
    SortableHeaderSessionsDirective,
    SortableHeaderLogsDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MaterialElevationDirective,
    SortableHeaderDirective,
    SortableHeaderSessionsDirective,
    SortableHeaderLogsDirective
  ]
})
export class DirectivesModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialElevationDirective } from './MaterialElevation.directive';
import { SortableHeaderDirective } from './sortable-header.directive';
import { SortableHeaderSessionsDirective } from './sortable-header-sessions.directive';
import { SortableHeaderLogsDirective } from './sortable-header-logs.directive';
import { SortableHeadersEmailsDirective } from './sortable-headers.emails.directive';
import { DndDirective } from './dnd.directive';


@NgModule({
  declarations: [
    MaterialElevationDirective,
    SortableHeaderDirective,
    SortableHeaderSessionsDirective,
    SortableHeaderLogsDirective,
    SortableHeadersEmailsDirective,
    DndDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MaterialElevationDirective,
    SortableHeaderDirective,
    SortableHeaderSessionsDirective,
    SortableHeaderLogsDirective,
    SortableHeadersEmailsDirective,
    DndDirective
  ]
})
export class DirectivesModule { }

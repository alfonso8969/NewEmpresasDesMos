import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrimPipe } from '../pipes/trim.pipe';
import { TicketPipe } from '../pipes/ticket.pipe';
import { SessionPipe } from '../pipes/session.pipe';
import { LogPipe } from '../pipes/log.pipe';


@NgModule({
  declarations: [
    TrimPipe,
    TicketPipe,
    SessionPipe,
    LogPipe,
  ],
  exports: [ 
    TrimPipe,
    TicketPipe,
    SessionPipe,
    LogPipe,
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }

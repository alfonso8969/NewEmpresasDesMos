import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrimPipe } from '../pipes/trim.pipe';
import { TicketPipe } from '../pipes/ticket.pipe';
import { SessionPipe } from '../pipes/session.pipe';
import { LogPipe } from '../pipes/log.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';


@NgModule({
  declarations: [
    TrimPipe,
    TicketPipe,
    SessionPipe,
    LogPipe,
    SafeHtmlPipe
  ],
  exports: [ 
    TrimPipe,
    TicketPipe,
    SessionPipe,
    LogPipe,
    SafeHtmlPipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }

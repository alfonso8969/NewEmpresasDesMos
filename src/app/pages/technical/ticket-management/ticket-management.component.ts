import { Component, OnInit } from '@angular/core';
import { Ticket } from 'src/app/interfaces/ticket';
import { TicketByUser } from 'src/app/interfaces/ticketByUser';
import { SupportService } from 'src/app/services/support.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ticket-management',
  templateUrl: './ticket-management.component.html',
  styleUrls: ['./ticket-management.component.css']
})
export class TicketManagementComponent implements OnInit {

  public url: string = environment.apiUrl;

  tickets: Ticket[];
  ticketsTotal: number;
  ticketsTotalResponse: number;
  ticketsTotalPending: number;
  ticketsTotalResolve: number;
  load: boolean = false;

  public page: number = 1;
  public siguiente: string = "Siguiente";
  public anterior: string = "Anterior";

  constructor(private supportService: SupportService) { 

    this.supportService.getTickets().subscribe({
      next: (result: Ticket[]) => {
        this.tickets = result;
        this.ticketsTotal = this.tickets.length;
        this.tickets.forEach(ticket => {
          if(ticket.respondido) {
            this.supportService.getTicketTratadosByCode(ticket.code).subscribe({
              next: (result: TicketByUser) => { 
                if (result.ticket_code != undefined) {
                  ticket.ticketByUser = result;
                  this.ticketsTotalResolve = this.tickets.filter((ticket: Ticket) => ticket.ticketByUser?.solucionado == 1).length;
                } else {
                  ticket.ticketByUser = undefined;
                }
              }, error: (error: any) => {
                console.log("Error consiguiendo ticket tratado", error);
                this.load = false;
              } , complete: () => {
                console.log("Completado get ticket tratado para ticket");
                this.load = false;
              }
             });
          }
        });
        this.ticketsTotalResponse = this.tickets.filter((ticket: Ticket) => Number(ticket.respondido) != 0).length;
        this.ticketsTotalPending = this.tickets.filter((ticket: Ticket) => Number(ticket.respondido) == 0).length;
      }, error: (error: any) => {
        console.log("Error consiguiendo tickets para técnico", this.tickets);
        this.load = false;
      }, complete: () => {
        console.log("Completado get tickets para técnico", this.tickets)
      }
    })
  }

  ngOnInit(): void {
    this.load = true;
  }

  public getTicket(ticket: Ticket, expression: string): void {

  }

}

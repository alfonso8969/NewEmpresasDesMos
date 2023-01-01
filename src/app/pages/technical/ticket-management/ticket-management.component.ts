import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/class/users';
import { Ticket } from 'src/app/interfaces/ticket';
import { TicketByUser } from 'src/app/interfaces/ticketByUser';
import { SupportService } from 'src/app/services/support.service';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import * as d3 from 'd3';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-ticket-management',
  templateUrl: './ticket-management.component.html',
  styleUrls: ['./ticket-management.component.css'],
  providers: [DatePipe]
})
export class TicketManagementComponent implements OnInit, AfterViewInit {

  public url: string = environment.apiUrl;

  user: User;
  responseTicketForm: FormGroup;
  closeTicketForm: FormGroup;
  tickets: Ticket[];
  ticket: Ticket;

  userFullName: string;
  ticketsTotal: number;
  ticketsTotalResponse: number;
  ticketsTotalPending: number;
  ticketsTotalResolve: number;
  ticketsTotalPendingClose: number;

  load: boolean = false;
  responseTicket: boolean;
  viewTicket: boolean;
  closeTicket: boolean;

  public page: number = 1;
  public siguiente: string = "Siguiente";
  public anterior: string = "Anterior";

  private sendTicketResponse = {
    title: '',
    message: ''
  };

  constructor(private supportService: SupportService,
    private fb: FormBuilder,
    private userService: UsersService,
    private datePipe: DatePipe) {

    this.user = this.userService.getUserLogged();
    this.userFullName = `${this.user.user_name} ${this.user.user_lastName}`;

    this.responseTicketForm = this.fb.group({
      message: ['', Validators.required]
    })

    this.getTickets();
  }

  private getTickets(): void {
    this.supportService.getTickets().subscribe({
      next: (result: Ticket[]) => {
        this.tickets = result;
        this.ticketsTotal = this.tickets.length;
        this.tickets.forEach(ticket => {
          if (ticket.respondido) {
            this.supportService.getTicketTratadosByCode(ticket.code).subscribe({
              next: (result: TicketByUser) => {
                if (result.ticket_code != undefined) {
                  ticket.ticketByUser = result;
                  this.ticketsTotalResolve = this.tickets.filter((ticket: Ticket) => ticket.ticketByUser?.solucionado == 1).length;
                  this.ticketsTotalPendingClose = this.tickets.filter((ticket: Ticket) => ticket.respondido == 1 && (ticket.ticketByUser && ticket.ticketByUser.solucionado == 0)).length;
                } else {
                  ticket.ticketByUser = undefined;
                }
              }, error: (error: any) => {
                console.log("Error consiguiendo ticket tratado", error);
                this.load = false;
              }, complete: () => {
                console.log("Completado get ticket tratado para ticket", ticket);
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
    });
  }

  ngOnInit(): void {
    this.load = true;
  }

  ngAfterViewInit(): void {
    d3.selectAll(".close").on('mouseover', function (event) {
      d3.select(this).style("color", "red");
    });
    d3.selectAll(".close").on('mouseout', function (event) {
      d3.select(this).style("color", "black");
    });
  }


  public getTicket(ticket: Ticket, expression: string): void {
    this.responseTicket = false;
    this.viewTicket = false;
    this.closeTicket = false;
    console.log("Ticket: ", ticket);
    this.ticket = ticket;
    console.log("expression: ", expression);
    if (expression == "Responder ticket") {
      this.responseTicket = true;
    } else if (expression == "Ver ticket") {
      this.viewTicket = true;
    } else {
      this.closeTicket = true;
    }
  }

  public funcResponseTicket(): void {
    this.load = true;
    this.ticket.ticketByUser = {
      id_technical: this.user.id_user,
      respuesta: this.responseTicketForm.get('message')?.value,
      ticket_code: this.ticket.code,
      ticket_refer: this.ticket.ticket_refer != undefined ? this.ticket.ticket_refer : '',
      solucionado: 0
    }
    this.supportService.insertTicketResponse(this.ticket.ticketByUser!).subscribe({
      next: (result: number) => {
        if (result === 1) {
          this.sendTicketResponse.title = "Respuesta a ticket";
          this.sendTicketResponse.message = `El ticket ${this.ticket.code} se respondió exitosamente`;
          this.showSwal('success');
        } else {
          this.sendTicketResponse.title = "Error";
          this.sendTicketResponse.message = "Hubo un error al generar la respueta del ticket";
          this.showSwal('error');
        }      
      }, error: (error: any) => {
        this.sendTicketResponse.title = "Error";
        this.sendTicketResponse.message = "El código no coincide con ninguno de sus tickets";
        this.showSwal('error');
        console.log(`Error enviando respuesta de ticket ${this.ticket.code}`, error);
        this.load = false;
      }, complete: () => {
        console.log("Completado envío respuesta de ticket", this.ticket.ticketByUser);
        this.load = false;
        this.getTickets();
      }
    })
  }

  public onCheckboxChange(event: any) {
    if (event.target.checked) {
      this.ticket.ticketByUser!.solucionado = 1;
      this.ticket.ticketByUser!.fecha_solucion = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss')!;
      this.supportService.markTicketFixed(this.ticket.ticketByUser!.ticket_code).subscribe({
        next: (result: number) => {
          if (result === 1) {
            this.sendTicketResponse.title = "Solucionado";
            this.sendTicketResponse.message = "El ticket se cerro exitosamente";
            this.showSwal('success');
          } else {
            this.sendTicketResponse.title = "Error";
            this.sendTicketResponse.message = "El código no coincide con ninguno de sus tickets";
            this.showSwal('error');
          }
        },
        error: (error: any) => {
          console.log(error);
          alert(error.message)
        },
        complete: () => {
          console.log("Complete closed ticked", this.ticket.ticketByUser!);
          this.getTickets();
        }
      });
    }
  }

  private showSwal(option: SweetAlertIcon): void {
    this.load = false;
    Swal.fire({
      icon: option,
      title: this.sendTicketResponse.title,
      text: this.sendTicketResponse.message,
    });
    this.cleanForm();
  }

  private cleanForm(): void {
    this.responseTicketForm = this.fb.group({
      message: ['', Validators.required]
    })
  }

}

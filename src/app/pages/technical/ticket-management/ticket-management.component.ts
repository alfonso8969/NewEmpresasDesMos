import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
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
import {
  SortableHeaderDirective,
  SortEvent,
  compare
} from 'src/app/events/sortable-header.directive';
import { Log } from 'src/app/interfaces/log';
import { LogsService } from 'src/app/services/logs.service';

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
  ticketsTmp: Ticket[];
  ticket: Ticket;
  log: Log;

  filter: string;
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

  @ViewChildren(SortableHeaderDirective)
  headers: QueryList<SortableHeaderDirective>;

  constructor(private supportService: SupportService,
              private fb: FormBuilder,
              private userService: UsersService,
              private logService: LogsService,
              private datePipe: DatePipe) {

    this.log = this.logService.initLog();
    this.user = this.userService.getUserLogged();
    this.userFullName = `${this.user.user_name} ${this.user.user_lastName}`;

    this.responseTicketForm = this.fb.group({
      message: ['', [Validators.required, Validators.maxLength(500)]]
    })

    this.getTickets();
  }

  private getTickets(): void {
    this.supportService.getTickets().subscribe({
      next: (result: Ticket[]) => {
        this.tickets = result;
        this.ticketsTmp = result;
        this.ticketsTotal = this.tickets.length;
        this.tickets.forEach(ticket => {
          ticket.user_technical = "Sin asignar";
          this.supportService.getTicketTratadosByCode(ticket.code).subscribe({
            next: (result: TicketByUser) => {
              // Comprobamos que el ticket ha sido respondido
              if (result.ticket_code != undefined) {
                ticket.ticketByUser = result;
                // Asignamos el ticket al técnico que respondió
                ticket.user_technical = ticket.ticketByUser.user_name;
                // Asignamos al ticket el estado, solucionado (Completado) o pendiente de solucionar (Pendiente cerrar)
                ticket.estado = (ticket.respondido == 1 && (ticket.ticketByUser && ticket.ticketByUser.solucionado == 0)) ? 'Pendiente cerrar' :
                  'Completado';
                this.ticketsTotalResolve = this.tickets.filter((ticket: Ticket) => ticket.ticketByUser?.solucionado == 1).length;
                this.ticketsTotalPendingClose = this.tickets.filter((ticket: Ticket) => ticket.ticketByUser?.solucionado == 0).length;
              } else {
                // Si el ticket no ha sido respondido, asignamos al ticket el estado de Nuevo
                ticket.estado = 'Nuevo';
              }
            }, error: (error: any) => {
              this.log.action = 'Conseguir tickets tratados';
              this.log.status = false;
              this.log.message = `(ticket-management) Error al conseguir los tickets tratados: ${JSON.stringify(error)}`;
              this.logService.setLog(this.log);
              console.log("Error consiguiendo ticket tratado", error);
              this.load = false;
            }, complete: () => {
              console.log("Completado get ticket tratado para ticket", ticket);
              this.load = false;
            }
          });

        });
        this.ticketsTotalResponse = this.tickets.filter((ticket: Ticket) => Number(ticket.respondido) != 0).length;
        this.ticketsTotalPending = this.tickets.filter((ticket: Ticket) => Number(ticket.respondido) == 0).length;

      }, error: (error: any) => {
        this.log.action = 'Conseguir tickets';
        this.log.status = false;
        this.log.message = `(ticket-management) Error al conseguir los tickets: ${JSON.stringify(error)}`;
        this.logService.setLog(this.log);
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


  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting tickets
    if (direction === '' || column === '') {
      this.tickets = this.ticketsTmp;
    } else {
      this.tickets = [...this.ticketsTmp].sort((a, b) => {
        const res = compare(a[column]!, b[column]!);
        return direction === 'asc' ? res : -res;
      });
    }
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
    this.supportService.insertTicketResponse(this.ticket.ticketByUser).subscribe({
      next: (result: number) => {
        if (result === 1) {
          this.sendTicketResponse.title = "Respuesta a ticket";
          this.sendTicketResponse.message = `El ticket ${this.ticket.code} se respondió exitosamente`;
          this.showSwal('success');
        } else {
          this.sendTicketResponse.title = "Error";
          this.sendTicketResponse.message = "Hubo un error al generar la respuesta del ticket";
          this.showSwal('error');
        }
      }, error: (error: any) => {
        this.log.action = 'Respuesta tickets';
        this.log.status = false;
        this.log.message = `(ticket-management) Error enviando respuesta de ticket: ${JSON.stringify(error)}`;
        this.logService.setLog(this.log);
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
            this.sendTicketResponse.title = "Solución ticket";
            this.sendTicketResponse.message = "El ticket se cerro exitosamente";
            this.showSwal('success');
          } else {
            this.log.action = 'Cerrar ticket';
            this.log.status = false;
            this.log.message = `(ticket-management) Error al cerrar el ticket ${this.ticket.code}: ${JSON.stringify(result)}`;
            this.logService.setLog(this.log);
            this.sendTicketResponse.title = "Error";
            this.sendTicketResponse.message = "El código no coincide con ninguno de sus tickets";
            this.showSwal('error');
          }
        },
        error: (error: any) => {
          this.log.action = 'Cerrar ticket';
          this.log.status = false;
          this.log.message = `(ticket-management) Error al cerrar el ticket ${this.ticket.code}: ${JSON.stringify(error)}`;
          this.logService.setLog(this.log);
          console.log("Cerrar ticket", `Error al cerrar el ticket ${this.ticket.code}`, this.user.id_user, new Date(), error);
          alert(error.message)
        },
        complete: () => {
          console.log("Cerrar ticket", `Éxito al cerrar el ticket ${this.ticket.code}`, this.user.id_user, new Date(), this.ticket.ticketByUser!);
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

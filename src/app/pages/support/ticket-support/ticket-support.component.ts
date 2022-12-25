import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/class/users';
import { Tema } from 'src/app/interfaces/tema';
import { Ticket } from 'src/app/interfaces/ticket';
import { TicketByUser } from 'src/app/interfaces/ticketByUser';
import { EmailService } from 'src/app/services/email.service';
import { SupportService } from 'src/app/services/support.service';
import { Utils } from 'src/app/utils/utils';
import { environment } from 'src/environments/environment';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-ticket-support',
  templateUrl: './ticket-support.component.html',
  styleUrls: ['./ticket-support.component.css'],
  providers: [ DatePipe ]
})
export class TicketSupportComponent implements OnInit {

  url: string = environment.apiUrl;

  addTicketSupport: FormGroup;

  temas: Tema[];
  user: User;
  ticket: Ticket;

  ticketsByUser: TicketByUser[];
  ticketsTratadosByUser: TicketByUser[];
  checkTicketsCode: TicketByUser[];

  checkTicketExitCode: TicketByUser;
  ticketByUser: TicketByUser;
  ticketTratadosByUser: TicketByUser;

  load: boolean = false;
  campoStr: string;
  campoInt: number;
  message: string;
  code: string;
  ticketCodeSelected: string;
  codeRef: string;

  public dataForm = {
    name: '',
    email: '',
    message: '',
    from: 'Admin Empresas ticket soporte',
    ticket: true,
    code_ref: '',
    code: '',
    password: false
  };

  private sendEmailResult = {
    title: '',
    message: ''
  };

  sendEmailMessages = {
    titleError: "Error",
    titleSuccess: "Correcto",
    noData: "Los datos enviados no pueden estar vacíos",
    messageError: "Hubo algún error enviando el ticket",
    messageSuccess: "El ticket fue enviado correctamente",
  }

  constructor(private fb: FormBuilder,
    private supportService: SupportService,
    private emailService: EmailService,
    private userService: UsersService,
    private datePipe: DatePipe) {
      this.checkTicketExitCode = {
        ticket_code: '',
        user_name: '',
        campo: '',
        message: '',
        fecha: new Date(),
        respondido: 0,
        solucionado: 0,
        respuesta: '',
        user_img: '',
        ticket_refer: '',
      }
    this.ticket = {
      id_ticket: 0,
      user_id: 0,
      campo: 0,
      message: '',
      fecha: new Date(),
      code: '',
      respondido: false
    }

    this.user = this.userService.getUserLogged();

    this.ticketsTratadosByUser = [];
    this.ticketsByUser = [];
    this.supportService.getTicketByUser(this.user).subscribe({
      next: (result: TicketByUser[]) => {
        if (result != null) {
          this.ticketsByUser = result;
        } else {
          alert("Hubo un error")
        }
      },
      error: (error: any) => {
        console.log(error);
        alert(error.message)
      },
      complete: () => console.log("Complete ticketsByUser", this.ticketsByUser)
    });

    this.addTicketSupport = this.fb.group({
      field: [0, Validators.required],
      codeRef: ['', Validators.maxLength(10)],
      message: ['', [Validators.required, Validators.maxLength(500)]]
    });

    this.supportService.getTemas().subscribe({
      next: (result: Tema[]) => {
        if (result != null) {
          this.temas = result;
        } else {
          alert("Hubo un error")
        }
      },
      error: (error: any) => {
        console.log(error);
        alert(error.message)
      },
      complete: () => console.log("Complete getTemas", this.temas)
    });
  }

  ngOnInit(): void {
  }


  isDisabled(): boolean {
    return this.addTicketSupport.get('field')?.value == 0;
  }

  public addTicket(): void {
    this.message = this.addTicketSupport.get('message')?.value;
    this.campoInt = this.addTicketSupport.get('field')?.value;
    this.code = Utils.makeString(10);
    this.dataForm = {
      name: `${this.user.user_name} ${this.user.user_lastName}`,
      email: this.user.user_email,
      message: `<h3>Campo: ${this.campoStr} </h3>
                <br>
                <h4>Mensaje: ${this.message}</h4>`,
      from: 'Admin Empresas ticket soporte',
      ticket: true,
      code: this.code,
      code_ref: this.codeRef != undefined ? this.codeRef : 'Sin ticket de referencia',
      password: false
    };

    this.emailService.sendEmail(this.dataForm).subscribe({
      next: (result: any) => {
        this.load = false;
        console.log('ContactComponent response', result);
        if (result.title.includes('error')) {
          this.showSwal('error');
          return;
        }
        this.sendEmailResult.title = this.sendEmailMessages.titleSuccess;
        this.sendEmailResult.message = this.sendEmailMessages.messageSuccess;
        this.showSwal('success');
        this.saveTicket();
      }, error: (error: any) => {
        this.load = false;
        this.sendEmailResult.title = this.sendEmailMessages.titleError;
        this.sendEmailResult.message = error.message;
        this.showSwal('error');
        console.log('Ticket send email Error', error);
      }, complete: () => console.log("Complete send email")
    });
  }

  public changeTema(event: any) {
    if (this.checkTicketExitCode.campo != '') {
      this.addTicketSupport.get('field')!.setValue(this.checkTicketExitCode.campo);
      return;
    }
    this.campoStr = event.target.selectedOptions[0].text;
  }

  public onCheckboxChange(event: any) {
    if (event.target.checked) {
      this.ticketTratadosByUser.solucionado = 1;
      this.ticketTratadosByUser.fecha_solucion = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss')!;
      this.supportService.markTicketFixed(this.ticketTratadosByUser.ticket_code).subscribe({
        next: (result: number) => {
          if (result === 1) {
            this.sendEmailResult.title = "Solucionado";
            this.sendEmailResult.message = "El ticket se cerro exitosamente";
            this.showSwal('success');
          } else {
            this.sendEmailResult.title = "Error";
            this.sendEmailResult.message = "El código no coincide con ninguno de sus tickets";
            this.showSwal('error');
          }
        },
        error: (error: any) => {
          console.log(error);
          alert(error.message)
        },
        complete: () => console.log("Complete closed ticked", this.checkTicketsCode)
      });
    }
  }

  public codeRefChange(event: any): void {
    if (event.target.value.length === 10) {
      this.codeRef = event.target.value;
      this.supportService.checkTicketExitByCode(this.codeRef).subscribe({
        next: (result: TicketByUser) => {
          if (result && result.campo != undefined) {

            this.checkTicketExitCode = result;
            this.addTicketSupport.get('field')?.setValue(this.checkTicketExitCode.campo);
          } else {
            this.sendEmailResult.title = "Error";
            this.sendEmailResult.message = "El código no coincide con ninguno de sus tickets";
            this.showSwal('error');
            this.checkTicketExitCode.campo = '';
            this.addTicketSupport.get('field')!.setValue(0);
          }
        },
        error: (error: any) => {
          console.log(error);
          alert(error.message)
        },
        complete: () => console.log("Complete checkTicketCode", this.checkTicketsCode)
      });
    } else {
      this.checkTicketExitCode.respondido = 0;
      this.checkTicketExitCode.campo = '';
      this.addTicketSupport.get('field')!.setValue(0);
    }

  }

  changeTicketCode(event: any) {
    this.ticketCodeSelected = event.target.selectedOptions[0].text;
    if (this.ticketCodeSelected == 'Seleccione ticket') {
      return;
    }
    this.ticketByUser = this.ticketsByUser?.find((ticket: TicketByUser) => ticket.ticket_code == this.ticketCodeSelected)!;
    console.log("this.ticketByUser", this.ticketByUser);
    console.log("this.ticketCodeSelected", this.ticketCodeSelected);
    // buscamos si tiene referencias
    this.supportService.checkTicketRefCode(this.ticketCodeSelected).subscribe({
      next: (result: TicketByUser[]) => {
        if (result != null) {
          this.checkTicketsCode = result;
          console.log("this.checkTicketsCode", this.checkTicketsCode)
        } else {
          alert("Hubo un error")
        }
      },
      error: (error: any) => {
        console.log(error);
        alert(error.message)
      },
      complete: () => console.log("Complete checkTicketCode", this.checkTicketsCode)
    });
    console.log("this.ticketByUser.respondido", this.ticketByUser.respondido);
    if (this.ticketByUser.respondido != 0) {
      this.supportService.getTicketTratadosByUser(this.ticketCodeSelected).subscribe({
        next: (result: TicketByUser[]) => {
          if (result != null) {
            this.ticketsTratadosByUser = result;
            this.ticketTratadosByUser = this.ticketsTratadosByUser?.find((ticket: TicketByUser) => ticket.ticket_code == this.ticketCodeSelected)!;
          } else {
            alert("Hubo un error")
          }
        },
        error: (error: any) => {
          console.log(error);
          alert(error.message)
        },
        complete: () => console.log("Complete ticketsTratadosByUser", this.ticketsTratadosByUser)
      });
    }
    console.log("ticketCodeSelected", this.ticketCodeSelected)
    console.log("ticketByUser", this.ticketByUser)
  }


  private showSwal(option: SweetAlertIcon): void {

    Swal.fire({
      icon: option,
      title: this.sendEmailResult.title,
      text: this.sendEmailResult.message,
    });
    this.cleanForm();
  }

  public cleanForm(): void {
    this.addTicketSupport = this.fb.group({
      field: [0, Validators.required],
      codeRef: ['', Validators.maxLength(10)],
      message: ['', Validators.required]
    });
    this.addTicketSupport.markAsUntouched();
  }

  private clearDataForm(): void {
    this.dataForm = {
      name: '',
      email: '',
      message: '',
      from: '',
      ticket: true,
      code: '',
      code_ref: '',
      password: false
    };

  }

  private saveTicket(): void {
    this.ticket.user_id = this.user.id_user;
    this.ticket.campo = this.campoInt;
    this.ticket.message = this.message;
    this.ticket.code = this.code;
    this.ticket.ticket_refer = this.codeRef != undefined ? this.codeRef : '';

    this.supportService.saveTicket(this.ticket).subscribe({
      next: (result: number) => {
        if (result == 0) {
          alert("Hubo un error guardando ticket")
        }
        this.clearDataForm();
      },
      error: (error: any) => {
        console.log(error);
        this.clearDataForm();
        alert("Hubo un error guardando ticket: " + error.message)
      },
      complete: () => console.log("Complete save ticket", this.ticket)
    });
  }


}

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

@Component({
  selector: 'app-ticket-support',
  templateUrl: './ticket-support.component.html',
  styleUrls: ['./ticket-support.component.css']
})
export class TicketSupportComponent implements OnInit {
  
  url: string = environment.apiUrl;

  addTicketSupport: FormGroup;
  temas: Tema[];
  user: User;
  ticket: Ticket;
  ticketsByUser: TicketByUser[];
  ticketsTratadosByUser: TicketByUser[];
  ticketByUser: TicketByUser;
  ticketTratadosByUser: TicketByUser;

  load: boolean = false;
  campoStr: string;
  campoInt: number;
  message: string;
  code: string;
  ticketCodeSelected: string;

  public dataForm = {
    name: '',
    email: '',
    message: '',
    from: 'Admin Empresas ticket soporte',
    ticket: true,
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
    messageerror: "Hubo algún error enviando el ticket",
    messageSuccess: "El ticket fue enviado correctamente",
  }

  constructor(private fb: FormBuilder,
              private supportService: SupportService,
              private emailService: EmailService) {
    this.ticket = {
      id_ticket: 0,
      user_id: 0,
      campo: 0,
      message: '',
      fecha: new Date(),
      code: '',
      respondido: false
    }

    let userLogged = localStorage.getItem('userlogged');
    if (userLogged && userLogged != "undefined") {
      console.log('localStorage userLogged MenuService: ', JSON.parse(localStorage.getItem('userlogged')!))
      this.user = JSON.parse(userLogged);
    }
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
      name: `${ this.user.user_name } ${  this.user.user_lastName }`,
      email: this.user.user_email ,
      message: `<h3>Campo: ${ this.campoStr } </h3>
                <br>
                <h4>Mensaje: ${ this.message }</h4>`,
      from: 'Admin Empresas ticket soporte',
      ticket: true,
      code: this.code,
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

  changeTema(event: any) {
    this.campoStr = event.target.selectedOptions[0].text;
  }

  changeTicketCode(event: any) {
    this.ticketCodeSelected = event.target.selectedOptions[0].text;
    this.ticketByUser = this.ticketsByUser.find((ticket: TicketByUser) => ticket.ticket_code == this.ticketCodeSelected)!;
    console.log("this.ticketByUser.respondido", this.ticketByUser.respondido);
    if(this.ticketByUser.respondido != 0) {
      if(this.ticketsTratadosByUser.length === 0) {
        
        this.supportService.getTicketTratadosByUser(this.ticketCodeSelected).subscribe({
          next: (result: TicketByUser[]) => {
            if (result != null) {
              this.ticketsTratadosByUser = result;
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
      password: false
    };

  }

  private saveTicket(): void {
    this.ticket.user_id = this.user.id_user;
    this.ticket.campo = this.campoInt;
    this.ticket.message = this.message;
    this.ticket.code = this.code;

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

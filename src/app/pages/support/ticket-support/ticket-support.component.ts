import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/class/users';
import { Tema } from 'src/app/interfaces/tema';
import { Ticket } from 'src/app/interfaces/ticket';
import { EmailService } from 'src/app/services/email.service';
import { SupportService } from 'src/app/services/support.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-ticket-support',
  templateUrl: './ticket-support.component.html',
  styleUrls: ['./ticket-support.component.css']
})
export class TicketSupportComponent implements OnInit {

  addTicketSupport: FormGroup;
  temas: Tema[];
  user: User;
  load: boolean = false;
  ticket: Ticket;
  campoStr: string;
  campoInt: number;
  message: string;

  public dataForm = {
    name: '',
    email: '',
    message: '',
    from: 'Admin Empresas ticket soporte',
    ticket: true,
    password: false
  };

  private sendEmailResult = {
    title: '',
    message: ''
  };

  sendEmailMessages = {
    titleerror: "Error",
    titlesuccess: "Correcto",
    nodata: "Los datos enviados no pueden estar vacios",
    messageerror: "Hubo algún error enviando el ticket",
    messagesuccess: "El ticket fue enviado correctamente",
  }

  constructor(private fb: FormBuilder, 
              private supporService: SupportService,
              private emailService: EmailService) {
    this.ticket = {
      id_ticket: 0,
      user_id: 0,
      campo: 0,
      message: '',
      fecha: new Date(),
      respondido: false
    }

    let userLogged = localStorage.getItem('userlogged');
    if (userLogged && userLogged != "undefined") {
      console.log('localstorage userlogged MenuService: ', JSON.parse(localStorage.getItem('userlogged')!))
      this.user = JSON.parse(userLogged);
    }
    this.addTicketSupport = this.fb.group({ 
      field: [0, Validators.required],
      message: ['', Validators.required]
    });

    this.supporService.getTemas().subscribe({
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
      complete: () => console.log("Complete", this.temas)
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
    this.dataForm = {
      name: `${ this.user.user_name } ${  this.user.user_lastName }`,
      email: this.user.user_email ,
      message: `<h3>Campo: ${ this.campoStr } </h3>
                <br>
                <h4>Mensaje: ${ this.message }</h4>`,
      from: 'Admin Empresas ticket soporte',
      ticket: true,
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
      this.sendEmailResult.title = this.sendEmailMessages.titlesuccess;
      this.sendEmailResult.message = this.sendEmailMessages.messagesuccess;
      this.showSwal('success');
      this.saveTicket();
     }, error: (error: any) => {
      this.load = false;
      this.sendEmailResult.title = this.sendEmailMessages.titleerror;
      this.sendEmailResult.message = error.message;
      this.showSwal('error');
      console.log('Login send email Error', error);
     }, complete: () => console.log("Complete send email")
    });
  }

  changeSector(event: any) {
    this.campoStr = event.target.selectedOptions[0].text;
  }

  
  private showSwal(option: SweetAlertIcon): void {

    Swal.fire({
      icon: option,
      title: this.sendEmailResult.title,
      text: this.sendEmailResult.message,
    });
    this.addTicketSupport.get('field')?.setValue(0);
    this.addTicketSupport.get('message')?.setValue('');
    this.addTicketSupport.markAsUntouched();
  }

  public cleanForm(): void {
    this.addTicketSupport = this.fb.group({ 
      field: [0, Validators.required],
      message: ['', Validators.required]
    });
  }

  private clearDataForm(): void {
    this.dataForm = {
      name: '',
      email: '',
      message: '',
      from: '',
      ticket: true,
      password: false
    };
  }

  private saveTicket(): void {
    this.ticket.user_id = this.user.id_user;
    this.ticket.campo = this.campoInt;
    this.ticket.message = this.message ;

    this.supporService.saveTicket(this.ticket).subscribe({
      next: (result: number) => {
        if (result == 0) {
          alert("Hubo un error")
        } else {
          this.clearDataForm();
        }       
      },
      error: (error: any) => {
        console.log(error);
        alert(error.message)
      },
      complete: () => console.log("Complete save ticket", this.ticket)
    });
  }


}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { Log } from '../interfaces/log';
import { User } from '../class/users';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class LogsService {


  private urlEmail: string;
  private baseUrl: string;
  private ipAddress: string = '';
  log: Log;
  user: User;

  constructor(private http: HttpClient,
              private datePipe: DatePipe,
              private userService: UsersService) {

    this.user = this.userService.getUserLogged();
    this.urlEmail = environment.urlPHPEmail;
    this.baseUrl = environment.apiUrl;
    !this.ipAddress && this.getIPAddress();
  }

  public getLogs(): Observable<Log[]> {
    return this.http.get<Log[]>(`${this.baseUrl}/getLogs.php`);
  }

  public setLog(log: Log): void {
    log.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss')!;
    if (log.ip == '' || log.ip === undefined) {
      log.ip = this.ipAddress;
    }
    console.log("log in log Service: ", log);
    let logSave = log;
    this.http.post<number>(`${this.baseUrl}/setLog.php`, { log: log })
    .subscribe({
      next: (result: number) => {
        if(result === 1) {
          console.log("Log grabado satisfactoriamente");
        } else {
          console.log("Error grabando log");
        }
      }, error: (error: any) =>  {
        console.log("Error al procesar log", error);
        if(error.message.toLowerCase().includes('http failure response')) {
          localStorage.setItem('errorlog_response', error.message);
          localStorage.setItem('log_response', JSON.stringify(logSave));
        }
      }, complete: () => console.log("Se completo el grabado del log satisfactoriamente")
    });
  }

  public getIPAddress(): void {
    this.http.get("https://api.ipify.org/?format=json").subscribe((res: any)=>{
      this.ipAddress = res.ip;
      console.log("IP log: ", this.ipAddress);
    });
  }

  public initLog(): Log {
    this.log = {
      id_user: (this.user && this.user.id_user) || 0,
      user_email: (this.user && this.user.user_email) || '',
      ip: this.ipAddress,
      action: '',
      date: '',
      message: '',
      status: false
    }
    console.log("This Log", this.log);
    return this.log;
  }
}

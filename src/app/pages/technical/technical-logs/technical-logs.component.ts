import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { compare, SortableHeaderLogsDirective, SortEventLog } from 'src/app/events/sortable-header-logs.directive';
import { Log } from 'src/app/interfaces/log';
import { environment } from 'src/environments/environment';
import { LogsService } from 'src/app/services/logs.service';
import { formatDate, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';

@Component({
  selector: 'app-technical-logs',
  templateUrl: './technical-logs.component.html',
  styleUrls: ['./technical-logs.component.css']
})
export class TechnicalLogsComponent implements OnInit {


  public url: string = environment.apiUrl;

  load: boolean = false;
  logsTotal: number;
  logsSuccessTotal: number;
  logsFailTotal: number;
  filter: string;

  logs: Log[];
  logsTmp: Log[];
  log: Log;

  public page: number = 1;
  public siguiente: string = "Siguiente";
  public anterior: string = "Anterior";

  @ViewChildren(SortableHeaderLogsDirective)
  headers: QueryList<SortableHeaderLogsDirective>;

  constructor(private logService: LogsService) {
      registerLocaleData(es);
      this.logsTotal = 0;
      this.logsSuccessTotal = 0;
      this.logsFailTotal = 0;
  
      this.load = true;
      this.logService.getLogs().subscribe({
        next: (logs: Log[]) => {
          this.logs = logs;
          this.logsTmp = logs;
          this.logsTotal = logs.length;
          this.logsSuccessTotal = logs.filter(s => s.status == !0).length;
          this.logsFailTotal = this.logsTotal - this.logsSuccessTotal;
        }, error: (error: any) => {
          console.log("Error consiguiendo logs");
           this.load = false;
        }, complete: () => {
          console.log(`Se consiguieron los logs ${ JSON.stringify(this.logs) }`, formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'es_ES'));
           this.load = false;
  
        }
      });
     }

  ngOnInit(): void {
  }

  onSort({ column, direction }: SortEventLog) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortableLog !== column) {
        header.direction = '';
      }
    });

    // sorting logs
    if (direction === '' || column === '') {
      this.logs = this.logsTmp;
    } else {
      this.logs = [...this.logsTmp].sort((a, b) => {
        const res = compare(a[column]!, b[column]!);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  public getLog(log: Log): void {
    this.log = log;
    console.log(this.log)
  }

}

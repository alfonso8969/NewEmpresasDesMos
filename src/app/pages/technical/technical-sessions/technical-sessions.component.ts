import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  SortableHeaderSessionsDirective,
  SortEventSession,
  compare
} from 'src/app/events/sortable-header-sessions.directive';
import { DatePipe } from '@angular/common';
import * as d3 from 'd3';
import { Session } from 'src/app/interfaces/session';
import { SessionsService } from 'src/app/services/sessions.service';
import { Log } from 'src/app/interfaces/log';
import { LogsService } from 'src/app/services/logs.service';

@Component({
  selector: 'app-technical-sessions',
  templateUrl: './technical-sessions.component.html',
  styleUrls: ['./technical-sessions.component.css'],
  providers: [DatePipe]
})
export class TechnicalSessionsComponent implements OnInit, AfterViewInit {

  public url: string = environment.apiUrl;

  load: boolean = false;
  sessionsTotal: number;
  sessionsSuccessTotal: number;
  sessionsFailTotal: number;
  filter: string;

  log: Log
  sessions: Session[];
  sessionsTmp: Session[];
  session: Session;

  public page: number = 1;
  public siguiente: string = "Siguiente";
  public anterior: string = "Anterior";

  @ViewChildren(SortableHeaderSessionsDirective)
  headers: QueryList<SortableHeaderSessionsDirective>;

  constructor(private sessionService: SessionsService,
              private datePipe: DatePipe,
              private logService: LogsService) {
    this.sessionsTotal = 0;
    this.sessionsSuccessTotal = 0;
    this.sessionsFailTotal = 0;
    this.log = this.logService.initLog();
    this.load = true;
    this.sessionService.getSessions().subscribe({
      next: (sessions: Session[]) => {
        this.sessions = sessions;
        this.sessionsTmp = sessions;
        this.sessionsTotal = sessions.length;
        this.sessionsSuccessTotal = sessions.filter(s => s.complete == !0).length;
        this.sessionsFailTotal = this.sessionsTotal - this.sessionsSuccessTotal;
      }, error: (error: any) => {
        console.log("Error consiguiendo sesiones");
         this.load = false;
      }, complete: () => {
        console.log(`Se consiguieron las sesiones ${ JSON.stringify(this.sessions) }`, this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'));
         this.load = false;

      }
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    d3.selectAll(".close").on('mouseover', function (event) {
      d3.select(this).style("color", "red");
    });
    d3.selectAll(".close").on('mouseout', function (event) {
      d3.select(this).style("color", "black");
    });
  }

  onSort({ column, direction }: SortEventSession) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortableSession !== column) {
        header.direction = '';
      }
    });

    // sorting sessions
    if (direction === '' || column === '') {
      this.sessions = this.sessionsTmp;
    } else {
      this.sessions = [...this.sessionsTmp].sort((a, b) => {
        const res = compare(a[column]!, b[column]!);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  public getSession(session: Session): void {
    this.session = session;
    console.log(this.session)
  }

}

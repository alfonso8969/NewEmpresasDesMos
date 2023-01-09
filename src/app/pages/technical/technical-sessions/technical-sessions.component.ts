import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  SortableHeaderSessionsDirective,
  SortEventSession,
  compare
} from 'src/app/events/sortable-header-sessions.directive';
import { DatePipe } from '@angular/common';
import { Session } from 'src/app/interfaces/session';
import { SessionsService } from 'src/app/services/sessions.service';

@Component({
  selector: 'app-technical-sessions',
  templateUrl: './technical-sessions.component.html',
  styleUrls: ['./technical-sessions.component.css'],
  providers: [DatePipe]
})
export class TechnicalSessionsComponent implements OnInit {

  public url: string = environment.apiUrl;

  load: boolean = false;
  sessionsTotal: number;
  filter: string;

  sessions: Session[];
  sessionsTmp: Session[];
  session: Session;

  public page: number = 1;
  public siguiente: string = "Siguiente";
  public anterior: string = "Anterior";

  @ViewChildren(SortableHeaderSessionsDirective)
  headers: QueryList<SortableHeaderSessionsDirective>;

  constructor(private sessionService: SessionsService,
    private datePipe: DatePipe) {
    this.sessionsTotal = 0;

    this.load = true;
    this.sessionService.getSessions().subscribe({
      next: (sessions: Session[]) => { 
        this.sessions = sessions;
        this.sessionsTmp = sessions;
        this.sessionsTotal = sessions.length;
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

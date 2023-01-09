import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { Session } from '../interfaces/session';

export type SortColumnSession = keyof Session | '';
export type SortDirection = 'asc' | 'desc' | '';

const rotate: { [key: string]: SortDirection } = {
  asc: 'desc',
  desc: '',
  '': 'asc',
};

export const compare = (
  v1: string | number | boolean | Date,
  v2: string | number | boolean | Date
) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

export interface SortEventSession {
  column: SortColumnSession;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortableSession]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
})

export class SortableHeaderSessionsDirective {

  @Input() sortableSession: SortColumnSession = '';
  @Input() direction: SortDirection = '';
  @Output() sortSession = new EventEmitter<SortEventSession>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sortSession.emit({ column: this.sortableSession, direction: this.direction });
  }

}

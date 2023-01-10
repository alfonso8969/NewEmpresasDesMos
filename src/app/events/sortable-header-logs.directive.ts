import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { Log } from '../interfaces/log';

export type SortColumnLog = keyof Log | '';
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

export interface SortEventLog {
  column: SortColumnLog;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortableLog]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
})

export class SortableHeaderLogsDirective {

  @Input() sortableLog: SortColumnLog = '';
  @Input() direction: SortDirection = '';
  @Output() sortLog = new EventEmitter<SortEventLog>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sortLog.emit({ column: this.sortableLog, direction: this.direction });
  }
}

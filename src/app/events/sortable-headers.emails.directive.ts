import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { Email } from '../interfaces/email';
import { FormInscription } from '../interfaces/formInscription';

export type SortColumnEmail = keyof Email | '';
export type SortDirection = 'asc' | 'desc' | '';

const rotate: { [key: string]: SortDirection } = {
  asc: 'desc',
  desc: '',
  '': 'asc',
};

export const compare = (
  v1: string | number | boolean | string[] | Date | FormInscription,
  v2: string | number | boolean | string[] | Date | FormInscription
) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

export interface SortEventEmail {
  column: SortColumnEmail;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortableEmail]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
})

export class SortableHeadersEmailsDirective {

  @Input() sortableEmail: SortColumnEmail = '';
  @Input() direction: SortDirection = '';
  @Output() sortEmail = new EventEmitter<SortEventEmail>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sortEmail.emit({ column: this.sortableEmail, direction: this.direction });
  }
}

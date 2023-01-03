import { Pipe, PipeTransform } from '@angular/core';
import { Ticket } from '../interfaces/ticket';

@Pipe({
  name: 'ticket'
})
export class TicketPipe implements PipeTransform {
  transform(values: Ticket[], filter: string): Ticket[] {
    if (!filter || filter.length === 0) {
      return values;
    }

    if (values.length === 0) {
      return values;
    }

    return values.filter((value: Ticket) => {
      const nameFound =
        value.user_name!.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
      const capitalFound =
        value.code!.toLowerCase().indexOf(filter.toLowerCase()) !== -1;

      if (nameFound || capitalFound) {
        return value;
      }

      return '';
    });
  }
}

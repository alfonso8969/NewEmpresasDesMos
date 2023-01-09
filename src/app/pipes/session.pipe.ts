import { Pipe, PipeTransform } from '@angular/core';
import { Session } from '../interfaces/session';

@Pipe({
  name: 'session'
})
export class SessionPipe implements PipeTransform {
  transform(values: Session[], filter: string): Session[] {
    if (!filter || filter.length === 0) {
      return values;
    }

    if (values.length === 0) {
      return values;
    }

    return values.filter((value: Session) => {
      const nameFound =
        value.user_name!.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
      const emailFound =
        value.user_email!.toLowerCase().indexOf(filter.toLowerCase()) !== -1;

      if (nameFound || emailFound) {
        return value;
      }

      return '';
    });
  }
}
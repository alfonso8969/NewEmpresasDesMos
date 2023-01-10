import { Pipe, PipeTransform } from '@angular/core';
import { Log } from '../interfaces/log';

@Pipe({
  name: 'log'
})
export class LogPipe implements PipeTransform {

  transform(values: Log[], filter: string): Log[] {
    if (!filter || filter.length === 0) {
      return values;
    }

    if (values.length === 0) {
      return values;
    }

    return values.filter((value: Log) => {
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

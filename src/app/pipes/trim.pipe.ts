import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trim'
})
export class TrimPipe implements PipeTransform {

  transform(value: string) {
    if (!value) {
      return '';
    }
    return value.trim().replace(/ /g, "").replace("&", "");
  }

}

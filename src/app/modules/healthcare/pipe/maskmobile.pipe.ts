import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskmobile'
})
export class MaskmobilePipe implements PipeTransform {

  transform(value: any): any {
    const visibleDigits = 3;
    let maskedSection = value.slice(3, 10);
    let visibleSection = value.slice(0, 3);
    return visibleSection+'-' + maskedSection.replace(/./g, '*');
  }

}

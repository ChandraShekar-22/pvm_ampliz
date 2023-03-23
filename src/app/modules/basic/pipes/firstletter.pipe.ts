import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstletter'
})
export class FirstletterPipe implements PipeTransform {

  transform(value: any='', ...args: any[]): any {
    return value.split(' ').map(n => n[0]).join('').toUpperCase();
  }

}

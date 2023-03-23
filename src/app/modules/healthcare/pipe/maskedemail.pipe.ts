import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskedemail'
})
export class MaskedemailPipe implements PipeTransform {

  transform(value: any): any {
    let x = value.split("@");
    return '***'+x[1];
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'startcase'
})
export class StartcasePipe implements PipeTransform {

  transform(value: any): any {
    var result = value.replace( /([A-Z])/g, " $1" );
    var finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
  }
}

import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "numberWithCommas",
})
export class NumberWithCommasPipe implements PipeTransform {
  transform(value: any): any {
    if (value === 0) {
      return 0;
    } else {
      if (value) {
        value = value.toString();
        var pattern = /(-?\d+)(\d{3})/;
        while (pattern.test(value)) value = value.replace(pattern, "$1,$2");
      }
      return value;
    }
  }
}

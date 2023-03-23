import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'texthighlight'
})
export class TexthighlightPipe implements PipeTransform {

  transform(value: string, args: string): string {
    if (args && value) {
      let startIndex = value.toLowerCase().indexOf(args.toLowerCase());
      if (startIndex != -1) {
        let endLength = args.length;
        let matchingString = value.substr(startIndex, endLength);
        return value.replace(matchingString, "<span class='highlightText'>" + matchingString + "</span>");
      }
    }
    return value;
  }
}

import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "shortName"
})
export class ShortNamePipe implements PipeTransform {
  transform(fullName: string): any {
  
    return fullName
    .replace(/ and /, ' ')
      .match(/\b(\w)/g).reduce((response,word)=> response+=word.slice(0,1),'')
  }
}

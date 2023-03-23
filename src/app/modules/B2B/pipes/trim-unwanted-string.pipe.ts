import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "trimUnwantedString",
})
export class TrimUnwantedStringPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]) {
    let clearedString: string = "";
    const unwantedStrings = new Set(["Nil", "N/A", "NA", "null"]);
    const hasString = unwantedStrings.has(value);
    if (hasString === false) {
      clearedString = value;
    } else {
      clearedString = "";
    }
    return clearedString;
  }
}

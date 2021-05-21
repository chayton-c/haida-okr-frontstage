import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'kilometerPipe'})
export class KilometerPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    let kilometer = value;
    return "K" + Number(Math.floor(kilometer / 1000).toFixed(0)) + "+" + Number(kilometer % 1000).toFixed(0);
  }
}

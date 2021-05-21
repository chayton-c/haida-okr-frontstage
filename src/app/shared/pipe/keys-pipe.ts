import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'keysPipe'})
export class keysPipe implements PipeTransform {
  transform(value:any, args:string[]) : any {
    let keys = [];
    for (let key in value) {
      if (args.find(value1 => value1 == key))
        keys.push(key);
    }
    return keys;
  }
}

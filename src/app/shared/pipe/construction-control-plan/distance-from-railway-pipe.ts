import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'distanceFromRailwayPipe'})
export class DistanceFromRailwayPipe implements PipeTransform {

  transform(startDistanceFromRailway: any, endDistanceFromRailway: any, ...args: any[]): any {
    if (startDistanceFromRailway && endDistanceFromRailway)
      return startDistanceFromRailway + '-' + endDistanceFromRailway;

    if (startDistanceFromRailway && !endDistanceFromRailway)
      return startDistanceFromRailway;

    if (!startDistanceFromRailway && endDistanceFromRailway)
      return endDistanceFromRailway;

    return '';
  }
}

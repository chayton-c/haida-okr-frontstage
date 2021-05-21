import {ContainsLocationData, Location} from "../location/location";

export class RailwayLineSection implements ContainsLocationData {
  id: string;
  railwayLineId: string;
  leftStationId: string;
  rightStationId: string;
  downriver: number;
  locations: Location[];
  name: string;

  constructor(id: string, railwayLineId: string, leftStationId: string, rightStationId: string, downriver: number, locations: Location[], name: string) {
    this.id = id;
    this.railwayLineId = railwayLineId;
    this.leftStationId = leftStationId;
    this.rightStationId = rightStationId;
    this.downriver = downriver;
    this.locations = locations;
    this.name = name;
  }
}

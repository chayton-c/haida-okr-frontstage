import {ContainsLocationData, Location} from "../location/location";

export interface KilometerMark extends ContainsLocationData {
  id: string,
  name: string,
  railwayLineSectionId: string,
  stationId: string,
  kilometer: number,
  locations: Location[],
}

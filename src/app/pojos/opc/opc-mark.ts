import {ContainsLocationData, Location} from "../location/location";

export interface OpcMark extends ContainsLocationData {
  id: string,
  name: string,
  opcMarkTypeId: string,
  nextOpcMarkId?: string,
  typeName: string,
  kilometerMark: number,
  locations: Location[],
}

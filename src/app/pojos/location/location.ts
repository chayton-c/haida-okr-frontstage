export interface Location {
  id: string;
  seq: number;
  dataId?: string;
  type?: number;
  longitude: number;
  latitude: number;
  altitude?: number;
  addTime?: Date;
  kilometerMark?: Date;

  opcMarkName?: string;
  opcMarkTypeName?: string;
  opcMarkKilometerMark?: string;
}

export interface ContainsLocationData {
  id: string;
  name: string;
  locations: Location[];
}

export class LocationConstant {
  // type字段
  public readonly OPC = 1;
  public readonly OPC_MARK = 2;
  public readonly CONSTRUCTION_CONTROL_PLAN_POINT = 3;
  public readonly RAILWAY_LINE = 4;
  public readonly KILOMETER_MARKS = 5;
}

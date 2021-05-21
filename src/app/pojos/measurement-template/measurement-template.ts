export class MeasurementTemplate {

  public static readonly DEVICE = 0;
  public static readonly STATION = 1;

  id: string;
  deviceTypeId?: string;
  deviceTypeName?: string;
  deviceSubTypeId?: string;
  deviceSubTypeName?: string;
  stationId?: string;
  stationName?: string;
  name: string;
  description: string;
  remark: string;
  repairClass?: number;
  type?: number;

  constructor(
    id: string,
    deviceTypeId: string,
    deviceTypeName: string,
    deviceSubTypeId: string,
    deviceSubTypeName: string,
    stationId: string,
    stationName: string,
    name: string,
    description: string,
    remark: string,
    repairClass: number,
    type: number
  ) {
    this.id = id;
    this.deviceTypeId = deviceTypeId;
    this.deviceTypeName = deviceTypeName;
    this.deviceSubTypeId = deviceSubTypeId;
    this.deviceSubTypeName = deviceSubTypeName;
    this.stationId = stationId;
    this.stationName = stationName;
    this.name = name;
    this.description = description;
    this.remark = remark;
    this.repairClass = repairClass;
    this.type = type;
  }
}

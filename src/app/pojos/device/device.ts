import {Time} from "@angular/common";

export interface Device {
  id: string;
  code: string;
  name: string;

  railwayLineNames?: string;
  stationName?: string;
  workAreaName?: string;
  deviceTypeName?: string;
  deviceSubTypeName?: string;
  addTime?: Time;

  stationId:string;
  deviceTypeIdOrDeviceSubTypeId:string;
  deviceModel:string;
  remark:string;

  deviceTypeId?: string;
  deviceSubTypeId?: string;
}


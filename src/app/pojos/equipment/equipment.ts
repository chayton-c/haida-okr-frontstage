import {ContainsLocationData, Location} from "../location/location";

export class Equipment implements ContainsLocationData {
  id: string;
  imei: string;
  equipmentType: number;
  workshopId: string;
  name: string;
  status: number;
  addTime?: Date;
  updateTime?: Date;
  workshopName?: string;
  using?: boolean = false;
  linkmanPhoneNumber?: string;
  locations: Location[];
  distanceToOpc?: number;
  influenceRadius?: number;

  constructor(id: string, imei: string, equipmentType: number, workshopId: string, name: string, status: number, addTime: Date, updateTime: Date, workshopName: string, locations: Location[]) {
    this.id = id;
    this.imei = imei;
    this.equipmentType = equipmentType;
    this.workshopId = workshopId;
    this.name = name;
    this.status = status;
    this.addTime = addTime;
    this.updateTime = updateTime;
    this.workshopName = workshopName;
    this.locations = locations;
  }

}

export class EquipmentConstant {
  // constructionLevel
  public readonly NORMAL = 0;
  public readonly STOPPED = 1;
  public readonly ERROR = 2;

  // equipmentType
  public readonly SUPERVISOR = 0;
  public readonly MACHINE = 1;
}

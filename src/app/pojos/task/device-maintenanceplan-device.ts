export class DeviceMaintenanceplanDevice {
  /**
   * 数据类型为设备
   */
  public static readonly TYPE_DEVICE = 0;
  /**
   * 数据类型为位置
   */
  public static readonly TYPE_STATION = 1;

  id: string;
  dataType: number;
  deviceId: string;
  measurementTemplateId: string;
  seq: number;
  deviceName: string;
  deviceCode: string;
  measurementTemplateName: string;

  constructor(id: string, dataType: number, deviceId: string, measurementTemplateId: string, seq: number, deviceName: string, deviceCode: string, measurementTemplateName: string) {
    this.id = id;
    this.dataType = dataType;
    this.deviceId = deviceId;
    this.measurementTemplateId = measurementTemplateId;
    this.seq = seq;
    this.deviceName = deviceName;
    this.deviceCode = deviceCode;
    this.measurementTemplateName = measurementTemplateName;
  }
}

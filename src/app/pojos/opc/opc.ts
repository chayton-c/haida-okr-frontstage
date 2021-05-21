import { OpcMark } from './opc-mark';
import { ContainsLocationData, Location } from '../location/location';

export class Opc implements ContainsLocationData {
  public static readonly OPTICAL_CABLE_LINE = 0;
  public static readonly RAILWAY_LINE = 1;

  id: string;
  name: string;
  code?: string;
  opcTypeId: string;
  opcTypeName: string;
  opcMarks?: OpcMark[];
  locations: Location[];
  opcMarkName: string;
  opcMarkId: string;

  constructor(
    id: string,
    name: string,
    code: string,
    opcTypeId: string,
    opcTypeName: string,
    opcMarks: OpcMark[],
    locations: Location[],
    opcMarkName: string,
    opcMarkId: string,
  ) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.opcTypeId = opcTypeId;
    this.opcTypeName = opcTypeName;
    this.opcMarks = opcMarks;
    this.locations = locations;
    this.opcMarkName = opcMarkName;
    this.opcMarkId = opcMarkId;
  }
}

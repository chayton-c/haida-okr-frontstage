export class OpcMarkType {
  id: string;
  name: string;
  color: string;

  constructor(id: string, name: string, color: string) {
    this.id = id;
    this.name = name;
    this.color = color;
  }

  static createOpcMarkTypeMap(opcMarkTypes: OpcMarkType[]): Map<string, OpcMarkType> {
    let opcMarkTypeMap: Map<string, OpcMarkType> = new Map<string, OpcMarkType>();
    opcMarkTypes.forEach(value => opcMarkTypeMap.set(value.id, value))
    return opcMarkTypeMap;
  }
}

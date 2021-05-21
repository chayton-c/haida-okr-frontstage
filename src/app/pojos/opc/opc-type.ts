export class OpcType {
  id: string;
  name: string;
  color: string;

  constructor(id: string, name: string, color: string) {
    this.id = id;
    this.name = name;
    this.color = color;
  }

  static createOpcTypeMap(opcTypes: OpcType[]): Map<string, OpcType> {
    let opcTypeMap: Map<string, OpcType> = new Map<string, OpcType>();
    opcTypes.forEach(value => opcTypeMap.set(value.id, value))
    return opcTypeMap;
  }
}

import { ContainsLocationData, Location } from '../location/location';

export class ConstructionControlPlanPoint implements ContainsLocationData {
  id: string;
  collectType: number;
  name: string;
  radius: number;
  shortestDistance: number;
  seq?: number;
  constructionControlPlanId?: string;
  locations: Location[];

  constructor(id: string, name: string, radius: number, shortestDistance: number, collectType: number, locations: Location[]) {
    this.id = id;
    this.collectType = collectType;
    this.name = name;
    this.radius = radius;
    this.shortestDistance = shortestDistance;
    this.locations = locations;
  }
}

export class ConstructionControlPlanPointConstant {
  // collectType
  public readonly POINT = 0;
  public readonly LINE = 1;
  public readonly AREA = 2;
}

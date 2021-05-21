export class SetPosition {
  id: string;
  railwayLineId?: string;
  stationId?: string;
  xPosition?: string;
  yPosition?: string;
  x?: number;
  y?: number;

  constructor(id: string, railwayLineId: string, stationId: string, xPosition: string, yPosition: string) {
    this.id = id;
    this.railwayLineId = railwayLineId;
    this.stationId = stationId;
    this.xPosition = xPosition;
    this.yPosition = yPosition;
  }
}

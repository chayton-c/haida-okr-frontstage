export interface RailwayLine {
  id: string;
  name: string;
  code: string;
  stationId?: string;
}

/**
 * 既可以是线路，也可以是车站
 */
export class LineNodePojo {
  public static readonly RAILWAY_LINE_TYPE = 0;
  public static readonly STATION_TYPE = 1;

  id: string;
  name: string;
  code: string;
  type: number;
  level?: number;
  expand?: boolean;
  lineNodePojoList?: LineNodePojo[];
  parent?: LineNodePojo;
  selected?: boolean;
  kilometerMark?: number;
  kilometerMarkText?: string;

  constructor(
    id: string,
    name: string,
    code: string,
    type: number,
    level: number,
    expand: boolean,
    lineNodePojoList: LineNodePojo[],
    parent: LineNodePojo,
    selected: boolean,
    kilometerMark: number,
    kilometerMarkText: string,
  ) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.type = type;
    this.level = level;
    this.expand = expand;
    this.lineNodePojoList = lineNodePojoList;
    this.parent = parent;
    this.selected = selected;
    this.kilometerMark = kilometerMark;
    this.kilometerMarkText = kilometerMarkText;
  }
}

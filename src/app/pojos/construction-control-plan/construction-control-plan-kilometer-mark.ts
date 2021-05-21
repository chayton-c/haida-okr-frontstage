export class ConstructionControlPlanKilometerMark {
  id: string;
  constructionControlPlanId: string; // 施工计划id
  railwayLineId?: string; // 线路
  startStationId?: string; // 施工地点起始站
  endStationId?: string; // 施工地点终点站
  downriver?: number; // 行别
  startKilometer?: number; // 起始公里标
  endKilometer?: number; // 结束公里标
  railwayLineName?: string;
  startStationName?: string;
  endStationName?: string;
  addTime?: Date;
  updateTime?: Date;
  startKilometerKilometerPart?: number;
  startKilometerMeterPart?: number;
  endKilometerKilometerPart?: number;
  detailInfo?: string;
  endKilometerMeterPart?: number;


  constructor(id: string, constructionControlPlanId: string) {
    this.id = id;
    this.constructionControlPlanId = constructionControlPlanId;
  }

  public static splitKilometer(constructionControlPlanKilometerMark: ConstructionControlPlanKilometerMark) {
    let startKilometer = constructionControlPlanKilometerMark.startKilometer ? constructionControlPlanKilometerMark.startKilometer : 0;
    constructionControlPlanKilometerMark.startKilometerKilometerPart = Number(Math.floor(startKilometer / 1000).toFixed(0));
    constructionControlPlanKilometerMark.startKilometerMeterPart = Number((startKilometer % 1000).toFixed(0));
    let endKilometer = constructionControlPlanKilometerMark.endKilometer ? constructionControlPlanKilometerMark.endKilometer : 0;
    constructionControlPlanKilometerMark.endKilometerKilometerPart = Number(Math.floor(endKilometer / 1000).toFixed(0));
    constructionControlPlanKilometerMark.endKilometerMeterPart = Number((endKilometer % 1000).toFixed(0));
  }

  public static setKilometer(constructionControlPlanKilometerMark: ConstructionControlPlanKilometerMark) {
    constructionControlPlanKilometerMark.startKilometer = 0;
    constructionControlPlanKilometerMark.endKilometer = 0;
    if (constructionControlPlanKilometerMark.startKilometerKilometerPart) {
      constructionControlPlanKilometerMark.startKilometer += constructionControlPlanKilometerMark.startKilometerKilometerPart * 1000;
    }
    if (constructionControlPlanKilometerMark.startKilometerMeterPart) {
      constructionControlPlanKilometerMark.startKilometer += constructionControlPlanKilometerMark.startKilometerMeterPart;
    }
    if (constructionControlPlanKilometerMark.endKilometerKilometerPart) {
      constructionControlPlanKilometerMark.endKilometer += constructionControlPlanKilometerMark.endKilometerKilometerPart * 1000;
    }
    if (constructionControlPlanKilometerMark.endKilometerMeterPart) {
      constructionControlPlanKilometerMark.endKilometer += constructionControlPlanKilometerMark.endKilometerMeterPart;
    }
  }
}

export class ConstructionControlPlanKilometerMarkConstant {
  public readonly DOWNRIVER = 0; // 下行
  public readonly UPRIVER = 1; // 上行
  public readonly SINGLE_LINE = 2; // 单线
  public readonly UPRIVER_AND_DOWNRIVER = 3; // 上下行
}

export interface ConstructionControlPlanKilometerMarkEditable extends ConstructionControlPlanKilometerMark {
  edit?: boolean
  persistent?: boolean; // 持久状态(已插入到数据库的)
}

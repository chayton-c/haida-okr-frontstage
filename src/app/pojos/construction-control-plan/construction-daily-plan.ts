export class ConstructionDailyPlan {
  id: string;
  constructionControlPlanId: string;
  railwayLineId?: string;
  code: string;
  downriver: number;
  startTime?: Date;
  endTime?: Date;
  startKilometer: number;
  endKilometer: number;
  addTime?: Date;
  updateTime?: Date;
  finishedStatus: number;

  constructionControlPlanCode?: string;
  railwayLineName?: string;
  constructionProjectInfo?: string;
  startKilometerKilometerPart?: number;
  startKilometerMeterPart?: number;
  endKilometerKilometerPart?: number;
  endKilometerMeterPart?: number;
  equipmentCodes?: string;
  constructionLevel?: number;
  warnStatus?: number;

  constructor(
    id: string,
    constructionControlPlanId: string,
    code: string,
    downriver: number,
    startTime: Date,
    endTime: Date,
    startKilometer: number,
    endKilometer: number,
    addTime: Date,
    updateTime: Date,
    finishedStatus: number,
    constructionControlPlanCode: string,
    railwayLineName: string,
    startKilometerKilometerPart: number,
    startKilometerMeterPart: number,
    endKilometerKilometerPart: number,
    endKilometerMeterPart: number,
    warnStatus: number,
  ) {
    this.id = id;
    this.constructionControlPlanId = constructionControlPlanId;
    this.code = code;
    this.downriver = downriver;
    this.startTime = startTime;
    this.endTime = endTime;
    this.startKilometer = startKilometer;
    this.endKilometer = endKilometer;
    this.addTime = addTime;
    this.updateTime = updateTime;
    this.finishedStatus = finishedStatus;
    this.constructionControlPlanCode = constructionControlPlanCode;
    this.railwayLineName = railwayLineName;
    this.startKilometerKilometerPart = startKilometerKilometerPart;
    this.startKilometerMeterPart = startKilometerMeterPart;
    this.endKilometerKilometerPart = endKilometerKilometerPart;
    this.endKilometerMeterPart = endKilometerMeterPart;
    this.warnStatus = warnStatus;
  }
  public static splitKilometer(constructionDailyPlan: ConstructionDailyPlan) {
    let startKilometer = constructionDailyPlan.startKilometer ? constructionDailyPlan.startKilometer : 0;
    constructionDailyPlan.startKilometerKilometerPart = Number(Math.floor(startKilometer / 1000).toFixed(0));
    constructionDailyPlan.startKilometerMeterPart = Number(startKilometer % 1000);
    let endKilometer = constructionDailyPlan.endKilometer ? constructionDailyPlan.endKilometer : 0;
    constructionDailyPlan.endKilometerKilometerPart = Number(Math.floor(endKilometer / 1000).toFixed(0));
    constructionDailyPlan.endKilometerMeterPart = endKilometer % 1000;
  }
  public static setKilometer(constructionDailyPlan: ConstructionDailyPlan) {
    constructionDailyPlan.startKilometer = 0;
    constructionDailyPlan.endKilometer = 0;

    if (constructionDailyPlan.startKilometerMeterPart && constructionDailyPlan.startKilometerMeterPart > 1000)
      constructionDailyPlan.startKilometerMeterPart = 999;
    if (constructionDailyPlan.endKilometerMeterPart && constructionDailyPlan.endKilometerMeterPart > 1000)
      constructionDailyPlan.endKilometerMeterPart = 999;

    if (constructionDailyPlan.startKilometerKilometerPart)
      constructionDailyPlan.startKilometer += constructionDailyPlan.startKilometerKilometerPart * 1000;
    if (constructionDailyPlan.startKilometerMeterPart)
      constructionDailyPlan.startKilometer += constructionDailyPlan.startKilometerMeterPart;
    if (constructionDailyPlan.endKilometerKilometerPart)
      constructionDailyPlan.endKilometer += constructionDailyPlan.endKilometerKilometerPart * 1000;
    if (constructionDailyPlan.endKilometerMeterPart) constructionDailyPlan.endKilometer += constructionDailyPlan.endKilometerMeterPart;
  }
}

export class ConstructionDailyPlanConstant {
  public readonly DOWNRIVER = 0;
  public readonly UPRIVER = 1;
  public readonly SINGLE_LINE = 2; // 单线
  public readonly UPRIVER_AND_DOWNRIVER = 3; // 上下行

  //日计划状态-finishedStatus
  public readonly PENDING_START = 0; //未开始
  public readonly PROCESSING = 1; //进行中
  public readonly CLOSED = 2; //已结束
}

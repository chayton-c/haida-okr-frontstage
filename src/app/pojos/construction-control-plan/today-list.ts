export class TodayList {
  id: string;
  planStatus!: number; // 方案状态
  planType?: number; // 计划类型
  warnStatus: number; // 风险等级
  railwayLineName?: string; // 线路名
  startKilometer?: number; // 起始公里标
  endKilometer?: number; // 结束公里标
  startStationId?: string; // 起始站
  startStationName?: string; // 起始站
  endStationName?: string; // 结束站
  railwayLineStatus?: number; // 行别
  code?: string; // 方案编码
  constructionProjectInfo?: string; // 施工内容
  addTime?: Date; // 录入时间
  startTime?: Date;
  endTime?: Date;
  constructionStep: number; //施工阶段
  processStatus!: number; // 方案流程

  constructor(
    id: string,
    planType: number,
    warnStatus: number,
    railwayLineName: string,
    startKilometer: number,
    endKilometer: number,
    startStationName: string,
    endStationName: string,
    railwayLineStatus: number,
    code: string,
    constructionProjectInfo: string,
    addTime: Date,
    startTime: Date,
    endTime: Date,
    constructionStep: number,
    processStatus: number,
  ) {
    this.id = id;
    this.planType = planType;
    this.warnStatus = warnStatus;
    this.railwayLineName = railwayLineName;
    this.startKilometer = startKilometer;
    this.endKilometer = endKilometer;
    this.startStationName = startStationName;
    this.endStationName = endStationName;
    this.railwayLineStatus = railwayLineStatus;
    this.code = code;
    this.constructionProjectInfo = constructionProjectInfo;
    this.addTime = addTime;
    this.startTime = startTime;
    this.endTime = endTime;
    this.constructionStep = constructionStep;
    this.processStatus = processStatus;
  }
}

export class TodayListConstant {
  // processStatus 方案流程
  public readonly PENDING_SUBMIT = 0; // 待提交
  public readonly PENDING_COUNTERSIGN = 1; // 待会签
  public readonly PENDING_RELEVANCE = 2; // 待关联
  public readonly RELEVANCEED = 3; // 已关联
  public readonly CLOSED = 4; // 已关闭

  // planStatus字段
  public readonly FIRST_DRAFT = 0; // 初稿
  public readonly TECH_COUNTERSIGN = 1; // 技术会签
  public readonly SAFE_COUNTERSIGN = 2; // 安全会签
  public readonly COUNTERSIGNED = 3; // 已会签
  public readonly PENDING_START = 4; // 未开始
  public readonly FORMAL_START = 5; // 已开始(系统自动判断方案开始日期，状态变为已开始)
  public readonly CONSTRUCTING = 6; // 施工中(系统自动判断日计划开始时间，状态变为施工中)
  public readonly SYSTEM_CLOSED = 7; // 系统关闭
  public readonly MANUALLY_CLOSED = 8; // 人工关闭

  // constructionStep字段
  // 待关联
  public readonly STEPARR1: number[] = [this.COUNTERSIGNED];
  // 已开始
  public readonly STEPARR2: number[] = [this.PENDING_START, this.FORMAL_START];
  // 未开始
  public readonly STEPARR3: number[] = [this.CONSTRUCTING];

  // 下拉菜单value
  public readonly STEP1 = 0; // 待关联
  public readonly STEP2 = 1; // 已开始
  public readonly STEP3 = 2; // 未开始

  // planType字段
  public readonly DAILY = 0;
  public readonly CONTROL = 1;

  // warnStatus字段
  public readonly LEVEL1 = 0;
  public readonly LEVEL2 = 1;
  public readonly LEVEL3 = 2;
  public readonly LEVEL4 = 3;
  public readonly LEVEL5 = 4;

  // railwayLineStatus字段 行别
  public readonly UPRIVER = 0;
  public readonly DOWNRIVER = 1;
}

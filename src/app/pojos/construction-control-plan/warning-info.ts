export class WarningInfo {
  id: string;
  constructionControlPlanId: string; // 日计划
  equipmentId: string; // 设备
  warnLevel: number; // 预警等级
  processStatus: number; // 处理状态
  processResult: string; // 处理结果
  warnInfo: string; // 预警信息
  addTime: Date;
  updateTime: Date;
  constructionControlPlanCode: string; // 方案编号
  constructionControlPlanProjectInfo: string; // 施工项目名称
  equipmentImei: string; // 设备编号
  totals: number; // 统计数量

  constructor(
    id: string,
    constructionControlPlanId: string,
    equipmentId: string,
    warnLevel: number,
    processStatus: number,
    processResult: string,
    warnInfo: string,
    addTime: Date,
    updateTime: Date,
    constructionControlPlanCode: string,
    constructionControlPlanProjectInfo: string,
    equipmentImei: string,
    totals: number,
  ) {
    this.id = id;
    this.constructionControlPlanId = constructionControlPlanId;
    this.equipmentId = equipmentId;
    this.warnLevel = warnLevel;
    this.processStatus = processStatus;
    this.processResult = processResult;
    this.warnInfo = warnInfo;
    this.addTime = addTime;
    this.updateTime = updateTime;
    this.constructionControlPlanCode = constructionControlPlanCode;
    this.constructionControlPlanProjectInfo = constructionControlPlanProjectInfo;
    this.equipmentImei = equipmentImei;
    this.totals = totals;
  }
}
export class WarnInfoConstant {
  // warnLevel字段
  public readonly LEVEL1 = 0; // 红
  public readonly LEVEL2 = 1; // 橙
  public readonly LEVEL3 = 2; // 黄
  public readonly LEVEL4 = 3; // 蓝
  public readonly LEVEL5 = 4; // 绿

  // processStatus
  public readonly NOT_PROCESSED = 0;
  public readonly PROCESSING = 1;
  public readonly PROCESSED = 2;
  public readonly CLOSED = 3;
}

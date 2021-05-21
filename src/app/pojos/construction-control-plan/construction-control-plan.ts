import {ConstructionControlPlanKilometerMark} from './construction-control-plan-kilometer-mark';
import {ConstructionControlPlanWorkTime} from './construction-control-plan-work-time';
import { ConstructionFormalPlan } from './construction-formal-plan';

export class ConstructionControlPlan {
  id: string;
  name: string;
  processStatus?: number;
  investigationProgressStatus?: number;
  constructionType?: string;
  constructionStatus?: number;
  signInUserId?: string;
  executeUserId?: string;
  workInfo: string;
  influenceArea: string;
  signInStationId: string;
  code: string;
  constructionFormalPlanCodes?: string;
  approveStatus: number;
  signInStatus?: number;
  warnStatus: number;
  finishStatus: number;
  addTime?: Date;
  updateTime?: Date;
  executorName?: string;
  signInUserName?: string;
  workshopName?: string;
  constructionFormalPlan?: ConstructionFormalPlan;
  constructDepartment?: string;
  constructionDepartmentAndPrincipalName?: string;
  protectiveMeasuresInfo?: string;
  executeOrganizationId?: string;
  executeOrganizationName?: string;
  constructionProjectInfo?: string;
  constructionPeriod?: number;
  signInUserDisplayName?: string;
  executorDisplayName?: string;
  constructionContentAndInfluenceArea?: number;
  constructionLevel?: number;
  startKilometerKilometerPart?: number;
  startKilometerMeterPart?: number;
  endKilometerKilometerPart?: number;
  endKilometerMeterPart?: number;
  hasUploadedCooperativeScheme?: number;
  hasUploadedSafetyProtocol?: number;
  investigationOrganizationId?: string;
  investigationOrganizationName?: string;
  planStatus?: number;
  equipmentBindCount?: number;
  equipmentReleaseCount?: number;
  totals?: number;
  approvalTime?: Date;
  supervisionDepartmentAndPrincipalName?: string; // 监理单位及负责人
  equipmentMonitoringDepartmentAndPrincipalName?: string; // 设备监护单位及负责人
  remarks?: string; // 备注
  starRating?: string; // 星级
  auditDepartment?: string; // 审核处室
  startTime?: Date;
  endTime?: Date;
  workTimeInfo?: string;
  kilometerMarkInfo?: string;
  constructionControlPlanKilometerMarks?: ConstructionControlPlanKilometerMark[];
  constructionControlPlanWorkTimes?: ConstructionControlPlanWorkTime[];


  constructor(id: string, name: string, processStatus: number, investigationProgressStatus: number, constructionType: string, constructionStatus: number, signInUserId: string, executeUserId: string, workInfo: string, influenceArea: string, signInStationId: string, code: string, constructionFormalPlanCodes: string, approveStatus: number, signInStatus: number, warnStatus: number, finishStatus: number, addTime: Date, updateTime: Date, executorName: string, signInUserName: string, workshopName: string, constructionFormalPlan: ConstructionFormalPlan, constructDepartment: string, constructionDepartmentAndPrincipalName: string, protectiveMeasuresInfo: string, executeOrganizationId: string, executeOrganizationName: string, constructionProjectInfo: string, constructionPeriod: number, signInUserDisplayName: string, executorDisplayName: string, constructionContentAndInfluenceArea: number, constructionLevel: number, startKilometerKilometerPart: number, startKilometerMeterPart: number, endKilometerKilometerPart: number, endKilometerMeterPart: number, hasUploadedCooperativeScheme: number, hasUploadedSafetyProtocol: number, investigationOrganizationId: string, investigationOrganizationName: string, planStatus: number, equipmentBindCount: number, equipmentReleaseCount: number, totals: number, approvalTime: Date, supervisionDepartmentAndPrincipalName: string, equipmentMonitoringDepartmentAndPrincipalName: string, remarks: string, starRating: string, auditDepartment: string) {
    this.id = id;
    this.name = name;
    this.processStatus = processStatus;
    this.investigationProgressStatus = investigationProgressStatus;
    this.constructionType = constructionType;
    this.constructionStatus = constructionStatus;
    this.signInUserId = signInUserId;
    this.executeUserId = executeUserId;
    this.workInfo = workInfo;
    this.influenceArea = influenceArea;
    this.signInStationId = signInStationId;
    this.code = code;
    this.constructionFormalPlanCodes = constructionFormalPlanCodes;
    this.approveStatus = approveStatus;
    this.signInStatus = signInStatus;
    this.warnStatus = warnStatus;
    this.finishStatus = finishStatus;
    this.addTime = addTime;
    this.updateTime = updateTime;
    this.executorName = executorName;
    this.signInUserName = signInUserName;
    this.workshopName = workshopName;
    this.constructionFormalPlan = constructionFormalPlan;
    this.constructDepartment = constructDepartment;
    this.constructionDepartmentAndPrincipalName = constructionDepartmentAndPrincipalName;
    this.protectiveMeasuresInfo = protectiveMeasuresInfo;
    this.executeOrganizationId = executeOrganizationId;
    this.executeOrganizationName = executeOrganizationName;
    this.constructionProjectInfo = constructionProjectInfo;
    this.constructionPeriod = constructionPeriod;
    this.signInUserDisplayName = signInUserDisplayName;
    this.executorDisplayName = executorDisplayName;
    this.constructionContentAndInfluenceArea = constructionContentAndInfluenceArea;
    this.constructionLevel = constructionLevel;
    this.startKilometerKilometerPart = startKilometerKilometerPart;
    this.startKilometerMeterPart = startKilometerMeterPart;
    this.endKilometerKilometerPart = endKilometerKilometerPart;
    this.endKilometerMeterPart = endKilometerMeterPart;
    this.hasUploadedCooperativeScheme = hasUploadedCooperativeScheme;
    this.hasUploadedSafetyProtocol = hasUploadedSafetyProtocol;
    this.investigationOrganizationId = investigationOrganizationId;
    this.investigationOrganizationName = investigationOrganizationName;
    this.planStatus = planStatus;
    this.equipmentBindCount = equipmentBindCount;
    this.equipmentReleaseCount = equipmentReleaseCount;
    this.totals = totals;
    this.approvalTime = approvalTime;
    this.supervisionDepartmentAndPrincipalName = supervisionDepartmentAndPrincipalName;
    this.equipmentMonitoringDepartmentAndPrincipalName = equipmentMonitoringDepartmentAndPrincipalName;
    this.remarks = remarks;
    this.starRating = starRating;
    this.auditDepartment = auditDepartment;
  }
}

export class ConstructionControlPlanConstant {
  // planStatus 方案状态
  public readonly FIRST_DRAFT = 0; // 初稿
  public readonly TECH_COUNTERSIGN = 1; // 技术会签
  public readonly SAFE_COUNTERSIGN = 2; // 安全会签
  public readonly COUNTERSIGNED = 3; // 已会签
  public readonly PENDING_START = 4; // 未开始
  public readonly FORMAL_START = 5; // 方案开始(系统自动判断方案开始日期，状态变为已开始)
  public readonly CONSTRUCTING = 6; // 施工中(系统自动判断日计划开始时间，状态变为施工中)
  public readonly SYSTEM_CLOSED = 7; // 系统关闭
  public readonly MANUALLY_CLOSED = 8; // 人工关闭

  // investigationProgressStatus 调查进度
  public readonly INVESTIGATION_NOT_OPENED = 0; // 未开始
  public readonly PENDING_INVESTIGATE = 1; // 待调查（这个状态不存在）
  public readonly INVESTIGATING = 2; // 调查中
  public readonly INVESTIGATED = 3; // 已调查

  // processStatus 流程状态
  public readonly PENDING_SUBMIT = 0; // 待提交
  public readonly PENDING_COUNTERSIGN = 1; // 待会签
  public readonly PENDING_RELEVANCE = 2; // 待关联
  public readonly RELEVANCEED = 3; // 已关联
  public readonly CLOSED = 4; // 已关闭

  // constructionStatus
  public readonly BC_CONSTRUCTION = 0;
  public readonly NORMAL_CONSTRUCTION = 1;
  // constructionLevel
  public readonly LEVEL1 = 0;
  public readonly LEVEL2 = 1;
  public readonly LEVEL3 = 2;
  public readonly TYPEB = 3;
  public readonly TYPEC = 4;

  // warnStatus字段
  public readonly RED = 0;
  public readonly ORANGE = 1;
  public readonly YELLOW = 2;
  public readonly BLUE = 3;
  public readonly GREEN = 4;

  // finishedStatus
  public readonly FINISHED = 1;
  // approveStatus
  public readonly HAS_NOT_APPROVED = 0;
  public readonly APPROVED = 1;
  // signInStatus
  public readonly HAS_NOT_SIGN_IN = 0;
  public readonly SIGN_IN = 1;

  //constructionPeriod 施工周期
  public readonly EVERYDAY = 0;
  public readonly EVERY_OTHER_DAY = 1;
  public readonly DIEBUS_TERTIUS = 2;
}

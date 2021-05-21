export class ConstructionFormalPlan {
  id: string;
  relevanceStatus?: number; // 是否已关联了预计划方案
  constructionControlPlanId?: string; // 关联的预计划方案
  planType?: string;
  planCode?: string;
  railwayLineName?: string;
  downriver?: string;
  constructionProject?: string;
  workTime?: string;
  constructionSite?: string;
  constructionContentAndInfluenceArea?: string;
  constructionMachinery?: string;
  constructDepartment?: string;
  constructionDepartmentAndPrincipalName?: string;
  supervisionDepartmentAndPrincipalName?: string;
  equipmentMonitoringDepartmentAndPrincipalName?: string;
  remarks?: string;
  starRating?: string;
  auditDepartment?: string;
  constructionControlPlanCode?: string; // 预计划编号
  constructionProjectInfo?: string; // 预计划施工项目
  addTime?: Date;

  constructor(
    id: string,
    relevanceStatus: number,
    constructionControlPlanId: string,
    planType: string,
    planCode: string,
    railwayLineName: string,
    downriver: string,
    constructionProject: string,
    workTime: string,
    constructionSite: string,
    constructionContentAndInfluenceArea: string,
    constructionMachinery: string,
    constructDepartment: string,
    constructionDepartmentAndPrincipalName: string,
    supervisionDepartmentAndPrincipalName: string,
    equipmentMonitoringDepartmentAndPrincipalName: string,
    remarks: string,
    starRating: string,
    auditDepartment: string,
    constructionControlPlanCode: string,
    constructionProjectInfo: string,
  ) {
    this.id = id;
    this.relevanceStatus = relevanceStatus;
    this.constructionControlPlanId = constructionControlPlanId;
    this.planType = planType;
    this.planCode = planCode;
    this.railwayLineName = railwayLineName;
    this.downriver = downriver;
    this.constructionProject = constructionProject;
    this.workTime = workTime;
    this.constructionSite = constructionSite;
    this.constructionContentAndInfluenceArea = constructionContentAndInfluenceArea;
    this.constructionMachinery = constructionMachinery;
    this.constructDepartment = constructDepartment;
    this.constructionDepartmentAndPrincipalName = constructionDepartmentAndPrincipalName;
    this.supervisionDepartmentAndPrincipalName = supervisionDepartmentAndPrincipalName;
    this.equipmentMonitoringDepartmentAndPrincipalName = equipmentMonitoringDepartmentAndPrincipalName;
    this.remarks = remarks;
    this.starRating = starRating;
    this.auditDepartment = auditDepartment;
    this.constructionControlPlanCode = constructionControlPlanCode;
    this.constructionProjectInfo = constructionProjectInfo;
  }
}

export class ConstructionFormalPlanConstant {
  public readonly PENDING_RELEVANCING = 0; // 待关联
  public readonly RELEVANCED = 1; // 已关联
}

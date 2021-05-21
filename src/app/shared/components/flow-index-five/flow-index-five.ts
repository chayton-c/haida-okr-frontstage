import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StringUtils } from '../../utils/string-utils';
import { TodayList, TodayListConstant } from '../../../pojos/construction-control-plan/today-list';
import { Organization } from '../../../pojos/organization/organization';
import { WarnInfoConstant, WarningInfo } from '../../../pojos/construction-control-plan/warning-info';
import {
  ConstructionControlPlan,
  ConstructionControlPlanConstant,
} from '../../../pojos/construction-control-plan/construction-control-plan';
import { ConstructionDailyPlan, ConstructionDailyPlanConstant } from '../../../pojos/construction-control-plan/construction-daily-plan';
import { OpcStatistics } from '../../../pojos/opc/opc-statistics';

interface FormParams {
  workshopId?: string;
  stationId?: string;
}
interface IndexPojos {
  //方案审批、关联情况
  notSubmittedTotals: number; // 待提交
  notSurveyingTotals: number; // 待调查
  notUnderReviewTotals: number; // 待审核
  notPendingApprovalTotals: number; // 待批准
  notPendingRelevanceTotals: number; // 待关联

  //预警信息总览
  warningLevel1Totals: number; // 一至四级预警总数
  warningLevel2Totals: number;
  warningLevel3Totals: number;
  warningLevel4Totals: number;

  warningLevel1MonthTotals: number; // 一至四级当月预警总数
  warningLevel2MonthTotals: number;
  warningLevel3MonthTotals: number;
  warningLevel4MonthTotals: number;

  warningLevel1YearTotals: number; // 一至四级当年预警总数
  warningLevel2YearTotals: number;
  warningLevel3YearTotals: number;
  warningLevel4YearTotals: number;

  //安全施工天数
  lastWarningTime: Date;
  nowTime?: Date;
  safetyConstructionDays?: number;
}
interface OperationalProcess {
  step: string;
  level1: number;
  level2: number;
  level3: number;
  level4: number;
  level5: number;
  currentYearTotal: number;
  currentMonthTotal: number;
  lastMonthTotal: number;
}

class ModuleTypeConstant {
  // 模块名称
  public readonly MODULE1 = 0; // 径路测绘
  public readonly MODULE2 = 1; // 方案执行情况
  public readonly MODULE3 = 2; // 方案审批、关联情况
  public readonly MODULE4 = 3; // 日计划情况
  public readonly MODULE5 = 4; // 系统功能总览
  public readonly MODULE6 = 5; // 预警信息总览
  public readonly MODULE7 = 6; // 安全施工天数
}

@Component({
  selector: 'flow-index-five',
  templateUrl: './flow-index-five.html',
  styleUrls: ['./flow-index-five.css'],
})
export class FlowIndexFive implements OnInit {
  organizationValues: string[] = []; // 管辖单位筛选框

  // 定义所有常量
  moduleTypeConstant: ModuleTypeConstant = new ModuleTypeConstant(); // 首页各个模块常量
  todayListConstant: TodayListConstant = new TodayListConstant(); // 当日计划常量
  constructionControlPlanConstant: ConstructionControlPlanConstant = new ConstructionControlPlanConstant(); // 方案常量
  constructionDailyPlanConstant: ConstructionDailyPlanConstant = new ConstructionDailyPlanConstant(); // 日计划常量
  warnInfoConstant: WarnInfoConstant = new WarnInfoConstant(); // 预警信息常量

  // 所有变量
  indexPojos: IndexPojos = {
    // 方案审批、关联情况
    notSubmittedTotals: 0,
    notSurveyingTotals: 0,
    notUnderReviewTotals: 0,
    notPendingApprovalTotals: 0,
    notPendingRelevanceTotals: 0,

    // 预警信息总览
    warningLevel1Totals: 0,
    warningLevel2Totals: 0,
    warningLevel3Totals: 0,
    warningLevel4Totals: 0,
    warningLevel1MonthTotals: 0,
    warningLevel2MonthTotals: 0,
    warningLevel3MonthTotals: 0,
    warningLevel4MonthTotals: 0,
    warningLevel1YearTotals: 0,
    warningLevel2YearTotals: 0,
    warningLevel3YearTotals: 0,
    warningLevel4YearTotals: 0,

    // 安全施工天数
    lastWarningTime: new Date(),
    nowTime: new Date(),
  };

  // 查询条件
  formParams: FormParams = {
    workshopId: '',
    stationId: '',
  };

  todayLists: TodayList[] = [];

  // 查询方法
  queryDataFromServer(event: any) {}

  // 径路测绘情况总览
  opcStatistics: OpcStatistics = {
    opcMileage: 0,
    railwayLineMileage: 0,
  };

  opcMileage: string = '-';
  railwayLineMileage: string = '-';
  loadPathPlotting() {
    this.http.post('/api/backstage/opc/getRailwayLineOrOpcStatistics').subscribe((res) => {
      if (!res.success) return;
      this.opcStatistics = res.opcStatistics;
      this.opcMileage = (Number(this.opcStatistics.opcMileage.toFixed(2)) > 0
        ? (this.opcStatistics.opcMileage / 1000).toFixed(2)
        : '-'
      ).toString();
      this.railwayLineMileage = (Number(this.opcStatistics.railwayLineMileage.toFixed(2)) > 0
        ? this.opcStatistics.railwayLineMileage.toFixed(2)
        : '-'
      ).toString();
    });
  }

  // 方案执行情况总览
  // 加载方案数据
  countControlPlans: ConstructionControlPlan[] = [];
  loadPlanExecuted() {
    const params = {
      workshopId: this.formParams.workshopId,
    };
    this.http.post('/api/backstage/constructionControlPlan/countPlanByWarnStatusAndDate', null, null).subscribe((res) => {
      if (!res.success) return;
      if (StringUtils.arrayEmpty(res.countControlPlans)) return;
      this.countControlPlans = res.countControlPlans;
      this.cdr.detectChanges();
    });
  }

  // 带参链接到方案列表
  linkToPlanList(processStatus: number | null, planStatus: number | null, warnStatus: number | null, totalType: string | null) {
    this.router.navigate(['/construction-control-plan/list'], {
      queryParams: {
        processStatus: processStatus,
        planStatus: planStatus,
        warnStatus: warnStatus,
        totalType: totalType,
      },
    });
  }

  // 方案审批、关联情况总览
  constructionControlPlans: ConstructionControlPlan[] = [];
  loadPlanApproveAndRelevance() {
    this.http.post('/api/backstage/constructionControlPlan/countPlanTotals', null, null).subscribe((res) => {
      if (!res.success) return;
      if (StringUtils.arrayEmpty(res.constructionControlPlans)) return;
      this.constructionControlPlans = res.constructionControlPlans;
      this.cdr.detectChanges();
    });
  }

  //日计划情况总览
  countDailyPlans: ConstructionDailyPlan[] = [];
  loadDailyPlans() {
    const params = {
      workshopId: this.formParams.workshopId,
    };
    this.http.post('/api/backstage/constructionDailyPlan/countDailyPlanByConstructionLevelAndDate', null, null).subscribe((res) => {
      if (!res.success) return;
      if (StringUtils.arrayEmpty(res.countDailyPlans)) return;
      this.countDailyPlans = res.countDailyPlans;
      this.cdr.detectChanges();
    });
  }

  // 带参链接到现场管控列表
  linkToLocalControlList(finishedStatus: number, warnStatus: number | null) {
    this.router.navigate(['/operation-process/locale-control-list'], {
      queryParams: {
        finishedStatus: finishedStatus,
        warnStatus: warnStatus,
      },
    });
  }

  //预警信息总览
  warningStatisticsResult: WarningInfo[] = [];
  loadWarningInfos() {
    this.http.post('/api/backstage/warningInfo/getWarningStatisticsResult', null, null).subscribe((res) => {
      if (!res.success) return;
      this.warningStatisticsResult = res.warningStatisticsResult;
      this.cdr.detectChanges();
    });
  }

  linkToWarningInfoList(processStatus: number | null, warnLevel: number | null, totalType: string | null) {
    this.router.navigate(['/operation-process/warning-information-list'], {
      queryParams: {
        processStatus: processStatus,
        warnLevel: warnLevel,
        totalType: totalType,
      },
    });
  }

  //安全施工天数
  warningInfos: WarningInfo[] = [];
  loadSafetyConstructionDays() {
    const params = {
      workshopId: this.formParams.workshopId,
    };
    this.http.post('/api/backstage/warningInfo/getLastWarningDate', null, null).subscribe((res) => {
      if (!res.success) return;
      if (StringUtils.arrayEmpty(res.warningInfos)) return;
      this.warningInfos = res.warningInfos;
      this.warningInfos.forEach((w) => {
        if (w.addTime == null || '' || undefined) return;
        this.indexPojos.lastWarningTime = w.addTime;
      });
      this.indexPojos.safetyConstructionDays = Math.floor(
        (Date.now() - new Date(this.indexPojos.lastWarningTime).getTime()) / 1000 / 60 / 60 / 24,
      );
      this.cdr.detectChanges();
    });
  }

  //首页各模块icon快捷跳转
  linkToList(modelType: number) {
    switch (modelType) {
      case this.moduleTypeConstant.MODULE1:
        this.router.navigate(['/opc/upload']);
        break;
      case this.moduleTypeConstant.MODULE2:
        this.router.navigate(['/construction-control-plan/list']);
        break;
      case this.moduleTypeConstant.MODULE3:
        this.router.navigate(['/construction-control-plan/list']);
        break;
      case this.moduleTypeConstant.MODULE4:
        this.router.navigate(['/operation-process/date-plan-list']);
        break;
      case this.moduleTypeConstant.MODULE5:
        this.router.navigate(['/dashboard/v1']);
        break;
      case this.moduleTypeConstant.MODULE6:
        this.router.navigate(['/operation-process/warning-information-list']);
        break;
      case this.moduleTypeConstant.MODULE7:
        this.router.navigate(['/operation-process/warning-information-list']);
        break;
      default:
        this.router.navigate(['dashboard/v1']);
        break;
    }
  }

  countByConstructionStep(constructionStep: number): number {
    if (StringUtils.arrayEmpty(this.todayLists)) return 0;
    return this.todayLists.filter((x) => x.constructionStep == constructionStep).length;
  }

  countByWarnStatusAndConstructionStep(warnStatus: number, constructionStep: number): number {
    if (StringUtils.arrayEmpty(this.todayLists)) return 0;
    return this.todayLists.filter((x) => x.warnStatus == warnStatus).filter((x) => x.constructionStep == constructionStep).length;
  }

  constructionControlPlanListPage(
    processStatus: number | undefined,
    planStatus: number | undefined,
    investigationProgressStatus: number | undefined,
  ) {
    this.router.navigate(['/construction-control-plan/list'], {
      queryParams: {
        processStatus: processStatus,
        planStatus: planStatus,
        investigationProgressStatus: investigationProgressStatus,
      },
    });
  }

  constructor(
    public http: _HttpClient,
    public injector: Injector,
    public router: Router,
    public msg: NzMessageService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadPathPlotting();
    this.loadSafetyConstructionDays();
    this.loadPlanApproveAndRelevance();
    this.loadWarningInfos();
    this.loadPlanExecuted();
    this.loadDailyPlans();
    setTimeout(() => this.cdr.detectChanges(), 500);
  }
}

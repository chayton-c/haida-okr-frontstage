import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StringUtils } from '../../utils/string-utils';
import { TodayList, TodayListConstant } from '../../../pojos/construction-control-plan/today-list';
import { Organization } from '../../../pojos/organization/organization';
import { ConstructionDailyPlan } from '../../../pojos/construction-control-plan/construction-daily-plan';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ConstructionControlPlanConstant } from '../../../pojos/construction-control-plan/construction-control-plan';

interface FormParams {
  workshopId?: string;
  railwayLineId?: string;
  warnStatus?: number;
  startTime?: Date;
  endTime?: Date;
  stationId?: string;
  constructionStep?: number;

  pathPlottingWorkshopId?: string; //径路测绘车间
  cooperativePlanWorkshopId?: string; //配合方案车间
  operationalProcessWorkshopId?: string; //作业管控车间

  dailyPlanWorkshopId?: string; //日计划车间
  dailyPlanDate?: Date; //日计划日期
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

@Component({
  selector: 'flow-index-four',
  templateUrl: './flow-index-four.html',
  styleUrls: ['./flow-index-four.css'],
})
export class FlowIndexFour implements OnInit {
  formParams: FormParams = {
    workshopId: '',
    railwayLineId: '',
    stationId: '',
    dailyPlanDate: new Date(),
  };
  todayListConstant: TodayListConstant = new TodayListConstant();
  constructionDailyPlans: TodayList[] = [];

  //车间nz-select
  workshops: Organization[] = [];

  //作业过程管控总览
  operationalProcessList: OperationalProcess[] = [
    {
      step: '已关联方案',
      level1: 0,
      level2: 0,
      level3: 0,
      level4: 0,
      level5: 0,
      currentYearTotal: 0,
      currentMonthTotal: 0,
      lastMonthTotal: 0,
    },
    {
      step: '未开始方案',
      level1: this.countByWarnStatusAndConstructionStep(this.todayListConstant.LEVEL1, this.todayListConstant.STEP2),
      level2: this.countByWarnStatusAndConstructionStep(this.todayListConstant.LEVEL2, this.todayListConstant.STEP2),
      level3: this.countByWarnStatusAndConstructionStep(this.todayListConstant.LEVEL3, this.todayListConstant.STEP2),
      level4: this.countByWarnStatusAndConstructionStep(this.todayListConstant.LEVEL4, this.todayListConstant.STEP2),
      level5: this.countByWarnStatusAndConstructionStep(this.todayListConstant.LEVEL5, this.todayListConstant.STEP2),
      currentYearTotal: 0,
      currentMonthTotal: 0,
      lastMonthTotal: 0,
    },
    {
      step: '已开始方案',
      level1: this.countByWarnStatusAndConstructionStep(this.todayListConstant.LEVEL1, this.todayListConstant.STEP3),
      level2: this.countByWarnStatusAndConstructionStep(this.todayListConstant.LEVEL2, this.todayListConstant.STEP3),
      level3: this.countByWarnStatusAndConstructionStep(this.todayListConstant.LEVEL3, this.todayListConstant.STEP3),
      level4: this.countByWarnStatusAndConstructionStep(this.todayListConstant.LEVEL4, this.todayListConstant.STEP3),
      level5: this.countByWarnStatusAndConstructionStep(this.todayListConstant.LEVEL5, this.todayListConstant.STEP3),
      currentYearTotal: 0,
      currentMonthTotal: 0,
      lastMonthTotal: 0,
    },
  ];

  //配合方案情况总览
  chartInstance: any;
  options = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    series: [
      {
        name: '配合方案',
        type: 'pie',
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8,
        },
        data: [
          { value: 40, name: '待批准' },
          { value: 30, name: '待关联' },
          { value: 20, name: '待审核' },
          { value: 22, name: '待提交' },
          { value: 16, name: '待调查' },
        ],
      },
    ],
  };

  //日计划情况总览
  constructionControlPlanConstant: ConstructionControlPlanConstant = new ConstructionControlPlanConstant();
  constructionDailyPlanList: ConstructionDailyPlan[] = [];
  constructionDailyPlanLoading = false;
  constructionDailyPlanTotal = 1;
  constructionDailyPlanPageSize = 10;
  constructionDailyPlanPageIndex = 1;

  onConstructionDailyPlanQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.constructionDailyPlanPageSize = pageSize;
    this.constructionDailyPlanPageIndex = pageIndex;
    this.loadConstructionDailyPlans();
  }

  loadConstructionDailyPlans(): void {
    this.constructionDailyPlanLoading = true;
    const params = {
      constructionControlPlanId: '28917a03-1a2a-4124-b422-15fab6e8fa04',
    };

    this.http.post('/api/backstage/constructionDailyPlan/getByConstructionControlPlan', null, params).subscribe((res) => {
      this.constructionDailyPlanLoading = false;
      this.constructionDailyPlanList = res.constructionDailyPlans;
      this.constructionDailyPlanTotal = res.page.dataTotal;
    });
  }

  //数据查询
  loadCooperativePlans(): void {
    const params = {
      workshopId: this.formParams.workshopId,
      railwayLineId: this.formParams.railwayLineId,
      warnStatus: this.formParams.warnStatus,
      // startTime: this.formParams.startTime,
      // endTime: this.formParams.endTime,
      stationId: this.formParams.stationId,
      constructionStep: this.formParams.constructionStep,
    };
    this.http.post('/api/backstage/constructionDailyPlan/getList', null, params).subscribe((res) => {
      if (!res.success) return;
      this.constructionDailyPlans = res.controlPlanOrDailyPlans;
      this.workshops = res.workshops;
      this.cdr.detectChanges();
    });
  }

  countByConstructionStep(constructionStep: number): number {
    if (StringUtils.arrayEmpty(this.constructionDailyPlans)) return 0;
    return this.constructionDailyPlans.filter((x) => x.constructionStep == constructionStep).length;
  }

  countByWarnStatusAndConstructionStep(warnStatus: number, constructionStep: number): number {
    if (StringUtils.arrayEmpty(this.constructionDailyPlans)) return 0;
    return this.constructionDailyPlans.filter((x) => x.warnStatus == warnStatus).filter((x) => x.constructionStep == constructionStep)
      .length;
  }

  constructor(
    public http: _HttpClient,
    public injector: Injector,
    public router: Router,
    public msg: NzMessageService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadCooperativePlans();
    this.loadConstructionDailyPlans();
  }

  //配合方案饼图
  onChartInit(e: any) {
    this.chartInstance = e;
  }
}

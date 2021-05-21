import { Component, ElementRef, EventEmitter, Injector, OnDestroy, OnInit, Output } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { NzTreeNodeOptions } from 'ng-zorro-antd/core/tree';
import { Router } from '@angular/router';
import { Organization } from '../../../pojos/organization/organization';
import { TodayList, TodayListConstant } from '../../../pojos/construction-control-plan/today-list';
import { RailwayLine } from '../../../pojos/railway-line/railway-line';
import { StringUtils } from '../../../shared/utils/string-utils';
import { WarnInfoConstant, WarningInfo } from '../../../pojos/construction-control-plan/warning-info';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';

interface FormParams {
  workshopId?: string;
  railwayLineId?: string;
  warnStatus?: number;
  startTime?: Date;
  endTime?: Date;
  stationId?: string;
  constructionStep?: number;
}

@Component({
  selector: 'app-center-screen-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css'],
})
export class CenterScreenScreenComponent implements OnInit, OnDestroy {
  loading = true;
  //滚动当日施工信息
  constructionDailyPlans: TodayList[] = [];
  rawControlPlanOrDailyPlans: TodayList[] = [];

  todayListConstant: TodayListConstant = new TodayListConstant();
  formParams: FormParams = {
    workshopId: '',
    railwayLineId: '',
    stationId: '',
  };

  dataTotal = 1; //左侧查询结果总条数
  constructionTotal = 10; //今日施工总数
  todayPlanTotal = 0; //当日计划总数

  railwayLines: RailwayLine[] = [];
  workshops: Organization[] = [];

  lineSelectTreeNodes: Array<NzTreeNodeOptions> = [];
  workShopSelectedNodes: Organization[] = [];

  warningInfoContext = new WarnInfoConstant();
  warningInfos: WarningInfo[] = []; // 预警信息
  warningInfoTotal = 0; // 预警信息总数

  // harbindongleft = '60.3%';
  // harbindongtop = '52.8%';

  harbindongleft = '59.53%';
  harbindongtop = '55.65%';

  dongmenleft = '59.75%';
  dongmentop = '59.7%';

  xinxiangfangleft = '62.8%';
  xinxiangfangtop = '66.1%';

  chenggaozileft = '65.2%';
  chenggaozitop = '66.1%';

  achengtop = '66.9%';
  achengleft = '66.3%';

  yagoutop = '66.2%';
  yagouleft = '68.5%';

  //定时刷新大屏
  createInterval: any;

  //本来留着做更新条件的，需求有变，暂时留着
  oldConstructionDailyPlanIds: Array<string> = [];
  newConstructionDailyPlanIds: Array<string> = [];
  newRawControlPlanOrDailyPlans: TodayList[] = [];

  //勿删，定时器
  intervalGetConstructionDailyPlans(): void {
    const params = {
      workshopId: this.formParams.workshopId,
      railwayLineId: this.formParams.railwayLineId,
      warnStatus: this.formParams.warnStatus,
      stationId: this.formParams.stationId,
      constructionStep: this.formParams.constructionStep,
    };

    this.http.post('/api/backstage/constructionDailyPlan/getList', null, params).subscribe((res) => {
      if (!res.success) return;
      if (!res.rawControlPlanOrDailyPlans) return;
      this.newRawControlPlanOrDailyPlans = res.rawControlPlanOrDailyPlans;
      this.newRawControlPlanOrDailyPlans.forEach((data) => {
        this.newConstructionDailyPlanIds.push(data.id);
      });
      this.todayPlanTotal = res.rawControlPlanOrDailyPlans.length;
      this.rawControlPlanOrDailyPlans = this.newRawControlPlanOrDailyPlans;
    });
  }

  loadDataFromServer(): void {
    // this.loading = true;
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
      this.loading = false;
      this.dataTotal = res.controlPlanOrDailyPlans.length;
      this.todayPlanTotal = res.rawControlPlanOrDailyPlans.length;
      this.railwayLines = res.railwayLines;
      this.workshops = res.workshops;
      this.constructionDailyPlans = res.controlPlanOrDailyPlans;
      this.rawControlPlanOrDailyPlans = res.rawControlPlanOrDailyPlans;

      this.rawControlPlanOrDailyPlans.forEach((data) => {
        this.oldConstructionDailyPlanIds.push(data.id);
      });

      if (this.rawControlPlanOrDailyPlans.length == 2)
        this.rawControlPlanOrDailyPlans = this.rawControlPlanOrDailyPlans.concat(this.rawControlPlanOrDailyPlans);
    });
  }

  loadWarningInfos(): void {
    this.loading = true;

    this.http.post('/api/backstage/warningInfo/getListToCenterScreen').subscribe((res) => {
      this.loading = false;
      this.warningInfos = res.warningInfos;
      this.warningInfoTotal = res.page.dataTotal;
    });
  }

  loadWarningInfo(): void {
    this.http.post('api/backstage/warningInfo/getList').subscribe((res) => {
      this.warningInfos = res.warningInfos;
      this.warningInfoTotal = res.page.dataTotal;
    });
  }
  getUrlByStationId(stationId: string): string {
    let constructionDailyPlansByStationId = this.constructionDailyPlans.filter((x) => x.startStationId == stationId);
    let warnStatus = 6;
    let constructionStep = -1;
    // 取warnStatus最低且constructionStep最高的
    for (let i = 0; i < constructionDailyPlansByStationId.length; i++) {
      let constructionDailyPlan = constructionDailyPlansByStationId[i];
      let iterativeWarnStatus = constructionDailyPlan.warnStatus;
      let iterativeConstructionStep = constructionDailyPlan.constructionStep;
      warnStatus = iterativeWarnStatus > warnStatus ? warnStatus : iterativeWarnStatus;
      constructionStep = iterativeConstructionStep > constructionStep ? iterativeConstructionStep : constructionStep;
    }
    return this.getImgUrlWarnStatusAndConstructionStep(warnStatus, constructionStep);
  }

  countByWarnStatusAndConstructionStep(warnStatus: number, constructionStep: number): number {
    if (StringUtils.arrayEmpty(this.constructionDailyPlans)) return 0;
    return this.constructionDailyPlans.filter((x) => x.warnStatus == warnStatus).filter((x) => x.constructionStep == constructionStep)
      .length;
  }

  countByConstructionStep(constructionStep: number): number {
    if (StringUtils.arrayEmpty(this.constructionDailyPlans)) return 0;
    return this.constructionDailyPlans.filter((x) => x.constructionStep == constructionStep).length;
  }

  getImgUrlWarnStatusAndConstructionStep(warnStatus: number, constructionStep: number): string {
    //待关联
    if (constructionStep == this.todayListConstant.STEP1 && warnStatus == this.todayListConstant.LEVEL1)
      return '/assets/opcimg/status-imgs/0-0.png';

    if (constructionStep == this.todayListConstant.STEP1 && warnStatus == this.todayListConstant.LEVEL2)
      return '/assets/opcimg/status-imgs/0-1.png';

    if (constructionStep == this.todayListConstant.STEP1 && warnStatus == this.todayListConstant.LEVEL3)
      return '/assets/opcimg/status-imgs/0-2.png';

    if (constructionStep == this.todayListConstant.STEP1 && warnStatus == this.todayListConstant.LEVEL4)
      return '/assets/opcimg/status-imgs/0-3.png';

    if (constructionStep == this.todayListConstant.STEP1 && warnStatus == this.todayListConstant.LEVEL5)
      return '/assets/opcimg/status-imgs/0-4.png';

    //未开始
    if (constructionStep == this.todayListConstant.STEP2 && warnStatus == this.todayListConstant.LEVEL1)
      return '/assets/opcimg/status-imgs/1-0.png';

    if (constructionStep == this.todayListConstant.STEP2 && warnStatus == this.todayListConstant.LEVEL2)
      return '/assets/opcimg/status-imgs/1-1.png';

    if (constructionStep == this.todayListConstant.STEP2 && warnStatus == this.todayListConstant.LEVEL3)
      return '/assets/opcimg/status-imgs/1-2.png';

    if (constructionStep == this.todayListConstant.STEP2 && warnStatus == this.todayListConstant.LEVEL4)
      return '/assets/opcimg/status-imgs/1-3.png';

    if (constructionStep == this.todayListConstant.STEP2 && warnStatus == this.todayListConstant.LEVEL5)
      return '/assets/opcimg/status-imgs/1-4.png';

    //已开始
    if (constructionStep == this.todayListConstant.STEP3 && warnStatus == this.todayListConstant.LEVEL1)
      return '/assets/opcimg/status-imgs/2-0.png';

    if (constructionStep == this.todayListConstant.STEP3 && warnStatus == this.todayListConstant.LEVEL2)
      return '/assets/opcimg/status-imgs/2-1.png';

    if (constructionStep == this.todayListConstant.STEP3 && warnStatus == this.todayListConstant.LEVEL3)
      return '/assets/opcimg/status-imgs/2-2.png';

    if (constructionStep == this.todayListConstant.STEP3 && warnStatus == this.todayListConstant.LEVEL4)
      return '/assets/opcimg/status-imgs/2-3.png';

    if (constructionStep == this.todayListConstant.STEP3 && warnStatus == this.todayListConstant.LEVEL5)
      return '/assets/opcimg/status-imgs/2-4.png';

    return '';
  }

  loadWorkShopSelectTrees() {
    this.http.post('/api/backstage/organization/getWorkshops').subscribe((res) => {
      this.workShopSelectedNodes = res.workshops;
    });
  }

  loadLineSelectTrees(): void {
    this.http.post('/api/backstage/line/initSelectTrees').subscribe((res) => {
      this.lineSelectTreeNodes = res.lineSelectTreeNodes;
      this.lineSelectTreeNodes.forEach((value) => (value.disabled = true));
    });
  }

  goToWarningInfoList(): void {
    this.router.navigate(['/operation-process/warning-information-list']);
  }

  clickHarbinDongQiPao(): void {
    this.router.navigate(['/construction-control-plan/preview'], {
      queryParams: { constructionControlPlanId: 'f576c979-c8d0-4b01-a0fc-63d719617656' },
    });
  }

  clickXinXiangFang(): void {
    this.router.navigate(['/construction-control-plan/preview'], {
      queryParams: { constructionControlPlanId: '27f3cc4d-b092-426c-b999-c3b0e175a48d' },
    });
  }

  constructor(private a: ElementRef, private http: _HttpClient, public router: Router, private titleService: TitleService) {}

  ngOnInit() {
    this.titleService.setTitle('中心大屏');
    this.loadDataFromServer();
    this.loadWorkShopSelectTrees();
    this.loadLineSelectTrees();
    this.loadWarningInfos();
    // this.createInterval = setInterval(() => {
    //   this.intervalGetConstructionDailyPlans();
    // }, 10000);
  }

  closeAndRefresh() {
    this.showPlanTodayList = false;
  }

  // 施工计划详情模态框部分
  showPlanTodayList = false;
  stationId?: string;

  showPlanTodayListModal(stationId: string) {
    this.stationId = stationId;
    this.showPlanTodayList = true;
  }

  ngOnDestroy(): void {
    if (this.router.url != '/center-screen/screen') {
      clearInterval(this.createInterval);
    }
  }
}

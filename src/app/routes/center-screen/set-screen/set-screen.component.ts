import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { _HttpClient, SettingsService, TitleService } from '@delon/theme';
import { NzTreeNodeOptions } from 'ng-zorro-antd/core/tree';
import { Router } from '@angular/router';
import { Organization } from '../../../pojos/organization/organization';
import { TodayList, TodayListConstant } from '../../../pojos/construction-control-plan/today-list';
import { RailwayLine } from '../../../pojos/railway-line/railway-line';
import { StringUtils } from '../../../shared/utils/string-utils';
import { WarnInfoConstant, WarningInfo } from '../../../pojos/construction-control-plan/warning-info';
import { CookieService } from 'ngx-cookie-service';
import { WebSocketConstant } from '../../../pojos/common/constant';
import { SetPosition } from '../../../pojos/center-screen/set-position';
import { webSocket } from 'rxjs/webSocket';

interface FormParams {
  workshopId?: string;
  railwayLineId?: string;
  warnStatus?: string;
  startTime?: Date;
  endTime?: Date;
  stationId?: string;
  constructionStep?: string;
}

@Component({
  selector: 'app-center-screen-set-screen',
  templateUrl: './set-screen.component.html',
  styleUrls: ['./set-screen.component.css'],
  styles: [
    `
      .blinking {
        animation: opacity 2s ease-in-out infinite;
        opacity: 1;
      }

      @keyframes opacity {
        0% {
          opacity: 1;
        }

        100% {
          opacity: 0;
        }
      }
    `,
  ],
})
export class CenterScreenSetScreenComponent implements OnInit, OnDestroy {
  webSocketConstant: WebSocketConstant = new WebSocketConstant();
  baseImageUrl = '';
  loading = true;
  //滚动当日施工信息
  constructionDailyPlans: TodayList[] = [];
  rawControlPlanOrDailyPlans: TodayList[] = [];
  centerScreenElementPositions: SetPosition[] = [];

  todayListConstant: TodayListConstant = new TodayListConstant();
  formParams: FormParams = {
    workshopId: '',
    railwayLineId: '',
    stationId: '',
  };

  dataTotal = 0; //左侧查询结果总条数
  constructionTotal = 10; //今日施工总数
  todayPlanTotal = 0; //当日计划总数

  railwayLines: RailwayLine[] = [];
  workshops: Organization[] = [];

  lineSelectTreeNodes: Array<NzTreeNodeOptions> = [];
  workShopSelectedNodes: Organization[] = [];

  warningInfoContext = new WarnInfoConstant();
  warningInfos: WarningInfo[] = []; // 预警信息
  warningInfoTotal = 0; // 预警信息总数

  //测试图标点位置，暂时不删
  achengtop = '66.2%';
  achengleft = '67%';

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
      warnStatusStr: this.formParams.warnStatus,
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
    const params = {
      workshopId: this.formParams.workshopId,
      railwayLineId: this.formParams.railwayLineId,
      warnStatusStr: this.formParams.warnStatus,
      stationId: this.formParams.stationId,
      constructionStep: this.formParams.constructionStep,
    };

    this.http.post('/api/backstage/constructionDailyPlan/getList', null, params).subscribe((res) => {
      if (!res.success) return;
      if (!StringUtils.arrayEmpty(res.controlPlanOrDailyPlans)) this.dataTotal = res.controlPlanOrDailyPlans.length;
      this.todayPlanTotal = res.rawControlPlanOrDailyPlans.length;
      this.railwayLines = res.railwayLines;
      this.workshops = res.workshops;
      this.constructionDailyPlans = res.controlPlanOrDailyPlans;
      this.rawControlPlanOrDailyPlans = res.rawControlPlanOrDailyPlans;
      this.centerScreenElementPositions = res.centerScreenElementPositions;
      this.formParams.workshopId = res.workshopId;

      this.setCookieContent();
      this.getBaseImageUrlByWorkshopId(this.formParams.workshopId);

      this.centerScreenElementPositions.forEach((x) => {
        x.x = Number(x.xPosition);
        x.y = Number(x.yPosition);
      });

      this.rawControlPlanOrDailyPlans.forEach((data) => {
        this.oldConstructionDailyPlanIds.push(data.id);
      });

      if (this.rawControlPlanOrDailyPlans.length == 2)
        this.rawControlPlanOrDailyPlans = this.rawControlPlanOrDailyPlans.concat(this.rawControlPlanOrDailyPlans);
    });
  }

  loadWarningInfos(): void {
    this.http.post('/api/backstage/warningInfo/getListToCenterScreen').subscribe((res) => {
      if (!res.success) return;
      if (!StringUtils.arrayEmpty(res.warningInfos)) this.warningInfoTotal = res.warningInfos.length;
      this.warningInfos = res.warningInfos;

      // 为解决nz-carousel只有两条时倒退播放问题
      if (this.warningInfos.length == 2) this.warningInfos = this.warningInfos.concat(this.warningInfos);
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
      let iterativeConstructionStep = constructionDailyPlan.planStatus;
      warnStatus = iterativeWarnStatus > warnStatus ? warnStatus : iterativeWarnStatus;
      constructionStep = iterativeConstructionStep > constructionStep ? iterativeConstructionStep : constructionStep;
    }
    return this.getImgUrlWarnStatusAndConstructionStep(warnStatus, constructionStep);
  }

  getBaseImageUrlByWorkshopId(workshopId: any) {
    this.setCookieContent();
    /**
     * 哈车车间：b3655b37-521a-4ff3-aa6c-ec9d3801dbdf
     * 阿城车间：6dd6f041-c201-4e29-9147-d4d3084f9d5d
     * 哈信号车间：716f90c2-62fd-4f93-853d-102e71187d18
     * 呼兰车间：66807502-bb31-4629-a673-333245866b3a
     * 双城车间：5ae63a58-b61f-467e-a3da-b6e79a9863f2
     */
    const workshopIds = {
      hache: 'b3655b37-521a-4ff3-aa6c-ec9d3801dbdf',
      acheng: '6dd6f041-c201-4e29-9147-d4d3084f9d5d',
      haxinhao: '716f90c2-62fd-4f93-853d-102e71187d18',
      hulan: '66807502-bb31-4629-a673-333245866b3a',
      shuangcheng: '5ae63a58-b61f-467e-a3da-b6e79a9863f2',
    };

    // 换车间底图
    if (workshopId === undefined || '') this.baseImageUrl = '/assets/opcimg/map-imgs/basemap.png';

    if (this.cookieService.get('workshopId') === '') this.baseImageUrl = '/assets/opcimg/map-imgs/basemap.png';

    if (String(workshopId) == workshopIds.hache && this.cookieService.get('workshopId') == workshopIds.hache)
      this.baseImageUrl = '/assets/opcimg/map-imgs/basemap.png';

    if (String(workshopId) == workshopIds.acheng && this.cookieService.get('workshopId') == workshopIds.acheng)
      this.baseImageUrl = '/assets/opcimg/map-imgs/achengmap.png';

    if (String(workshopId) == workshopIds.haxinhao && this.cookieService.get('workshopId') == workshopIds.haxinhao)
      this.baseImageUrl = '/assets/opcimg/map-imgs/basemap.png';

    if (String(workshopId) == workshopIds.hulan && this.cookieService.get('workshopId') == workshopIds.hulan)
      this.baseImageUrl = '/assets/opcimg/map-imgs/basemap.png';

    if (String(workshopId) == workshopIds.shuangcheng && this.cookieService.get('workshopId') == workshopIds.shuangcheng) {
      this.baseImageUrl = '/assets/opcimg/map-imgs/basemap.png';
    } else {
      this.baseImageUrl = '/assets/opcimg/map-imgs/basemap.png';
    }

    this.cdr.detectChanges();
  }

  projectionScreen() {
    window.open(`/#/${this.router.url}`, '_blank');
  }

  /**
   * 根据方案阶段、风险等级统计方案数量
   * @param warnStatus
   * @param planStatus
   */
  countByWarnStatusAndConstructionStep(warnStatus: number, planStatus: number[], processStatus: number): number {
    if (StringUtils.arrayEmpty(this.constructionDailyPlans)) return 0;
    return this.constructionDailyPlans
      .filter((x) => x.warnStatus == warnStatus)
      .filter((x) => x.processStatus == processStatus)
      .filter((x) => planStatus.indexOf(x.planStatus) > -1).length;
  }

  /**
   * 根据方案阶段统计方案数量
   * @param planStatus
   */
  countByConstructionStep(planStatus: number[], processStatus: number): number {
    if (StringUtils.arrayEmpty(this.constructionDailyPlans)) return 0;
    return this.constructionDailyPlans.filter((x) => x.processStatus == processStatus).filter((x) => planStatus.indexOf(x.planStatus) > -1)
      .length;
  }

  /**
   * 根据风险等级和方案阶段获取水滴图标URL
   * @param warnStatus
   * @param constructionStep
   */
  getImgUrlWarnStatusAndConstructionStep(warnStatus: number, constructionStep: number): string {
    // 待关联
    if (this.todayListConstant.STEPARR1.indexOf(constructionStep) > -1 && warnStatus == this.todayListConstant.LEVEL1)
      return '/assets/opcimg/status-imgs/0-0.png';

    if (this.todayListConstant.STEPARR1.indexOf(constructionStep) > -1 && warnStatus == this.todayListConstant.LEVEL2)
      return '/assets/opcimg/status-imgs/0-1.png';

    if (this.todayListConstant.STEPARR1.indexOf(constructionStep) > -1 && warnStatus == this.todayListConstant.LEVEL3)
      return '/assets/opcimg/status-imgs/0-2.png';

    if (this.todayListConstant.STEPARR1.indexOf(constructionStep) > -1 && warnStatus == this.todayListConstant.LEVEL4)
      return '/assets/opcimg/status-imgs/0-3.png';

    if (this.todayListConstant.STEPARR1.indexOf(constructionStep) > -1 && warnStatus == this.todayListConstant.LEVEL5)
      return '/assets/opcimg/status-imgs/0-4.png';

    // 未开始
    if (this.todayListConstant.STEPARR2.indexOf(constructionStep) > -1 && warnStatus == this.todayListConstant.LEVEL1)
      return '/assets/opcimg/status-imgs/1-0.png';

    if (this.todayListConstant.STEPARR2.indexOf(constructionStep) > -1 && warnStatus == this.todayListConstant.LEVEL2)
      return '/assets/opcimg/status-imgs/1-1.png';

    if (this.todayListConstant.STEPARR2.indexOf(constructionStep) > -1 && warnStatus == this.todayListConstant.LEVEL3)
      return '/assets/opcimg/status-imgs/1-2.png';

    if (this.todayListConstant.STEPARR2.indexOf(constructionStep) > -1 && warnStatus == this.todayListConstant.LEVEL4)
      return '/assets/opcimg/status-imgs/1-3.png';

    if (this.todayListConstant.STEPARR2.indexOf(constructionStep) > -1 && warnStatus == this.todayListConstant.LEVEL5)
      return '/assets/opcimg/status-imgs/1-4.png';

    // 施工中
    if (this.todayListConstant.STEPARR3.indexOf(constructionStep) > -1 && warnStatus == this.todayListConstant.LEVEL1)
      return '/assets/opcimg/status-imgs/2-0.png';

    if (this.todayListConstant.STEPARR3.indexOf(constructionStep) > -1 && warnStatus == this.todayListConstant.LEVEL2)
      return '/assets/opcimg/status-imgs/2-1.png';

    if (this.todayListConstant.STEPARR3.indexOf(constructionStep) > -1 && warnStatus == this.todayListConstant.LEVEL3)
      return '/assets/opcimg/status-imgs/2-2.png';

    if (this.todayListConstant.STEPARR3.indexOf(constructionStep) > -1 && warnStatus == this.todayListConstant.LEVEL4)
      return '/assets/opcimg/status-imgs/2-3.png';

    if (this.todayListConstant.STEPARR3.indexOf(constructionStep) > -1 && warnStatus == this.todayListConstant.LEVEL5)
      return '/assets/opcimg/status-imgs/2-4.png';

    return '';
  }

  /**
   * 加载车间下拉树
   */
  loadWorkShopSelectTrees() {
    this.http.post('/api/backstage/organization/getWorkshops').subscribe((res) => {
      this.workShopSelectedNodes = res.workshops;
    });
  }

  /**
   * 加载线路下拉树
   */
  loadLineSelectTrees(): void {
    this.http.post('/api/backstage/line/initSelectTrees').subscribe((res) => {
      this.lineSelectTreeNodes = res.lineSelectTreeNodes;
      this.lineSelectTreeNodes.forEach((value) => (value.disabled = true));
    });
  }

  /**
   * 跳转到预警信息管理
   */
  goToWarningInfoList(): void {
    this.router.navigate(['/operation-process/warning-information-list']);
  }

  /**
   * 设置Cookie
   */
  setCookieContent() {
    let constructionStep = this.formParams.constructionStep;
    if (constructionStep != null) this.cookieService.set('constructionStep', constructionStep, 30);

    let warnStatus = this.formParams.warnStatus;
    if (warnStatus != null) this.cookieService.set('warnStatus', warnStatus, 30);

    let railwayLineId = this.formParams.railwayLineId;
    if (railwayLineId != null) this.cookieService.set('railwayLineId', railwayLineId, 30);

    let workshopId = this.formParams.workshopId;
    // 校验cookie中保存的车间是否在用户权限范围内
    if (workshopId != null && this.workshops.filter((x) => x.id === workshopId).length > 0)
      this.cookieService.set('workshopId', workshopId, 30);
    if (workshopId === '') this.cookieService.set('workshopId', workshopId, 30);
  }

  /**
   * 页面初始化，获取cookie中查询条件用于回显
   */
  setFormParamsFromCookie() {
    this.formParams.constructionStep = this.cookieService.get('constructionStep');
    this.formParams.warnStatus = this.cookieService.get('warnStatus');
    this.formParams.workshopId = this.cookieService.get('workshopId');
    this.formParams.railwayLineId = this.cookieService.get('railwayLineId');
  }

  /**
   * 设置图标闪烁并伴提示音
   */
  blinkStationId = '';
  @ViewChild('videoPlayer') videoplayer!: ElementRef;
  toggleGlintImg(wsMsg: any): void {
    if (wsMsg) {
      if (wsMsg === 'refresh') {
        this.loadDataFromServer();
      } else {
        this.videoplayer.nativeElement.play();
        this.blinkStationId = wsMsg;
      }
    }
  }

  private warningInfoWebSocket: any;
  private constructionDailyPlanWebSocket: any;
  constructor(
    private a: ElementRef,
    private cdr: ChangeDetectorRef,
    private http: _HttpClient,
    public router: Router,
    private titleService: TitleService,
    private cookieService: CookieService,
    private settingService: SettingsService,
  ) {
    this.warningInfoWebSocket = webSocket(`ws://${window.location.host}/api/warningInfoWebSocket`);
    this.constructionDailyPlanWebSocket = webSocket(`ws://${window.location.host}/api/constructionDailyPlanWebSocket`);

    this.warningInfoWebSocket.subscribe(
      (msg: any) => {
        this.toggleGlintImg(msg);
      },
      (err: any) => console.log(err),
      () => console.log('complete'),
    );
    this.constructionDailyPlanWebSocket.subscribe(
      (msg: any) => {
        this.toggleGlintImg(msg);
      },
      (err: any) => console.log(err),
      () => console.log('complete'),
    );
  }

  ngOnInit() {
    this.titleService.setTitle('中心大屏');
    this.setFormParamsFromCookie();
    this.loadDataFromServer();
    this.loadWarningInfos();
  }

  closeAndRefresh() {
    this.showPlanTodayList = false;
  }

  // 施工计划详情模态框部分
  showPlanTodayList = false;
  stationId?: string;
  parentPageFormParams: FormParams = {
    workshopId: this.formParams.workshopId,
    railwayLineId: this.formParams.railwayLineId,
    warnStatus: this.formParams.warnStatus,
  };

  showPlanTodayListModal(stationId: string) {
    this.stationId = stationId;
    this.showPlanTodayList = true;
  }

  ngOnDestroy(): void {
    if (this.router.url != '/center-screen/set-screen') {
      this.warningInfoWebSocket.unsubscribe();
      this.constructionDailyPlanWebSocket.unsubscribe();
    }
  }
}

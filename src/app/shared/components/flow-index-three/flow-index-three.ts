import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StringUtils } from '../../utils/string-utils';
import { TodayList, TodayListConstant } from '../../../pojos/construction-control-plan/today-list';
import { Organization } from '../../../pojos/organization/organization';

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
  selector: 'flow-index-three',
  templateUrl: './flow-index-three.html',
  styleUrls: ['./flow-index-three.css'],
})
export class FlowIndexThree implements OnInit {
  formParams: FormParams = {
    workshopId: '',
    railwayLineId: '',
    stationId: '',
  };
  todayListConstant: TodayListConstant = new TodayListConstant();
  constructionDailyPlans: TodayList[] = [];
  workshops: Organization[] = [];

  loadDataFromServer(): void {
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
    this.loadDataFromServer();
  }
}

import {ChangeDetectorRef, Component, Input, NgZone, OnInit, Renderer2, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { NzTreeNodeOptions } from 'ng-zorro-antd/core/tree';
import {
  ConstructionControlPlan,
  ConstructionControlPlanConstant,
} from '../../../../pojos/construction-control-plan/construction-control-plan';
import {ConstructionControlPlanKilometerMark} from '../../../../pojos/construction-control-plan/construction-control-plan-kilometer-mark';
import { Station } from '../../../../pojos/station/station';
import { User } from '../../../../pojos/user/user';
import { Organization } from '../../../../pojos/organization/organization';
import { HttpUtils } from '../../../utils/http-utils';
import { RailwayLine } from '../../../../pojos/railway-line/railway-line';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import {ConstructionDailyPlan, ConstructionDailyPlanConstant} from '../../../../pojos/construction-control-plan/construction-daily-plan';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import {UtilComponent} from "../../../../routes/delon/util/util.component";

@Component({
  selector: 'construction-daily-plan-detail',
  templateUrl: './construction-daily-plan-detail.html',
})
export class ConstructionDailyPlanDetail {
  @Input() constructionDailyPlanId?: string | undefined;
  @Input() constructionControlPlanId?: string;

  constructionDailyPlanConstant: ConstructionDailyPlanConstant = new ConstructionDailyPlanConstant();
  constructionDailyPlan: ConstructionDailyPlan = {
    finishedStatus: this.constructionDailyPlanConstant.PENDING_START,
    endKilometer: 0, startKilometer: 0,
    id: UtilComponent.uuid(),
    code: '',
    constructionControlPlanId: '',
    downriver: 0
  };
  constructionControlPlanKilometerMarks: ConstructionControlPlanKilometerMark[] = [];
  checkedConstructionControlPlanKilometerMark?: ConstructionControlPlanKilometerMark;
  constructionControlPlan: ConstructionControlPlan = {
    approveStatus: 0,
    code: '',
    finishStatus: 0,
    id: '',
    influenceArea: '',
    name: '',
    signInStationId: '',
    warnStatus: 0,
    workInfo: ''
  };
  constructionConstrolPlanConstant: ConstructionControlPlanConstant = new ConstructionControlPlanConstant();
  loading = false;

  // 提交日计划信息
  execute(next?: (res: any) => void) {
    if (this.constructionControlPlanId) this.constructionDailyPlan.constructionControlPlanId = this.constructionControlPlanId;
    this.http
      .post('/api/backstage/constructionDailyPlan/saveOrUpdate', null, HttpUtils.transform(this.constructionDailyPlan))
      .subscribe((res) => {
        if (!res.success) return;
        if (next) next(res);
      });
  }

  loadDataFromServer(): void {
    const params = {
      constructionControlPlanId: this.constructionControlPlanId,
      constructionDailyPlanId: this.constructionDailyPlanId,
    };

    this.http.post('/api/backstage/constructionDailyPlan/info', null, params).subscribe((res) => {
      this.constructionControlPlan = res.constructionControlPlan;
      if (res.constructionDailyPlan) {
        this.constructionDailyPlan = res.constructionDailyPlan;
        ConstructionDailyPlan.splitKilometer(this.constructionDailyPlan);
        this.constructionControlPlanKilometerMarks = res.constructionControlPlanKilometerMarks;
      }
      this.loading = false;
    });
  }

  setKilometer() {
    ConstructionDailyPlan.setKilometer(this.constructionDailyPlan);
    console.log(this.constructionDailyPlan.startKilometerMeterPart);
    console.log(this.constructionDailyPlan.endKilometerMeterPart);
    this.cdr.detectChanges();
  }

  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

  checkDisabledEndDate = (current: Date): boolean => {
    let startTime = this.constructionDailyPlan.startTime;
    if (!startTime) return true;
    if (typeof startTime.toString() == 'string') startTime = this.constructionDailyPlan.startTime = new Date(startTime);
    if (current.getFullYear() != startTime.getFullYear()) return true;
    if (current.getMonth() != startTime.getMonth()) return true;
    if (current.getDate() != startTime.getDate()) return true;
    return false;
  };

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endDatePicker.open();
    }
  }
  handleEndOpenChange(): void {
    if (this.constructionDailyPlan.startTime == null || undefined) this.msg.error('请先选择开始时间');
  }
  changeConstructionControlPlanKilometerMark(): void {
    if (this.checkedConstructionControlPlanKilometerMark) {
      this.constructionDailyPlan.railwayLineId = this.checkedConstructionControlPlanKilometerMark.railwayLineId;
      this.constructionDailyPlan.downriver = this.checkedConstructionControlPlanKilometerMark.downriver!;
    }
  }

  clearEndTime() {
    this.constructionDailyPlan.endTime = undefined;
  }

  constructor(
    public http: _HttpClient,
    private activatedRoute: ActivatedRoute,
    private msg: NzMessageService,
    private router: Router,
    private renderer: Renderer2,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadDataFromServer();
  }
}

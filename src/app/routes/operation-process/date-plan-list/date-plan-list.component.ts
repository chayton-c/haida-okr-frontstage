import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper, TitleService } from '@delon/theme';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  ConstructionControlPlan,
  ConstructionControlPlanConstant,
} from '../../../pojos/construction-control-plan/construction-control-plan';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { ConstructionDailyPlan, ConstructionDailyPlanConstant } from '../../../pojos/construction-control-plan/construction-daily-plan';
import { valid } from 'mockjs';
import { OnReuseInit, ReuseHookOnReuseInitType } from '@delon/abc/reuse-tab';
import { StringUtils } from '../../../shared/utils/string-utils';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { DomEvent } from 'leaflet';
import stopPropagation = DomEvent.stopPropagation;
import { DateUtils } from '../../../shared/utils/date-utils';

interface DailyFormParams {
  finishedStatus: string;
}
@Component({
  selector: 'app-operation-process-date-plan-list',
  templateUrl: './date-plan-list.component.html',
  styleUrls: ['../../construction-coordinate-plan/list.component.less'],
})
export class OperationProcessDatePlanListComponent implements OnInit, OnReuseInit {
  constructor(
    public http: _HttpClient,
    public injector: Injector,
    public router: Router,
    public msg: NzMessageService,
    public activatedRoute: ActivatedRoute,
    private modal: ModalHelper,
    private cdr: ChangeDetectorRef,
    private titleService: TitleService,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('日计划提交');

    // 根据路由带参设置查询条件
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.processStatus) {
        this.constructionControlPlanFormParams.processStatus = Number(queryParams.processStatus);
      }
      if (queryParams.planStatus) {
        this.constructionControlPlanFormParams.planStatus = Number(queryParams.planStatus);
      }
      if (queryParams.finishedStatus) {
        this.constructionDailyPlanFormParams.finishedStatus = queryParams.finishedStatus;
      }
      if (queryParams.warnStatus) {
        this.constructionControlPlanFormParams.warnStatus = queryParams.warnStatus;
      }
      if (queryParams.totalType) {
        if (queryParams.totalType == 'nowYear') {
          this.constructionControlPlanFormParams.startTime = DateUtils.getNowYear();
        } else if (queryParams.totalType == 'lastMonth') {
          this.constructionControlPlanFormParams.startTime = DateUtils.getLastMonth();
        }
      }
    });

    this.loadConstructionControlPlans();
  }

  _onReuseInit(type?: ReuseHookOnReuseInitType): void {
    this.titleService.setTitle('日计划提交');
    this.loadConstructionControlPlans();
  }

  // 管控方案列表部分
  setOfConstructionControlPlanCheckedId = new Set<string>();
  checkedConstructionControlPlan: ConstructionControlPlan | undefined;
  constructionControlPlanConstant: ConstructionControlPlanConstant = new ConstructionControlPlanConstant();
  constructionControlPlanFormParams: {
    processStatus?: number;
    codeOrConstructionProjectInfo: string;
    startTime?: Date;
    planStatus?: number;
    endTime?: Date;
    warnStatus: string;
  } = {
    warnStatus: '',
    processStatus: this.constructionControlPlanConstant.RELEVANCEED,
    codeOrConstructionProjectInfo: '',
    endTime: DateUtils.getTodayTime235959(),
  };
  constructionControlPlans: ConstructionControlPlan[] = [];
  constructionControlPlanLoading = true;
  constructionControlPlanTotal = 1;
  constructionControlPlanPageSize = 5;
  constructionControlPlanPageIndex = 1;

  loadConstructionControlPlans(): void {
    this.constructionControlPlanLoading = true;

    const params = {
      pageSize: this.constructionControlPlanPageSize,
      currentPage: this.constructionControlPlanPageIndex,
      processStatusStr: this.constructionControlPlanFormParams.processStatus,
      startTime: this.constructionControlPlanFormParams.startTime,
      endTime: this.constructionControlPlanFormParams.endTime,
      warnStatusStr: this.constructionControlPlanFormParams.warnStatus,
    };

    this.http.post('/api/backstage/constructionControlPlan/getList', null, params).subscribe((res) => {
      this.constructionControlPlanLoading = false;
      this.constructionControlPlans = res.constructionControlPlans;
      if (StringUtils.arrayNotEmpty(this.constructionControlPlans) && this.setOfConstructionControlPlanCheckedId.size <= 0)
        this.updateConstructionControlPlanCheckedSet(this.constructionControlPlans[0].id, true);

      this.constructionControlPlanTotal = res.page.dataTotal;
    });
  }

  updateConstructionControlPlanCheckedSet(id: string, checked: boolean): void {
    this.checkedConstructionControlPlan = undefined;
    this.constructionDailyPlans = [];
    this.checkedConstructionDailyPlan = undefined;
    console.log(this.checkedConstructionControlPlan);
    this.setOfConstructionControlPlanCheckedId.clear();
    if (checked) {
      this.setOfConstructionControlPlanCheckedId.add(id);
      this.checkedConstructionControlPlan = this.constructionControlPlans.find((value) => value.id == id);
    }

    this.loadConstructionDailyPlans();
  }

  onConstructionControlPlanItemChecked(id: string, checked: boolean): void {
    this.updateConstructionControlPlanCheckedSet(id, checked);
  }

  onConstructionControlPlanQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.constructionControlPlanPageSize = pageSize;
    this.constructionControlPlanPageIndex = pageIndex;
    this.loadConstructionControlPlans();
  }

  // 下方日计划部分
  setOfConstructionDailyPlanCheckedId = new Set<string>();
  checkedConstructionDailyPlan?: ConstructionDailyPlan;
  constructionDailyPlanFormParams: DailyFormParams = {
    finishedStatus: '',
  };
  constructionDailyPlans: ConstructionDailyPlan[] = [];
  constructionDailyPlanConstant: ConstructionDailyPlanConstant = new ConstructionDailyPlanConstant();
  constructionDailyPlanLoading = false;
  constructionDailyPlanTotal = 1;
  constructionDailyPlanPageSize = 5;
  constructionDailyPlanPageIndex = 1;

  loadConstructionDailyPlans(): void {
    if (!this.checkedConstructionControlPlan) {
      return;
    }
    this.constructionDailyPlanLoading = true;

    const params = {
      constructionControlPlanId: this.checkedConstructionControlPlan.id,
      pageSize: this.constructionDailyPlanPageSize,
      currentPage: this.constructionDailyPlanPageIndex,
      finishedStatusStr: this.constructionDailyPlanFormParams.finishedStatus,
    };

    this.http.post('/api/backstage/constructionDailyPlan/getByConstructionControlPlan', null, params).subscribe((res) => {
      this.constructionDailyPlanLoading = false;
      this.constructionDailyPlans = res.constructionDailyPlans;
      this.constructionDailyPlanTotal = res.page.dataTotal;
    });
  }

  updateConstructionDailyPlanCheckedSet(id: string, checked: boolean): void {
    this.setOfConstructionDailyPlanCheckedId.clear();
    if (!checked) return;
    this.setOfConstructionDailyPlanCheckedId.add(id);
    this.checkedConstructionDailyPlan = this.constructionDailyPlans.filter((x) => x.id == id)[0];
  }

  onConstructionDailyPlanQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.constructionDailyPlanPageSize = pageSize;
    this.constructionDailyPlanPageIndex = pageIndex;
    this.loadConstructionDailyPlans();
  }

  // 施工计划范围预览模态框部分
  showControlPlanMapFunction(id: string) {
    this.router.navigate(['/construction-control-plan/preview'], {
      queryParams: {
        constructionControlPlanId: id,
        parentUrl: '/operation-process/date-plan-list',
        parentName: '日计划提交',
      },
    });
  }

  // 日计划范围预览模态框部分
  showDailyPlanMap = false;
  dailyPlanId?: string;
  showDailyPlanMapFunction(id: string) {
    this.updateConstructionDailyPlanCheckedSet(id, true);
    this.dailyPlanId = id;
    this.showDailyPlanMap = true;
  }

  // 日计划详情模态框部分
  @ViewChild('constructionDailyPlanDetail') constructionDailyPlanDetail: any;
  showPlanDetail = false;
  dailyPlanAddPage() {
    let checkedConstructionControlPlanId = this.setOfConstructionControlPlanCheckedId.values().next().value;
    if (!checkedConstructionControlPlanId) {
      this.msg.error('请选择需要添加日计划的方案');
      return;
    }
    this.showPlanDetail = true;
  }
  dailyPlanUpdatePage(id: string, event: any) {
    stopPropagation(event);
    this.updateConstructionDailyPlanCheckedSet(id, true);
    let checkedConstructionControlPlanId = this.setOfConstructionControlPlanCheckedId.values().next().value;
    if (!checkedConstructionControlPlanId) {
      this.msg.error('请选择需要修改的方案');
      return;
    }
    this.showPlanDetail = true;
  }
  executeDailyPlanDetail() {
    this.constructionDailyPlanDetail.execute((res: any) => {
      if (!res.success) return;
      this.msg.success('提交成功');
      this.showPlanDetail = false;
      this.loadConstructionDailyPlans();
    });
  }
  closeDailyPlanDetailPage() {
    this.showPlanDetail = false;
  }
}

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
import { DateUtils } from '../../../shared/utils/date-utils';

interface FormParams {
  finishedStatus: number;
  warnStatus?: number;
}
@Component({
  selector: 'app-operation-process-locale-control-list',
  templateUrl: './locale-control-list.component.html',
  styleUrls: ['../../construction-coordinate-plan/list.component.less'],
})
export class OperationProcessLocaleControlListComponent implements OnInit {
  constructionDailyPlanConstant: ConstructionDailyPlanConstant = new ConstructionDailyPlanConstant();
  constructionControlPlanConstant: ConstructionControlPlanConstant = new ConstructionControlPlanConstant();
  setOfConstructionDailyPlanCheckedId = new Set<string>();

  constructionDailyPlanFormParams: FormParams = {
    finishedStatus: this.constructionDailyPlanConstant.PROCESSING,
  };

  //弹窗日计划部分
  checkedConstructionDailyPlan: ConstructionDailyPlan | undefined;

  constructionDailyPlans: ConstructionDailyPlan[] = [];
  constructionDailyPlanLoading = true;
  constructionDailyPlanTotal = 1;
  constructionDailyPlanPageSize = 20;
  constructionDailyPlanPageIndex = 1;

  loadConstructionDailyPlans(): void {
    this.constructionDailyPlanLoading = true;
    const params = {
      finishedStatus: this.constructionDailyPlanFormParams.finishedStatus,
      warningStatusStr: this.constructionDailyPlanFormParams.warnStatus,
    };
    this.http.post('/api/backstage/constructionDailyPlan/dailyList', null, params).subscribe((res) => {
      this.constructionDailyPlanLoading = false;
      this.constructionDailyPlans = res.constructionDailyPlans;
      this.constructionDailyPlanTotal = res.page.dataTotal;
    });
  }

  updateConstructionDailyPlanCheckedSet(id: string, checked: boolean): void {
    this.setOfConstructionDailyPlanCheckedId.clear();
    if (checked) this.setOfConstructionDailyPlanCheckedId.add(id);

    this.checkedConstructionDailyPlan = this.constructionDailyPlans.find((value) => value.id == id);
  }

  onConstructionDailyPlanItemChecked(id: string, checked: boolean): void {
    this.updateConstructionDailyPlanCheckedSet(id, checked);
  }

  onConstructionDailyPlanQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.constructionDailyPlanPageSize = pageSize;
    this.constructionDailyPlanPageIndex = pageIndex;
    this.loadConstructionDailyPlans();
  }

  /**
   * 实际（手动）开始日计划
   */
  actualStart() {
    let checkedId = this.setOfConstructionDailyPlanCheckedId.values().next().value;
    if (!checkedId) {
      this.msg.error('请选择需要开始的日计划');
      return;
    }

    this.http.post('/api/backstage/constructionDailyPlan/actualStart', null, { constructionDailyPlanId: checkedId }).subscribe((res) => {
      if (!res.success) return;
      this.msg.success(res.msg);
      this.loadConstructionDailyPlans();
    });
  }

  /**
   * 实际（手动）结束日计划
   */
  actualClose() {
    let checkedId = this.setOfConstructionDailyPlanCheckedId.values().next().value;
    if (!checkedId) {
      this.msg.error('请选择需要结束的日计划');
      return;
    }

    this.http.post('/api/backstage/constructionDailyPlan/actualClose', null, { constructionDailyPlanId: checkedId }).subscribe((res) => {
      if (!res.success) return;
      this.msg.success(res.msg);
      this.loadConstructionDailyPlans();
    });
  }

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
    this.titleService.setTitle('现场管控');
    this.loadConstructionDailyPlans();
    // 根据路由带参设置查询条件
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.finishedStatus) {
        this.constructionDailyPlanFormParams.finishedStatus = Number(queryParams.finishedStatus);
      }
      if (queryParams.warnStatus) {
        this.constructionDailyPlanFormParams.warnStatus = Number(queryParams.warnStatus);
      }
    });
  }

  // 日计划范围预览模态框部分
  showPlanMap = false;
  dailyPlanId?: string;
  showPlanMapFunction(id: string) {
    this.dailyPlanId = id;
    this.showPlanMap = true;
  }

  // 施工计划范围预览模态框部分
  showControlPlanMapFunction(id: string) {
    this.router.navigate(['/construction-control-plan/preview'], {
      queryParams: {
        constructionControlPlanId: id,
        parentUrl: '/operation-process/locale-control-list',
        parentName: '现场管控',
      },
    });
  }
}

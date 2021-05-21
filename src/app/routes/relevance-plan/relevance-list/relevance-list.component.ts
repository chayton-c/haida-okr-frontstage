import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { _HttpClient, ModalHelper, TitleService } from '@delon/theme';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  ConstructionControlPlan,
  ConstructionControlPlanConstant,
} from '../../../pojos/construction-control-plan/construction-control-plan';
import { ConstructionFormalPlan, ConstructionFormalPlanConstant } from '../../../pojos/construction-control-plan/construction-formal-plan';
import { StringUtils } from '../../../shared/utils/string-utils';

@Component({
  selector: 'app-relevance-plan-relevance-list',
  templateUrl: './relevance-list.component.html',
  styleUrls: ['../../construction-coordinate-plan/list.component.less'],
})
export class RelevancePlanRelevanceListComponent implements OnInit {
  constructor(
    public http: _HttpClient,
    public injector: Injector,
    public router: Router,
    public msg: NzMessageService,
    private modal: ModalHelper,
    private cdr: ChangeDetectorRef,
    private titleService: TitleService,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('关联计划');
    this.loadConstructionControlPlans();
  }

  // 管控方案列表部分
  setOfConstructionControlPlanCheckedId = new Set<string>();
  constructionControlPlanConstant: ConstructionControlPlanConstant = new ConstructionControlPlanConstant();
  constructionControlPlanFormParams: {
    processStatus?: number;
    codeOrConstructionProjectInfo: string;
    startTimeAndEndTime: [];
    railwayLine: string;
    workshop: string;
    planType: string;
    planStatus?: number;
  } = {
    planType: '',
    railwayLine: '',
    workshop: '',
    processStatus: this.constructionControlPlanConstant.PENDING_RELEVANCE,
    planStatus: this.constructionControlPlanConstant.COUNTERSIGNED,
    codeOrConstructionProjectInfo: '',
    startTimeAndEndTime: [],
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
      codeOrConstructionProjectInfo: this.constructionControlPlanFormParams.codeOrConstructionProjectInfo,
      planStatusStr: this.constructionControlPlanFormParams.planStatus,
    };

    this.http.post('/api/backstage/constructionControlPlan/getList', null, params).subscribe((res) => {
      this.constructionControlPlanLoading = false;
      this.constructionControlPlans = res.constructionControlPlans;
      this.constructionControlPlanTotal = res.page.dataTotal;

      if (StringUtils.arrayNotEmpty(this.constructionControlPlans))
        this.updateConstructionControlPlanCheckedSet(this.constructionControlPlans[0].id, true);
      else this.loadConstructionFormalPlans();
    });
  }

  updateConstructionControlPlanCheckedSet(id: string, checked: boolean): void {
    this.setOfConstructionControlPlanCheckedId.clear();
    if (checked) this.setOfConstructionControlPlanCheckedId.add(id);

    this.loadConstructionFormalPlans();
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

  // 下方正式计划部分
  setOfConstructionFormalPlanCheckedId = new Set<string>();
  constructionFormalPlanFormParams: {
    processStatus?: number;
    codeOrConstructionProjectInfo: string;
    startTimeAndEndTime: [];
    railwayLine: string;
    workshop: string;
    planType: string;
  } = {
    planType: '',
    railwayLine: '',
    workshop: '',
    processStatus: this.constructionControlPlanConstant.PENDING_RELEVANCE,
    codeOrConstructionProjectInfo: '',
    startTimeAndEndTime: [],
  };
  constructionFormalPlans: ConstructionFormalPlan[] = [];
  constructionFormalPlanConstant: ConstructionFormalPlanConstant = new ConstructionFormalPlanConstant();
  constructionFormalPlanLoading = true;
  constructionFormalPlanTotal = 1;
  constructionFormalPlanPageSize = 5;
  constructionFormalPlanPageIndex = 1;

  loadConstructionFormalPlans(): void {
    this.constructionFormalPlanLoading = true;

    const params = {
      planCode: this.constructionFormalPlanFormParams.codeOrConstructionProjectInfo,
      relevanceStatus: this.constructionFormalPlanConstant.PENDING_RELEVANCING,
      planType: this.constructionFormalPlanFormParams.planType,
      railwayLine: this.constructionFormalPlanFormParams.railwayLine,
      workshop: this.constructionFormalPlanFormParams.workshop,
      pageSize: this.constructionFormalPlanPageSize,
      currentPage: this.constructionFormalPlanPageIndex,
    };

    this.http.post('/api/backstage/constructionFormalPlan/getList', null, params).subscribe((res) => {
      this.constructionFormalPlanLoading = false;
      this.constructionFormalPlans = res.constructionFormalPlans;
      this.constructionFormalPlanTotal = res.page.dataTotal;

      if (StringUtils.arrayNotEmpty(this.constructionFormalPlans))
        this.updateConstructionFormalPlanCheckedSet(this.constructionFormalPlans[0].id, true);
    });
  }

  updateConstructionFormalPlanCheckedSet(id: string, checked: boolean): void {
    this.setOfConstructionFormalPlanCheckedId.clear();
    if (checked) this.setOfConstructionFormalPlanCheckedId.add(id);
  }

  onConstructionFormalPlanItemChecked(id: string, checked: boolean): void {
    this.updateConstructionFormalPlanCheckedSet(id, checked);
  }

  onConstructionFormalPlanQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.constructionFormalPlanPageSize = pageSize;
    this.constructionFormalPlanPageIndex = pageIndex;
    this.loadConstructionFormalPlans();
  }

  // 关联确认模态框部分
  showPlanRelevanceDetail = false;
  showPlanRelevanceDetailFunction() {
    let checkedConstructionControlPlanId = this.setOfConstructionControlPlanCheckedId.values().next().value;
    if (!checkedConstructionControlPlanId) {
      this.msg.error('请选择需要关联的方案');
      return;
    }
    let setOfConstructionFormalPlanCheckedId = this.setOfConstructionFormalPlanCheckedId.values().next().value;
    if (!setOfConstructionFormalPlanCheckedId) {
      this.msg.error('请选择需要关联的正式计划');
      return;
    }

    this.router.navigate(['/relevance-plan/relevance-detail'], {
      queryParams: {
        constructionControlPlanId: checkedConstructionControlPlanId,
        constructionFormalPlanId: setOfConstructionFormalPlanCheckedId,
      },
    });
  }
  closeAndRefresh() {
    this.showPlanRelevanceDetail = false;
    this.loadConstructionControlPlans();
  }

  // 施工详情预览
  showPlanDetailFunction(id: string) {
    this.router.navigate(['/construction-control-plan/preview'], {
      queryParams: {
        constructionControlPlanId: id,
        parentUrl: '/relevance-plan/relevance-list',
        parentName: '关联计划',
      },
    });
  }
}

import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';
import {_HttpClient} from '@delon/theme';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable, Observer} from 'rxjs';
import {HttpParams} from '@angular/common/http';
import {NzTreeNodeOptions} from 'ng-zorro-antd/core/tree';
import {
  ConstructionControlPlan,
  ConstructionControlPlanConstant,
} from '../../../../pojos/construction-control-plan/construction-control-plan';
import {Station} from '../../../../pojos/station/station';
import {User} from '../../../../pojos/user/user';
import {Organization} from '../../../../pojos/organization/organization';
import {HttpUtils} from '../../../utils/http-utils';
import {RailwayLine} from '../../../../pojos/railway-line/railway-line';
import {ConstructionFormalPlan, ConstructionFormalPlanConstant} from "../../../../pojos/construction-control-plan/construction-formal-plan";


@Component({
  selector: 'construction-control-plan-relevance-detail',
  templateUrl: './construction-control-plan-relevance-detail.html',
})
export class ConstructionControlPlanRelevanceDetail {

  ngOnInit(): void {
    this.loadConstructionFormalPlan();
  }

  constructor(
    public http: _HttpClient,
    private activatedRoute: ActivatedRoute,
    private msg: NzMessageService,
    private router: Router,
    private fb: FormBuilder,
  ) {
  }

  // 左侧预计划部分
  @Input() constructionControlPlanId?: string;
  @Output() closeAndRefresh = new EventEmitter<string>();

  constructionControlPlan: ConstructionControlPlan = {
    id: '',
    approveStatus: 0,
    processStatus: 0,
    investigationProgressStatus: 0,
    code: '',
    executeUserId: '',
    finishStatus: 0,
    influenceArea: '',
    name: '',
    signInStationId: '',
    signInUserId: '',
    warnStatus: 0,
    workInfo: ''
  };
  constructionConstrolPlanConstant: ConstructionControlPlanConstant = new ConstructionControlPlanConstant();
  loading = false;

  setConstructionControlPlanId(id: string) {
    this.constructionControlPlanId = id;
  }

  // 提交岗位信息
  execute() {
    this.http
      .post('/api/backstage/constructionControlPlan/saveOrUpdate', null, HttpUtils.transform(this.constructionControlPlan))
      .subscribe((res) => {
        if (!res.success) return;

        this.constructionControlPlan = res.role;
        this.msg.success(res.msg);
      });
  }

  loadConstructionFormalPlan(): void {
    this.http
      .post('/api/backstage/constructionFormalPlan/info', null, {
        constructionControlPlanId: this.constructionControlPlanId,
        constructionFormalPlanId: this.constructionFormalPlanId
      })
      .subscribe((res) => {
        this.constructionFormalPlan = res.constructionFormalPlan;
        this.constructionControlPlan = res.constructionControlPlan;

        this.loading = false;
      });
  }

  // 右侧正式计划部分
  @Input() constructionFormalPlanId?: string;

  constructionFormalPlan: ConstructionFormalPlan = {
    constructDepartment: "",
    constructionContentAndInfluenceArea: "",
    constructionControlPlanId: "",
    constructionMachinery: "",
    constructionProject: "",
    constructionSite: "",
    downriver: "",
    id: "",
    planCode: "",
    planType: "",
    railwayLineName: "",
    relevanceStatus: 0
  };
  constructionFormalPlanConstant: ConstructionFormalPlanConstant = new ConstructionFormalPlanConstant();

  showPlanMap = false;
  showPlanMapFunction() {
    this.showPlanMap = true;
  }

  // 确认关联
  confirmRelevance() {
    const param = {
      constructionControlPlanId: this.constructionControlPlanId,
      constructionFormalPlanId: this.constructionFormalPlanId
    }

    this.http.post('/api/backstage/constructionControlPlan/confirmConnect', null, param).subscribe((res) => {
      if (!res.success) return;
      this.msg.success(res.msg);
      this.closeAndRefresh.emit('');
    });
  }

  // 补充配合方案
  reinvestigationPlan() {
    this.http.post('/api/backstage/constructionControlPlan/supplementaryPlan', null, { id: this.constructionControlPlanId }).subscribe((res) => {
      if (!res.success) return;
      this.msg.success(res.msg);
      this.closeAndRefresh.emit('');
    });
  }
}

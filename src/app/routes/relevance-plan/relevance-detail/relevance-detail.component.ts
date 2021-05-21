import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {_HttpClient, TitleService} from '@delon/theme';
import {ActivatedRoute, Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {FormBuilder} from "@angular/forms";
import {ConstructionControlPlan, ConstructionControlPlanConstant} from "../../../pojos/construction-control-plan/construction-control-plan";
import {HttpUtils} from "../../../shared/utils/http-utils";
import {ConstructionFormalPlan, ConstructionFormalPlanConstant} from "../../../pojos/construction-control-plan/construction-formal-plan";
import {ConstructionDailyPlan} from "../../../pojos/construction-control-plan/construction-daily-plan";
import {Station} from "../../../pojos/station/station";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import {NzDatePickerComponent} from "ng-zorro-antd/date-picker";
import {RailwayLine} from "../../../pojos/railway-line/railway-line";

@Component({
  selector: 'app-relevance-plan-relevance-detail',
  templateUrl: './relevance-detail.component.html',
  styleUrls: ['./relevance-detail.component.css']
})
export class RelevancePlanRelevanceDetailComponent implements OnInit {

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.constructionControlPlanId) this.constructionControlPlanId = queryParams.constructionControlPlanId;
      if (queryParams.constructionFormalPlanId) this.constructionFormalPlanId = queryParams.constructionFormalPlanId;
    });
    this.titleService.setTitle('计划详情');
    this.loadConstructionFormalPlan();
  }

  constructor(
    private titleService: TitleService,
    public http: _HttpClient,
    private activatedRoute: ActivatedRoute,
    private msg: NzMessageService,
    private router: Router,
    private fb: FormBuilder,
  ) {
  }

  showUpdate = false;

  // 左侧预计划部分
  constructionControlPlanId?: string;
  stations: Station[] = [];
  railwayLines: RailwayLine[] = [];

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

  loadConstructionFormalPlan(): void {
    this.http
      .post('/api/backstage/constructionFormalPlan/info', null, {
        constructionControlPlanId: this.constructionControlPlanId,
        constructionFormalPlanId: this.constructionFormalPlanId
      })
      .subscribe((res) => {
        this.constructionFormalPlan = res.constructionFormalPlan;
        this.constructionControlPlan = res.constructionControlPlan;
        this.stations = res.stations;
        this.railwayLines = res.railwayLines;

        this.loading = false;
      });
  }
  // 保存
  saveConstructionControlPlan() {
    this.http
      .post('/api/backstage/constructionControlPlan/saveOrUpdate', null, HttpUtils.transform(this.constructionControlPlan))
      .subscribe((res) => {
        if (!res.success) return;

        this.msg.success(res.msg);

        this.showUpdate = false;
      });
  }

  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endDatePicker.open();
    }
  }

  // 右侧正式计划部分
  constructionFormalPlanId?: string;

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

  back() {
    this.router.navigate(['/relevance-plan/relevance-list']);
  }

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
      this.router.navigate(['/relevance-plan/relevance-list']);
    });
  }

  // 补充配合方案
  reinvestigationPlan() {
    this.http.post('/api/backstage/constructionControlPlan/supplementaryPlan', null, { id: this.constructionControlPlanId }).subscribe((res) => {
      if (!res.success) return;
      this.msg.success(res.msg);
      this.router.navigate(['/relevance-plan/relevance-list']);
    });
  }

  updateView() {
    this.showUpdate = true;
  }
}


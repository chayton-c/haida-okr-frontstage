import {ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {_HttpClient, ModalHelper} from '@delon/theme';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd/message';
import {TodayList, TodayListConstant} from '../../../../pojos/construction-control-plan/today-list';

interface FormParams {
  workshopId?: string;
  railwayLineId?: string;
  warnStatus?: number;
  startTime?: Date;
  endTime?: Date;
  stationId?: string;
}

@Component({
  selector: 'construction-daily-plan-today-list',
  templateUrl: './today-component-list.html',
})
export class TodayListComponent implements OnInit {
  @Input() stationId?: string;
  @Input() workshopId?: string;
  @Input() railwayLineId?: string;
  @Input() warnStatus?: string;

  @Output() closeAndRefresh = new EventEmitter<string>();

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();

  todayListConstant: TodayListConstant = new TodayListConstant();
  todayLists: TodayList[] = [];

  loading = true;
  total = 1;
  pageSize = 5;
  pageIndex = 1;
  formParams: FormParams = {
    workshopId: '',
    railwayLineId: '',
  };

  //列表查询
  loadDataFromServer(pageIndex: number, pageSize: number, formParams: FormParams): void {
    this.loading = true;

    let params = {
      pageSize: pageSize,
      currentPage: pageIndex,
      stationId: this.stationId,
      workshopId: this.workshopId,
      railwayLineId: this.railwayLineId,
      warnStatusStr: this.warnStatus,
      // startTime: this.startTime,
      // endTime: this.endTime,
    };

    this.http.post('/api/backstage/constructionDailyPlan/getList', null, params).subscribe((res) => {
      this.loading = false;
      this.todayLists = res.controlPlanOrDailyPlans;
      if (this.todayLists) this.total = this.todayLists.length;
    });
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) this.setOfCheckedId.add(id);
    else this.setOfCheckedId.delete(id);
  }

  onAllChecked(checked: boolean): void {
    this.todayLists.forEach(({id}) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.todayLists;
    this.checked = listOfEnabledData.every(({id}) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({id}) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.setOfCheckedId.clear();
    const {pageSize, pageIndex} = params;
    this.loadDataFromServer(pageIndex, pageSize, this.formParams);
  }

  constructor(
    public http: _HttpClient,
    public injector: Injector,
    public router: Router,
    public msg: NzMessageService,
    private modal: ModalHelper,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    // this.loadDataFromServer(this.pageIndex, this.pageSize, this.formParams);
  }

  closePlanMap() {
    this.closeAndRefresh.emit('');
    this.showPlanMap = false;
  }

  // 施工计划详情模态框部分
  @ViewChild('constructionControlPlanPreview') constructionControlPlanPreview: any;
  showPlanMap = false;
  constructionDailyPlanId?: string;
  constructionControlPlanId?: string;

  showPlanMapFunction(dataId: string) {
    this.constructionControlPlanId = dataId;
    this.showPlanMap = true;
  }
}

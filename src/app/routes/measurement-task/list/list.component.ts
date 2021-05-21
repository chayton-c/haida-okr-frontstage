import {Component, Injector, NgZone, OnInit} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {Router} from '@angular/router';
import {NzMessageService} from "ng-zorro-antd/message";
import { OnReuseInit, ReuseHookOnReuseInitType} from "@delon/abc/reuse-tab";
import {MeasurementTask} from "../../../pojos/task/measurement-task";
import {MeasurementTaskDetail} from "../../../pojos/task/measurement-task-detail";
import {DeviceMaintenanceplanDevice} from "../../../pojos/task/device-maintenanceplan-device";



interface FormParams {
  nameOrCode: string,
  executorNames: string,
}
@Component({
  selector: 'app-measurement-task-list',
  templateUrl: './list.component.html',
})
export class MeasurementTaskListComponent implements OnInit, OnReuseInit {
  readonly TYPE_DEVICE = DeviceMaintenanceplanDevice.TYPE_DEVICE;
  readonly TYPE_STATION = DeviceMaintenanceplanDevice.TYPE_STATION;

  // 工单列表部分
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  formParams: FormParams = {
    nameOrCode: '',
    executorNames: '',
  };
  measurementTasks: MeasurementTask[] = [];
  loading = true;
  total = 1;
  pageSize = 5;
  pageIndex = 1;

  loadDataFromServer(formParams: FormParams): void {
    this.loading = true;

    const params = {
      pageSize: this.pageSize,
      currentPage: this.pageIndex,
      nameOrCode: formParams.nameOrCode,
      executorNames: formParams.executorNames,
    };

    this.http.post('/api/backstage/measurementTask', null, params).subscribe((res) => {
      if (!res.success) return;

      this.loading = false;
      this.measurementTasks = res.measurementTasks;

      if (this.setOfCheckedId.size == 0 && this.measurementTasks.length > 0)
        this.updateCheckedSet(this.measurementTasks[0].id);

      this.total = res.page.dataTotal;
    });
  }

  deleteTask(): void {
    let checkedId = this.setOfCheckedId.values().next().value;
    if (!checkedId) {
      this.msg.error("请选择需要删除的任务");
      return;
    }

    const params = {
      id: checkedId
    }

    this.http.post('/api/backstage/measurementTask/delete', null, params).subscribe((res) => {
      if (!res.success) return;

      this.setOfCheckedId.clear()
      this.msg.success(res.msg);
    });
  }

  updateCheckedSet(id: string): void {
    this.setOfCheckedId.clear();
    this.setOfCheckedId.add(id);
    this.loadSubDataFromServer();
  }

  onItemChecked(id: string): void {
    this.updateCheckedSet(id);
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const {pageSize, pageIndex} = params;
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
    this.loadDataFromServer(this.formParams);
  }

  constructor(private zone: NgZone,
              private msg: NzMessageService,
              public http: _HttpClient,
              public injector: Injector,
              public router: Router) {
  }

  ngOnInit(): void {
    this.loadDataFromServer(this.formParams);
  }

  _onReuseInit(type?: ReuseHookOnReuseInitType): void {
    this.loadDataFromServer(this.formParams);
  }

  // 子工单列表
  measurementTaskDetails: MeasurementTaskDetail[] = [];

  subLoading = true;
  subTotal = 1;
  subPageSize = 5;
  subPageIndex = 1;
  setOfSubDataCheckedId = new Set<string>();

  subTableUpdateCheckedSet(id: string): void {
    this.setOfSubDataCheckedId.clear();
    this.setOfSubDataCheckedId.add(id);
  }

  subTableOnItemChecked(id: string): void {
    this.subTableUpdateCheckedSet(id);
  }

  subTableOnQueryParamsChange(params: NzTableQueryParams): void {
    const {pageSize, pageIndex} = params;
    this.subPageSize = pageSize;
    this.subPageIndex = pageIndex;
    this.loadSubDataFromServer();
  }

  loadSubDataFromServer(): void {
    let checkedId = this.setOfCheckedId.values().next().value;
    this.subLoading = true;

    const params = {
      pageSize: this.subPageSize,
      currentPage: this.subPageIndex,
      measurementTaskId: checkedId,
    };

    this.http.post('/api/backstage/measurementTaskDetail/getByMeasurementTaskId', null, params).subscribe((res) => {
      this.subLoading = false;
      this.measurementTaskDetails = res.measurementTaskDetails;

      this.subTotal = res.page.dataTotal;
    });
  }
}

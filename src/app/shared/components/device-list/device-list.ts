import {Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, Renderer2} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Router } from '@angular/router';
import { Time } from '@angular/common';
import {NzMessageService} from "ng-zorro-antd/message";
import {NzTreeNodeOptions} from "ng-zorro-antd/core/tree";
import { OnReuseInit, ReuseHookOnReuseInitType} from "@delon/abc/reuse-tab";
import {Device} from "../../../pojos/device/device";


interface FormParams {
  deviceTypeIdOrDeviceSubTypeId: string;
  railwayLineIdOrStationId: string;
  deviceNameOrCode: string;
}

@Component({
  selector: 'device-list',
  templateUrl: './device-list.html',
})
export class DeviceList {
  @Input() checkedDatas: any[] = [];
  @Output() outer = new EventEmitter();

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  formParams: FormParams = {
    deviceTypeIdOrDeviceSubTypeId: '',
    railwayLineIdOrStationId: '',
    deviceNameOrCode: '',
  };
  devices: Device[] = [];
  loading = true;
  total = 1;
  pageSize = 5;
  pageIndex = 1;
  deviceTypeSelectTreeNodes: Array<NzTreeNodeOptions> = [];
  lineSelectTreeNodes: Array<NzTreeNodeOptions> = [];
  executeDatas: any[] = [];

  loadDataFromServer(pageIndex: number, pageSize: number, formParams: FormParams): void {
    this.loading = true;

    const params = {
      pageSize: pageSize,
      currentPage: pageIndex,
      deviceTypeIdOrDeviceSubTypeId: formParams.deviceTypeIdOrDeviceSubTypeId,
      railwayLineIdOrStationId: formParams.railwayLineIdOrStationId,
      deviceNameOrCode: formParams.deviceNameOrCode,
    };

    this.http.post('/api/backstage/device', null, params).subscribe((res) => {
      this.loading = false;
      this.devices = res.devices;
      this.total = res.page.dataTotal;
    });
  }

  loadSelectTrees(): void {
    this.http.post('/api/backstage/line/initSelectTrees').subscribe((res) => {
      this.deviceTypeSelectTreeNodes = res.deviceTypeSelectTreeNodes;
      this.lineSelectTreeNodes = res.lineSelectTreeNodes;
    });
  }

  addPage(): void {
    this.router.navigate(["/device/detail"]);
  }

  updatePage(): void {
    let checkedId = this.setOfCheckedId.values().next().value;
    if (!checkedId) {
      this.msg.error('请选择需要修改的设备');
      return;
    }

    this.router.navigate(["/device/detail"], {
      queryParams: {
        id: checkedId
      },
    });
  }

  deleteDevices(): void {
    let deviceIds: string[] = [];
    this.setOfCheckedId.forEach((value) => deviceIds.push(value));
    if (deviceIds.length == 0) {
      this.msg.error('请选择要删除的设备');
      return;
    }

    this.http.post('/api/backstage/device/delete', null, {ids: deviceIds.toString()}).subscribe((res) => {
      if (!res.success) return;

      this.msg.info('删除成功');
      this.loadDataFromServer(this.pageIndex, this.pageSize, this.formParams);
    });
  }

  updateCheckedSet(id: string, checked: boolean): void {
    this.setOfCheckedId.clear()

    if (checked) {
      this.setOfCheckedId.add(id);
      this.passCheckedDataToFather();
    }
  }

  onAllChecked(checked: boolean): void {
    this.devices.forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.devices;
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.loadDataFromServer(pageIndex, pageSize, this.formParams);
  }

  rowChecked(id:string) {
    const checked = this.setOfCheckedId.has(id);
    this.onItemChecked(id, !checked);
  }

  constructor(private msg: NzMessageService,public http: _HttpClient, public injector: Injector, public router: Router) {}

  ngOnInit(): void {
    this.loadDataFromServer(this.pageIndex, this.pageSize, this.formParams);
    this.loadSelectTrees();
  }

  passCheckedDataToFather():void {
    this.executeDatas = this.devices.filter(value => this.setOfCheckedId.has(value.id));
    this.outer.emit(this.executeDatas);
  }

}

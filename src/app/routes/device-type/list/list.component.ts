import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { OnReuseInit, ReuseHookOnReuseInitType} from "@delon/abc/reuse-tab";

export class DeviceTypeNodePojoType {
  public static readonly DEVICE_TYPE = 0;
  public static readonly DEVICE_SUB_TYPE = 1;
}

/**
 * 既可以是线路，也可以是车站
 */
export interface DeviceTypeNodePojo {
  id: string;
  name: string;
  type: number;
  level?: number;
  expand?: boolean;
  deviceTypeNodePojoList?: DeviceTypeNodePojo[];
  parent?: DeviceTypeNodePojo;
  selected?: boolean;
}

export interface DeviceSubType {
  id: string;
  name: string;
  description: string;
  remark: string;
}

interface DeviceSubTypeFormParams {
  name: string;
}

@Component({
  selector: 'app-device-type-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class DeviceTypeListComponent implements OnInit, OnReuseInit {
  ngOnInit(): void {
    // 加载菜单信息
    this.loadDeviceTypeDataFromServer();
  }

  constructor(public http: _HttpClient, private msg: NzMessageService, public injector: Injector, public router: Router) {}

  // =============================左侧树形菜单部分=======================================
  deviceTypeLoading = false;
  deviceTypeNodePojos: DeviceTypeNodePojo[] = [];
  deviceTypeNodePojoList: Set<DeviceTypeNodePojo> = new Set();
  checkedDeviceTypeNodePojo: DeviceTypeNodePojo | null = null;
  mapOfExpandedData: { [id: string]: DeviceTypeNodePojo[] } = {};

  collapse(array: DeviceTypeNodePojo[], data: DeviceTypeNodePojo, $event: boolean): void {
    if ($event) return;

    if (!data.deviceTypeNodePojoList) return;

    data.deviceTypeNodePojoList.forEach((d) => {
      const target = array.find((a) => a.id === d.id)!;
      target.expand = false;
      this.collapse(array, target, false);
    });
  }

  convertTreeToList(root: DeviceTypeNodePojo): DeviceTypeNodePojo[] {
    const stack: DeviceTypeNodePojo[] = [];
    const array: DeviceTypeNodePojo[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.deviceTypeNodePojoList && node.deviceTypeNodePojoList.length == 0) node.deviceTypeNodePojoList = undefined;
      if (node.deviceTypeNodePojoList) {
        for (let i = node.deviceTypeNodePojoList.length - 1; i >= 0; i--) {
          stack.push({ ...node.deviceTypeNodePojoList[i], level: node.level! + 1, expand: true, parent: node });
        }
      }
    }

    // 如果没有选择的组织，选择第一个
    let hasSelectedOrganizations = false;
    this.deviceTypeNodePojoList.forEach((value) => {
      if (value.selected) hasSelectedOrganizations = true;
    });
    if (!hasSelectedOrganizations) this.clickLineNodePojo(this.deviceTypeNodePojoList.values().next().value);

    return array;
  }

  clickLineNodePojo(item: DeviceTypeNodePojo) {
    this.deviceTypeNodePojoList.forEach((value) => (value.selected = false));
    item.selected = true;
    this.checkedDeviceTypeNodePojo = item;
    this.deviceTypeNodePojoList.forEach((value) => {
      if (value.id == item.id)
        this.checkedDeviceTypeNodePojo = value;
    });
    this.loadDeviceSubTypesFromServer(this.deviceSubTypePageIndex, this.deviceSubTypePageSize, this.deviceSubTypeFormParams);
  }

  visitNode(node: DeviceTypeNodePojo, hashMap: { [id: string]: boolean }, array: DeviceTypeNodePojo[]): void {
    this.deviceTypeNodePojoList.add(node);
    if (!hashMap[node.id]) {
      hashMap[node.id] = true;
      array.push(node);
    }
  }

  loadDeviceTypeDataFromServer(): void {
    this.http.post('/api/backstage/deviceType', null).subscribe((res) => {
      if (!res.success) return;
      this.deviceTypeLoading = false;
      this.deviceTypeNodePojos = res.deviceTypeNodePojos;

      // 加载树方法
      this.deviceTypeNodePojos.forEach((item) => {
        this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
      });

      if (this.checkedDeviceTypeNodePojo)
        this.clickLineNodePojo(this.checkedDeviceTypeNodePojo);
    });
  }

  // 下级菜单部分
  deviceSubTypeChecked = false;
  deviceSubTypeIndeterminate = false;
  deviceSubTypeLoading = false;
  deviceSubTypeCheckedId = new Set<string>();
  deviceSubTypeFormParams: DeviceSubTypeFormParams = {
    name: '',
  };
  deviceSubTypes: DeviceSubType[] = [];
  deviceSubTypeTotal = 1;
  deviceSubTypePageSize = 5;
  deviceSubTypePageIndex = 1;

  loadDeviceSubTypesFromServer(pageIndex: number, pageSize: number, formParams: DeviceSubTypeFormParams): void {
    this.deviceSubTypeLoading = true;
    if (!this.checkedDeviceTypeNodePojo) {
      this.deviceSubTypeLoading = false;
      return;
    }

    const params = {
      pageSize: pageSize,
      currentPage: pageIndex,
      name: formParams.name,
      deviceTypeId: this.checkedDeviceTypeNodePojo.id,
    };

    this.http.post('/api/backstage/deviceSubType/getDeviceSubTypesByDeviceTypeId', null, params).subscribe((res) => {
      this.deviceSubTypeLoading = false;
      this.deviceSubTypes = res.deviceSubTypes;
      this.deviceSubTypeTotal = res.page.dataTotal;
    });
  }

  formAddPage(): void {
    let checkedNodePojoType = this.checkedDeviceTypeNodePojo ? this.checkedDeviceTypeNodePojo.type : '';

    if (checkedNodePojoType == DeviceTypeNodePojoType.DEVICE_TYPE) this.router.navigate(['/device-type/detail']);
  }

  formUpdatePage(): void {
    let checkedNodePojoId = this.checkedDeviceTypeNodePojo ? this.checkedDeviceTypeNodePojo.id : '';
    let checkedNodePojoType = this.checkedDeviceTypeNodePojo ? this.checkedDeviceTypeNodePojo.type : '';

    if (checkedNodePojoType == DeviceTypeNodePojoType.DEVICE_TYPE) {
      this.router.navigate(['/device-type/detail'], {
        queryParams: {
          deviceTypeId: checkedNodePojoId,
        },
      });
    }
    if (checkedNodePojoType == DeviceTypeNodePojoType.DEVICE_SUB_TYPE) {
      this.router.navigate(['/device-sub-type/detail'], {
        queryParams: {
          deviceSubTypeId: checkedNodePojoId,
        },
      });
    }
  }

  deleteInForm(): void {
    let checkedNodePojoId = this.checkedDeviceTypeNodePojo ? this.checkedDeviceTypeNodePojo.id : '';
    let checkedNodePojoType = this.checkedDeviceTypeNodePojo ? this.checkedDeviceTypeNodePojo.type : '';

    if (checkedNodePojoType == DeviceTypeNodePojoType.DEVICE_TYPE) {
      this.http.post('/api/backstage/deviceType/delete', null, {ids: [checkedNodePojoId]}).subscribe((res) => {
        if (!res.success) return;

        this.msg.info('删除成功');
        this.loadDeviceTypeDataFromServer();
        this.clickLineNodePojo(this.deviceTypeNodePojos[0]);
      });
    }
    if (checkedNodePojoType == DeviceTypeNodePojoType.DEVICE_SUB_TYPE) {
      this.http.post('/api/backstage/deviceSubType/delete', null, {ids: [checkedNodePojoId]}).subscribe((res) => {
        if (!res.success) return;

        this.msg.info('删除成功');
        this.loadDeviceTypeDataFromServer();
        this.clickLineNodePojo(this.deviceTypeNodePojos[0]);
      });
    }
  }

  tableAddPage(): void {
    let checkedNodePojoId = this.checkedDeviceTypeNodePojo ? this.checkedDeviceTypeNodePojo.id : '';
    this.router.navigate(['/device-sub-type/detail'], {
      queryParams: {
        deviceTypeId: checkedNodePojoId,
      },
    });
  }

  tableUpdatePage(): void {
    let tableCheckedId = this.deviceSubTypeCheckedId.values().next().value;
    if (!tableCheckedId) {
      this.msg.error('请选择需要修改的设备子类型');
      return;
    }

    let checkedNodePojoId = this.checkedDeviceTypeNodePojo ? this.checkedDeviceTypeNodePojo.id : '';
    this.router.navigate(['/device-sub-type/detail'], {
      queryParams: {
        deviceSubTypeId: tableCheckedId,
        deviceTypeId: checkedNodePojoId,
      },
    });
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) this.deviceSubTypeCheckedId.add(id);
    else this.deviceSubTypeCheckedId.delete(id);
  }

  deleteDeviceSubType(): void {
    let deviceSubTypeIds: string[] = [];
    this.deviceSubTypeCheckedId.forEach((value) => deviceSubTypeIds.push(value));
    if (deviceSubTypeIds.length == 0) {
      this.msg.error('请选择要删除的设备');
      return;
    }

    this.http.post('/api/backstage/deviceSubType/delete', null, {ids: deviceSubTypeIds.toString()}).subscribe((res) => {
      if (!res.success) return;

      this.msg.info('删除成功');
      this.loadDeviceTypeDataFromServer();
      this.loadDeviceSubTypesFromServer(this.deviceSubTypePageIndex, this.deviceSubTypePageSize, this.deviceSubTypeFormParams);
    });
    this.deviceSubTypeCheckedId.clear();
  }

  onAllChecked(checked: boolean): void {
    this.deviceSubTypes.forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.deviceSubTypes;
    this.deviceSubTypeChecked = listOfEnabledData.every(({ id }) => this.deviceSubTypeCheckedId.has(id));
    this.deviceSubTypeIndeterminate = listOfEnabledData.some(({ id }) => this.deviceSubTypeCheckedId.has(id)) && !this.deviceSubTypeChecked;
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.loadDeviceSubTypesFromServer(pageIndex, pageSize, this.deviceSubTypeFormParams);
  }

  _onReuseInit(type?: ReuseHookOnReuseInitType): void {
    this.loadDeviceTypeDataFromServer();
  }
}

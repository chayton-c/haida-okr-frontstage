import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import {MeasurementTemplate} from "../../../pojos/measurement-template/measurement-template";
import {MeasurementItemField} from "../../../pojos/measurement-item-field/measurement-item-field";
import { OnReuseInit, ReuseHookOnReuseInitType} from "@delon/abc/reuse-tab";

/**
 * 既可以是设备类型，也可以是子设备类型
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

interface MeasurementTemplateFormParams {
  name: string;
}

@Component({
  selector: 'app-measurement-template-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class MeasurementTemplateListComponent implements OnInit, OnReuseInit {
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
    this.loadMeasurementTemplates(this.measurementTemplatePageIndex, this.measurementTemplatePageSize, this.measurementTemplateFormParams);
    // this.loadMeasurementItemFields(this.measurementItemFieldPageIndex, this.measurementItemFieldPageSize);
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
    });
  }

  // 右上列表
  measurementTemplateLoading = false;
  measurementTemplateCheckedId = new Set<string>();
  measurementTemplateFormParams: MeasurementTemplateFormParams = {
    name: '',
  };
  measurementTemplates: MeasurementTemplate[] = [];
  measurementTemplateTypeTotal = 1;
  measurementTemplatePageSize = 5;
  measurementTemplatePageIndex = 1;
  checkedMeasurementTemplate: MeasurementTemplate|null = null;

  loadMeasurementTemplates(pageIndex: number, pageSize: number, formParams: MeasurementTemplateFormParams): void {
    this.measurementTemplateLoading = true;
    if (!this.checkedDeviceTypeNodePojo) {
      this.measurementTemplateLoading = false;
      return;
    }

    const params = {
      pageSize: pageSize,
      currentPage: pageIndex,
      name: formParams.name,
      deviceTypeIdOrDeviceSubTypeId: this.checkedDeviceTypeNodePojo.id,
    };

    this.http.post('/api/backstage/measurementTemplate/getList', null, params).subscribe((res) => {
      this.measurementTemplateLoading = false;
      this.measurementTemplates = res.measurementTemplates;
      this.measurementTemplateTypeTotal = res.page.dataTotal;

      if (this.measurementTemplates.length > 0)
        this.onMeasurementTemplateChecked(this.measurementTemplates[0], true);
      else
        this.measurementItemFields = [];
    });
  }

  measurementTemplateAddPage(): void {
    let checkedNodePojoId = this.checkedDeviceTypeNodePojo ? this.checkedDeviceTypeNodePojo.id : '';
    this.router.navigate(['/measurement-template/detail'], {
      queryParams: {
        deviceTypeIdOrDeviceSubTypeId: checkedNodePojoId,
        type: MeasurementTemplate.DEVICE
      },
    });
  }

  measurementTemplateUpdatePage(): void {
    let tableCheckedId = this.measurementTemplateCheckedId.values().next().value;
    if (!tableCheckedId) {
      this.msg.error('请选择需要修改的标准');
      return;
    }

    this.router.navigate(['/measurement-template/detail'], {
      queryParams: {
        measurementTemplateId: tableCheckedId,
        type: MeasurementTemplate.DEVICE,
      },
    });
  }

  measurementTemplateDelete(): void {
    let tableCheckedId = this.measurementTemplateCheckedId.values().next().value;
    if (!tableCheckedId) {
      this.msg.error('请选择需要删除的标准');
      return;
    }

    this.http
      .post('/api/backstage/measurementTemplate/delete', null, {
        id: tableCheckedId,
      })
      .subscribe((res) => {
        if (!res.success) return;
        this.msg.success('删除成功');

        this.loadMeasurementTemplates(this.measurementTemplatePageIndex, this.measurementTemplatePageSize, this.measurementTemplateFormParams);
        this.measurementTemplateCheckedId.clear();
      });
  }

  measurementTemplateSettingPage(): void {
    let tableCheckedId = this.measurementTemplateCheckedId.values().next().value;
    if (!tableCheckedId) {
      this.msg.error('请选择需要修改的标准');
      return;
    }

    this.router.navigate(['/measurement-template/detail'], {
      queryParams: {
        measurementTemplateId: tableCheckedId,
        type: MeasurementTemplate.DEVICE,
        step: 1
      },
    });
  }

  updateCheckedSet(id: string): void {
    this.measurementTemplateCheckedId.clear();
    this.measurementTemplateCheckedId.add(id);
  }

  onMeasurementTemplateChecked(data: MeasurementTemplate, checked: boolean): void {
    if (!checked) {
      this.measurementTemplateCheckedId.clear();
      this.checkedMeasurementTemplate = null;
      this.measurementItemFields = [];
      return;
    }

    this.checkedMeasurementTemplate = data;
    this.updateCheckedSet(data.id);
    this.loadMeasurementItemFields(this.measurementItemFieldPageIndex, this.measurementItemFieldPageSize);
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.loadMeasurementTemplates(pageIndex, pageSize, this.measurementTemplateFormParams);
  }

  // 右下列表
  measurementItemFieldLoading = false;
  measurementItemFields: MeasurementItemField[] = [];
  measurementItemFieldTotal = 1;
  measurementItemFieldPageSize = 5;
  measurementItemFieldPageIndex = 1;

  measurementItemFieldOnQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.loadMeasurementItemFields(pageIndex, pageSize);
  }

  loadMeasurementItemFields(pageIndex: number, pageSize: number): void {
    this.measurementItemFieldLoading = true;

    if (!this.checkedMeasurementTemplate) {
      this.measurementItemFieldLoading = false;
      return;
    }

    const params = {
      pageSize: pageSize,
      currentPage: pageIndex,
      measurementTemplateId: this.checkedMeasurementTemplate.id,
    };

    this.http.post('/api/backstage/measurementItemFiled/getList', null, params).subscribe((res) => {
      this.measurementItemFieldLoading = false;
      this.measurementItemFields = res.measurementItemFields;
      this.measurementItemFieldTotal = res.page.dataTotal;
    });
  }

  _onReuseInit(type?: ReuseHookOnReuseInitType): void {
    this.loadMeasurementTemplates(this.measurementTemplatePageIndex, this.measurementTemplatePageSize, this.measurementTemplateFormParams);
  }
}

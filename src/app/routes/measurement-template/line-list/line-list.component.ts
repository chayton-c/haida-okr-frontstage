import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import {MeasurementTemplate} from "../../../pojos/measurement-template/measurement-template";
import {MeasurementItemField} from "../../../pojos/measurement-item-field/measurement-item-field";
import { OnReuseInit, ReuseHookOnReuseInitType} from "@delon/abc/reuse-tab";
import {LineNodePojo} from "../../../pojos/railway-line/railway-line";

interface MeasurementTemplateFormParams {
  name: string;
}

@Component({
  selector: 'app-measurement-template-line-list',
  templateUrl: './line-list.component.html',
  styleUrls: ['./line-list.component.css'],
})
export class MeasurementTemplateLineListComponent implements OnInit, OnReuseInit {
  ngOnInit(): void {
    // 加载菜单信息
    this.loadRailwayLineData();
  }

  constructor(public http: _HttpClient, private msg: NzMessageService, public injector: Injector, public router: Router) {}

  // =============================左侧树形菜单部分=======================================
  deviceTypeLoading = false;
  lineNodePojos: LineNodePojo[] = [];
  deviceTypeNodePojoList: Set<LineNodePojo> = new Set();
  checkedLineNodePojo: LineNodePojo | null = null;
  mapOfExpandedData: { [id: string]: LineNodePojo[] } = {};

  collapse(array: LineNodePojo[], data: LineNodePojo, $event: boolean): void {
    if ($event) return;

    if (!data.lineNodePojoList) return;

    data.lineNodePojoList.forEach((d) => {
      const target = array.find((a) => a.id === d.id)!;
      target.expand = false;
      this.collapse(array, target, false);
    });
  }

  convertTreeToList(root: LineNodePojo): LineNodePojo[] {
    const stack: LineNodePojo[] = [];
    const array: LineNodePojo[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.lineNodePojoList && node.lineNodePojoList.length == 0) node.lineNodePojoList = undefined;
      if (node.lineNodePojoList) {
        for (let i = node.lineNodePojoList.length - 1; i >= 0; i--) {
          stack.push({ ...node.lineNodePojoList[i], level: node.level! + 1, expand: true, parent: node });
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

  clickLineNodePojo(item: LineNodePojo) {
    this.deviceTypeNodePojoList.forEach((value) => (value.selected = false));
    item.selected = true;
    this.checkedLineNodePojo = item;
    this.loadMeasurementTemplates(this.measurementTemplatePageIndex, this.measurementTemplatePageSize, this.measurementTemplateFormParams);
    // this.loadMeasurementItemFields(this.measurementItemFieldPageIndex, this.measurementItemFieldPageSize);
  }

  visitNode(node: LineNodePojo, hashMap: { [id: string]: boolean }, array: LineNodePojo[]): void {
    this.deviceTypeNodePojoList.add(node);
    if (!hashMap[node.id]) {
      hashMap[node.id] = true;
      array.push(node);
    }
  }

  loadRailwayLineData(): void {
    this.http.post('/api/backstage/railwayLine', null).subscribe((res) => {
      if (!res.success) return;
      this.deviceTypeLoading = false;
      this.lineNodePojos = res.lineNodePojos;

      // 加载树方法
      this.lineNodePojos.forEach((item) => {
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
    let checkedLineNodePojoId = this.checkedLineNodePojo ? this.checkedLineNodePojo.id : '';
    let checkedLineNodePojoType = this.checkedLineNodePojo ? this.checkedLineNodePojo.type : '';

    if (checkedLineNodePojoType == LineNodePojo.RAILWAY_LINE_TYPE) return;

    const params = {
      pageSize: pageSize,
      currentPage: pageIndex,
      name: formParams.name,
      stationId: checkedLineNodePojoId,
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
    let checkedNodePojoId = this.checkedLineNodePojo ? this.checkedLineNodePojo.id : '';
    let checkedLineNodePojoType = this.checkedLineNodePojo ? this.checkedLineNodePojo.type : '';

    if (checkedLineNodePojoType == LineNodePojo.RAILWAY_LINE_TYPE) {
      this.msg.error('请选择需要添加标准的位置');
      return;
    }

    this.router.navigate(['/measurement-template/detail'], {
      queryParams: {
        stationId: checkedNodePojoId,
        type: MeasurementTemplate.STATION
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
        type: MeasurementTemplate.STATION,
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

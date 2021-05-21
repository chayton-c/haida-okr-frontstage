import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Opc } from '../../../pojos/opc/opc';
import { Location } from '../../../pojos/location/location';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { StringUtils } from '../../../shared/utils/string-utils';

@Component({
  selector: 'app-opc-list',
  templateUrl: './list.component.html',
  styleUrls: ['../../../shared/components/opc-base-map/opc-base-map.css'],
})
export class OpcListComponent implements AfterViewInit {
  ngOnInit(): void {}

  constructor(public http: _HttpClient, private msg: NzMessageService, public injector: Injector, public router: Router) {}

  //******************************************* 查询 ***********************************************
  nzDisabled: boolean = true;
  opcOptions: Opc[] = [];

  /**
   * 根据车站ID获取光电缆options
   * @param event
   */
  loadOpcCasecadeByStationId(event: Array<any>) {
    let checkedStationIds: any[] = event;
    let stationId = checkedStationIds[checkedStationIds.length - 1];
    this.formParams.stationId = stationId;

    this.http.post('/api/backstage/opc/getOpcCasecadeByStationId', null, { stationId: stationId }).subscribe((res) => {
      if (!res.success) return;
      this.nzDisabled = false;
      this.opcOptions = res.opcOptions;
    });
  }

  //******************************************* 数据列表 ***********************************************
  // loading = true;
  loading = false;
  total = 1;
  pageSize = 10;
  pageIndex = 1;

  opcs: Opc[] = [];
  locations: Location[] = [];

  formParams: {
    stationId: string;
    opcIds: string[];
  } = {
    stationId: '',
    opcIds: [],
  };

  // tableList
  checked = false;
  indeterminate = false;
  checkedId = new Set<string>();

  // 加载数据列表
  loadOpcDataOfTableList(opcIds: string[]) {
    this.formParams.opcIds = opcIds;
    // this.loading = true;

    const params = {
      stationId: this.formParams.stationId,
      opcIds: this.formParams.opcIds.toString(),
      currentPage: this.pageIndex,
      pageSize: this.pageSize,
    };

    this.initOpcMap();
    if (StringUtils.arrayEmpty(this.formParams.opcIds)) {
      // this.loading = true;
      this.locations = [];
      return;
    }

    this.http.post('/api/backstage/location/getList', null, params).subscribe((res) => {
      if (!res.success) return;
      this.loading = false;
      this.total = res.page.dataTotal;
      this.locations = res.locations;
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    if (pageSize === this.pageSize && pageIndex === this.pageIndex) return;

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.loadOpcDataOfTableList(this.formParams.opcIds);
  }

  onAllChecked(checked: boolean): void {
    this.opcs.forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) this.checkedId.add(id);
    else this.checkedId.delete(id);
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.opcs;
    this.checked = listOfEnabledData.every(({ id }) => this.checkedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.checkedId.has(id)) && !this.checked;
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  //******************************************* 地图 ***********************************************

  // 地图参数部分
  @ViewChild('opcBaseMap') opcBaseMap: any;
  initOpcMap() {
    // console.log(this.formParams.opcIds)
    this.opcBaseMap.opcIds = this.formParams.opcIds;
    this.opcBaseMap.ngOnInit();
  }

  ngAfterViewInit(): void {
    // this.initMap();
  }

  // 加载地图
  loadOpcDataOfMap() {}

  // 加载平面图
  loadOpcDataOfFloorPlan() {}

  // 原方法备份
  // ngOnInit(): void {
  //   // 加载菜单信息
  //   this.loadRailwayLineDataFromServer();
  // }
  //
  // constructor(public http: _HttpClient, private msg: NzMessageService, public injector: Injector, public router: Router) {
  //
  // }
  //
  // // =============================左侧树形菜单部分=======================================
  // railwayLineLoading = false;
  // lineNodePojos: LineNodePojo[] = [];
  // lineNodePojoList: Set<LineNodePojo> = new Set();
  // checkedLineNodePojo: LineNodePojo | null = null;
  // mapOfExpandedData: { [id: string]: LineNodePojo[] } = {};
  //
  // collapse(array: LineNodePojo[], data: LineNodePojo, $event: boolean): void {
  //   if ($event) return;
  //
  //   if (!data.lineNodePojoList) return;
  //
  //   data.lineNodePojoList.forEach((d) => {
  //     const target = array.find((a) => a.id === d.id)!;
  //     target.expand = false;
  //     this.collapse(array, target, false);
  //   });
  // }
  //
  // convertTreeToList(root: LineNodePojo): LineNodePojo[] {
  //   const stack: LineNodePojo[] = [];
  //   const array: LineNodePojo[] = [];
  //   const hashMap = {};
  //   stack.push({...root, level: 0, expand: root.expand});
  //
  //   while (stack.length !== 0) {
  //     const node = stack.pop()!;
  //     this.visitNode(node, hashMap, array);
  //     if (node.lineNodePojoList && node.lineNodePojoList.length == 0) node.lineNodePojoList = undefined;
  //     if (node.lineNodePojoList) {
  //       for (let i = node.lineNodePojoList.length - 1; i >= 0; i--) {
  //         stack.push({...node.lineNodePojoList[i], level: node.level! + 1, expand: true, parent: node});
  //       }
  //     }
  //   }
  //
  //   return array;
  // }
  //
  // clickLineNodePojo(item: LineNodePojo) {
  //   this.lineNodePojoList.forEach((value) => (value.selected = false));
  //   item.selected = true;
  //   this.checkedLineNodePojo = item;
  //   this.loadStationFromServer();
  //   if (item.lineNodePojoList)
  //     this.collapse(item.lineNodePojoList, item, false);
  // }
  //
  // visitNode(node: LineNodePojo, hashMap: { [id: string]: boolean }, array: LineNodePojo[]): void {
  //   this.lineNodePojoList.add(node);
  //   if (!hashMap[node.id]) {
  //     hashMap[node.id] = true;
  //     array.push(node);
  //   }
  // }
  //
  // loadRailwayLineDataFromServer(): void {
  //   this.http.post('/api/backstage/railwayLine', null).subscribe((res) => {
  //     if (!res.success) return;
  //     this.railwayLineLoading = false;
  //     this.lineNodePojos = res.lineNodePojos;
  //
  //     // 展开第一个节点
  //     this.lineNodePojos[0].expand = true;
  //
  //     // 加载树方法
  //     this.lineNodePojos.forEach((item) => {
  //       this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
  //     });
  //
  //     // 选中第一个子节点
  //     if (this.lineNodePojos[0].lineNodePojoList) this.clickLineNodePojo(this.lineNodePojos[0]);
  //   });
  // }
  //
  // // 车站tab部分
  // leftStation: Station | undefined = undefined;
  // station: Station | undefined = undefined;
  // rightStation: Station | undefined = undefined;
  // tabs: {
  //   leftStation?: Station,
  //   rightStation?: Station,
  //   station?: Station,
  // }[] = [];
  // selectIndex = 0;
  //
  // // 获取车站
  // loadStationFromServer(): void {
  //   if (!this.checkedLineNodePojo) return;
  //   if (this.checkedLineNodePojo.type == LineNodePojo.RAILWAY_LINE_TYPE) return;
  //
  //   const params = {
  //     id: this.checkedLineNodePojo.id,
  //   };
  //
  //   this.http.post('/api/backstage/station/opcInfo', null, params).subscribe((res) => {
  //     if (!res.success) return;
  //     this.tabs = [];
  //     this.leftStation = res.leftStation;
  //     this.station = res.station;
  //     this.rightStation = res.rightStation;
  //
  //
  //     if (this.leftStation && this.station) {
  //       this.tabs.push({
  //         leftStation: this.station,
  //         rightStation: this.leftStation,
  //       })
  //     }
  //     if (this.rightStation && this.station) {
  //       this.tabs.push({
  //         leftStation: this.station,
  //         rightStation: this.rightStation,
  //       })
  //     }
  //     this.tabs.push({
  //       station: this.station
  //     })
  //     this.selectIndex = 0;
  //
  //   });
  // }
}

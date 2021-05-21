import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import {NzMessageService} from "ng-zorro-antd/message";
import {Router} from "@angular/router";
import {LineNodePojo} from "../../../pojos/railway-line/railway-line";
import {Station} from "../../../pojos/station/station";

@Component({
  selector: 'app-construction-control-plan-create',
  templateUrl: './create.component.html',
})
export class ConstructionControlPlanCreateComponent implements OnInit {

  ngOnInit(): void {
    // 加载菜单信息
    this.loadRailwayLineDataFromServer();
  }

  constructor(public http: _HttpClient, private msg: NzMessageService, public injector: Injector, public router: Router) {

  }

  // =============================左侧树形菜单部分=======================================
  railwayLineLoading = false;
  lineNodePojos: LineNodePojo[] = [];
  lineNodePojoList: Set<LineNodePojo> = new Set();
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
    stack.push({...root, level: 0, expand: root.expand});

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.lineNodePojoList && node.lineNodePojoList.length == 0) node.lineNodePojoList = undefined;
      if (node.lineNodePojoList) {
        for (let i = node.lineNodePojoList.length - 1; i >= 0; i--) {
          stack.push({...node.lineNodePojoList[i], level: node.level! + 1, expand: true, parent: node});
        }
      }
    }

    return array;
  }

  clickLineNodePojo(item: LineNodePojo) {
    this.lineNodePojoList.forEach((value) => (value.selected = false));
    item.selected = true;
    this.checkedLineNodePojo = item;
    this.loadStationFromServer();
    if (item.lineNodePojoList)
      this.collapse(item.lineNodePojoList, item, false);
  }

  visitNode(node: LineNodePojo, hashMap: { [id: string]: boolean }, array: LineNodePojo[]): void {
    this.lineNodePojoList.add(node);
    if (!hashMap[node.id]) {
      hashMap[node.id] = true;
      array.push(node);
    }
  }

  loadRailwayLineDataFromServer(): void {
    this.http.post('/api/backstage/railwayLine', null).subscribe((res) => {
      if (!res.success) return;
      this.railwayLineLoading = false;
      this.lineNodePojos = res.lineNodePojos;

      // 展开第一个节点
      this.lineNodePojos[0].expand = true;

      // 加载树方法
      this.lineNodePojos.forEach((item) => {
        this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
      });

      // 选中第一个子节点
      if (this.lineNodePojos[0].lineNodePojoList) this.clickLineNodePojo(this.lineNodePojos[0]);
    });
  }

  // 车站tab部分
  leftStation: Station | undefined = undefined;
  station: Station | undefined = undefined;
  rightStation: Station | undefined = undefined;
  tabs: {
    leftStation?: Station,
    rightStation?: Station,
    station?: Station,
  }[] = [];
  selectIndex = 0;

  // 获取车站
  loadStationFromServer(): void {
    if (!this.checkedLineNodePojo) return;
    if (this.checkedLineNodePojo.type == LineNodePojo.RAILWAY_LINE_TYPE) return;

    const params = {
      id: this.checkedLineNodePojo.id,
    };

    this.http.post('/api/backstage/station/opcInfo', null, params).subscribe((res) => {
      if (!res.success) return;
      this.tabs = [];
      this.leftStation = res.leftStation;
      this.station = res.station;
      this.rightStation = res.rightStation;


      if (this.leftStation && this.station) {
        this.tabs.push({
          leftStation: this.station,
          rightStation: this.leftStation,
        })
      }
      if (this.rightStation && this.station) {
        this.tabs.push({
          leftStation: this.station,
          rightStation: this.rightStation,
        })
      }
      this.tabs.push({
        station: this.station
      })
      this.selectIndex = 0;

    });
  }
}


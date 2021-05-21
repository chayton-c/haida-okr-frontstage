import { Component, Injector, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Station } from '../../../pojos/station/station';
import { OnReuseInit, ReuseHookOnReuseInitType } from '@delon/abc/reuse-tab';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { LineNodePojo } from '../../../pojos/railway-line/railway-line';

interface StationFormParams {
  name: string;
}

@Component({
  selector: 'app-railway-line-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class RailwayLineListComponent implements OnInit, OnReuseInit {
  _onReuseInit(type?: ReuseHookOnReuseInitType): void {
    this.loadRailwayLineDataFromServer();
  }

  ngOnInit(): void {
    this.titleService.setTitle('线路车站');
    // 加载菜单信息
    this.loadRailwayLineDataFromServer();
  }

  constructor(
    public http: _HttpClient,
    private msg: NzMessageService,
    public injector: Injector,
    public router: Router,
    private titleService: TitleService,
  ) {}

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
    stack.push({ ...root, level: 0, expand: root.expand });

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
    this.lineNodePojoList.forEach((value) => {
      if (value.selected) hasSelectedOrganizations = true;
    });
    if (!hasSelectedOrganizations) this.clickLineNodePojo(this.lineNodePojoList.values().next().value);

    return array;
  }

  clickLineNodePojo(item: LineNodePojo) {
    console.log('clickLineNodePojo.item');
    console.log(item);
    this.lineNodePojoList.forEach((value) => (value.selected = false));
    item.selected = true;
    this.checkedLineNodePojo = item;
    this.loadStationFromServer(this.stationPageIndex, this.stationPageSize, this.stationFormParams);
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

      console.log('loadRailwayLineDataFromServer.checkedLineNodePojo');
      console.log(this.checkedLineNodePojo);
      // 路由复用时展开上级节点
      if (this.checkedLineNodePojo?.parent) {
        let parent = this.checkedLineNodePojo?.parent;
        this.lineNodePojos.filter((value) => value.id == parent.id).forEach((value) => (value.expand = true));
      }

      // 加载树方法
      this.lineNodePojos.forEach((item) => {
        this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
      });
      // 路由复用时找到节点
      if (this.checkedLineNodePojo) {
        this.clickLineNodePojo(this.checkedLineNodePojo);
      }
    });
  }

  // 下级菜单部分
  stationChecked = false;
  stationIndeterminate = false;
  stationLoading = false;
  stationCheckedId = new Set<string>();
  stationFormParams: StationFormParams = {
    name: '',
  };
  stations: Station[] = [];
  stationTotal = 1;
  stationPageSize = 5;
  stationPageIndex = 1;

  // 获取下级组织
  loadStationFromServer(pageIndex: number, pageSize: number, formParams: StationFormParams): void {
    this.stationLoading = true;
    if (!this.checkedLineNodePojo) {
      this.stationLoading = false;
      return;
    }

    const params = {
      pageSize: pageSize,
      currentPage: pageIndex,
      name: formParams.name,
      railwayLineId: this.checkedLineNodePojo.id,
    };

    this.http.post('/api/backstage/station/getStationsByRailwayLineId', null, params).subscribe((res) => {
      this.stationLoading = false;
      this.stations = res.stations;
      this.stationTotal = res.page.dataTotal;
    });
  }

  formAddPage(): void {
    let checkedLineNodePojoType = this.checkedLineNodePojo ? this.checkedLineNodePojo.type : '';

    if (checkedLineNodePojoType == LineNodePojo.RAILWAY_LINE_TYPE) this.router.navigate(['/railway-line/detail']);
  }

  formUpdatePage(): void {
    let checkedLineNodePojoId = this.checkedLineNodePojo ? this.checkedLineNodePojo.id : '';
    let checkedLineNodePojoType = this.checkedLineNodePojo ? this.checkedLineNodePojo.type : '';

    if (checkedLineNodePojoType == LineNodePojo.RAILWAY_LINE_TYPE) {
      this.router.navigate(['/railway-line/detail'], {
        queryParams: {
          railwayLineId: checkedLineNodePojoId,
        },
      });
    }
    if (checkedLineNodePojoType == LineNodePojo.STATION_TYPE) {
      this.router.navigate(['/station/detail'], {
        queryParams: {
          stationId: checkedLineNodePojoId,
        },
      });
    }
  }

  deleteRailwayLine(): void {
    let checkedLineNodePojoId = this.checkedLineNodePojo ? this.checkedLineNodePojo.id : '';
    let checkedLineNodePojoType = this.checkedLineNodePojo ? this.checkedLineNodePojo.type : '';

    if (checkedLineNodePojoType == LineNodePojo.RAILWAY_LINE_TYPE) {
      this.http.post('/api/backstage/railwayLine/delete', null, { id: checkedLineNodePojoId }).subscribe((res) => {
        if (!res.success) return;

        this.msg.info('删除成功');
        this.loadRailwayLineDataFromServer();
        this.clickLineNodePojo(this.lineNodePojos[0]);
      });
    }
    if (checkedLineNodePojoType == LineNodePojo.STATION_TYPE) {
      this.http.post('/api/backstage/station/delete', null, { ids: [checkedLineNodePojoId] }).subscribe((res) => {
        if (!res.success) return;

        this.msg.info('删除成功');
        this.loadRailwayLineDataFromServer();
        this.clickLineNodePojo(this.lineNodePojos[0]);
      });
    }
  }

  stationAddPage(): void {
    let checkedLineNodePojoId = this.checkedLineNodePojo ? this.checkedLineNodePojo.id : '';
    this.router.navigate(['/railway-line/railway-line-station-detail'], {
      queryParams: {
        railwayLineId: checkedLineNodePojoId,
      },
    });
  }

  stationUpdatePage(): void {
    let tableCheckedId = this.stationCheckedId.values().next().value;
    if (!tableCheckedId) {
      this.msg.error('请选择需要修改的位置');
      return;
    }

    let checkedLineNodePojoId = this.checkedLineNodePojo ? this.checkedLineNodePojo.id : '';
    this.router.navigate(['/station/detail'], {
      queryParams: {
        stationId: tableCheckedId,
        railwayLineId: checkedLineNodePojoId,
      },
    });
  }

  deleteStations(): void {
    let stationIds: string[] = [];
    this.stationCheckedId.forEach((value) => stationIds.push(value));
    if (stationIds.length == 0) {
      this.msg.error('请选择要删除的车站');
      return;
    }

    let params = {
      stationIds: stationIds.toString(),
      railwayLineId: this.checkedLineNodePojo!.id,
    };

    this.http.post('/api/backstage/station/removeLinkageStationAndRailwayLine', null, params).subscribe((res) => {
      if (!res.success) return;

      this.msg.info('删除成功');
      this.loadRailwayLineDataFromServer();
      // this.loadStationFromServer(this.stationPageIndex, this.stationPageSize, this.stationFormParams);
    });
  }

  stationUpdateCheckedSet(id: string, checked: boolean): void {
    this.stationCheckedId.clear();
    if (checked) this.stationCheckedId.add(id);
  }

  stationOnAllChecked(checked: boolean): void {
    this.stations.forEach(({ id }) => this.stationUpdateCheckedSet(id, checked));
    this.stationRefreshCheckedStatus();
  }

  stationRefreshCheckedStatus(): void {
    const listOfEnabledData = this.stations;
    this.stationChecked = listOfEnabledData.every(({ id }) => this.stationCheckedId.has(id));
    this.stationIndeterminate = listOfEnabledData.some(({ id }) => this.stationCheckedId.has(id)) && !this.stationChecked;
  }

  stationOnItemChecked(id: string, checked: boolean): void {
    this.stationUpdateCheckedSet(id, checked);
    this.stationRefreshCheckedStatus();
  }

  updateStationSeq(stationId: string, railwayLineId: string, seq: number) {
    let params = {
      railwayLineId: railwayLineId,
      stationId: stationId,
      seq: seq,
    };

    this.http.post('/api/backstage/stationRailwayLine/updateSeq', null, params).subscribe((res) => {});
  }

  stationOnQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.loadStationFromServer(pageIndex, pageSize, this.stationFormParams);
  }

  dropStations(event: CdkDragDrop<string[]>): void {
    console.log(event.previousIndex);
    console.log(event.currentIndex);
    moveItemInArray(this.stations, event.previousIndex, event.currentIndex);
  }
}

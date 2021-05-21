import {Component, Injector, OnInit} from '@angular/core';
import {User} from "../../../pojos/user/user";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {_HttpClient} from "@delon/theme";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {Station} from "../../../pojos/station/station";
import {OnReuseInit, ReuseHookOnReuseInitType} from "@delon/abc/reuse-tab";

@Component({
  selector: 'app-station-list',
  templateUrl: './list.component.html',
})
export class StationListComponent implements OnInit, OnReuseInit {
  checked = false;
  setOfCheckedId = new Set<string>();
  formParams: {
    nameOrCode: string;
  } = {
    nameOrCode: '',
  };
  stations: Station[] = [];
  loading = true;
  total = 1;
  pageSize = 5;
  pageIndex = 1;

  loadDataFromServer(): void {
    this.loading = true;

    const params = {
      pageSize: this.pageSize,
      currentPage: this.pageIndex,
      nameOrCode: this.formParams.nameOrCode,
    };

    this.http.post('/api/backstage/station', null, params).subscribe((res) => {
      this.loading = false;
      this.stations = res.stations;
      this.total = res.page.dataTotal;
    });
  }

  stationAddPage(): void {
    this.router.navigate(['/station/detail']);
  }

  stationUpdatePage(): void {
    let checkedId = this.setOfCheckedId.values().next().value;
    if (!checkedId) {
      this.msg.error('请选择需要修改的车站');
      return;
    }
    this.router.navigate(['/station/detail'], {
      queryParams: { stationId: checkedId },
    });
  }

  updateCheckedSet(id: string, checked: boolean): void {
    this.setOfCheckedId.clear();
    if (checked) this.setOfCheckedId.add(id);
  }

  deleteStation(): void {
    let stationIds: string[] = [];
    this.setOfCheckedId.forEach((value) => stationIds.push(value));
    if (stationIds.length == 0) {
      this.msg.error('请选择要删除的车站');
      return;
    }

    this.http.post('/api/backstage/station/delete', null, {ids: stationIds.toString()}).subscribe((res) => {
      if (!res.success) return;

      this.msg.info('删除成功');
      this.loadDataFromServer();
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
    this.loadDataFromServer();
  }

  constructor(public http: _HttpClient, public injector: Injector, public router: Router, public msg: NzMessageService) {}

  ngOnInit(): void {
    this.loadDataFromServer();
  }

  _onReuseInit(type?: ReuseHookOnReuseInitType): void {
    this.loadDataFromServer();
  }
}
